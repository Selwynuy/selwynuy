/**
 * Skills: Selwyn's process, packaged as installable Claude Code Skills.
 *
 * Pure data, the single source of truth for the /skills marketplace. Mirrors the
 * decisions.ts / launch-checklist.ts pattern: the rendered cards, the skill
 * detail pages, the generated SKILL.md bundles, the marketplace.json, and the
 * Skills section of /claude.md and /llms.txt all read from here, so the shelf a
 * human browses never diverges from what an agent installs.
 *
 * The split that matters:
 *   - the /skills PAGE is the storefront (humans browse cards, copy the install
 *     command),
 *   - the git repo (/skills/<name>/SKILL.md + marketplace.json at root) is the
 *     warehouse Claude Code actually installs from via
 *     `/plugin marketplace add <owner>/<repo>` then `/plugin install`.
 * Raw-HTTP delivery of a SKILL.md does NOT make it installable; distribution is
 * git-based. This module generates both faces from one definition.
 *
 * Every `docs` slug is validated against the registry at load (see
 * assertSkillsValid), the same fail-loud discipline the docs frontmatter uses.
 */

import type { SkillKind } from "./types";

export interface SkillPhase {
  /** Phase label, e.g. "Validate". */
  phase: string;
  /** What the agent does in this phase, one imperative sentence. */
  directive: string;
  /** Handbook slugs to read for this phase (validated against the registry). */
  docs: string[];
}

export interface SkillFile {
  /** Path inside the skill bundle, e.g. "scripts/check-slop.mjs". */
  path: string;
  /** What this file is, one short line. Drives the payload summary. */
  role: "script" | "template" | "reference";
  /** One-line description for the card / detail page. */
  summary: string;
}

export interface Skill {
  /** Bundle + command name, kebab-case. Route: /skills/<name>. */
  name: string;
  /** Display title, the poster-voice name on the card. */
  title: string;
  /** Two-letter mark for the icon tile (keeps the card iconic without art). */
  mark: string;
  /** What kind of skill this is; drives the card's type label + filtering. */
  kind: SkillKind;
  /**
   * The SKILL.md `description`: what it does + when to use it, key use first.
   * This is the activation signal Claude matches on (description text only, not
   * the body), so it reads like a routing rule and opens with a WHEN clause.
   * Kept well under the 1,536-char skill-listing cap.
   */
  description: string;
  /** One human-facing sentence for the card body (plain, no em-dashes). */
  blurb: string;
  /** The natural-language trigger, mirrored into /claude.md as a WHEN line. */
  when: string;
  /** Handbook slugs this skill leans on, shown as "needs" chips (validated). */
  needs: string[];
  /** Ordered phases, present for workflow-kind skills. */
  phases?: SkillPhase[];
  /** Bundled files that ship in the skill dir (the executable payload). */
  files: SkillFile[];
  /** Whether Selwyn has signed this skill off (mirrors doc `verified`). */
  verified: boolean;
}

/**
 * The skill catalog. Authored from the handbook: each skill packages a slice of
 * the process that already exists as prose/data, so the marketplace launches
 * dense by reframing, not inventing. Keep `needs`/`phase.docs` pointed at real
 * slugs so a reader (and the validator) can follow the reasoning.
 */
