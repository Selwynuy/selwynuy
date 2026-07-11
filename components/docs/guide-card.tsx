import Link from "next/link";
import type { Guide } from "@/lib/docs/guides";

/**
 * A guide card: icon-tile + identity header, blurb, then a price and a "View"
 * pill that funnels to the guide's landing page (not the raw PDF), so the sale
 * happens on the detail page where the pitch, price, and checkout live.
 */
export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg hover:ring-accent/40">
      <Link
        href={`/guides/${guide.slug}`}
        className="flex items-start gap-4 p-5 pb-3"
      >
        <span
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-mono text-lg font-bold text-accent-foreground shadow-soft-md ring-1 ring-white/10"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)",
          }}
        >
          {guide.mark}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            {guide.kind.toUpperCase()} guide
          </span>
          <span className="display mt-1 block truncate text-2xl leading-none text-foreground group-hover:text-accent">
            {guide.title}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted">
            {guide.verified ? (
              <span className="inline-flex items-center gap-1 text-accent">
                <span aria-hidden>✓</span> verified
              </span>
            ) : (
              <span className="text-subtle">draft</span>
            )}
          </span>
        </span>
      </Link>

      <p className="px-5 text-sm leading-relaxed text-muted">{guide.blurb}</p>

      <div className="mt-auto flex items-center justify-between gap-3 p-5 pt-6">
        <span className="flex items-baseline gap-1.5">
          <span className="display text-2xl leading-none text-foreground">
            {guide.landing.price}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
            {guide.landing.pages}pp
          </span>
        </span>
        <Link
          href={`/guides/${guide.slug}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover"
        >
          View <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
