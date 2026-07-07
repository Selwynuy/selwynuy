import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkill, getSkillNames, fileCount } from "@/lib/docs/skills";
import { SKILLS_MARKETPLACE } from "@/lib/docs/registry";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Back to the marketplace */}
      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> All skills
      </Link>

      {/* Hero */}
      <header className="mt-6 flex items-start gap-5 border-b border-hairline pb-8">
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-xl font-bold text-accent-foreground shadow-soft-md ring-1 ring-white/10"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)",
          }}
        >
          {skill.mark}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {KIND_LABEL[skill.kind]}
          </p>
          <h1 className="display mt-1 text-4xl text-foreground sm:text-5xl">
            {skill.title}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
            {skill.verified ? (
              <span className="inline-flex items-center gap-1 text-accent">
                <span aria-hidden>✓</span> verified
              </span>
            ) : (
              <span className="text-subtle">draft, under review</span>
            )}
            {skill.phases && (
              <>
                <span aria-hidden className="text-subtle">
                  ·
                </span>
                <span>{skill.phases.length} phases</span>
              </>
            )}
            <span aria-hidden className="text-subtle">
              ·
            </span>
            <span>{skill.files.length} bundled files</span>
          </p>
        </div>
      </header>

      {/* Blurb */}
      <p className="mt-8 text-lg leading-relaxed text-foreground">
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
  );
}
