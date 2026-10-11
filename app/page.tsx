import type { ReactNode } from "react";
import { ArrowRight, BookOpen, EyeOff, Github, Key, Layers, Scale, Server, Shield, Wallet } from "@/components/icons";
import { Screenshot, type SlotName } from "@/components/Screenshot";
import { ButtonLink, CheckList, CodeBlock, Eyebrow, Note, SectionHeading, Strong, TextLink } from "@/components/ui";
import { site } from "@/lib/site";

/*
 * Every claim here is checked against Open Model Gateway v0.4.0 (tag v0.4.0 of
 * github.com/ncecere/open-model-gateway): README.md, docs/roadmap.md,
 * docs/architecture.md, docs/kubernetes.md and the feature docs in docs/.
 * Keep it that way. No capacity/throughput numbers belong on this page: the
 * release notes' laptop load-test figures are explicitly not a capacity
 * promise, pending a homelab cluster test.
 */

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Operations />
      <Screenshots />
      <SelfHost />
      <OpenSource />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */

const heroExample = `import os
from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.example.edu/v1",
    api_key=os.environ["GATEWAY_KEY"],  # a workspace key
)

reply = client.chat.completions.create(
    model="campus/chat",  # a model from your catalog
    max_completion_tokens=512,
    messages=[{"role": "user", "content": "Hello"}],
)`;

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-glow relative overflow-hidden border-b border-brand-border">
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="min-w-0">
          <a
            href={site.releaseNotesUrl}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-border-emphasis bg-brand-surface px-3 py-1 text-xs font-medium text-brand-muted hover:text-brand-text"
          >
            <span className="rounded-full bg-brand-primary-subtle px-2 py-0.5 text-brand-primary-subtle-text">{site.version}</span>
            <span>Open source, MIT licensed</span>
            <ArrowRight className="size-3.5 shrink-0" />
          </a>
          <p className="mt-6 text-base font-semibold text-brand-text">{site.name}</p>
          <h1 id="hero-title" className="mt-2 text-4xl font-semibold tracking-tight text-brand-text sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            One governed API for every AI model
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-muted">
            Open Model Gateway ({site.shortName}) puts your cloud providers and self-hosted models behind one
            OpenAI- and Anthropic-compatible API, with the workspaces, budgets, sign-in and audit trail your
            organisation needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.docsUrl}>
              <BookOpen className="size-4" />
              Read the docs
            </ButtonLink>
            <ButtonLink href={site.repoUrl} variant="secondary">
              <Github className="size-4" />
              View on GitHub
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-xl text-sm text-brand-subtle">
            Built for IT and platform teams at universities, research organisations and companies that run AI for many
            people and have to answer for who used what, and what it cost.
          </p>
        </div>
        <div className="min-w-0">
          <CodeBlock label="Your existing OpenAI SDK, pointed at the gateway">{heroExample}</CodeBlock>
          <p className="mt-3 text-sm text-brand-muted">
            The key decides the workspace, the models and the limits. Nothing in the request can pick another
            workspace.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- The problem */

const problems: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <Key className="size-5" />,
    title: "Keys everywhere",
    body: "Provider keys sit in scripts, notebooks and shared vaults. Nobody can say who holds one, or take it back from one person without breaking everyone else.",
  },
  {
    icon: <Wallet className="size-5" />,
    title: "Costs nobody can see",
    body: "Each provider sends its own bill after the fact. Splitting it by team, project or person is guesswork, and nothing stops a runaway script before the month ends.",
  },
  {
    icon: <Shield className="size-5" />,
    title: "No governance",
    body: "There is no one place to decide which models a group may use, how much, under which sign-in, or to see afterwards what happened.",
  },
];

