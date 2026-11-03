const repoUrl = "https://github.com/ncecere/open-model-gateway";
const docsUrl = "https://docs.omg.bitop.dev";
// Every pinned repository link points at this tag. Check that each path exists
// before changing it: git ls-tree -r --name-only <tag>
const releaseTag = "v0.10.0";
const tag = `${repoUrl}/blob/${releaseTag}`;
const image = "ghcr.io/ncecere/open-model-gateway";
// From the release's open-model-gateway-<tag>.digest.txt asset.
const imageDigest = "sha256:77a37910d5af8ef26cdacec1f7dac026ba2aee32d9de8fd8ab30c039adbcdbe6";

export const site = {
  name: "Open Model Gateway",
  // The short form, used only after the full name has been given.
  // scripts/postbuild.mjs fails the build if "OMG" appears before it.
  shortName: "OMG",
  url: "https://omg.bitop.dev",
  title: "Open Model Gateway: one governed API for every AI model",
  description:
    "Open Model Gateway (OMG) is a self-hosted, open-source gateway that puts cloud and self-hosted AI models behind one API, with workspaces, stacked budgets, exact cost accounting, single sign-on and audit.",
  docsUrl,
  repoUrl,
  version: releaseTag,
  // The release day of `version` (the footer and the sitemap show it). Null
  // until the tag exists; set it the day the release is tagged.
  releaseDate: "2026-11-02" as string | null,
  // The version the "What's new" section counts from.
  previousVersion: "v0.6.0",
  releaseNotesUrl: `${repoUrl}/releases/tag/${releaseTag}`,
  releasesUrl: `${repoUrl}/releases`,
  changelogUrl: `${tag}/CHANGELOG.md`,
  upgradeNotesUrl: `${tag}/docs/releases/v0.10.0.md#upgrade`,
  // Release pages on the docs site (one per release, v0-6-1 to v0-10-0).
  docsReleasesUrl: `${docsUrl}/docs/releases`,
  docsReleaseUrl: `${docsUrl}/docs/releases/v0-10-0`,
  // The published image, by tag and digest, and its keyless cosign signature.
  image: {
    repository: image,
    tag: releaseTag,
    digest: imageDigest,
    ref: `${image}:${releaseTag}@${imageDigest}`,
    cosignIdentity: `${repoUrl}/.github/workflows/image.yml@refs/tags/${releaseTag}`,
    cosignIssuer: "https://token.actions.githubusercontent.com",
  },
  licenseUrl: `${tag}/LICENSE`,
  securityUrl: `${repoUrl}/security`,
  roadmapUrl: `${tag}/docs/roadmap.md`,
  stagingUrl: `${tag}/docs/staging.md`,
  operationsUrl: `${tag}/docs/operations.md`,
  kubernetesUrl: `${tag}/docs/kubernetes.md`,
  composeUrl: `${tag}/deploy/staging/compose.yaml`,
  inferenceOpenApiUrl: `${tag}/docs/openapi/inference.openapi.json`,
  websiteRepoUrl: "https://github.com/ncecere/omg-website",
} as const;
