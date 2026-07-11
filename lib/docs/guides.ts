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
 * Pure data, the single source of truth for the /guides shelf. Cards read the
 * catalog fields; each guide's detail page is a proper landing/sales page and
 * reads the `landing` block. PDFs are checked into the repo under
 * public/guides/ and linked to directly.
 *
 * A new guide ships `verified: false` (draft) until Selwyn signs off; draft
 * guides show a "read the preview" CTA. Once `buyUrl` is set (a Gumroad or
 * Lemon Squeezy link) the CTA becomes a real buy button. All six current
 * guides are signed off (verified: true) as of edition 2026.07.
 */

import type { GuideKind } from "./types";

/** Edition stamp shared across the current release. */
export const GUIDES_EDITION = "2026.07";

/** The sales content shown on a guide's landing page. */
export interface GuideLanding {
  /** Hero hook, one line. */
  tagline: string;
  /** One or two sentences under the tagline. */
  pitch: string;
  /** Who the guide is for, a few short lines. */
  forWho: string[];
  /** What ships in the guide, the feature list. */
  inside: string[];
  /** What the reader can do after, benefit-first. */
  outcomes: string[];
  /** Display price, e.g. "$19". */
  price: string;
  /** Page count of the PDF. */
  pages: number;
  /** Checkout link (Gumroad/Lemon Squeezy). Empty while in draft. */
  buyUrl?: string;
}

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
  /** Sales content for the landing page. */
  landing: GuideLanding;
}

/**
 * The guide catalog. The complete edition leads the shelf; the five parts
 * follow. `kind` is a free string so a new category never needs a schema
 * change, just a new row. Sources live in content/guides/*.html.
 */
