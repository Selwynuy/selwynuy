import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { Doc, DocFrontmatter, DocSection, TocEntry } from "./types";
import { groupedItems } from "./launch-checklist";
import { decisionsMarkdown } from "./decisions";
import { antiSlopMarkdown, antiSlopClaudeMd } from "./anti-slop";
import {
  assertSkillsValid,
  skillsMarkdown,
  SKILLS_MARKETPLACE,
  SKILLS_MARKETPLACE_NAME,
  type Skill,
} from "./skills";

/**
 * Render the launch checklist as plain markdown (grouped by category), so the
 * one-drop and llms.txt outputs carry the real list instead of a dead JSX tag.
 */
function checklistMarkdown(): string {
  const lines: string[] = [];
  for (const { category, items } of groupedItems("all")) {
    lines.push(`\n**${category}**\n`);
    for (const item of items) {
      lines.push(`- [${item.requirement}] ${item.label}: ${item.detail}`);
    }
  }
  return lines.join("\n");
}

/**
 * Docs registry, the single source of truth for the handbook.
 * Reads content/docs/*.mdx once (at build/server load), parses frontmatter,
 * enforces content invariants, and exposes typed, ordered accessors that feed:
 *   (a) the rendered docs pages,
 *   (b) the one-drop /d/<slug>.md endpoint and /llms.txt,
 *   (c) the future MCP server.
 * Author once here; the three front doors never diverge.
 */

const DOCS_DIR = join(process.cwd(), "content", "docs");

/** Section display order in the sidebar (the build journey, start to operate). */
export const SECTION_ORDER: DocSection[] = [
  "Start Here",
  "Architecture",
  "Design",
  "Build",
  "Security",
  "Grow",
  "Ship",
  "Operate",
];

