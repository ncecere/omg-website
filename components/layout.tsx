import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Github } from "./icons";
import { Logo } from "./logo";

const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#screenshots", label: "Screenshots" },
  { href: "/#self-host", label: "Self-host" },
];

export function SiteHeader() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-contrast focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/85 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/70">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Main" className="flex items-center gap-1 text-sm">
            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="rounded-md px-3 py-2 text-brand-muted hover:bg-brand-surface-hover hover:text-brand-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={site.docsUrl} className="rounded-md px-3 py-2 font-medium text-brand-text hover:bg-brand-surface-hover">
              Docs
            </a>
            <a
              href={site.repoUrl}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium text-brand-text hover:bg-brand-surface-hover"
            >
              <Github className="size-4" />
              <span className="sr-only sm:not-sr-only">GitHub</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  const releaseDay = site.releaseDate
    ? new Date(site.releaseDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const year = site.releaseDate ? new Date(site.releaseDate).getUTCFullYear() : 2026;
  return (
    <footer className="border-t border-brand-border bg-brand-surface-sunken">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-brand-muted">
            One self-hosted gateway for every AI model your organisation uses. Pre-1.0: expect changes between minor
            releases, and read the release notes before you upgrade.
          </p>
          <p className="mt-3 text-sm text-brand-muted">
            {releaseDay ? "Latest release: " : "This page describes "}
            <a href={site.releaseNotesUrl} className="font-medium text-brand-link underline underline-offset-2 hover:text-brand-link-hover">
              {site.version}
            </a>
            {site.releaseDate ? (
              <>
                {" "}
                (<time dateTime={site.releaseDate}>{releaseDay}</time>)
              </>
            ) : (
              "."
            )}
          </p>
        </div>
        <nav aria-labelledby="footer-project">
          <h2 id="footer-project" className="text-sm font-semibold text-brand-text">
            Project
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <FooterLink href={site.docsUrl}>Documentation</FooterLink>
            <FooterLink href={site.repoUrl}>Source on GitHub</FooterLink>
            <FooterLink href={site.releaseNotesUrl}>Release {site.version}</FooterLink>
            <FooterLink href={site.releasesUrl}>All releases</FooterLink>
            <FooterLink href={site.roadmapUrl}>Roadmap</FooterLink>
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal">
          <h2 id="footer-legal" className="text-sm font-semibold text-brand-text">
            Licence and security
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <FooterLink href={site.licenseUrl}>{site.shortName} is MIT licensed</FooterLink>
            <FooterLink href={site.securityUrl}>Report a vulnerability</FooterLink>
            <FooterLink href={site.websiteRepoUrl}>This website&apos;s source</FooterLink>
          </ul>
        </nav>
      </div>
      <div className="border-t border-brand-border">
        <p className="container-page py-6 text-xs text-brand-subtle">
          © {year} Nicholas Cecere. Website code under the MIT licence; website text under CC BY 4.0. No cookies, no
          tracking, no third-party requests.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href} className="text-brand-muted hover:text-brand-text hover:underline">
        {children}
      </a>
    </li>
  );
}
