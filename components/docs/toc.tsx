"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/docs/types";

/**
 * Right-rail "on this page" table of contents with scroll-spy.
 * The active heading is tracked via IntersectionObserver and lit red.
 * Hidden on narrow viewports (collapses first, per the layout research).
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (records) => {
        // Pick the topmost heading currently intersecting the viewport.
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-hairline">
        {entries.map((entry) => {
          const active = activeId === entry.id;
          return (
            <li key={entry.id} style={{ paddingLeft: entry.depth === 3 ? "0.75rem" : 0 }}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l-2 py-0.5 pl-4 transition-colors ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