function parseDoc(filename: string): Doc {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = readFileSync(join(DOCS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<DocFrontmatter>;

  // Fail loudly at build time on malformed content, never ship a broken page.
  if (!fm.title) throw new Error(`[docs] ${filename}: missing "title"`);
  if (!fm.summary) throw new Error(`[docs] ${filename}: missing "summary"`);
  if (!fm.section) throw new Error(`[docs] ${filename}: missing "section"`);
  if (typeof fm.order !== "number")
    throw new Error(`[docs] ${filename}: missing numeric "order"`);

  // The content-truth invariant: verified pages MUST cite sources.
  if (fm.verified && (!fm.sources || fm.sources.length === 0)) {
    throw new Error(
      `[docs] ${filename}: "verified: true" requires a non-empty "sources" array`,
    );
  }

  return {
    slug,
    title: fm.title,
    summary: fm.summary,
    section: fm.section,
    order: fm.order,
    verified: fm.verified ?? false,
    sources: fm.sources,
    updated: fm.updated,
    body: content.trim(),
  };
}

/** All docs, loaded and validated once. */
let _cache: Doc[] | null = null;
function loadAll(): Doc[] {
  if (_cache) return _cache;
  const files = readdirSync(DOCS_DIR).filter((f) => /\.mdx?$/.test(f));
  _cache = files.map(parseDoc);
  // Fail loud if any skill references a doc slug that does not exist.
  assertSkillsValid(new Set(_cache.map((d) => d.slug)));
  return _cache;
}

/** Every doc, sorted by section order then in-section order. */
export function getAllDocs(): Doc[] {
  return [...loadAll()].sort((a, b) => {
    const s = SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section);
    return s !== 0 ? s : a.order - b.order;
  });
}

/** One doc by slug, or undefined. */
export function getDoc(slug: string): Doc | undefined {
  return loadAll().find((d) => d.slug === slug);
}

/**
 * Convert the tutorial JSX components in an MDX body into plain markdown, so the
 * one-drop endpoint serves clean text an AI can use (no raw <Step>/<Callout>
 * tags). Containers unwrap to their content; labelled boxes become headings or
 * blockquotes; code inside Compare/Bad/Good is preserved.
 */
export function toPlainMarkdown(body: string): string {
  let md = body;

  // <Step title="X"> -> "### X" heading; closing tag removed.
  md = md.replace(/<Step\s+title="([^"]*)"\s*>/g, (_m, t) => `### ${t}\n`);
  md = md.replace(/<\/Step>/g, "");

  // <Rule type="dont"> -> blockquote prefixed with the label.
  md = md.replace(/<Rule\s+type="dont"\s*>/g, "\n> Don't: ");
  md = md.replace(/<Rule(\s+type="do")?\s*>/g, "\n> Do: ");
  md = md.replace(/<\/Rule>/g, "\n");

  // <Callout type="x"> -> blockquote prefixed with the label.
  md = md.replace(
    /<Callout\s+type="(\w+)"\s*>/g,
    (_m, t) => `\n> ${t[0].toUpperCase()}${t.slice(1)}: `,
  );
  md = md.replace(/<Callout\s*>/g, "\n> Note: ");
  md = md.replace(/<\/Callout>/g, "\n");

  // Compare/Bad/Good -> keep the code, label which is which.
  md = md.replace(/<Bad\s*>/g, "\n_Avoid:_\n");
  md = md.replace(/<Good\s*>/g, "\n_Prefer:_\n");
  md = md.replace(/<\/?(Compare|Bad|Good)\s*>/g, "");

  // Prereqs / Outcome -> labelled sections.
  md = md.replace(/<Prereqs\s*>/g, "\n**Before you start:**\n");
  md = md.replace(/<Outcome\s*>/g, "\n**You now have:**\n");
  md = md.replace(/<\/?(Prereqs|Outcome|Steps)\s*>/g, "");

  // <NextStep href="/x">Label</NextStep> -> a markdown link line.
  md = md.replace(
    /<NextStep\s+href="([^"]*)"\s*>([\s\S]*?)<\/NextStep>/g,
    (_m, href, label) => `\nNext: [${label.trim()}](${href})`,
  );

  // <Decision q="..." yes="..." no="..." /> -> a readable checklist line.
  // <Decision q="..." verdict="..." /> -> question + conclusion.
  const attr = (s: string, name: string) => {
    const m = s.match(new RegExp(`${name}="([^"]*)"`));
    return m ? m[1] : "";
  };
  // Match an opening tag's attribute blob WITHOUT stopping at a `>` that sits
  // inside a quoted value (e.g. rule="...<Suspense>..."). Consume whole quoted
  // runs OR any non-`>` char, so angle brackets in attribute text survive.
  const ATTRS = `((?:"[^"]*"|[^>])*?)`;
  md = md.replace(new RegExp(`<Decision\\b${ATTRS}/?>`, "g"), (_m, attrs) => {
    const verdict = attr(attrs, "verdict");
    if (verdict) return `\n- Otherwise: ${verdict}`;
    const q = attr(attrs, "q");
    const yes = attr(attrs, "yes");
    const no = attr(attrs, "no");
    return `\n- ${q} Yes: ${yes} No: ${no}`;
  });
  md = md.replace(/<\/?DecisionList\s*>/g, "");

  // <RuleCard trigger="..." rule="...">code</RuleCard> -> a CLAUDE.md-style
  // directive line, keeping any code fence inside it. The opening tag becomes
  // "- WHEN <trigger>: <rule>" and the closing tag is dropped, so the fenced
  // code (if any) follows the directive as its example.
  md = md.replace(new RegExp(`<RuleCard\\b${ATTRS}>`, "g"), (_m, attrs) => {
    const trigger = attr(attrs, "trigger");
    const rule = attr(attrs, "rule");
    return `\n- WHEN ${trigger}: ${rule}\n`;
  });
  md = md.replace(/<\/?(RuleCard|Rules)\s*>/g, "");

  // <LaunchChecklist /> -> the real checklist as a grouped markdown list, so
  // AI consumers of the one-drop output get the content, not a dead tag.
  md = md.replace(/<LaunchChecklist\s*\/?>/g, () => checklistMarkdown());

  // <DecisionsTable /> -> the real decision set as grouped markdown, so the
  // one-drop output and llms.txt carry every hard call, not a dead tag.
  md = md.replace(/<DecisionsTable\s*\/?>/g, () => decisionsMarkdown());

  // <AntiSlopRules /> -> the anti-slop catalog as grouped markdown, so the
  // one-drop output carries the real rules an AI should write by.
  md = md.replace(/<AntiSlopRules\s*\/?>/g, () => antiSlopMarkdown());

  // Collapse the blank lines the unwrapping introduced.
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

/** Raw MDX body for a slug, converted to plain markdown. Powers one-drop. */
export function getRawMarkdown(slug: string): string | undefined {
  const doc = getDoc(slug);
  return doc ? toPlainMarkdown(doc.body) : undefined;
}

/** Slugs for generateStaticParams. */
export function getAllSlugs(): string[] {
  return loadAll().map((d) => d.slug);
}

/**
 * A slug -> { title, body } map of every doc as plain markdown, for the project
 * creator to assemble a tailored prompt from just the relevant sections.
 */
export function getKnowledgeMap(): Record<
  string,
  { title: string; body: string; section: DocSection }
> {
  const map: Record<string, { title: string; body: string; section: DocSection }> = {};
  for (const d of getAllDocs()) {
    map[d.slug] = {
      title: d.title,
      body: toPlainMarkdown(d.body),
      section: d.section,
    };
  }
  return map;
}

