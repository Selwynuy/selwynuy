"use client";

import { useEffect, useState } from "react";
import type { Guide } from "@/lib/docs/guides";
import { GUIDE_MARK_TILE, BuyButton } from "@/components/docs/guide-landing-shared";

/**
 * Compact buy bar that appears once the hero has scrolled past. Watches a
 * sentinel element (same IntersectionObserver technique as components/docs/
 * toc.tsx) rather than a raw scroll listener. Checks boundingClientRect.top
 * too, not just isIntersecting, so it stays hidden on load (sentinel below
 * the fold, not yet intersecting) and only appears once actually scrolled
 * past it (sentinel above the viewport).
 */
export function StickyBuyBar({
  guide,
  sentinelId = "hero-end",
}: {
  guide: Guide;
  sentinelId?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelId]);

  const { landing } = guide;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-accent-foreground"
            style={{ backgroundImage: GUIDE_MARK_TILE }}
          >
            {guide.mark}
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-subtle">
              {guide.title}
            </span>
            <span className="display block text-lg leading-none text-foreground">
              {landing.price}
            </span>
          </span>
          <span className="display text-lg leading-none text-foreground sm:hidden">
            {landing.price}
          </span>
        </div>
        <BuyButton guide={guide} className="shrink-0" />
      </div>
    </div>
  );
}