function Problem() {
  return (
    <section aria-labelledby="problem-title" className="py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading id="problem-title" eyebrow="The problem" title="AI use grows faster than the controls around it">
          <p>
            Every team wants a different model from a different provider, and some run their own. Without a gateway,
            each of them is a separate account, a separate bill and a separate set of keys.
          </p>
        </SectionHeading>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {problems.map((p) => (
            <li key={p.title} className="rounded-card border border-brand-border bg-brand-surface p-6">
              <span className="flex size-9 items-center justify-center rounded-md bg-brand-primary-subtle text-brand-primary-subtle-text">
                {p.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand-text">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- How it works */

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-control border border-brand-border-emphasis bg-brand-surface px-3 py-2 text-sm font-medium text-brand-text">
      {children}
    </li>
  );
}

/** Points right on wide screens, down when the diagram stacks. Decorative. */
function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center text-brand-subtle">
      <svg viewBox="0 0 24 24" className="size-6 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <path d="M4 12h16M14 6l6 6-6 6" />
      </svg>
    </div>
  );
}

const gatewaySteps: { title: string; body: string }[] = [
  { title: "Identify", body: "The API key names one workspace. Revoked, expired or orphaned keys stop here." },
  { title: "Authorise", body: "The model must be in the workspace's catalog and allowed for this key." },
  { title: "Reserve", body: "Every applicable limit and budget is checked, and the worst-case cost is held." },
  { title: "Route", body: "Priority, weight and residency pick the deployment; fallbacks only if you allow them." },
  { title: "Settle", body: "The provider's reported usage is priced exactly. Unknown usage keeps its hold." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-16 border-t border-brand-border bg-brand-surface-sunken py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading id="how-title" eyebrow="How it works" title="One API in front, every model behind it">
          <p>
            Applications call one endpoint with one kind of key. The gateway decides whether the request may run,
            where it goes and what it cost, and keeps the record.
          </p>
        </SectionHeading>

        <figure className="mt-12">
          <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.5fr_auto_1fr]">
            <div className="rounded-card border border-brand-border bg-brand-surface p-5">
              <p className="text-sm font-semibold text-brand-subtle">Your apps and people</p>
              <ul className="mt-4 space-y-2">
                <Chip>OpenAI SDKs</Chip>
                <Chip>Anthropic SDKs</Chip>
                <Chip>Any HTTP client</Chip>
                <Chip>The dashboard, with SSO</Chip>
              </ul>
            </div>

            <FlowArrow />

            <div className="rounded-card border-2 border-brand-primary bg-brand-surface p-5 shadow-brand-2">
              <p className="text-sm font-semibold text-brand-text">{site.name}</p>
              <ol className="mt-4 space-y-3">
                {gatewaySteps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary-subtle text-xs font-semibold text-brand-primary-subtle-text">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-muted">
                      <Strong>{s.title}.</Strong> {s.body}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-brand-border pt-3 text-xs text-brand-subtle">
                State in PostgreSQL · files in an encrypted store
              </p>
            </div>

            <FlowArrow />

            <div className="grid gap-4">
              <div className="rounded-card border border-brand-border bg-brand-surface p-5">
                <p className="text-sm font-semibold text-brand-subtle">Cloud providers</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  <Chip>OpenAI</Chip>
                  <Chip>Anthropic</Chip>
                  <Chip>AWS Bedrock</Chip>
                  <Chip>OpenRouter</Chip>
                </ul>
              </div>
              <div className="rounded-card border border-brand-border bg-brand-surface p-5">
                <p className="text-sm font-semibold text-brand-subtle">Self-hosted models</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  <Chip>vLLM</Chip>
                  <Chip>SGLang</Chip>
                  <Chip>Ollama</Chip>
                  <Chip>OpenAI-compatible</Chip>
                </ul>
              </div>
            </div>
          </div>
          <figcaption className="mt-4 text-sm text-brand-muted">
            Every request takes the same path. Provider credentials stay on the server; the caller&apos;s key is never
            sent upstream.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Features */

function FeatureCard({
  id,
  icon,
  eyebrow,
  title,
  lead,
  bullets,
  note,
  wide = false,
}: {
  id: string;
  icon?: ReactNode;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  bullets: ReactNode[];
  note?: ReactNode;
  wide?: boolean;
}) {
  return (
    <article
      aria-labelledby={id}
      className={`flex min-w-0 flex-col rounded-card border border-brand-border bg-brand-surface p-6 sm:p-8 ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-primary-subtle text-brand-primary-subtle-text">
            {icon}
          </span>
        ) : null}
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h3 id={id} className="mt-3 text-xl font-semibold tracking-tight text-brand-text sm:text-2xl">
        {title}
      </h3>
      <div className="mt-3 space-y-3 leading-relaxed text-brand-muted">{lead}</div>
      <CheckList items={bullets} columns={wide} />
      {note ? <Note>{note}</Note> : null}
    </article>
  );
}

const endpoints: { path: string; what: string }[] = [
  { path: "/v1/chat/completions", what: "Chat, with streaming and function tools" },
  { path: "/v1/responses", what: "Responses, stateless" },
  { path: "/v1/messages", what: "Anthropic Messages" },
  { path: "/v1/embeddings", what: "Embeddings" },
  { path: "/v1/images/generations", what: "Image generation" },
  { path: "/v1/audio/*", what: "Transcription and speech" },
  { path: "/v1/realtime", what: "Realtime audio over WebSocket" },
  { path: "/v1/files", what: "Files, encrypted at rest" },
  { path: "/v1/batches", what: "Batches, for any model" },
  { path: "/v1/rerank", what: "Rerank" },
];

function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16 border-t border-brand-border py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading id="features-title" eyebrow="Features" title="Everything a platform team needs between people and models">
          <p>
            {site.shortName} is one installation for one organisation. Workspaces are the security boundary;
            platform administrators set the rules, and workspace administrators work within them.
          </p>
        </SectionHeading>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* APIs: README "Inference and accounting", docs/protocol-matrix.md, realtime.md, files-api.md, batches.md */}
          <article aria-labelledby="feature-apis" className="flex min-w-0 flex-col rounded-card border border-brand-border bg-brand-surface p-6 sm:p-8 lg:col-span-2">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div className="min-w-0">
                <Eyebrow>APIs</Eyebrow>
                <h3 id="feature-apis" className="mt-3 text-xl font-semibold tracking-tight text-brand-text sm:text-2xl">
                  OpenAI and Anthropic compatible, realtime, files and batches included
                </h3>
                <div className="mt-3 space-y-3 leading-relaxed text-brand-muted">
                  <p>
                    Keep the SDKs your developers already use. Change the base URL and the key; the gateway speaks
                    each protocol natively.
                  </p>
                </div>
                <CheckList
                  items={[
                    <>
                      <Strong>Realtime audio</Strong> sessions over WebSocket, with the budget reserved and settled
                      per response.
                    </>,
                    <>
                      <Strong>Batches for any model:</Strong> on the provider&apos;s own batch API for OpenAI and
                      Anthropic, otherwise run line by line by the gateway, each line with its own reservation. Inputs
                      are checked first, with a report by line number.
                    </>,
                    <>
                      <Strong>Anything unsupported fails clearly.</Strong> Options the gateway can&apos;t honour are
                      rejected, never silently dropped.
                    </>,
                  ]}
                />
                <Note>
                  Each endpoint supports a documented subset of its protocol. In this release, Responses and Messages
                  streams arrive in one piece rather than token by token, and there is no image input yet.
                </Note>
              </div>
              <div className="min-w-0 self-start overflow-x-auto rounded-card border border-brand-border-emphasis bg-brand-surface-sunken">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Inference endpoints</caption>
                  <thead>
                    <tr className="border-b border-brand-border text-xs text-brand-subtle">
                      <th scope="col" className="py-2 pr-2 pl-3 font-medium sm:pr-3 sm:pl-4">
                        Endpoint
                      </th>
                      <th scope="col" className="py-2 pr-3 pl-2 font-medium sm:pr-4 sm:pl-3">
                        For
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((e) => (
                      <tr key={e.path} className="border-b border-brand-border last:border-0">
                        <td className="py-2 pr-2 pl-3 font-mono sm:pr-3 sm:pl-4 text-xs whitespace-nowrap text-brand-text sm:text-[0.8125rem]">{e.path}</td>
                        <td className="py-2 pr-3 pl-2 text-brand-muted sm:pr-4 sm:pl-3">{e.what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          {/* Providers: docs/provider-adapters.md, routing.md, bedrock.md */}
          <FeatureCard
            id="feature-providers"
            icon={<Server className="size-5" />}
            eyebrow="Providers and routing"
            title="Cloud providers and your own GPUs, side by side"
            lead={
              <p>
                Connect OpenAI, Anthropic, AWS Bedrock and OpenRouter, and self-hosted vLLM, SGLang, Ollama or other
                OpenAI-compatible servers. One model name can route to several deployments.
              </p>
            }
            bullets={[
              <>
                <Strong>Bedrock</Strong> with the server&apos;s AWS identity, a named profile or an assumed role.
                <Strong> OpenRouter</Strong> with data collection denied unless you allow it.
              </>,
              <>
                <Strong>Self-hosted endpoints</Strong> must be approved in server configuration, pinned to fixed
                addresses, with redirects and proxies off.
              </>,
              <>
                <Strong>Routing</Strong> by priority and weight, with residency labels and a cooldown for failing
                deployments. Up to three attempts, only when you allow it, and never after a stream has started.
              </>,
              // verify after merge: capacity-aware batch scheduling for self-hosted models
              // (migration 0022_batch_scheduling.sql, docs/batches.md#scheduling-on-self-hosted-models).
              <>
                <Strong>Batches wait for capacity</Strong> on self-hosted models: a per-route limit, yielding to live
                traffic, an optional server load signal and time window.
              </>,
            ]}
          />

          {/* Scale: docs/kubernetes.md, scaling.md, releases/v0.4.0.md */}
          <FeatureCard
            id="feature-scale"
            icon={<Layers className="size-5" />}
            eyebrow="Scale-out"
            title="Add replicas as load grows"
            lead={
              <p>
                Scoped admission locks a workspace&apos;s and a key&apos;s own budget rows instead of one
                installation-wide row, so replicas of different workspaces run in parallel. Monthly history
                partitions, hourly usage rollups and operator archival keep old requests from slowing down new ones.
              </p>
            }
            bullets={[
              <>
                <Strong>A Kubernetes Helm chart (beta)</Strong> deploys the gateway with an explicit migration job, a
                hardened non-root Deployment, and an optional CloudNativePG-managed PostgreSQL cluster and pooler.
              </>,
              <>
                <Strong>Per-replica caches</Strong> stay current within about a second through PostgreSQL
                <code> LISTEN</code>/<code>NOTIFY</code>, while admission always re-checks authorization live.
              </>,
              <>
                <Strong>An admission-ceiling alert</Strong> tells platform admins when one workspace or key, not the
                installation as a whole, is nearing the request rate a single scope can sustain.
              </>,
            ]}
            note={<>Every number behind this work is a laptop load-test stack, not a capacity promise. See the Kubernetes docs for what is validated so far.</>}
          />

          {/* Workspaces: docs/architecture.md, enterprise-rebuild.md, enterprise-costs.md */}
          <FeatureCard
            id="feature-workspaces"
            icon={<Layers className="size-5" />}
            eyebrow="Workspaces and catalogs"
            title="Teams, projects and private spaces"
            lead={
              <p>
                Teams and Projects are shared workspaces with their own owners, admins and members. Everyone with
                access also gets a personal workspace that only they can see into.
              </p>
            }
            bullets={[
              <>
                <Strong>Catalogs</Strong> decide which models each kind of workspace can use, with per-workspace
                overrides and direct assignments.
              </>,
              <>
                <Strong>Keys</Strong> belong to one workspace, are shown once, and can be limited to chosen models.
                Rotate, disable or revoke them; a revoked key never comes back.
              </>,
              <>
                <Strong>Service accounts</Strong> give applications keys that don&apos;t depend on one employee.
              </>,
              <>
                <Strong>Cost centers</Strong> tag a workspace&apos;s future spend for internal allocation.
              </>,
            ]}
          />

          {/* Budgets: docs/governance.md, cache-pricing.md, cost-reporting.md */}
          <FeatureCard
            id="feature-budgets"
            icon={<Wallet className="size-5" />}
            eyebrow="Budgets, limits and costs"
            title="Stacked budgets, exact costs, and unknown is never zero"
            wide
            lead={
              <p>
                Budgets and limits apply at every layer at once: the workspace type&apos;s defaults, a platform
                override for one workspace, the workspace itself and each key. Whichever runs out first stops the
                request, before it reaches the provider. An optional, non-blocking installation spend alert watches
                total spend across every workspace and only notifies &mdash; it never denies a request.
              </p>
            }
            bullets={[
              <>
                <Strong>Budgets</Strong> per UTC day, ISO week, month or lifetime, several at once. Lower layers can
                only tighten; raising a limit never resets what was spent.
              </>,
              <>
                <Strong>Limits</Strong> on requests and tokens per minute, requests at once, batch and video jobs at
                once, and file storage. Shared across replicas through PostgreSQL.
              </>,
              <>
                <Strong>Exact costs</Strong> in integer micro-dollars from versioned prices, pinned when each request is
                admitted, in an append-only ledger. Cached tokens are priced without double counting.
              </>,
              <>
                <Strong>Unknown is never zero.</Strong> If a provider doesn&apos;t report usage, the request keeps its
                hold and shows as unknown until someone resolves it with evidence. Requests whose cost can&apos;t be
                bounded are refused where a budget applies.
              </>,
            ]}
            note={
              <>
                Costs use the prices you configure. They are estimates, not provider invoices; keep provider-side
                spending limits where you need a hard cap on a bill.
              </>
            }
          />

          {/* Records: docs/dashboard.md, alerts.md, key-safety.md, cost-reporting.md */}
          <FeatureCard
            id="feature-records"
            icon={<Scale className="size-5" />}
            eyebrow="Logs, usage and alerts"
            title="See what happened, and hear about it early"
            lead={
              <p>
                Workspace members see their own activity; workspace admins see their workspace; platform staff see
                Teams and Projects, and personal spending only as totals.
              </p>
            }
            bullets={[
              <>
                <Strong>Logs</Strong> by request, generation and session: model, provider, status, tokens, time to first
                token and cost.
              </>,
              <>
                <Strong>Usage and costs</Strong> by workspace, model and key, with settled, held and unknown amounts
                kept apart, and CSV export.
              </>,
              <>
                <Strong>Alerts</Strong> for budget thresholds, spend spikes, error rates, failing connections, an
                admission ceiling, installation spend, and failed or stalled batches, in the app and by email.
              </>,
              <>
                <Strong>Key safety</Strong> finds keys with no expiry, no limits, a holder who has left, or no recent
                use, and offers the fix.
              </>,
            ]}
          />

          {/* Identity: docs/identity.md, scim.md, settings.md, operations.md */}
          <FeatureCard
            id="feature-identity"
            icon={<Shield className="size-5" />}
            eyebrow="Sign-in and audit"
            title="Your identity provider decides who gets in"
            lead={
              <p>
                People sign in with OpenID Connect. Signing in is not access: platform roles (User, Auditor, Admin)
                come from manual grants or your directory groups.
              </p>
            }
            bullets={[
              <>
                <Strong>Group mappings</Strong> grant platform roles and workspace membership from signed group claims.
              </>,
              <>
                <Strong>SCIM 2.0</Strong> provisioning: a deactivated person loses access and keys at once, and the last
                platform admin can&apos;t be removed by accident.
              </>,
              <>
                <Strong>Auditors</Strong> can open every admin page and change nothing.
              </>,
              <>
                <Strong>An audit log</Strong> records every administrative change, without credentials.
              </>,
            ]}
          />

          {/* Privacy: docs/settings.md (Data & privacy), architecture.md, file-storage.md */}
          <FeatureCard
            id="feature-privacy"
            icon={<EyeOff className="size-5" />}
            eyebrow="Privacy"
            title="Prompts are not stored"
            wide
            lead={
              <p>
                {site.shortName} does not store or log prompts or responses. Logs keep metadata only, and you choose
                how long even that is kept.
              </p>
            }
            bullets={[
              <>
                <Strong>Files are encrypted</Strong> by the gateway before they reach disk or S3-compatible storage,
                each with its own key. File storage is off until you turn it on, with retention per kind of file.
              </>,
              <>
                <Strong>Provider credentials</Strong> are references to server-side secrets or workload identity, never
                stored in the database or shown in the browser.
              </>,
              <>
                <Strong>Personal workspaces stay personal:</Strong> not even platform admins can see another
                person&apos;s keys or requests.
              </>,
              <>
                <Strong>Metrics carry no</Strong> workspace, key, user or request identifiers.
              </>,
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Operations */

const opsExample = `# explicit, checked migrations: serve never migrates
open-model-gateway migrate

# compare maintained budget totals with a full scan
open-model-gateway budget verify

# find missing or undecryptable files
open-model-gateway files verify

# checksummed backup, schema lineage recorded
python3 scripts/backup.py backup --out-dir /secure/backups`;

function Operations() {
  return (
    <section id="operations" aria-labelledby="operations-title" className="scroll-mt-16 border-t border-brand-border bg-brand-surface-sunken py-20 sm:py-24">
      <div className="container-page grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <SectionHeading id="operations-title" eyebrow="Operations" title="One Rust binary and PostgreSQL">
            <p>
              The gateway is a single Rust service that serves the API and the dashboard. No Node.js at runtime and no
              Redis.
            </p>
          </SectionHeading>
          <CheckList
            items={[
              <>
                <Strong>PostgreSQL 17</Strong> holds identity, configuration, limits and accounting, so every replica
                enforces the same budgets.
              </>,
              <>
                <Strong>A locked-down container:</Strong> a signed, distroless image with no shell, non-root, a
                read-only root filesystem and a built-in health check, plus a separate runtime database role with
                explicit grants. Prices, the ledger and the audit log are append-only to it.
              </>,
              <>
                <Strong>Health and metrics:</Strong> liveness and readiness endpoints, and Prometheus metrics on their
                own listener, with example alert rules and a Grafana dashboard.
              </>,
              <>
                <Strong>Backups</Strong> with checksums, lineage checks and restores only into an empty database. Never
                over live data.
              </>,
              <>
                <Strong>Load-tested</Strong> with a harness in the repository that checks the ledger to the
                micro-dollar after every run, including a multi-replica stack behind PgBouncer.
              </>,
            ]}
          />
          <Note>
            Admission locks a workspace&apos;s and a key&apos;s own budget rows, not an installation-wide row, so
            replicas of different workspaces run in parallel; one workspace or key still serializes its own requests
            on purpose, to keep its budgets exact. Backups are not encrypted by the script; encrypt them before they
            leave the host.
          </Note>
        </div>
        <div className="min-w-0 space-y-6">
          <CodeBlock label="Day-to-day operator commands">{opsExample}</CodeBlock>
          <div className="rounded-card border border-brand-border bg-brand-surface p-6">
            <p className="text-sm font-semibold text-brand-text">Upgrades are deliberate</p>
            <ul className="mt-3 space-y-2 text-sm text-brand-muted">
              <li>The service never migrates its own database; readiness fails until the schema matches the binary.</li>
              <li>Migrations check the existing schema before changing anything.</li>
              <li>There are no down migrations: roll back by restoring the pre-upgrade backup.</li>
            </ul>
            <p className="mt-4 text-sm">
              <TextLink href={site.operationsUrl}>Operations runbook</TextLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Screenshots */

const gallery: SlotName[] = [
  "admin-usage",
  "admin-limits",
  "workspace-models",
  "workspace-keys",
  "workspace-logs",
  "admin-connections",
  "admin-key-safety",
  "batch-detail",
];

function Screenshots() {
  return (
    <section id="screenshots" aria-labelledby="screenshots-title" className="scroll-mt-16 border-t border-brand-border py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading id="screenshots-title" eyebrow="The dashboard" title="A dashboard for workspaces and administrators">
          <p>
            Workspace admins manage their keys, models and spending. Platform admins manage connections, catalogs,
            limits and people. Auditors see the same pages, read-only.
          </p>
        </SectionHeading>
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {gallery.map((slot) => (
            <Screenshot key={slot} slot={slot} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Self-host */

const quickStart = `git clone https://github.com/ncecere/open-model-gateway.git
cd open-model-gateway
python3 scripts/staging.py init     # private secrets
python3 scripts/staging.py build    # gateway image
python3 scripts/staging.py db       # PostgreSQL 17
python3 scripts/staging.py migrate  # schema + grants
python3 scripts/staging.py up       # behind HTTPS
python3 scripts/staging.py verify`;

const composeExcerpt = `# deploy/staging/compose.yaml (excerpt)
services:
  postgres:
    image: postgres:17-bookworm
  gateway:
    image: \${GATEWAY_IMAGE:-open-model-gateway:staging}
    read_only: true
    cap_drop: [ALL]
    environment:
      DATABASE_URL_FILE: /run/secrets/runtime_database_url
      GATEWAY_ENV: production
      GATEWAY_LISTEN: 0.0.0.0:8080
      GATEWAY_WEB_DIR: /app/web
      GATEWAY_PUBLIC_URL: \${GATEWAY_PUBLIC_URL:-https://localhost:18443}
      GATEWAY_METRICS_ADDR: \${GATEWAY_METRICS_ADDR:-}
    secrets: [runtime_database_url]
  ingress:
    image: caddy:2-alpine`;

const requirements = [
  "Docker with Compose v2, Python 3 and curl on the host",
  "An OpenID Connect provider (authorization code with PKCE, verified email)",
  "PostgreSQL 17: included in the Compose file, or your own with TLS",
  "S3-compatible storage or a local disk, if you want files and batches",
  "Credentials for at least one provider, or an approved self-hosted endpoint",
];

function SelfHost() {
  return (
    <section id="self-host" aria-labelledby="self-host-title" className="scroll-mt-16 border-t border-brand-border bg-brand-surface-sunken py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading id="self-host-title" eyebrow="Self-host" title="Run it on your own infrastructure">
          <p>
            The repository ships a Compose deployment: PostgreSQL, the gateway and an HTTPS front end, with separate
            database roles and secrets in files. A helper script runs each step.
          </p>
          <p>
            Each release also publishes a signed image to <code>ghcr.io/ncecere/open-model-gateway</code>: distroless,
            with no shell or package manager, running as a non-root user. Verify it with cosign and set{" "}
            <code>GATEWAY_IMAGE</code> to its digest instead of building.
          </p>
        </SectionHeading>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0 space-y-6">
            <CodeBlock label="Build and start Open Model Gateway with Docker Compose">{quickStart}</CodeBlock>
            <ol className="list-decimal space-y-3 pl-5 text-brand-muted marker:text-brand-subtle">
              <li>
                Turn on sign-in with your issuer and client ID in <code>.local/staging/staging.env</code>, and register{" "}
                <code>https://your-host/api/v1/auth/callback</code> with your identity provider.
              </li>
              <li>
                Name the first administrator with <code>python3 scripts/staging.py provision-user --email you@example.edu</code>,
                then run <code>up</code> again.
              </li>
              <li>
                Sign in, add a connection and a model with its prices under <Strong>Admin</Strong>, and put the model
                in a catalog. Nothing is enabled until you do.
              </li>
            </ol>
            <CodeBlock label="What the Compose file runs">{composeExcerpt}</CodeBlock>
          </div>
          <div className="self-start rounded-card border border-brand-border bg-brand-surface p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-brand-text">What you need</h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-muted">
              {requirements.map((r) => (
                <li key={r} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-text" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <Note>
              The Compose deployment is a single-host baseline. Keep it private until you have run the live acceptance
              checks against your own identity provider and providers.
            </Note>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={site.docsUrl}>
                Self-hosting docs
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href={site.composeUrl} variant="secondary">
                Compose file on GitHub
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Open source */

function OpenSource() {
  return (
    <section id="open-source" aria-labelledby="open-source-title" className="scroll-mt-16 border-t border-brand-border py-20 sm:py-24">
      <div className="container-page">
        <h2 id="open-source-title" className="sr-only">
          Open source and project status
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <article aria-labelledby="oss-title" className="min-w-0 rounded-card border border-brand-border bg-brand-surface p-6 sm:p-8">
            <Eyebrow>Open source</Eyebrow>
            <h3 id="oss-title" className="mt-2 text-2xl font-semibold tracking-tight text-brand-text">
              MIT licensed, built in the open
            </h3>
            <div className="mt-4 space-y-3 leading-relaxed text-brand-muted">
              <p>
                {site.name} is released under the MIT licence. Run it for as many people as you like, and change the
                code if you need to.
              </p>
              <p>
                It is written in Rust with Axum and PostgreSQL, with a React dashboard. Every change runs Rust tests
                against real PostgreSQL, mock-provider and SDK contract tests, and browser tests with accessibility
                scans for every role. No test makes a paid provider call.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={site.repoUrl} variant="secondary">
                <Github className="size-4" />
                Source on GitHub
              </ButtonLink>
              <ButtonLink href={site.licenseUrl} variant="ghost">
                Read the licence
              </ButtonLink>
            </div>
          </article>
          <article aria-labelledby="status-title" className="min-w-0 rounded-card border border-brand-border bg-brand-surface p-6 sm:p-8">
            <Eyebrow>Project status</Eyebrow>
            <h3 id="status-title" className="mt-2 text-2xl font-semibold tracking-tight text-brand-text">
              {site.version}: pre-1.0, and honest about it
            </h3>
            <div className="mt-4 space-y-3 leading-relaxed text-brand-muted">
              <p>
                The features on this page are implemented and tested with mocks and real PostgreSQL. Live acceptance
                with real identity providers, providers and production load is still open, so pilot it before you
                depend on it. The Kubernetes Helm chart is beta: validated by template rendering, schema checks and
                a dry run against a live database operator, not yet by sustained production load.
              </p>
              <p>
                Planned, not built yet: image input, token-by-token Responses and Messages streaming, a video provider,
                active health checks, webhooks and reconciliation against provider invoices.
              </p>
            </div>
            <p className="mt-6 text-brand-muted">
              Read the <TextLink href={site.releaseNotesUrl}>{site.version} release</TextLink> and the{" "}
              <TextLink href={site.roadmapUrl}>roadmap</TextLink>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
