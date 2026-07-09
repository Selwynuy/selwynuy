"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The Work / Handbook world switch. Floats fixed to the side of the viewport
 * (not inside either navbar) because it has to survive both worlds: Work and
 * Handbook each render their own distinct navbar now, so the one constant
 * across both is this rail, not a shared header. Vertical icon stack, active
 * world lit red. Revealed in step with the header's own desktop nav (`lg:`)
 * so there is never a width where neither is available.
 *
 * At exactly `lg` (1024px), every page's max-width container still fills the
 * viewport (no auto-margin gutter yet), so a rail fixed at left-4 would sit
 * on top of flush-left content: the docs sidebar, the /skills and /guides
 * headers, and every homepage section. Each of those containers adds
 * `lg:pl-20` to reserve clearance for this rail specifically; keep that in
 * sync if the rail's width or left offset changes.
 */
export function WorldSwitcher({ inHandbook }: { inHandbook: boolean }) {
  const pathname = usePathname();
  const handbookHref = pathname?.startsWith("/docs") ? pathname : "/docs";

  return (
    <div
      role="tablist"
      aria-label="Site world"
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-full bg-surface p-1 shadow-soft-md ring-1 ring-hairline lg:flex"
    >
      <WorldTab
        href="/"
        label="Work"
        active={!inHandbook}
        icon={<BriefcaseIcon />}
      />
      <WorldTab
        href={handbookHref}
        label="Handbook"
        active={inHandbook}
        icon={<BookIcon />}
      />
    </div>
  );
}

function WorldTab({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted hover:bg-foreground/[0.04] hover:text-foreground"
      }`}
    >
      {icon}
    </Link>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
