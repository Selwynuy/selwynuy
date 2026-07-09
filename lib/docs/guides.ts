/**
 * Guides: foundational knowledge PDFs, distinct from the handbook and the
 * skills marketplace.
 *
 * The split that matters:
 *   - the HANDBOOK (/docs) is how Selwyn builds, his opinions and decisions.
 *   - SKILLS (/skills) package that process into something an agent can run.
 *   - GUIDES (/guides) are the foundational material underneath both: SEO,
 *     AEO, GEO, and whatever else gets added, shipped as a PDF rather than
 *     authored as MDX prose or an installable capability.
 *
 * Pure data, the single source of truth for the /guides shelf. Mirrors the
 * skills.ts pattern: cards and the detail page both read from here. PDFs are
 * checked into the repo under public/guides/ and linked to directly, there is
 * no one-drop markdown endpoint for these (a PDF isn't rewritten to text).
 *
 * Every guide ships `verified: false` (draft) until Selwyn signs off; draft
 * guides are still fully visible, just labeled, the same convention docs and
 * skills already use. Nothing here is gated: published means public.
 */

import type { GuideKind } from "./types";

export interface Guide {
  /** Detail-page + file-stem identifier, kebab-case. Route: /guides/<slug>. */
  slug: string;
  /** Display title, the card headline. */
  title: string;
  /** Two-letter mark for the icon tile, same convention as Skill.mark. */
  mark: string;
  /** Open-ended category, e.g. "seo", "aeo", "geo". Drives the filter chips. */
  kind: GuideKind;
  /** One human-facing sentence for the card body (plain, no em-dashes). */
  blurb: string;
  /** Path under public/, e.g. "/guides/seo-foundations.pdf". */
  pdf: string;
  /** Whether Selwyn has signed this guide off (mirrors Skill.verified). */
  verified: boolean;
}

/**
 * The guide catalog. Empty to start: this ships the feature (types, routes,
 * gallery, card) ahead of the first real PDF. Add entries here as guides are
 * authored; `kind` is a free string so a new category never needs a schema
 * change, just a new row.
 */
export const GUIDES: Guide[] = [];

/** Kinds present in the catalog, for the filter chips. Dedup, first-seen order. */
export function guideKinds(): GuideKind[] {
  return [...new Set(GUIDES.map((g) => g.kind))];
}

/** One guide by slug, or undefined. */
export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** All guide slugs, for generateStaticParams. */
export function getGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
