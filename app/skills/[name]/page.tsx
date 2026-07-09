import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_META,
  getSkill,
  getSkillNames,
  fileCount,
  SKILLS_MARKETPLACE,
} from "@/lib/docs/skills";
import { abs } from "@/lib/site";
import { InstallCommand } from "@/components/docs/install-command";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSkillNames().map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) return {};
  return {
    title: `${skill.title} skill`,
    description: skill.blurb,
    alternates: { canonical: `/skills/${skill.name}` },
  };
}

const KIND_LABEL: Record<string, string> = {
  workflow: "Workflow skill",
  check: "Check skill",
  scaffold: "Scaffold skill",
};

const ROLE_LABEL: Record<string, string> = {
  script: "script",
  template: "template",
  reference: "reference",
};

/**
 * Icon tile gradients, one per category tint (1-5). Mirrors
 * components/docs/skill-card.tsx's TINT_GRADIENT so the hero on a skill's
 * detail page matches the tint a visitor just clicked through from on the
 * card. Kept in its own copy (not imported) since this is a Server
 * Component and the card's version lives in a "use client" file.
 */
const TINT_GRADIENT: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "radial-gradient(120% 120% at 30% 20%, color-mix(in oklab, var(--color-red-600) 55%, var(--color-neutral-700)) 0%, color-mix(in oklab, var(--color-red-800) 55%, var(--color-neutral-800)) 75%)",
  2: "radial-gradient(120% 120% at 30% 20%, color-mix(in oklab, var(--color-red-600) 75%, var(--color-neutral-600)) 0%, var(--color-red-800) 75%)",
  3: "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-800) 75%)",
  4: "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)",
  5: "radial-gradient(120% 120% at 30% 20%, var(--color-red-400) 0%, var(--color-red-700) 75%)",
};

/** A single skill's page: what it does, how to install, its phases and payload. */
export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) notFound();

  const mdUrl = abs(`/s/${skill.name}.md`);

  const tint = CATEGORY_META[skill.category].tint;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
    <div className="overflow-hidden rounded-[28px] bg-surface shadow-soft-sm ring-1 ring-hairline sm:rounded-[32px]">
      {/* Header: one continuous colored area, back link, category, mark,
          kind, title, status, all together. Not split into a colored band
          plus a separate white block below it. */}
      <header
        className="px-6 pb-7 pt-5 sm:px-8"
        style={{ backgroundImage: TINT_GRADIENT[tint] }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white/80 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> All skills
          </Link>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {CATEGORY_META[skill.category].label}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 font-mono text-xl font-bold text-white ring-1 ring-white/25 sm:h-18 sm:w-18"
          >
            {skill.mark}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
              {KIND_LABEL[skill.kind]}
            </p>
            <h1 className="display mt-1 text-3xl text-white sm:text-4xl">
              {skill.title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-white/70">
              {skill.verified ? (
                <span className="inline-flex items-center gap-1 text-white">
                  <span aria-hidden>✓</span> verified
                </span>
              ) : (
                <span>draft, under review</span>
              )}
              {skill.phases && (
                <>
                  <span aria-hidden>·</span>
                  <span>{skill.phases.length} phases</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span>{skill.files.length} bundled files</span>
            </p>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 sm:px-8">
      {/* Blurb */}
      <p className="text-lg leading-relaxed text-foreground">
        {skill.blurb}
      </p>

      {/* Install */}
      <div className="mt-6">
        <InstallCommand
          name={skill.name}
          marketplace={SKILLS_MARKETPLACE}
          size="detail"
        />
        <p className="mt-2 font-mono text-[11px] text-subtle">
          Or read it as{" "}
          <a
            href={mdUrl}
            className="text-muted underline decoration-hairline underline-offset-2 hover:text-foreground"
          >
            SKILL.md
          </a>
          .
        </p>
      </div>

      {/* When to use it: the activation trigger, stated plainly. */}
      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          When it activates
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          Use this skill when {skill.when}.
        </p>
      </section>

      {/* Phases (workflow skills) */}
      {skill.phases && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            The workflow
          </h2>
          <ol className="mt-5 space-y-5">
            {skill.phases.map((p, i) => (
              <li key={p.phase} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent ring-1 ring-accent/20"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="display text-lg text-foreground">{p.phase}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {p.directive}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {p.docs.map((slug) => (
                      <Link
                        key={slug}
                        href={`/docs/${slug}`}
                        className="rounded-full bg-foreground/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-accent/40"
                      >
                        {slug}
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Read first (non-workflow skills) */}
      {!skill.phases && skill.needs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Reads from
          </h2>
          <p className="mt-4 flex flex-wrap gap-1.5">
            {skill.needs.map((slug) => (
              <Link
                key={slug}
                href={`/docs/${slug}`}
                className="rounded-full bg-foreground/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-accent/40"
              >
                {slug}
              </Link>
            ))}
          </p>
        </section>
      )}

      {/* Bundled payload */}
      {skill.files.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            What ships in the bundle
          </h2>
          <ul className="mt-5 divide-y divide-hairline overflow-hidden rounded-xl ring-1 ring-hairline">
            {skill.files.map((f) => (
              <li
                key={f.path}
                className="flex items-start gap-3 bg-surface px-4 py-3"
              >
                <span className="mt-0.5 shrink-0 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent ring-1 ring-accent/20">
                  {ROLE_LABEL[f.role]}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[13px] text-foreground">
                    {f.path}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {f.summary}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[11px] text-subtle">
            {fileCount(skill, "script")} run, the rest load on demand.
          </p>
        </section>
      )}
      </div>
    </div>
    </div>
  );
}
