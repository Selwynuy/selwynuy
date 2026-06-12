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
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {doc.sources.map((s) => {
          const external = /^https?:\/\//.test(s);
          return (
            <li key={s} className="break-words">
              {external ? (
                <a
                  href={s}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                >
                  {s}
                </a>
              ) : (
                <code className="font-mono text-xs text-foreground/80">{s}</code>
              )}
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
