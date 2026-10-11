const repoUrl = "https://github.com/ncecere/open-model-gateway";
const tag = `${repoUrl}/blob/v0.4.0`;

export const site = {
  name: "Open Model Gateway",
  // The short form, used only after the full name has been given.
  // scripts/postbuild.mjs fails the build if "OMG" appears before it.
  shortName: "OMG",
  url: "https://omg.bitop.dev",
  title: "Open Model Gateway: one governed API for every AI model",
  description:
    "Open Model Gateway (OMG) is a self-hosted, open-source gateway that puts cloud and self-hosted AI models behind one API, with workspaces, stacked budgets, exact cost accounting, single sign-on and audit.",
  docsUrl: "https://docs.omg.bitop.dev",
  repoUrl,
  version: "v0.4.0",
  // The release day of `version` (the footer and the sitemap show it). Null
  // until the tag exists; set it the day the release is tagged.
  releaseDate: "2026-10-10" as string | null,
  releaseNotesUrl: `${repoUrl}/releases/tag/v0.4.0`,
  releasesUrl: `${repoUrl}/releases`,
  licenseUrl: `${tag}/LICENSE`,
  securityUrl: `${repoUrl}/security`,
  roadmapUrl: `${tag}/docs/roadmap.md`,
  stagingUrl: `${tag}/docs/staging.md`,
  operationsUrl: `${tag}/docs/operations.md`,
  composeUrl: `${tag}/deploy/staging/compose.yaml`,
  websiteRepoUrl: "https://github.com/ncecere/omg-website",
} as const;