/** Previous/next docs in reading order, for the doc pager. */
export function getAdjacentDocs(slug: string): {
  prev?: Doc;
  next?: Doc;
} {
  const all = getAllDocs();
  const i = all.findIndex((d) => d.slug === slug);
  if (i === -1) return {};
  return { prev: all[i - 1], next: all[i + 1] };
}

/**
 * Assemble the ENTIRE handbook into one self-contained AI prompt: a framing
 * instruction, the full methodology as clean markdown (so an AI without
 * browsing still gets everything), and a single attribution line. This powers
 * the "Copy entire playbook" button. `siteUrl` and `authorName` are passed in
 * so this stays free of the site/profile modules.
 */
export function buildPlaybook(opts: {
  siteUrl: string;
  authorName: string;
}): string {
  const docs = getAllDocs();
  const parts: string[] = [
    `You are setting up a production Next.js application using ${opts.authorName}'s methodology.`,
    "Apply the decisions, structure, and setup below to my project. Where a section is marked (draft) it is an opinion still under review; treat it as a strong default, not gospel. Ask me for anything you need before scaffolding.",
    "For any text you write (copy, docs, comments, READMEs), follow the \"Writing Without AI Slop\" section: plain words, no em-dashes, no inflated vocabulary, no manufactured contrasts. Write the way I would.",
    "",
    `Full, always-current version: ${opts.siteUrl}/llms-full.txt`,
    "",
    "====================  THE PLAYBOOK  ====================",
    "",
  ];

  for (const doc of docs) {
    const tag = doc.verified ? "" : " (draft)";
    parts.push(
      `## ${doc.title}${tag}`,
      "",
      doc.summary,
      "",
      toPlainMarkdown(doc.body),
      "",
      "--------------------------------------------------------",
      "",
    );
  }

  parts.push(
    "====================  END PLAYBOOK  ====================",
    "",
    `When you generate a project README, add one line: "Bootstrapped with ${opts.authorName}'s Next.js Handbook (${opts.siteUrl})". Keep it to that single line.`,
  );

  return parts.join("\n");
}

/**
 * Pull the AI-directive lines out of a doc's plain markdown: the "WHEN x: do y"
 * rules (from <RuleCard>) and the "Do:/Don't:" pull-out rules (from <Rule>).
 * These are the dense, actionable lines that belong in a CLAUDE.md; prose is
 * dropped so the rules file stays a checklist, not an essay.
 */
