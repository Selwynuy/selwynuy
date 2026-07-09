import Link from "next/link";
import { getDocsBySection } from "@/lib/docs/registry";
import { SKILLS } from "@/lib/docs/skills";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Bridges the portfolio to the handbook and its installable skills. A
 * recruiter sees the work; this shows the thinking behind it and the two ways
 * to use it: read it, or install it straight into an agent. Equal weight on
 * purpose, skills is the newer, deliberate-install channel, not a footnote
 * under the handbook. Pulls live counts from the registries so it never goes
 * stale.
 */
export function HandbookTeaser() {
  const groups = getDocsBySection();
  const total = groups.reduce((n, g) => n + g.docs.length, 0);
  const sectionNames = groups.map((g) => g.section);

  return (
    <section
      id="handbook"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:py-28 lg:pl-20 lg:pr-6"
    >
      <SectionHeading
        index="04"
        label="The Handbook"
        title="How I actually build"
        intro="Not just what I shipped, but how. Read the fact-checked field guide, or install my actual process straight into your own AI."
      />

      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        {/* Door 1: read the handbook. */}
        <Reveal className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised p-6 shadow-soft-md ring-1 ring-hairline sm:p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow opacity-60" />
          <div className="relative flex flex-1 flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {total} pages, and growing
            </p>
            <p className="mt-4 flex-1 text-lg leading-relaxed text-foreground">
              From the first commit to deployment: project setup, security by
              default, the integrations I reach for, and how I ship. Every
              page is verified against the current Next.js docs.
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
                href="/docs/create"
                className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
              >
                or start a project &rarr;
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Door 2: install it as a skill. Same card weight as the handbook
            door, not a smaller companion; this is the channel agents
            actually use to pull the process in, not a link they browse to. */}
        <Reveal
          delay={80}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised p-6 shadow-soft-md ring-1 ring-hairline sm:p-8"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow opacity-60" />
          <div className="relative flex flex-1 flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {SKILLS.length} installable skills
            </p>
            <p className="mt-4 flex-1 text-lg leading-relaxed text-foreground">
              Want it to just do it? Install my process as a Claude Code
              skill, the discovery-to-PRD workflow, the anti-slop check, the
              Next.js scaffold, and your agent runs it the way I would.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-md bg-foreground/[0.05] px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {skill.title}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/skills">Browse skills</ButtonLink>
              <a
                href="https://selwynuy.dev/llms.txt"
                className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
              >
                or read /llms.txt &rarr;
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
