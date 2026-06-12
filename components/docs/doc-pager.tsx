import Link from "next/link";
import type { Doc } from "@/lib/docs/types";

/**
 * Previous / next navigation at the foot of a doc, so readers flow through the
 * handbook in order instead of dead-ending. Built from the registry ordering.
 */
export function DocPager({
  prev,
  next,
}: {
  prev?: Doc;
  next?: Doc;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Handbook pagination"
      className="mt-14 grid gap-3 border-t border-hairline pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group rounded-xl bg-surface p-4 ring-1 ring-hairline transition-colors hover:ring-accent/40"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
            Previous
          </span>
          <span className="mt-1 block font-semibold text-foreground group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group rounded-xl bg-surface p-4 text-right ring-1 ring-hairline transition-colors hover:ring-accent/40"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
            Next
          </span>
          <span className="mt-1 block font-semibold text-foreground group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
