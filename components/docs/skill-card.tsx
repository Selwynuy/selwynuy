import Link from "next/link";
import type { Skill } from "@/lib/docs/skills";
import { fileCount } from "@/lib/docs/skills";
import { InstallCommand } from "@/components/docs/install-command";

/** Human label + a11y noun for each skill kind. */
const KIND_LABEL: Record<Skill["kind"], string> = {
  workflow: "Workflow skill",
  check: "Check skill",
  scaffold: "Scaffold skill",
};

/**
 * A marketplace skill card: app-store information architecture (icon tile, type
 * label, name, status meta, blurb, needs chips, payload stat row, install +
 * SKILL.md actions) rendered in the handbook's terminal brand. The whole card
 * links to the detail page; the install button and the SKILL.md link are the
 * two live affordances. Presentational: all data comes from the Skill.
 */
export function SkillCard({
  skill,
  marketplace,
}: {
  skill: Skill;
  marketplace: string;
}) {
  const templates = fileCount(skill, "template");
  const scripts = fileCount(skill, "script");
  const phases = skill.phases?.length ?? 0;

  const references = fileCount(skill, "reference");

  // Only non-zero counts make the row, so a card never zero-pads. Order by
  // signal: phases, then scripts, templates, references. Capped at three, and
  // the grid below sizes to however many survive (1, 2, or 3 columns).
  const stats = [
    phases > 0 && { n: phases, label: phases === 1 ? "phase" : "phases" },
    scripts > 0 && { n: scripts, label: scripts === 1 ? "script" : "scripts" },
    templates > 0 && {
      n: templates,
      label: templates === 1 ? "template" : "templates",
    },
    references > 0 && {
      n: references,
      label: references === 1 ? "reference" : "references",
    },
  ]
    .filter(Boolean)
    .slice(0, 3) as { n: number; label: string }[];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg hover:ring-accent/40">
      {/* Top: icon tile + identity. The whole header links to the detail page. */}
      <Link
        href={`/skills/${skill.name}`}
        className="flex items-start gap-4 p-5 pb-3"
      >
        <span
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-mono text-lg font-bold text-accent-foreground shadow-soft-md ring-1 ring-white/10"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)",
          }}
        >
          {skill.mark}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            {KIND_LABEL[skill.kind]}
          </span>
          <span className="display mt-1 block truncate text-2xl leading-none text-foreground group-hover:text-accent">
            {skill.title}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted">
            {skill.verified ? (
              <span className="inline-flex items-center gap-1 text-accent">
                <span aria-hidden>✓</span> verified
              </span>
            ) : (
              <span className="text-subtle">draft</span>
            )}
            {phases > 0 && (
              <>
                <span aria-hidden className="text-subtle">
                  ·
                </span>
                <span>
                  {phases} {phases === 1 ? "phase" : "phases"}
                </span>
              </>
            )}
          </span>
        </span>
      </Link>

      {/* Blurb */}
      <p className="px-5 text-sm leading-relaxed text-muted">{skill.blurb}</p>

      {/* Needs chips: the handbook pages this skill leans on. */}
      <div className="flex flex-wrap gap-1.5 px-5 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
          needs
        </span>
        {skill.needs.slice(0, 3).map((slug) => (
          <span
            key={slug}
            className="rounded-full bg-foreground/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted ring-1 ring-hairline"
          >
            {slug}
          </span>
        ))}
        {skill.needs.length > 3 && (
          <span className="font-mono text-[10px] text-subtle">
            +{skill.needs.length - 3}
          </span>
        )}
      </div>

      {/* Payload stat row */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-2 border-y border-hairline py-3 text-center">
        {stats.map((s) => (
          <span key={s.label} className="flex flex-col gap-0.5">
            <span className="font-mono text-base tabular-nums text-foreground">
              {s.n}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-subtle">
              {s.label}
            </span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 p-5 pt-4">
        <div className="flex-1">
          <InstallCommand name={skill.name} marketplace={marketplace} />
        </div>
        <Link
          href={`/s/${skill.name}.md`}
          className="shrink-0 rounded-full px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider text-muted ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-accent/40"
        >
          SKILL.md
        </Link>
      </div>
    </article>
  );
}
