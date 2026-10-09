import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="container-page py-24 sm:py-32">
      <p className="font-mono text-sm text-brand-subtle">404</p>
      <h1 id="not-found-title" className="mt-2 text-4xl font-semibold tracking-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-xl text-lg text-brand-muted">
        This site is a single page about Open Model Gateway. The documentation lives on its own site, and the source on
        GitHub.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to the home page</ButtonLink>
        <ButtonLink href={site.docsUrl} variant="secondary">
          Read the docs
        </ButtonLink>
      </div>
    </section>
  );
}
