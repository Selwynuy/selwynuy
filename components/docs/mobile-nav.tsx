"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/docs/sidebar";
import type { DocSection } from "@/lib/docs/types";

interface Group {
  section: DocSection;
  items: { slug: string; title: string; verified: boolean }[];
}

/**
 * Mobile-only handbook navigation. The desktop left sidebar is hidden below lg;
 * this gives phones and tablets a collapsible "Browse the handbook" disclosure
 * (search + the full section list) so the docs are navigable on small screens.
 * Closes automatically when the route changes. `search` is passed in from the
 * server layout (it is a Server Component, so it cannot be imported here).
 */
export function MobileNav({
  groups,
  search,
}: {
  groups: Group[];
  search: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Collapse on navigation. Defer off the effect body (React Compiler rule).
  useEffect(() => {
    const id = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
        className="flex w-full items-center justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-hairline"
      >
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground">
          <span aria-hidden className="text-accent">
            ▸
          </span>
          Browse the handbook
        </span>
        <span
          aria-hidden
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id="mobile-docs-nav"
          className="mt-3 rounded-xl bg-surface-raised p-4 ring-1 ring-hairline"
        >
          <div className="mb-5">{search}</div>
          <Sidebar groups={groups} />
        </div>
      )}
    </div>
  );
}
