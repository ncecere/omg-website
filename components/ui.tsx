import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-control px-4 text-sm font-medium transition-colors";
  const styles = {
    primary: "bg-brand-primary text-brand-primary-contrast shadow-brand-1 hover:bg-brand-primary-hover active:bg-brand-primary-active",
    secondary:
      "border border-brand-border-strong bg-brand-surface text-brand-text shadow-brand-1 hover:bg-brand-surface-raised hover:shadow-brand-2",
    ghost: "text-brand-text hover:bg-brand-surface-hover",
  } as const;
  return (
    <a href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </a>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold text-brand-subtle">{children}</p>;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 space-y-3 text-lg leading-relaxed text-brand-muted">{children}</div> : null}
    </div>
  );
}

export function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-card border border-brand-border-emphasis bg-brand-surface-sunken">
      <div className="border-b border-brand-border px-4 py-2 text-xs font-medium text-brand-muted">{label}</div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={label}
        className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-brand-text"
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function CheckList({ items, columns = false }: { items: ReactNode[]; columns?: boolean }) {
  return (
    <ul className={columns ? "mt-6 grid gap-x-10 gap-y-3 lg:grid-cols-2" : "mt-6 space-y-3"}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-brand-muted">
          <svg
            viewBox="0 0 24 24"
            className="mt-1 size-4 shrink-0 text-brand-text"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-brand-text">{children}</strong>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="font-medium text-brand-link underline decoration-1 underline-offset-2 hover:text-brand-link-hover">
      {children}
    </a>
  );
}

/** A quiet aside: a limitation or condition worth knowing, next to the claim it qualifies. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 rounded-md border-l-2 border-brand-border-strong bg-brand-surface-sunken px-4 py-3 text-sm text-brand-muted">
      {children}
    </p>
  );
}
