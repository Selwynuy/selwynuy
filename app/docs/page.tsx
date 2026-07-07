import type { Metadata } from "next";
import Link from "next/link";
import { getDocsBySection } from "@/lib/docs/registry";
import { abs } from "@/lib/site";
import { Playbook } from "@/components/docs/playbook";

export const metadata: Metadata = {
  title: "Handbook",
  description:
    "An opinionated, fact-checked field guide to building production Next.js apps: setup, security, integrations, growth, and shipping. Droppable straight into your AI.",
};

/** Handbook landing page: the full section index. */
export default function DocsIndexPage() {
  const groups = getDocsBySection();

  return (
    <div className="min-w-0">
      <header className="mb-12 border-b border-hairline pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
          The Handbook
        </p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          How I build with <span className="text-accent">Next.js</span>
        </h1>
        <p className="measure mt-5 text-lg leading-relaxed text-muted">
          The real workflow behind the projects, written down and fact-checked.
          Setup, security, branding, the integrations I reach for, and how I
          ship. Follow it as a path from{" "}
          <Link
            href="/docs/getting-started"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            Getting Started
          </Link>{" "}
          to deployed, or drop any page straight into your own AI. New here?{" "}
          <Link
            href="/docs/how-to-use"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            See how to use this handbook
          </Link>
          .
        </p>

        {/* The headline feature: copy the whole playbook into an AI. */}
        <div className="measure mt-8">
          <Playbook />

          {/* Entry point to the installable skills marketplace. Full card
              weight, not a thin link: this is the flagship distribution
              channel (agents install skills; they don't browse llms.txt), so
              it needs to read at the same level as the CLAUDE.md card above
              it, not as a footnote underneath the project creator. */}
          <Link
            href="/skills"
            className="group mt-4 flex items-center justify-between gap-4 rounded-xl bg-surface-raised p-5 ring-1 ring-hairline transition-colors hover:ring-accent/40 sm:p-6"
          >
            <span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span aria-hidden>▸</span> Want it to just do it?
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                Install my process as a Claude Code skill: the discovery-to-PRD
                workflow, the anti-slop check, the Next.js scaffold. Browse the{" "}
                <span className="text-foreground group-hover:text-accent">
                  skills marketplace
                </span>
                .
              </span>
            </span>
            <span
              aria-hidden
              className="shrink-0 text-2xl text-accent transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          {/* Entry point to the interactive project creator. */}
          <Link
            href="/docs/create"
            className="group mt-4 flex items-center justify-between rounded-xl bg-surface px-5 py-4 ring-1 ring-hairline transition-colors hover:ring-accent/40"
          >
            <span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                <span aria-hidden>▸</span> Not sure where to start?
              </span>
              <span className="mt-1 block text-sm text-muted">
                Answer four questions, get a fit verdict and a prompt tailored to
                your project.
              </span>
            </span>
            <span
              aria-hidden
              className="ml-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Prefer one topic? Every section has its own{" "}
            <span className="text-muted">Copy for AI</span> button, the{" "}
            <Link
              href="/docs/decisions"
              className="text-muted underline decoration-hairline underline-offset-2 hover:text-foreground"
            >
              Decisions and Defaults
            </Link>{" "}
            page lists every hard call in one place, and agents can read the
            index at{" "}
            <a
              href={abs("/llms.txt")}
              className="font-mono text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              /llms.txt
            </a>
            .
          </p>
        </div>
      </header>

      <div className="space-y-12">
        {groups.map((group, gi) => (
          <section key={group.section}>
            <h2 className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              <span className="text-subtle">
                {String(gi + 1).padStart(2, "0")}
              </span>
              {group.section}
            </h2>
            <ul className="mt-4 divide-y divide-hairline">
              {group.docs.map((doc, di) => {
                // The very first page of the first section is the entry point.
                const isEntry = gi === 0 && di === 0;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-foreground"
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground group-hover:text-accent">
                            {doc.title}
                          </span>
                          {isEntry && (
                            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent ring-1 ring-accent/20">
                              Start here
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {doc.summary}
                        </span>
                      </span>
                      {!doc.verified && (
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-subtle">
                          Draft
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
