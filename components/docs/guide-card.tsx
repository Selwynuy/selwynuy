import Link from "next/link";
import type { Guide } from "@/lib/docs/guides";

/**
 * A guide card: same icon-tile + identity header as SkillCard, but the action
 * is a direct PDF link instead of an install command, guides are reference
 * material, not something an agent installs. Whole card links to the detail
 * page; the "Open PDF" pill is the one live affordance.
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

      <div className="mt-auto flex items-center gap-2 p-5 pt-6">
        <a
          href={guide.pdf}
          download
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover"
        >
          <span aria-hidden>▸</span> Open PDF
        </a>
      </div>
    </article>
  );
}
