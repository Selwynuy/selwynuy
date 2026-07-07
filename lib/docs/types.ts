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

/** A single heading extracted from a doc body, for the right-rail TOC. */
export interface TocEntry {
  /** Heading text. */
  text: string;
  /** Anchor id (slugified text). */
  id: string;
  /** Heading depth: 2 or 3. */
  depth: 2 | 3;
}
