import type { Doc } from "@/lib/docs/types";

/**
 * Shows whether a handbook page has been fact-checked and signed off.
 * Verified pages list their sources; drafts are labelled honestly in public.
 */
export function VerifiedBadge({ doc }: { doc: Doc }) {
  if (!doc.verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted ring-1 ring-hairline">
        <span className="h-1.5 w-1.5 rounded-full bg-subtle" aria-hidden />
        Draft, under review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-wash px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent ring-1 ring-accent/30">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      Verified
    </span>
  );
}

/** The source list shown at the foot of a verified page. */
export function SourceList({ doc }: { doc: Doc }) {
  if (!doc.sources || doc.sources.length === 0) return null;
  return (
    <footer className="mt-12 rounded-xl bg-surface px-5 py-4 ring-1 ring-hairline">
      <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">
        Sources
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {doc.sources.map((s) => {
          const external = /^https?:\/\//.test(s);
          if (external) {
            // The live, clickable reference. Show a friendly label, not the URL.
            let label = s;
            try {
              const u = new URL(s);
              label = `${u.hostname.replace(/^www\./, "")}${u.pathname}`;
            } catch {
              /* keep raw */
            }
            return (
              <li key={s}>
                <a
                  href={s}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-start gap-2 text-accent transition-colors hover:text-accent-hover"
                >
                  <span aria-hidden className="mt-0.5 shrink-0 text-xs">
                    ↗
                  </span>
                  <span className="break-words underline decoration-accent/40 underline-offset-2 group-hover:decoration-accent">
                    {label}
                  </span>
                </a>
              </li>
            );
          }
          // Bundled-doc path: a citation, not a link. Label it as internal so it
          // does not read as a broken link.
          const short = s.replace(/^node_modules\/next\/dist\/docs\//, "");
          return (
            <li key={s} className="flex items-start gap-2 text-muted">
              <span className="mt-0.5 shrink-0 rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-subtle">
                Next.js docs
              </span>
              <code className="break-all font-mono text-xs text-foreground/70">
                {short}
              </code>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
