"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocSection } from "@/lib/docs/types";

interface SidebarItem {
  slug: string;
  title: string;
  verified: boolean;
}
interface SidebarGroup {
  section: DocSection;
  items: SidebarItem[];
}

/**
 * Left-rail handbook navigation. Its mere presence signals "you are in the
 * handbook now" (the portfolio surface has no sidebar). Active item is lit red.
 */
export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Handbook" className="text-sm">
      <Link
        href="/docs"
        className={`mb-6 block font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
          pathname === "/docs"
            ? "text-accent"
            : "text-subtle hover:text-foreground"
        }`}
      >
        Handbook index
      </Link>

      <div className="space-y-7">
        {groups.map((group) => (
          <div key={group.section}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {group.section}
            </p>
            <ul className="space-y-0.5 border-l border-hairline">
              {group.items.map((item) => {
                const href = `/docs/${item.slug}`;
                const active = pathname === href;
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-4 transition-colors ${
                        active
                          ? "border-accent text-foreground"
                          : "border-transparent text-muted hover:border-hairline hover:text-foreground"
                      }`}
                    >
                      <span>{item.title}</span>
                      {!item.verified && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-subtle"
                          aria-label="draft"
                          title="Draft, under review"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
