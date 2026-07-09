"use client";

import { useRef } from "react";
import Link from "next/link";
import { CATEGORY_META, type Skill } from "@/lib/docs/skills";
import type { SkillCategory } from "@/lib/docs/types";
import { SkillCard } from "@/components/docs/skill-card";

/** Category display order: the build journey, plan first, ops last. */
const CATEGORY_ORDER: SkillCategory[] = [
  "plan",
  "build",
  "security",
  "quality",
  "content",
  "ops",
];

/**
 * One horizontally-scrolling row of skills for a single category, styled
 * after a browse-rail: a "{Category} →" header with its own scroll arrows,
 * cards snap-scroll instead of wrapping into a grid. Full-bleed width (the
 * parent breaks out of the page's centered container) so the row actually
 * reads as a rail, not a cramped strip.
 */
function CategoryRow({ category, skills }: { category: SkillCategory; skills: Skill[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div id={category}>
      <div className="mb-4 flex items-center justify-between px-4 sm:px-6 lg:pl-20 lg:pr-6">
        <Link
          href={`/skills#${category}`}
          className="group flex items-center gap-2"
        >
          <h2 className="display text-xl text-foreground sm:text-2xl">
            {CATEGORY_META[category].label}
          </h2>
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-hairline transition-colors group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent"
          >
            →
          </span>
        </Link>

        <div className="hidden items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${CATEGORY_META[category].label} left`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-accent/40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${CATEGORY_META[category].label} right`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-accent/40"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 sm:gap-5 lg:pl-20 lg:pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

/**
 * The skills marketplace browse surface: one horizontally-scrolling rail per
 * category, in build-journey order, instead of a single filterable grid. The
 * row IS the category signal now (no per-card color block, no filter chips);
 * a card's own tint accent is just a small corner badge. Meant to render
 * full-bleed (see app/skills/page.tsx, which breaks this out of the page's
 * centered container) so rows actually read as rails.
 */
export function SkillsGallery({ skills }: { skills: Skill[] }) {
  // Guard: a skill whose category is missing from CATEGORY_ORDER would render
  // in no row and silently vanish (a build can't catch it, the array is still
  // a valid SkillCategory[]). Fail loud instead so adding a category can't
  // quietly drop a skill from the gallery.
  const ordered = new Set<SkillCategory>(CATEGORY_ORDER);
  const orphan = skills.find((s) => !ordered.has(s.category));
  if (orphan) {
    throw new Error(
      `[skills-gallery] "${orphan.name}" has category "${orphan.category}" ` +
        `which is not in CATEGORY_ORDER; it would not render. Add it to CATEGORY_ORDER.`,
    );
  }

  const rows = CATEGORY_ORDER.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  })).filter((row) => row.skills.length > 0);

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {rows.map((row) => (
        <CategoryRow key={row.category} category={row.category} skills={row.skills} />
      ))}
    </div>
  );
}
