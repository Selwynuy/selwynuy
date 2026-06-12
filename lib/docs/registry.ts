import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
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

/** Raw MDX body for a slug (frontmatter already stripped). Powers one-drop. */
export function getRawMarkdown(slug: string): string | undefined {
  return getDoc(slug)?.body;
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
 * Mirrors the slugify in mdx-components so ids line up.
 */
export function getToc(body: string): TocEntry[] {
  const entries: TocEntry[] = [];
  // Ignore headings inside fenced code blocks.
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(withoutCode)) !== null) {
    const depth = m[1].length as 2 | 3;
    const text = m[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    entries.push({ text, id, depth });
  }
  return entries;
}
