import { certifications, sectionIntros } from "@/lib/content/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Credential cards with a subtle security/shield motif. */
export function Certifications() {
  return (
    <section
      id="certifications"
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:py-28"
    >
      <SectionHeading
        index="06"
        label="Credentials"
        title="Certifications"
        intro={sectionIntros.certifications}
      />

      {certifications.length === 0 && (
        <div className="rounded-2xl bg-surface-raised p-8 text-center shadow-soft-sm ring-1 ring-hairline">
          <ShieldMark />
          <p className="mt-4 text-sm text-muted">
            Security credentials are being added here. The work in the projects
            and the security section of the handbook speaks to the same posture.
          </p>
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <ShieldMark />
                <span className="font-mono text-xs text-subtle">{cert.year}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">
                {cert.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
              {cert.url && (
                <span className="mt-3 inline-block font-mono text-xs text-foreground underline-offset-4 group-hover:underline">
                  Verify ↗
                </span>
              )}
            </>
          );

          return (
            <Reveal as="li" key={i} delay={i * 70}>
              <div className="group flex h-full flex-col rounded-2xl bg-surface-raised p-6 shadow-soft-sm ring-1 ring-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md">
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 flex-col"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
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