export const SKILLS: Skill[] = [
  {
    name: "discovery-to-prd",
    title: "Discovery to PRD",
    mark: "PR",
    kind: "workflow",
    description:
      "Take a raw app idea to a signed-off PRD the way Selwyn does. Use when starting a new project, validating an idea, or turning a vague concept into a build-ready spec. Researches the market for an honest build/reshape/kill verdict, interrogates the idea in small question batches until every PRD section can be filled without guessing, drafts the PRD marking gaps [OPEN], and loops until zero remain before build.",
    blurb:
      "Validate an idea against the market, interrogate it into a complete PRD, sign off, then build. The whole kickoff, my way.",
    when: "starting a new project, validating an idea, or writing a PRD",
    needs: ["discovery", "prd", "decisions", "nextjs-fit-check"],
    phases: [
      {
        phase: "Validate",
        directive:
          "Research the market yourself (competitors, pricing, demand) and give an honest build, reshape, or do-not-build verdict before any spec work.",
        docs: ["discovery", "nextjs-fit-check"],
      },
      {
        phase: "Discover",
        directive:
          "Ask the seed questions, then your own follow-ups in small batches, until every PRD section can be filled without guessing.",
        docs: ["discovery"],
      },
      {
        phase: "PRD",
        directive:
          "Draft the PRD from recorded answers only, mark every gap [OPEN], loop back to questioning until none remain, then get explicit sign-off.",
        docs: ["prd", "decisions"],
      },
      {
        phase: "Build",
        directive:
          "Scaffold to the conventions, wire the decided stack, ship a first deploy.",
        docs: ["project-setup", "getting-started"],
      },
    ],
    files: [
      {
        path: "templates/PRD.md",
        role: "template",
        summary: "The 11-section PRD skeleton with [OPEN] gap markers.",
      },
      {
        path: "references/questioning-protocol.md",
        role: "reference",
        summary: "The interrogation protocol: batch size, when to stop, how to force concrete answers.",
      },
    ],
    verified: false,
  },
  {
    name: "anti-slop-check",
    title: "Anti-Slop Check",
    mark: "AS",
    kind: "check",
    description:
      "Write user-facing text to Selwyn's anti-AI-slop rules from the first draft, not as an after-the-fact fix. Use before drafting any copy, docs, comments, READMEs, or commit messages, then verify with a mechanical check before showing it. Avoids em-dashes, inflated vocabulary, manufactured contrasts, and hedging by writing plainly from the start.",
    blurb:
      "Load my anti-slop rules before you write a word, then verify with a quick check. Writes plain the first time instead of fixing it after.",
    when: "about to write any user-facing text, verified again before showing it",
    needs: ["writing-without-ai-slop"],
    files: [
      {
        path: "scripts/check-slop.mjs",
        role: "script",
        summary: "Scans text for em-dashes and slop tells, exits non-zero with the offending lines.",
      },
      {
        path: "references/slop-rules.md",
        role: "reference",
        summary: "The full sourced ruleset, with the plain-word rewrite for each tell.",
      },
    ],
    verified: false,
  },
  {
    name: "bootstrap-nextjs",
    title: "Bootstrap Next.js",
    mark: "NX",
    kind: "scaffold",
    description:
      "Scaffold a production Next.js app to Selwyn's conventions. Use when starting a new Next.js codebase or aligning an existing one to his defaults: App Router with Server Components, src/ layout, the decided data/auth/hosting stack, and secure-by-default wiring. Installs the handbook's CLAUDE.md so every future session inherits the rules.",
    blurb:
      "Stand up a Next.js project with my structure, stack, and secure-by-default wiring already in place.",
    when: "scaffolding a new Next.js project or aligning one to my defaults",
    needs: ["project-setup", "getting-started", "decisions", "security-by-design"],
    files: [
      {
        path: "scripts/install-claude-md.sh",
        role: "script",
        summary: "Fetches the handbook /claude.md and writes it to the project root.",
      },
      {
        path: "references/conventions.md",
        role: "reference",
        summary: "The src/ layout, App Router structure, and stack defaults with the why for each.",
      },
    ],
    verified: false,
  },
];

/** Kinds present in the catalog, for the marketplace filter chips. */
export function skillKinds(): SkillKind[] {
  return [...new Set(SKILLS.map((s) => s.kind))];
}

/** One skill by name, or undefined. */
export function getSkill(name: string): Skill | undefined {
  return SKILLS.find((s) => s.name === name);
}

/** All skill names, for generateStaticParams. */
export function getSkillNames(): string[] {
  return SKILLS.map((s) => s.name);
}

/** Count of payload files of a given role, for the card stat row. */
export function fileCount(skill: Skill, role: SkillFile["role"]): number {
  return skill.files.filter((f) => f.role === role).length;
}

/**
 * Validate every slug a skill references against the set of real doc slugs.
 * Called from the registry (which owns the doc list) so this module stays free
 * of filesystem access and can be imported anywhere. Fails loud at build time,
 * the same discipline as the docs frontmatter checks.
 */
export function assertSkillsValid(realSlugs: Set<string>): void {
  for (const skill of SKILLS) {
    const referenced = new Set<string>([
      ...skill.needs,
      ...(skill.phases?.flatMap((p) => p.docs) ?? []),
    ]);
    for (const slug of referenced) {
      if (!realSlugs.has(slug)) {
        throw new Error(
          `[skills] ${skill.name}: references unknown doc slug "${slug}"`,
        );
      }
    }
  }
}

/**
 * The plugin name all skills ship inside (one plugin, many skills, the
 * convention for one author's related skills). Users install this once, then
 * invoke each skill as `/<plugin>:<skill>`.
 */
export const SKILLS_PLUGIN = "selwyn-handbook";

/**
 * Render the Skills section for /claude.md and /llms.txt: a one-time install
 * line for the plugin, then one WHEN line per skill (with phase directives
 * inline so a non-browsing consumer still gets the substance). `siteUrl` and
 * `marketplace` (owner/repo) are passed in to keep this module config-free.
 */
export function skillsMarkdown(opts: {
  siteUrl: string;
  marketplace: string;
}): string {
  const lines: string[] = [
    `Install once: \`/plugin marketplace add ${opts.marketplace}\` then ` +
      `\`/plugin install ${SKILLS_PLUGIN}\`. Then invoke a skill as ` +
      `\`/${SKILLS_PLUGIN}:<name>\`.`,
    "",
  ];
  for (const skill of SKILLS) {
    const tag = skill.verified ? "" : " (draft)";
    lines.push(
      `- WHEN ${skill.when}: use the "${skill.name}" skill${tag} ` +
        `(\`/${SKILLS_PLUGIN}:${skill.name}\`), or read it at ${opts.siteUrl}/skills/${skill.name}.`,
    );
    if (skill.phases) {
      for (const p of skill.phases) {
        lines.push(`  - ${p.phase}: ${p.directive}`);
      }
    }
  }
  return lines.join("\n");
}
