import Link from "next/link";
import {
  decisions,
  decisionCount,
  STRENGTH_LABEL,
  type DecisionStrength,
} from "@/lib/docs/decisions";

/**
 * The Decisions and Defaults reference, rendered from the shared data module.
 * A Server Component (no interactivity), so it adds zero client JavaScript.
 * The same data is flattened to markdown by registry.toPlainMarkdown for the
 * one-drop endpoint, so the rendered table and the AI-facing text never drift.
 *
 * Used in MDX as a bare <DecisionsTable />.
 */

const strengthClass: Record<DecisionStrength, string> = {
  // The hard rules get the accent, so the eye lands on what is not negotiable.
  "non-negotiable": "bg-accent-wash text-accent ring-accent/30",
  "strong-default": "bg-surface-raised text-muted ring-hairline",
  opinion: "bg-surface-raised text-subtle ring-hairline",
};

function StrengthBadge({ strength }: { strength: DecisionStrength }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ring-1 ${strengthClass[strength]}`}
    >
      {STRENGTH_LABEL[strength]}
    </span>
  );
}

export function DecisionsTable() {
  return (
    <div className="my-8 space-y-10">
      {decisions.map((group) => (
        <section key={group.category}>
          <h2
            id={slugify(group.category)}
            className="display mt-0 mb-4 scroll-mt-24 text-2xl text-foreground"
          >
            {group.category}
          </h2>
          <div className="overflow-hidden rounded-xl ring-1 ring-hairline [&>*+*]:border-t [&>*+*]:border-hairline">
            {group.rows.map((row) => (
              <div
                key={`${group.category}-${row.topic}`}
                className="bg-surface px-4 py-4 sm:px-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
                    {row.topic}
                  </p>
                  <StrengthBadge strength={row.strength} />
                </div>
                <p className="mt-1.5 font-medium leading-relaxed text-foreground">
                  {row.choice}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {row.why}
                </p>
                <Link
                  href={`/docs/${row.slug}`}
                  className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                >
                  Read the case
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Match the github-slugger output the TOC uses, for in-page anchors. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Re-export for the page's intro line so the count is never hardcoded. */
export { decisionCount };
