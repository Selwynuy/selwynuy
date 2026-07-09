/** Types for the handbook docs system. Frontmatter lives in content/docs/*.mdx. */

/** Top-level grouping in the sidebar, in display order (the build journey). */
export type DocSection =
  | "Start Here"
  | "Architecture"
  | "Design"
  | "Build"
  | "Security"
  | "Grow"
  | "Ship"
  | "Operate";

/** Parsed frontmatter for a single handbook page. */
export interface DocFrontmatter {
  /** Page title, also the H1 and sidebar label. */
  title: string;
  /** One-line summary, used in TOC index, llms.txt, and meta description. */
  summary: string;
  /** Sidebar section this page belongs to. */
  section: DocSection;
  /** Sort order within the section (ascending). */
  order: number;
  /**
   * Whether the content has been fact-checked AND signed off by Selwyn.
   * INVARIANT: `verified: true` requires a non-empty `sources` array.
   */
  verified: boolean;
  /** Citations backing the page (bundled-doc paths or external authority URLs). */
  sources?: string[];
  /** ISO date the page was last reviewed. */
  updated?: string;
}

/** A handbook page: frontmatter + slug + the raw MDX body (no frontmatter). */
export interface Doc extends DocFrontmatter {
  /** URL slug, e.g. "security". Route: /docs/security. */
  slug: string;
  /** Raw MDX body with frontmatter stripped (feeds the one-drop endpoint). */
  body: string;
}

/** What a marketplace skill does; drives its card type label and filtering. */
export type SkillKind = "workflow" | "check" | "scaffold";

/**
 * Which slice of the process a skill belongs to; drives the card's category
 * tint and the gallery's category filter. Distinct from SkillKind: kind is
 * WHAT it is (a workflow, a check, a scaffold), category is WHERE it sits in
 * the process (planning vs building vs shipping). A skill has exactly one of
 * each, so a "Plan" skill can be a "workflow" kind, a "Ship" skill can be a
 * "check" kind, etc.
 */
export type SkillCategory =
  | "plan"
  | "build"
  | "security"
  | "quality"
  | "content"
  | "ops";

/**
 * A foundational PDF guide, open-ended by design: new categories (seo, aeo,
 * geo, ...) are just new catalog entries, not a schema change. Distinct from a
 * Skill (an installable capability) and a Doc (handbook prose): a Guide is
 * reference knowledge, delivered as a PDF, not a workflow or an MDX page.
 */
export type GuideKind = string;

/** A single heading extracted from a doc body, for the right-rail TOC. */
export interface TocEntry {
  /** Heading text. */
  text: string;
  /** Anchor id (slugified text). */
  id: string;
  /** Heading depth: 2 or 3. */
  depth: 2 | 3;
}
