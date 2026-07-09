import {
  certifications,
  skillBadges,
  sectionIntros,
} from "@/lib/content/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { CertGrid } from "@/components/sections/cert-grid";

/** Credential cards with a subtle security/shield motif. */
export function Certifications() {
  return (
    <section
      id="certifications"
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:py-28 lg:pl-20 lg:pr-6"
    >
      <SectionHeading
        index="06"
        label="Credentials"
        title="Certifications"
        intro={sectionIntros.certifications}
      />

      {certifications.length === 0 ? (
        <div className="rounded-2xl bg-surface-raised p-8 text-center shadow-soft-sm ring-1 ring-hairline">
          <p className="text-sm text-muted">
            Security credentials are being added here. The work in the projects
            and the security section of the handbook speaks to the same posture.
          </p>
        </div>
      ) : (
        <CertGrid items={certifications} />
      )}

      {skillBadges.length > 0 && <SkillBadges />}
    </section>
  );
}

/** Compact link strip for image-less credentials (Google Cloud skill badges). */
function SkillBadges() {
  return (
    <div className="mt-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-subtle">
        Cloud skill badges
      </p>
      <ul className="divide-y divide-hairline overflow-hidden rounded-2xl bg-surface-raised shadow-soft-sm ring-1 ring-hairline">
        {skillBadges.map((badge) => {
          const inner = (
            <>
              <span className="flex min-w-0 items-center gap-3">
                <CloudMark />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {badge.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {badge.issuer} · {badge.year}
                  </span>
                </span>
              </span>
              {badge.url && (
                <span className="shrink-0 font-mono text-xs text-foreground underline-offset-4 group-hover:underline">
                  View badge ↗
                </span>
              )}
            </>
          );
          return (
            <li key={badge.name}>
              {badge.url ? (
                <a
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.03]"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CloudMark() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 4 15.9" />
      </svg>
    </span>
  );
}
