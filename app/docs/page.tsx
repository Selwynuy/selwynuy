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
          to deployed, or drop any page straight into your own AI.
        </p>

        {/* The headline feature: copy the whole playbook into an AI. */}
        <div className="measure mt-8">
          <Playbook />
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Prefer one topic? Every section has its own{" "}
            <span className="text-muted">Copy for AI</span> button, and agents
            can read the index at{" "}
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
        {groups.map((group) => (
          <section key={group.section}>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              {group.section}
            </h2>
            <ul className="mt-4 divide-y divide-hairline">
              {group.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-foreground"
                  >
                    <span className="min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-accent">
                        {doc.title}
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
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
