"use client";

import { useState } from "react";
import type { Guide } from "@/lib/docs/guides";
import { GuideCard } from "@/components/docs/guide-card";

/**
 * The filterable guide grid. Same pattern as SkillsGallery, but kind is an
 * open string (not a fixed union), so the filter chips are derived from
 * whatever categories actually exist in the catalog, capitalized for display.
 */
export function GuidesGallery({
  guides,
  kinds,
}: {
  guides: Guide[];
  kinds: string[];
}) {
  const [active, setActive] = useState<string>("all");

  const filters = ["all", ...kinds];
  const shown = active === "all" ? guides : guides.filter((g) => g.kind === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter guides by kind"
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
              {f === "all" ? "All" : f.toUpperCase()}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[11px] text-subtle">
          {shown.length} {shown.length === 1 ? "guide" : "guides"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </div>
  );
}