export const GUIDES: Guide[] = [
  {
    slug: "the-complete-guide",
    title: "The Foundations",
    mark: "TF",
    kind: "complete",
    blurb:
      "All five guides in one book: SEO, AEO, GEO, The Stack, and The Client Kit, 87 pages of one connected system, cited throughout and heavily illustrated. The whole method, start to finish.",
    pdf: "/guides/the-complete-guide.pdf",
    verified: true,
    landing: {
      tagline: "The whole 2026 search playbook, in one book.",
      pitch:
        "SEO, AEO, GEO, the tooling under all three, and the field guide for working on client sites, as one connected method. Cited throughout, heavily illustrated, and written to be read by a beginner or handed to an AI whole.",
      forWho: [
        "Developers and freelancers who want the entire picture, not five browser tabs",
        "VAs and agencies who need one reference to run and to hand a client",
        "Anyone tired of guides that explain the what but never the how",
      ],
      inside: [
        "All five guides: SEO, AEO, GEO, The Stack, and The Client Kit",
        "87 pages, five full parts, cited to primary sources throughout",
        "A plain-language explainer opening every section, then the depth",
        "Inline infographics, lettered breakdowns, and decision maps, not walls of text",
        "Tiered action plans from Starter to Advanced, each with a Done-when check",
        "Copy-paste checklists and client-access request templates",
      ],
      outcomes: [
        "Understand how search, AI answers, and recommendations actually work in 2026",
        "Run a repeatable content and measurement system, not one-off tactics",
        "Onboard a client and work on their site safely from day one",
        "Always know the next concrete step, at your level, on every topic",
      ],
      price: "$39",
      pages: 87,
    },
  },
  {
    slug: "seo-foundations",
    title: "SEO Foundations",
    mark: "SE",
    kind: "seo",
    blurb:
      "How search actually works in 2026: crawl, render, index, rank, the technical layer a developer controls, and what the AI-reshaped results page changed. Guide 01 of the trilogy.",
    pdf: "/guides/seo-foundations.pdf",
    verified: true,
    landing: {
      tagline: "How search actually works in 2026, for the person who builds the site.",
      pitch:
        "Crawl, render, index, rank, the technical layer you control, and what the AI-reshaped results page changed. The fundamentals, current and cited, without the hacks.",
      forWho: [
        "Developers who want to own the technical layer, not guess at it",
        "Freelancers and VAs doing on-page SEO for clients",
        "Anyone who learned SEO years ago and needs the 2026 update",
      ],
      inside: [
        "The four-stage machine: crawl, render, index, rank, and where each breaks",
        "Core Web Vitals with real thresholds and real fixes",
        "The content system: write, publish, and scale a page that ranks and gets cited",
        "E-E-A-T, quality raters, and how to survive a core update",
        "Structured data and internal links: what still pays in 2026",
        "A tiered action plan and a pre-publish checklist you can hand a VA",
      ],
      outcomes: [
        "Diagnose why a page is not getting found, step by step",
        "Build pages that satisfy a human, a ranking system, and an answer engine at once",
        "Run a weekly content loop instead of chasing one-off tactics",
      ],
      price: "$19",
      pages: 21,
    },
  },
  {
    slug: "aeo-foundations",
    title: "AEO Foundations",
    mark: "AE",
    kind: "aeo",
    blurb:
      "Answer Engine Optimization: being the passage that snippets, People Also Ask, AI Overviews, and voice assistants extract and attribute. Guide 02 of the trilogy.",
    pdf: "/guides/aeo-foundations.pdf",
    verified: true,
    landing: {
      tagline: "Be the passage the answer engine quotes.",
      pitch:
        "Answer Engine Optimization: getting extracted and attributed by featured snippets, People Also Ask, AI Overviews, and voice assistants. The unit is no longer the page, it is the passage.",
      forWho: [
        "Content and SEO people adapting to answer-first search",
        "Developers structuring content and schema for extraction",
        "VAs who need to make client content answer-ready",
      ],
      inside: [
        "Why answers beat rankings, and how answer selection actually works",
        "Question-first content architecture and the answer-block anatomy",
        "Schema and access: making a passage machine-readable",
        "The llms.txt debate and what is actually real",
        "How to measure answer share without fooling yourself",
        "The answer system: a repeatable loop, plus an 8-row checklist",
      ],
      outcomes: [
        "Format a page so one passage gets lifted as the answer",
        "Structure questions and answers the way engines extract them",
        "Track whether you are being quoted, not just ranked",
      ],
      price: "$19",
      pages: 17,
    },
  },
  {
    slug: "geo-foundations",
    title: "GEO Foundations",
    mark: "GE",
    kind: "geo",
    blurb:
      "Generative Engine Optimization: getting retrieved, cited, and recommended inside AI answers, with the evidence base and what nobody knows yet. Guide 03 of the trilogy.",
    pdf: "/guides/geo-foundations.pdf",
    verified: true,
    landing: {
      tagline: "Get named, cited, and recommended inside AI answers.",
      pitch:
        "Generative Engine Optimization: getting retrieved and cited by ChatGPT, Perplexity, Gemini, and AI Overviews, with the evidence base and an honest map of what nobody knows yet.",
      forWho: [
        "Brands and freelancers who want to show up when someone asks an AI",
        "Developers making a site retrievable and citable by LLMs",
        "Anyone who keeps hearing GEO and wants the real version",
      ],
      inside: [
        "The new consideration set: how AI decides who to name",
        "The citation pipeline and what makes a passage citable",
        "Training data versus live retrieval, and why it matters",
        "Technical readiness for AI crawlers",
        "Measurement without self-deception on a non-deterministic surface",
        "The mention system: a monthly loop, plus a 7-row checklist",
      ],
      outcomes: [
        "Earn brand mentions inside AI answers, not just backlinks",
        "Instrument AI visibility with rolling averages, not single readings",
        "Separate what is proven from what is hype in GEO",
      ],
      price: "$19",
      pages: 18,
    },
  },
  {
    slug: "the-stack",
    title: "The Stack",
    mark: "ST",
    kind: "tools",
    blurb:
      "The tooling companion to the trilogy: GA4, Tag Manager, Search Console, Bing, Semrush, Screaming Frog, and AI-visibility tools, with a which-tool-for-which-job map, cost tiers, and a build-your-stack playbook.",
    pdf: "/guides/the-stack.pdf",
    verified: true,
    landing: {
      tagline: "The tools that measure everything, and what each is for.",
      pitch:
        "GA4, Tag Manager, Search Console, Bing, Semrush, Screaming Frog, and the new AI-visibility tools, wired together. A which-tool-for-which-job map, honest cost tiers, and a build-your-stack playbook. Most of it is free.",
      forWho: [
        "Anyone drowning in tool names who just wants the map",
        "VAs setting up measurement for a client from scratch",
        "Developers wiring analytics without a marketer on hand",
      ],
      inside: [
        "Which tool for which job, matched to the layer it serves",
        "The backbone: Tag Manager plus GA4, with a worked signup-tracking example",
        "Ground truth from Search Console and Bing",
        "AI-visibility tools: the new category, and how to judge one",
        "What it costs: free, freemium, and paid, in the order to spend",
        "A build-your-stack playbook, from zero to one dashboard",
      ],
      outcomes: [
        "Instrument a site end to end for free before paying a cent",
        "Know exactly which tool answers which question",
        "Build one dashboard you actually check instead of six tabs",
      ],
      price: "$15",
      pages: 13,
    },
  },
  {
    slug: "the-client-kit",
    title: "The Client Kit",
    mark: "CK",
    kind: "clients",
    blurb:
      "The field guide for working on a client's site: how to get access the safe way without ever holding a password, what to ask for on day one, which CMS you are looking at, and how to edit a live site without breaking it.",
    pdf: "/guides/the-client-kit.pdf",
    verified: true,
    landing: {
      tagline: "Work on a client's site without ever holding their password.",
      pitch:
        "The field guide nobody else writes: how to get access the safe way, what to ask for on day one, which CMS you are looking at, and how to edit a live site without breaking it. Written for a VA on day one.",
      forWho: [
        "Virtual assistants and freelancers working on clients' sites",
        "Anyone who has been handed a client login and felt uneasy about it",
        "Agencies onboarding contractors who need one clean process",
      ],
      inside: [
        "The access rule: your own login, lowest role, never their password",
        "A one-message onboarding request, plus copy-paste templates per platform",
        "Access, platform by platform: Search Console, GA4, GTM, Shopify, Meta, DNS",
        "Reading the site: which CMS is this, and can you finish the job alone",
        "Editing safely on a live site without taking it down",
        "A client-onboarding playbook and a clean-offboarding checklist",
      ],
      outcomes: [
        "Ask any client for exactly the right access, professionally, in one message",
        "Recognize any CMS and know whether you need the developer",
        "Edit a live client site with zero risk of breaking it",
        "Onboard and offboard cleanly enough that clients rehire you",
      ],
      price: "$24",
      pages: 20,
    },
  },
];

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

/** The complete-edition guide, for cross-sell from a single part. */
export function completeGuide(): Guide | undefined {
  return GUIDES.find((g) => g.kind === "complete");
}

/** The individual parts (everything except the complete edition). */
export function partGuides(): Guide[] {
  return GUIDES.filter((g) => g.kind !== "complete");
}
