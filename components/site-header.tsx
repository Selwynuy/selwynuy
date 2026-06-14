"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content/profile";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDocsNav } from "@/components/docs/docs-nav-context";

/**
 * Global navbar shared by both surfaces. A lit WORK / HANDBOOK switch tells you
 * which world you're in, and that switch is the whole nav: the bar stays
 * identical on both pages (no per-section anchors) so the two surfaces feel
 * like one site. The portfolio's own section flow carries in-page navigation.
 *
 * Below lg the utility cluster collapses into a hamburger drawer (theme,
 * source link, contact CTA, and the handbook section nav when in docs) so the
 * bar never crowds on a phone; it closes on route change or Escape.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const inDocs = pathname.startsWith("/docs");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change. Defer off the effect body (React Compiler rule).
  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  // Close on Escape, and lock page scroll while the drawer is open. overflow:
  // hidden alone is unreliable here (the body is a flex column that keeps
  // scrolling), so pin the body with position: fixed at the current offset, the
  // bulletproof approach, then restore the exact scroll position on close.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || inDocs
          ? "bg-background/70 shadow-soft-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        {/* Brand: the S mark badge + wordmark. The mark keeps brand presence on
            tiny screens even when the name truncates. */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand-mark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-md ring-1 ring-hairline"
            priority
          />
          <span className="display min-w-0 truncate text-sm tracking-wide text-foreground sm:text-base">
            {profile.name}
          </span>
        </Link>

        {/* The mode switch: the constant orientation cue across surfaces. */}
        <div
          role="tablist"
          aria-label="Site sections"
          className="flex shrink-0 items-center rounded-full bg-surface p-0.5 ring-1 ring-hairline"
        >
          <ModeTab href="/" label="Work" active={!inDocs} />
          <ModeTab href="/docs" label="Handbook" active={inDocs} />
        </div>

        {/* Right cluster (desktop): utilities + CTA. The mode switch is the nav. */}
        <div className="hidden shrink-0 items-center gap-0.5 lg:flex lg:gap-1">
          <ThemeToggle />
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="inline-flex rounded-full p-2 text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <GitHubMark />
          </a>
          <ButtonLink href="/#contact" className="px-4 py-2">
            Get in touch
          </ButtonLink>
        </div>

        {/* Hamburger (mobile/tablet only). Static icon: it opens the drawer,
            it does not morph. */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
          aria-label="Open menu"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground ring-1 ring-hairline transition-colors hover:bg-foreground/[0.04] lg:hidden"
        >
          <HamburgerIcon />
        </button>
      </nav>

      {/* Mobile drawer: a sidebar that slides in from the right. */}
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        inDocs={inDocs}
      />
    </header>
  );
}

/**
 * Slide-in navigation drawer (mobile/tablet). A real sidebar that enters from
 * the right over a dimmed backdrop, not a dropdown. Always mounted so it can
 * animate both directions; `open` drives the transform and the backdrop.
 */
function MobileDrawer({
  open,
  onClose,
  inDocs,
}: {
  open: boolean;
  onClose: () => void;
  inDocs: boolean;
}) {
  // In the handbook, the drawer carries the handbook nav (search + sections)
  // registered by the docs layout, instead of the portfolio anchors.
  const docsNav = useDocsNav();
  return (
    <div className="lg:hidden" aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[82%] max-w-xs flex-col border-l border-hairline bg-background shadow-soft-lg transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-hairline px-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground ring-1 ring-hairline transition-colors hover:bg-foreground/[0.04]"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {inDocs ? (
            <>
              <Link
                href="/"
                onClick={onClose}
                className="mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              >
                <span aria-hidden>←</span> Back to portfolio
              </Link>
              {/* The handbook nav (search + section list) from the docs layout.
                  Closing on link tap is handled by the route-change effect. */}
              {docsNav ?? (
                <p className="px-3 py-2 text-sm text-subtle">Loading…</p>
              )}
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={onClose}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/[0.05]"
              >
                Work
              </Link>
              <Link
                href="/docs"
                onClick={onClose}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/[0.05]"
              >
                Handbook
              </Link>
            </>
          )}
        </nav>

        <div className="shrink-0 border-t border-hairline p-4">
          <div className="mb-3 flex items-center gap-1">
            <ThemeToggle />
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              <GitHubMark />
              <span>GitHub</span>
            </a>
          </div>
          <ButtonLink
            href="/#contact"
            onClick={onClose}
            className="w-full px-5 py-2.5"
          >
            Get in touch
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}

function ModeTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

/** Static hamburger. It opens the drawer; it does not morph into anything. */
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Close (X) icon, used only inside the open drawer header. */
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
