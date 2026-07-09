import Link from "next/link";
import type { Skill } from "@/lib/docs/skills";
import { CATEGORY_META } from "@/lib/docs/skills";

/** Human label for each skill kind, shown in the compact meta line. */
const KIND_LABEL: Record<Skill["kind"], string> = {
  workflow: "Workflow",
  check: "Check",
  scaffold: "Scaffold",
};

/**
 * Category tints (1-5), one flat value each. Brand rule: red is an accent,
 * never a flood (see globals.css), so categories are told apart by WEIGHT
 * within the same red family, never a different hue. Tint 1 (Ops) is a dim,
 * desaturated ember; tint 5 (Build) is the brightest saturated red. Used as
 * a small ring/badge accent now, not a full card-header flood.
 */
const TINT_COLOR: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "color-mix(in oklab, var(--color-red-600) 55%, var(--color-neutral-600))",
  2: "color-mix(in oklab, var(--color-red-600) 78%, var(--color-neutral-500))",
  3: "var(--color-red-600)",
  4: "var(--color-red-500)",
  5: "var(--color-red-400)",
};

/**
 * A marketplace skill card, photo-rail style: a compact tile (mark where a
 * photo would be, a small tint-colored status badge in the corner like a
 * "Guest favorite" pill) with the title and a one-line meta stat below.
 * Deliberately thin on the card itself, blurb, needs, phases, and bundled
 * files all live on the detail page, the same split the reference's own
 * rail-card-to-listing-page pattern uses. Sized to sit in a horizontally
 * scrolling row, not a wrapping grid.
 */
export function SkillCard({ skill }: { skill: Skill }) {
  const tint = CATEGORY_META[skill.category].tint;
  const phases = skill.phases?.length ?? 0;
  const files = skill.files.length;

  return (
    <Link
      href={`/skills/${skill.name}`}
      className="group flex w-56 shrink-0 snap-start flex-col gap-2.5 sm:w-64"
    >
      {/* Photo slot: no image to show, so the mark tile fills the space,
          large and centered, on a flat neutral surface. */}
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft-lg">
        <span className="display text-5xl text-foreground/15">
          {skill.mark}
        </span>

        {/* Status badge: the "Guest favorite" pill equivalent, top-left. */}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-foreground shadow-soft-sm backdrop-blur-sm">
          {skill.verified ? "Verified" : "Draft"}
        </span>

        {/* Category accent: a small tinted dot, top-right, the same red
            family told apart by weight, not a different hue, kept small so
            the row header (not the card) carries the main category signal. */}
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full shadow-soft-sm ring-2 ring-background/90"
          style={{ backgroundColor: TINT_COLOR[tint] }}
        />
      </span>

      {/* Title + compact meta, mirrors the reference's name / price-and-rating line. */}
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold leading-snug text-foreground">
          {skill.title}
        </span>
        <span className="mt-0.5 flex items-center gap-1 font-mono text-[12px] text-muted">
          <span>{KIND_LABEL[skill.kind]}</span>
          {phases > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>
                {phases} {phases === 1 ? "phase" : "phases"}
              </span>
            </>
          )}
          {phases === 0 && files > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>
                {files} {files === 1 ? "file" : "files"}
              </span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
