import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A static site: `next build` writes plain files to out/, served by nginx.
  output: "export",
  // No image optimisation server; images are pre-optimised by scripts/sync-screenshots.mjs.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