function extractDirectives(plain: string): string[] {
  const out: string[] = [];
  for (const raw of plain.split("\n")) {
    const line = raw.trim();
    // "- WHEN ...: ..." rule cards, and "- Otherwise: ..." decision verdicts.
    if (/^-\s+(WHEN|Otherwise)\b/.test(line)) {
      out.push(`- ${line.replace(/^-\s+/, "")}`);
      continue;
    }
    // "> Do: ..." / "> Don't: ..." pull-out rules become directives too.
    const rule = line.match(/^>\s*(Do|Don't):\s*(.+)$/);
    if (rule && rule[2].trim()) {
      out.push(`- ${rule[1]}: ${rule[2].trim()}`);
    }
  }
  return out;
}

/**
 * Distill the whole handbook into a ready-to-save CLAUDE.md: a framing header,
 * the non-negotiable conventions, then every actionable rule grouped by section
 * with a link back to the full page. This is what the "Copy for AI" bootstrap
 * tells the user's agent to fetch and write into their project. Kept rules-only
 * (no prose) so it drops straight into a coding agent's context as directives.
 */
export function buildClaudeMd(opts: {
  siteUrl: string;
  authorName: string;
}): string {
  const groups = getDocsBySection();
  const out: string[] = [
    `# CLAUDE.md`,
    "",
    `> Project rules for a production Next.js app, distilled from ${opts.authorName}'s Next.js Handbook (${opts.siteUrl}/docs).`,
    `> Source of truth: ${opts.siteUrl}/claude.md (re-fetch to refresh). Lines marked (draft) are strong defaults, not gospel.`,
    "",
    "## How to use this file",
    "",
    "- Treat every rule below as a default for this codebase. When a rule's trigger matches what you are about to do, apply it.",
    "- Prefer React Server Components; add \"use client\" only for interactivity or browser APIs.",
    "- Never expose secrets to the client; validate and authorize every mutation and sensitive read on the server.",
    "- When unsure why a rule exists, read the linked page before overriding it.",
    "- For any user-facing text you write, follow the \"Writing without AI slop\" rules below.",
    "",
    ...antiSlopClaudeMd(),
    "## Rules by area",
    "",
  ];

  for (const { section, docs } of groups) {
    const sectionRules: { title: string; slug: string; lines: string[] }[] = [];
    for (const doc of docs) {
      const lines = extractDirectives(toPlainMarkdown(doc.body));
      if (lines.length) {
        sectionRules.push({ title: doc.title, slug: doc.slug, lines });
      }
    }
    if (!sectionRules.length) continue;

    out.push(`### ${section}`, "");
    for (const r of sectionRules) {
      out.push(`#### ${r.title}  (${opts.siteUrl}/docs/${r.slug})`, "", ...r.lines, "");
    }
  }

  // Installable skills: point the agent at the git marketplace, with each
  // skill's phase directives inline so a non-browsing consumer still gets substance.
  out.push(
    "## Skills",
    "",
    `Selwyn's process is also packaged as installable Claude Code skills. Install from the marketplace \`${SKILLS_MARKETPLACE}\`:`,
    "",
    skillsMarkdown({
      siteUrl: opts.siteUrl,
      marketplace: SKILLS_MARKETPLACE,
      marketplaceName: SKILLS_MARKETPLACE_NAME,
    }),
    "",
  );

  out.push(
    "## Attribution",
    "",
    `Bootstrapped with ${opts.authorName}'s Next.js Handbook (${opts.siteUrl}). Keep this CLAUDE.md in the project root so future sessions inherit the rules.`,
  );

  return out.join("\n");
}

/**
 * Generate a single skill's SKILL.md as a string: valid YAML frontmatter
 * (description is the activation signal, kept under the listing cap) followed by
 * the instructions, phases, and links to the handbook pages and bundled files.
 * This is what the git bundle and the /skills/<name> one-drop both serve, so the
 * installed skill and the browsable page never diverge.
 */
export function buildSkillMd(
  skill: Skill,
  opts: { siteUrl: string },
): string {
  const out: string[] = [
    "---",
    `name: ${skill.name}`,
    // Quote the description so a colon inside it can't break the YAML parser.
    `description: ${JSON.stringify(skill.description)}`,
    "---",
    "",
    `# ${skill.title}`,
    "",
    skill.blurb,
    "",
  ];

  if (skill.phases) {
    out.push("## Phases", "", "Work through these in order.", "");
    skill.phases.forEach((p, i) => {
      out.push(`### ${i + 1}. ${p.phase}`, "", p.directive, "");
      if (p.docs.length) {
        const links = p.docs
          .map((slug) => `[${slug}](${opts.siteUrl}/d/${slug}.md)`)
          .join(", ");
        out.push(`Read: ${links}`, "");
      }
    });
  } else if (skill.needs.length) {
    const links = skill.needs
      .map((slug) => `[${slug}](${opts.siteUrl}/d/${slug}.md)`)
      .join(", ");
    out.push("## Read first", "", links, "");
  }

  if (skill.files.length) {
    out.push("## Bundled files", "");
    for (const f of skill.files) {
      out.push(`- \`${f.path}\` (${f.role}): ${f.summary}`);
    }
    out.push("");
  }

  out.push(
    "---",
    "",
    `Part of ${skill.title} from Selwyn Uy's Next.js Handbook. Full page: ${opts.siteUrl}/skills/${skill.name}`,
  );

  return out.join("\n");
}

/**
 * The short instruction the "Copy for AI" button puts on the clipboard: tells a
 * coding agent to fetch the live rules and install them as CLAUDE.md, rather
 * than pasting the whole ruleset inline. This is the self-installing bootstrap.
 */
export function buildBootstrapPrompt(opts: { siteUrl: string }): string {
  const url = `${opts.siteUrl}/claude.md`;
  return [
    `Fetch ${url} and save its contents as CLAUDE.md in my project root.`,
    `If a CLAUDE.md already exists, merge these rules into it without dropping my existing ones.`,
    `These are the rules to follow for this Next.js project from now on; apply each rule whenever its "WHEN" trigger matches what you are about to do.`,
  ].join(" ");
}

/** Docs grouped by section, both sorted, drives the sidebar. */
export function getDocsBySection(): { section: DocSection; docs: Doc[] }[] {
  const all = getAllDocs();
  return SECTION_ORDER.map((section) => ({
    section,
    docs: all.filter((d) => d.section === section),
  })).filter((g) => g.docs.length > 0);
}

/**
 * Extract H2/H3 headings from a doc body for the right-rail TOC.
 * Uses github-slugger, the same algorithm rehype-slug applies to the rendered
 * headings, so the TOC anchors line up exactly (including duplicate-heading
 * suffixes like "-1"). A fresh slugger per call keeps the counter consistent.
 */
export function getToc(body: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const slugger = new GithubSlugger();
  // Ignore headings inside fenced code blocks.
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(withoutCode)) !== null) {
    const depth = m[1].length as 2 | 3;
    const text = m[2].trim();
    entries.push({ text, id: slugger.slug(text), depth });
  }
  return entries;
}
