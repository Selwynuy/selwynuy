import Link from "next/link";
import { getDocsBySection } from "@/lib/docs/registry";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Bridges the portfolio to the handbook. A recruiter sees the work; this shows
 * the thinking behind it and surfaces the one-drop feature. Pulls live counts
 * from the registry so it never goes stale.
 */
export function HandbookTeaser() {
  const groups = getDocsBySection();
  const total = groups.reduce((n, g) => n + g.docs.length, 0);
  const sectionNames = groups.map((g) => g.section);

  return (
    <section
      id="handbook"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 sm:py-28"
    >
      <SectionHeading
        index="04"
        label="The Handbook"
        title="How I actually build"
        intro="Not just what I shipped, but how. A fact-checked field guide to building production Next.js apps, and you can drop any section straight into your own AI."
      />

      <Reveal className="relative overflow-hidden rounded-2xl bg-surface-raised p-8 shadow-soft-md ring-1 ring-hairline sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow opacity-60" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {total} pages, and growing
            </p>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              From the first commit to deployment: project setup, security by
              default, the integrations I reach for, SEO, analytics, and shipping.
              Every page is verified against the current Next.js docs.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {sectionNames.map((name) => (
                <li
                  key={name}
                  className="rounded-md bg-foreground/[0.05] px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {name}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/docs">Read the handbook</ButtonLink>
              <Link
                href="/docs"
                className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
              >
                or drop it into your AI
              </Link>
            </div>
          </div>

          {/* Terminal motif: the one-drop feature, shown not told. */}
          <div className="rounded-xl bg-background/60 p-4 font-mono text-xs ring-1 ring-hairline">
            <p className="text-subtle">$ copy for AI</p>
            <p className="mt-2 leading-relaxed text-muted">
              <span className="text-accent">Read</span>{" "}
              <span className="text-foreground">/d/security.md</span> and apply
              the security setup to my project.
            </p>
            <p className="mt-3 text-subtle caret">paste into your assistant</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
