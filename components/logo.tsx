import mark from "@/lib/mark.json";
import { site } from "@/lib/site";

/*
 * The Open Model Gateway logo, "Portal": a tunnel seen slightly off-axis, two
 * light bands receding to an indigo core, on a dark tile. The mark is inline
 * SVG (no request, no font): mark-small.svg from omg-assets (logo/portal/), the
 * drawing for 20 to 47 px, kept in lib/mark.json, which scripts/og-image.mjs
 * also reads for the Open Graph card. The name beside it is live text. omg-docs
 * draws the same mark at the same size.
 *
 * This is the only place the site draws the logo (header and footer).
 */

/** The mark: decorative here, because the name is always next to it. */
export function Mark({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox={mark.viewBox}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      // Static markup from lib/mark.json, written by us; no user input.
      dangerouslySetInnerHTML={{ __html: mark.svg }}
    />
  );
}

/** The mark and the name, as a link to the top of the page. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`inline-flex items-center gap-2.5 rounded-md font-semibold text-brand-text ${className}`}>
      <Mark />
      <Wordmark />
    </a>
  );
}

/** The wordmark itself: the product's full name, set in Inter. */
export function Wordmark({ className = "text-[1.05rem]" }: { className?: string }) {
  return <span className={`tracking-tight whitespace-nowrap ${className}`}>{site.name}</span>;
}
