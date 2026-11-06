# Build the static export once on the build platform (the output is the same
# for every architecture), then copy it into a multi-arch nginx image.
FROM --platform=$BUILDPLATFORM docker.io/library/node:26.12.1-alpine@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797 AS build
WORKDIR /src
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM docker.io/library/nginx:1.31.7-alpine@sha256:892bb2152464f0c5d8972593a5f5afaf8054552580b699d95f8ff4af08c2d33d

LABEL org.opencontainers.image.source="https://github.com/ncecere/omg-website" \
      org.opencontainers.image.description="The Open Model Gateway website (omg.bitop.dev)" \
      org.opencontainers.image.licenses="MIT AND CC-BY-4.0"

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/build/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build --chown=101:101 /src/out/ /usr/share/nginx/html/

USER 101:101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
