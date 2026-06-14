"use client";

import Image from "next/image";
import { useState } from "react";
import type { Certification } from "@/lib/content/types";
import { Reveal } from "@/components/ui/reveal";

/**
 * Interactive certifications grid. The curated (`featured`) certs are always
 * shown; the rest stay collapsed behind a "show all" toggle so a long list of
 * 20+ credentials doesn't dominate the page. Certs with an image render the
 * actual certificate as a thumbnail (click to open full size).
 */
export function CertGrid({ items }: { items: Certification[] }) {
  const [expanded, setExpanded] = useState(false);

  const curated = items.filter((c) => c.featured);
  const rest = items.filter((c) => !c.featured);
  const visible = expanded ? items : curated;

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((cert, i) => (
          <Reveal as="li" key={cert.name} delay={Math.min(i, 6) * 60}>
            <CertCard cert={cert} />
          </Reveal>
        ))}
      </ul>

      {rest.length > 0 && (
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
