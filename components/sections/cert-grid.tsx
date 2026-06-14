"use client";

import Image from "next/image";
import { useState } from "react";
import type { Certification } from "@/lib/content/types";
import { Reveal } from "@/components/ui/reveal";

// Collapsed preview counts, sized to fill whole rows at each breakpoint:
// 3 on mobile (1 col), 6 on tablet/desktop (2-3 cols). Cards past the mobile
// count are hidden with CSS until the `sm` breakpoint, so the preview is always
// a clean rectangle and we never read the viewport at render time.
const MOBILE_PREVIEW = 3;
const DESKTOP_PREVIEW = 6;

/**
 * Interactive certifications grid. Collapsed, it previews the strongest few
 * certs (3 on mobile, 6 on desktop) and the rest stay behind a "show all"
 * toggle so a 20+ credential list doesn't dominate the page. Certs with an
 * image render the actual certificate as a thumbnail (click to open full size).
 */
export function CertGrid({ items }: { items: Certification[] }) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? items : items.slice(0, DESKTOP_PREVIEW);
  const hasMore = items.length > DESKTOP_PREVIEW;

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((cert, i) => {
          // When collapsed, cards beyond the mobile count are hidden until `sm`.
          const hideOnMobile = !expanded && i >= MOBILE_PREVIEW;
          return (
            <Reveal
              as="li"
              key={cert.name}
              delay={Math.min(i, 6) * 60}
              className={hideOnMobile ? "hidden sm:block" : ""}
            >
              <CertCard cert={cert} />
            </Reveal>
          );
        })}
      </ul>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 rounded-full bg-surface-raised px-5 py-2.5 font-mono text-xs text-foreground/80 shadow-soft-sm ring-1 ring-hairline transition-all duration-200 hover:text-foreground hover:shadow-soft-md active:scale-[0.98]"
          >
            {expanded ? "Show fewer" : `Show all ${items.length} certifications`}
            <span
              aria-hidden
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const card = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised shadow-soft-sm ring-1 ring-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md">
      {cert.image ? (
        <div className="relative h-32 overflow-hidden border-b border-hairline bg-foreground/[0.03]">
          <Image
            src={cert.image}
            alt={`${cert.name} certificate`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between">
          {cert.image ? null : <ShieldMark />}
          <span className="font-mono text-xs text-subtle">{cert.year}</span>
        </div>
        <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">
          {cert.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
        {cert.credentialId && (
          <p className="mt-2 font-mono text-[11px] text-subtle">
            ID: {cert.credentialId}
          </p>
        )}
        <div className="mt-auto pt-3">
          {cert.url ? (
            <span className="inline-block font-mono text-xs text-foreground underline-offset-4 group-hover:underline">
              Verify ↗
            </span>
          ) : cert.image ? (
            <span className="inline-block font-mono text-xs text-foreground underline-offset-4 group-hover:underline">
              View certificate ↗
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  // Link priority: an explicit verify URL, else the certificate image itself.
  const href = cert.url ?? cert.image;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </a>
    );
  }
  return card;
}

function ShieldMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
  );
}
