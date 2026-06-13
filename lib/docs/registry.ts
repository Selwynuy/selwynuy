import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { Doc, DocFrontmatter, DocSection, TocEntry } from "./types";

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

/** Section display order in the sidebar. */
export const SECTION_ORDER: DocSection[] = [
  "Foundations",
  "Architecture",
  "Design",
  "Security",
  "Integrations",
  "Growth",
  "Ship",
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
