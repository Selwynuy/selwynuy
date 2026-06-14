import { certifications, sectionIntros } from "@/lib/content/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { CertGrid } from "@/components/sections/cert-grid";

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
    </section>
  );
}
