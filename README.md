# omg-website

The landing page for [Open Model Gateway (OMG)](https://github.com/ncecere/open-model-gateway), a self-hosted, open-source (MIT) gateway that puts cloud and self-hosted AI models behind one OpenAI- and Anthropic-compatible API, with workspaces, stacked budgets, exact cost accounting, single sign-on and audit. The site is served at https://omg.bitop.dev; the documentation lives in its own repository and site, https://docs.omg.bitop.dev.

It's one long page plus a 404 page, with no pricing, sign-up, forms, cookies, tracking or third-party requests. The text describes OMG **v0.3.0** (the current `main` of the gateway repository) and is checked against its README, `docs/roadmap.md`, `docs/architecture.md` and the feature docs in `docs/`. `lib/site.ts` holds the version, the release day (`null` until the tag exists; set it when v0.3.0 is tagged, and the footer and sitemap show it) and the release links.

One claim depends on work that was not merged when the page was written: capacity-aware batch scheduling for self-hosted models (migration `0022_batch_scheduling.sql`). It is marked `// verify after merge` in `app/page.tsx`; check it against `docs/batches.md` once merged, and remove the bullet if it changed or was dropped.

**Naming.** The page leads with "Open Model Gateway" (title, hero, metadata) and uses "OMG" only as a short form after it. The text names no competing products; providers the gateway connects to (OpenAI, Anthropic, AWS Bedrock, OpenRouter, vLLM, SGLang, Ollama) are named because they are what it connects to. Examples use generic names (`gateway.example.edu`, `campus/chat`). `scripts/postbuild.mjs` fails the build if a page uses a forbidden name or "OMG" before "Open Model Gateway".

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) with `output: "export"`: `next build` writes plain static files to `out/`.
- React 19, TypeScript 5.9, [Tailwind CSS](https://tailwindcss.com) 4.
- Inter Variable, self-hosted from `@fontsource-variable/inter`.
- Node 22 and npm; every version is pinned in `package-lock.json`.
- nginx (alpine, pinned by digest) in the container.

## Brand tokens: `app/brand.css`

`app/brand.css` holds OMG's colours (light by default, and dark), radii, shadows and font stacks, taken from the dashboard's Bitop theme (`apps/web/src/components/ui/themes/neutral.css` and `styles/tokens.css` in the gateway repository), and maps them to Tailwind v4 theme variables (`bg-brand-surface`, `text-brand-muted`, `bg-brand-primary`, `text-brand-link`, `rounded-card`, `shadow-brand-2` and so on). A docs site should use **the same file, byte for byte**, so the two sites look like one product; change it in both repositories together and check with `cmp`.

Components and `app/globals.css` use only the Tailwind names (in CSS through `--theme(--color-brand-…)`), never the raw token variables, so a new `brand.css` drops in without other changes. The theme follows the system (`prefers-color-scheme`); `data-theme="dark|light"` or `class="dark|light"` can force one.

## Logo, favicon and Open Graph card

The logo is "Portal": a tunnel seen slightly off-axis, two light bands receding to an indigo core, on a dark tile. Its source, exports and usage rules are in `../omg-assets/logo/` (`logo/portal/`, `logo/README.md`).

- `components/logo.tsx` is the only place the site draws the logo (header and footer): the mark as inline SVG (`mark-small.svg`, 28 px, `aria-hidden`) beside the name as live text. omg-docs draws it identically; change both together.
- `lib/mark.json` holds the mark as inner SVG markup on its 64 grid: `svg` is `mark-small.svg` (read by `components/logo.tsx`), `svgRegular` is `mark.svg` (read by `scripts/og-image.mjs`). If the logo changes, copy both from `../omg-assets/logo/portal/` again, run `npm run og`, and commit.
- `npm run og` (`scripts/og-image.mjs`) copies `favicon.ico`, `favicon.svg`, `png/apple-touch-icon.png`, `png/icon-192.png` and `png/icon-512.png` unchanged from `../omg-assets/logo/portal/` (set `LOGO_DIR` to read from elsewhere) and draws `public/og.png` (1200x630: the mark and name, the headline and, once that slot is filled, the `admin-usage` screenshot) in the brand's dark colours. Rerun it when the logo or the screenshot changes and commit the results.

## Screenshots

The page has 8 named screenshot slots in its dashboard section, listed in `lib/slots.json` with their alt text and captions. A slot without an image shows a clearly marked placeholder with the expected file name. All 8 are placeholders until `omg-assets` has captures.

```sh
npm run images   # copy the screenshots that exist into public/images as WebP, record their sizes
npm run og       # rebuild the Open Graph card and icons
```

Commit the results (`public/images/`, `lib/screenshots.json`, `public/og.png`, icons). Screenshots come from a fictional demo installation in `../omg-assets/screenshots/`; set `SCREENSHOTS_DIR` to read from another directory. For each slot the script looks for `file` (or the slot's own name) and, if that's missing, the slot's `interimFile`, recording `"interim": true` in `lib/screenshots.json`. When the captures arrive, check each slot's alt text and caption against its image: they were written from the gateway's docs, before any capture existed.

| Slot | Shows |
|---|---|
| `admin-usage` | Admin › Usage: settled, held and unknown cost (also used by `public/og.png`) |
| `admin-limits` | Admin › Settings › Defaults & limits |
| `workspace-models` | Workspace › Models |
| `workspace-keys` | Workspace › API keys, with key safety badges |
| `workspace-logs` | Workspace › Logs › Requests |
| `admin-connections` | Admin › Connections |
| `admin-key-safety` | Admin › Records › Key safety |
| `batch-detail` | A batch page |

## Local development

```sh
npm ci
npm run dev      # http://localhost:3000
```

## Build

```sh
npm run typecheck
npm run build    # static export to out/, then scripts/postbuild.mjs
```

`scripts/postbuild.mjs` hashes the inline scripts Next.js writes into the HTML and puts them in the Content-Security-Policy (`build/security-headers.conf`), so `script-src` needs no `'unsafe-inline'`. It fails the build if the output loads a script, style sheet, font, image or frame from another origin, if the page text uses a forbidden name, or if "OMG" appears before "Open Model Gateway".

To run the production image locally, read-only like in a cluster:

```sh
npm run docker   # builds the image and serves it on http://127.0.0.1:8080
```

## Container image and deployment

`.github/workflows/publish.yaml` builds the site on every pull request and push. On `main` it also builds and pushes a multi-arch (linux/amd64, linux/arm64) image, with every action pinned by commit SHA:

- `ghcr.io/ncecere/omg-website:<full commit SHA>`
- `ghcr.io/ncecere/omg-website:latest`

The image is nginx serving `out/`:

- runs as user 101, listens on port **8080**, and answers `GET /healthz` with `ok`;
- works with a read-only root filesystem: the pid file and temp paths are under `/tmp`, so mount an `emptyDir` (or tmpfs) there;
- sends security headers (CSP, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP);
- caches hashed assets under `/_next/static/` for a year (`immutable`), other assets for an hour, and revalidates pages on every request.

Deployment lives outside this repository. New GHCR packages start private; make the package public, or pull it with a registry credential.

Dependabot opens one grouped pull request a week each for npm, GitHub Actions and the Docker base images.

## Licence

- **Code:** MIT, see [`LICENSE`](LICENSE).
- **Website text:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), see [`LICENSE-CONTENT`](LICENSE-CONTENT).
- Inter is under the SIL Open Font License 1.1.
