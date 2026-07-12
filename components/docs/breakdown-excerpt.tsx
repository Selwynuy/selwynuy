import type { ReactNode } from "react";

export interface BreakdownRow {
  mark: string;
  head: string;
  desc: string;
  icon?: ReactNode;
}

/**
 * Live recreation of the book's `.breakdown`/`.bd-row` component (a big
 * letter/number anchor + red heading + description in a banded row), used in
 * content/guides/complete-parts/*.html for named lists like E-E-A-T. Unlike
 * the CoverCard mockup, this follows the page's own light/dark theme rather
 * than being forced dark.
 */
export function BreakdownExcerpt({
  title,
  source,
  rows,
}: {
  title: string;
  source: string;
  rows: BreakdownRow[];
}) {
  return (
    <div className="rounded-2xl bg-surface p-5 ring-1 ring-hairline sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="display text-xl text-foreground">{title}</h3>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-subtle">
          {source}
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.mark + row.head}
            className="flex items-center gap-4 rounded-xl bg-surface-raised px-4 py-3"
          >
            <span className="relative flex w-8 shrink-0 items-center justify-center">
              <span className="display text-2xl leading-none text-foreground">
                {row.mark}
              </span>
              <span
                aria-hidden
                className="absolute inset-y-[18%] right-0 border-l border-dashed border-accent/55"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight text-accent">
                {row.head}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {row.desc}
              </p>
            </div>
            {row.icon && (
              <span aria-hidden className="hidden w-8 shrink-0 sm:block">
                {row.icon}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
