"use client";

import { useState } from "react";
import type { Skill } from "@/lib/docs/skills";
import type { SkillKind } from "@/lib/docs/types";
import { SkillCard } from "@/components/docs/skill-card";

const KIND_FILTER_LABEL: Record<SkillKind | "all", string> = {
  all: "All",
  workflow: "Workflows",
  check: "Checks",
  scaffold: "Scaffolds",
};

/**
 * The filterable skill grid. A row of kind chips filters the cards client-side;
 * everything else (data, cards) is rendered from the server-provided catalog.
 * Kept minimal: the chips are the only interactivity, so the page stays fast
 * and the cards themselves are presentational.
 */
export function SkillsGallery({
  skills,
  kinds,
  marketplace,
}: {
  skills: Skill[];
  kinds: SkillKind[];
  marketplace: string;
}) {
  const [active, setActive] = useState<SkillKind | "all">("all");

  const filters: (SkillKind | "all")[] = ["all", ...kinds];
  const shown =
    active === "all" ? skills : skills.filter((s) => s.kind === active);

  return (
    <div>
      {/* Filter chips */}
      <div
        role="tablist"
        aria-label="Filter skills by kind"
        className="mb-8 flex flex-wrap items-center gap-2"
      >
        {filters.map((f) => {
          const isActive = f === active;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted ring-1 ring-hairline hover:text-foreground hover:ring-accent/40"
              }`}
            >
              {KIND_FILTER_LABEL[f]}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[11px] text-subtle">
          {shown.length} {shown.length === 1 ? "skill" : "skills"}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((skill) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            marketplace={marketplace}
          />
        ))}
      </div>
    </div>
  );
}
