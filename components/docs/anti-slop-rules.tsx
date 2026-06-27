import { slopCategories, SLOP_WORDS } from "@/lib/docs/anti-slop";

/**
 * The anti-slop catalog, rendered from the shared data module. A Server
 * Component (no interactivity, zero client JS). The same data is flattened to
 * markdown by registry.toPlainMarkdown for the one-drop endpoint, so the page
 * and the AI-facing text never drift.
 *
 * Used in MDX as a bare <AntiSlopRules />.
 */
export function AntiSlopRules() {
  return (
    <div className="my-8 space-y-10">
      {/* The fast ban-list up top: the single most-flagged words. */}
      <section>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
          The fast ban-list
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The words sources flag most. If a draft leans on these, it reads as
          machine text. Reach for the plainest accurate word instead.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SLOP_WORDS.map((w) => (
            <span
              key={w}
              className="rounded-md bg-accent-wash px-2 py-1 font-mono text-xs text-accent ring-1 ring-accent/25"
            >
              {w}
            </span>
          ))}
        </div>
      </section>

      {slopCategories.map((group) => (
        <section key={group.category}>
          <h2
            id={slugify(group.category)}
            className="display mt-0 mb-1.5 scroll-mt-24 text-2xl text-foreground"
          >
            {group.category}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">{group.blurb}</p>
          <div className="overflow-hidden rounded-xl ring-1 ring-hairline [&>*+*]:border-t [&>*+*]:border-hairline">
            {group.rules.map((rule) => (
              <div
                key={`${group.category}-${rule.avoid}`}
                className="grid gap-3 bg-surface px-4 py-4 sm:grid-cols-[1fr_1fr] sm:px-5"
              >
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    Avoid
                  </span>
                  <p className="mt-1 font-medium leading-relaxed text-foreground">
                    {rule.avoid}
                  </p>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-subtle">
                    Instead
                  </span>
                  <p className="mt-1 leading-relaxed text-muted">{rule.instead}</p>
                  <p className="mt-2 text-xs leading-relaxed text-subtle">
                    {rule.evidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Match github-slugger output the TOC uses, for in-page anchors. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
