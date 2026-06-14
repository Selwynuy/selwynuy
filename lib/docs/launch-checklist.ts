/**
 * The launch checklist: the line between "it runs" and "it's done".
 *
 * Pure data + filter logic, extracted from the UI so it can be unit tested
 * (mirrors the fit-check.ts pattern). The interactive checklist component and
 * the handbook page both read from here, so the list never diverges.
 *
 * Grounded in real practice: the brainstorm-plan-build-verify loop popularized
 * by agentic skill frameworks, the Next.js best-practice areas those skills
 * encode, and the specific "small things" that decide whether a site reads as
 * finished (favicon, social card, brand consistency, the polish pass).
 */

export type Requirement = "required" | "recommended" | "optional";

/** Project shapes used to filter the list. "all" items always apply. */
export type ProjectType = "all" | "marketing" | "app" | "ecommerce";

export type ChecklistCategory =
  | "Foundation"
  | "Brand & Identity"
  | "Design & Polish"
  | "Security"
  | "Performance & SEO"
  | "Pre-Launch";

export interface ChecklistItem {
  /** Stable id, used as the React key and the localStorage key. */
  id: string;
  label: string;
  /** One sentence on why it matters or how to do it. No fluff. */
  detail: string;
  category: ChecklistCategory;
  requirement: Requirement;
  /** Project types this applies to. Include "all" for universal items. */
  appliesTo: ProjectType[];
  /** Optional handbook slug that covers this in depth. */
  slug?: string;
}

/** Category display order in the UI. */
export const CATEGORY_ORDER: ChecklistCategory[] = [
  "Foundation",
  "Brand & Identity",
  "Design & Polish",
  "Security",
  "Performance & SEO",
  "Pre-Launch",
];

export const checklist: ChecklistItem[] = [
  // --- Foundation -----------------------------------------------------------
  {
    id: "scope-before-code",
    label: "Scope the work before writing code",
    detail:
      "Decide what done looks like first. A half-page of intent beats a feature you have to unbuild.",
    category: "Foundation",
    requirement: "recommended",
    appliesTo: ["all"],
  },
  {
    id: "typecheck-lint-clean",
    label: "Typecheck and lint pass with zero errors",
    detail:
      "No any on real data, no unused imports, no stray console logs. Green before you ship, every time.",
    category: "Foundation",
    requirement: "required",
    appliesTo: ["all"],
  },
  {
    id: "build-succeeds",
    label: "Production build succeeds locally",
    detail:
      "next build catches what dev hides: bad image config, server/client boundary leaks, type errors in routes.",
    category: "Foundation",
    requirement: "required",
    appliesTo: ["all"],
    slug: "deployment",
  },
  {
    id: "env-and-secrets",
    label: "Secrets are server-only and .env is gitignored",
    detail:
      "No keys in client bundles, no .env.local committed. Verify what NEXT_PUBLIC_ actually exposes.",
    category: "Foundation",
    requirement: "required",
    appliesTo: ["all"],
    slug: "environment-and-secrets",
  },
  {
    id: "verify-rendered",
    label: "Verify the rendered output, not just the build",
    detail:
      "A green build is not a working page. Open it. Click the buttons. Check both themes and a phone width.",
    category: "Foundation",
    requirement: "required",
    appliesTo: ["all"],
  },

  // --- Brand & Identity -----------------------------------------------------
  {
    id: "favicon-set",
    label: "Real favicon, not the framework default",
    detail:
      "The default triangle screams unfinished. Ship favicon.ico plus icon and apple-icon, and check the corners do not fringe on a dark tab.",
    category: "Brand & Identity",
    requirement: "required",
    appliesTo: ["all"],
    slug: "branding-overview",
  },
  {
    id: "og-image",
    label: "Open Graph / social share image",
    detail:
      "When someone shares the link, a branded card matters. A blank or broken preview is the second unfinished tell after the favicon.",
    category: "Brand & Identity",
    requirement: "required",
    appliesTo: ["all"],
    slug: "seo",
  },
  {
    id: "title-meta",
    label: "Page titles and meta descriptions are real",
    detail:
      "No 'Create Next App' in the tab. Every route has an intentional title and description.",
    category: "Brand & Identity",
    requirement: "required",
    appliesTo: ["all"],
    slug: "seo",
  },
  {
    id: "logo-wordmark",
    label: "A consistent logo or wordmark",
    detail:
      "One mark used the same way everywhere (header, favicon, social) so the site reads as one brand.",
    category: "Brand & Identity",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "branding-overview",
  },

  // --- Design & Polish ------------------------------------------------------
  {
    id: "design-tokens",
    label: "Colors and type come from tokens, not magic values",
    detail:
      "One accent, a small scale, semantic tokens. Changing the theme should mean editing one place, not fifty.",
    category: "Design & Polish",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "design-tokens",
  },
  {
    id: "no-dead-links",
    label: "No dead links or placeholder content",
    detail:
      "Every link resolves, every 'coming soon' is real or gone. A 404 from your own nav is worse than omitting the link.",
    category: "Design & Polish",
    requirement: "required",
    appliesTo: ["all"],
  },
  {
    id: "consistent-spacing",
    label: "Consistent spacing, alignment, and card heights",
    detail:
      "Mixed-height cards and ragged rows read as broken. Make repeated elements uniform so the eye trusts the grid.",
    category: "Design & Polish",
    requirement: "recommended",
    appliesTo: ["all"],
  },
  {
    id: "empty-loading-error",
    label: "Empty, loading, and error states exist",
    detail:
      "The happy path is the easy 20 percent. Design the empty list, the spinner, the failed fetch, the 404.",
    category: "Design & Polish",
    requirement: "recommended",
    appliesTo: ["app", "ecommerce"],
    slug: "error-handling-ux",
  },
  {
    id: "responsive",
    label: "Responsive and mobile-first, verified on a real width",
    detail:
      "Most traffic is mobile. Check tap targets, the nav collapse, and that nothing overflows at 390px.",
    category: "Design & Polish",
    requirement: "required",
    appliesTo: ["all"],
    slug: "responsive-design",
  },
  {
    id: "dark-light",
    label: "Dark and light both look intentional",
    detail:
      "If you support a theme toggle, every surface and image has to hold up in both, not just the one you built in.",
    category: "Design & Polish",
    requirement: "optional",
    appliesTo: ["all"],
    slug: "dark-and-light",
  },
  {
    id: "a11y-basics",
    label: "Accessibility basics: alt text, labels, focus, contrast",
    detail:
      "Images have alt text, inputs have labels, focus is visible, text passes contrast. Cheap to do, expensive to retrofit.",
    category: "Design & Polish",
    requirement: "recommended",
    appliesTo: ["all"],
  },

  // --- Security -------------------------------------------------------------
  {
    id: "security-headers",
    label: "Baseline security headers are set",
    detail:
      "Clickjacking protection, no MIME sniffing, a tight referrer policy. The site that preaches security should practice it.",
    category: "Security",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "security",
  },
  {
    id: "input-validation",
    label: "Every input is validated server-side",
    detail:
      "Client validation is UX, not security. Validate and authorize on the server for every mutation.",
    category: "Security",
    requirement: "required",
    appliesTo: ["app", "ecommerce"],
    slug: "security-by-design",
  },
  {
    id: "rate-limit-forms",
    label: "Forms and auth routes are rate limited",
    detail:
      "A contact form or login with no limit is a spam and brute-force magnet. Add a limiter and a honeypot.",
    category: "Security",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "contact-and-forms",
  },
  {
    id: "auth-access-control",
    label: "Auth and access control are enforced at the data layer",
    detail:
      "Least-privilege access on every protected read and write, checked server-side, not hidden behind a UI route.",
    category: "Security",
    requirement: "required",
    appliesTo: ["app", "ecommerce"],
    slug: "data-security",
  },
  {
    id: "legal-pages",
    label: "Privacy policy and terms exist if you collect data or charge",
    detail:
      "Non-negotiable once you take emails, payments, or run ads. Also a hard requirement for AdSense and most processors.",
    category: "Security",
    requirement: "recommended",
    appliesTo: ["app", "ecommerce", "marketing"],
    slug: "legal-pages",
  },

  // --- Performance & SEO ----------------------------------------------------
  {
    id: "images-optimized",
    label: "Images are fitted and use the framework image pipeline",
    detail:
      "Ship the size you render, in a modern format. One unoptimized hero image can dwarf the rest of the page.",
    category: "Performance & SEO",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "performance",
  },
  {
    id: "core-web-vitals",
    label: "Core Web Vitals are in the green",
    detail:
      "LCP, CLS, INP. Run Lighthouse on the production build, not dev. Layout shift and slow LCP cost rankings and trust.",
    category: "Performance & SEO",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "performance",
  },
  {
    id: "sitemap-robots",
    label: "Sitemap, robots, and canonical URLs",
    detail:
      "Tell crawlers what to index and how. Missing these quietly caps how well you can ever rank.",
    category: "Performance & SEO",
    requirement: "recommended",
    appliesTo: ["marketing", "ecommerce"],
    slug: "seo",
  },
  {
    id: "structured-data",
    label: "Structured data (JSON-LD) for rich results",
    detail:
      "Person, Product, Article, or Organization schema earns richer search listings and is cheap to add.",
    category: "Performance & SEO",
    requirement: "optional",
    appliesTo: ["marketing", "ecommerce"],
    slug: "seo",
  },
  {
    id: "analytics",
    label: "Analytics is wired (and privacy-aware)",
    detail:
      "You cannot improve what you cannot see. Add analytics, but load it so it no-ops when the key is unset.",
    category: "Performance & SEO",
    requirement: "optional",
    appliesTo: ["all"],
    slug: "analytics",
  },

  // --- Pre-Launch -----------------------------------------------------------
  {
    id: "custom-domain",
    label: "Custom domain with HTTPS and DNS verified",
    detail:
      "A real domain on HTTPS, not the deploy preview URL. Confirm the records resolve before you announce.",
    category: "Pre-Launch",
    requirement: "required",
    appliesTo: ["all"],
    slug: "dns-and-domains",
  },
  {
    id: "observability",
    label: "Error tracking and logging are live",
    detail:
      "Know when production breaks before your users tell you. One JSON line per event, errors forwarded to a tracker.",
    category: "Pre-Launch",
    requirement: "recommended",
    appliesTo: ["app", "ecommerce"],
    slug: "observability-logging",
  },
  {
    id: "ci-gate",
    label: "CI gates every deploy on green checks",
    detail:
      "Typecheck, lint, tests, and build run on every pull request so a red build can never reach production.",
    category: "Pre-Launch",
    requirement: "recommended",
    appliesTo: ["all"],
    slug: "ci-cd-pipelines",
  },
  {
    id: "final-walkthrough",
    label: "Final walkthrough on a fresh device",
    detail:
      "Open the live URL on a phone you did not build on. First impression, every link, the share preview, the favicon.",
    category: "Pre-Launch",
    requirement: "recommended",
    appliesTo: ["all"],
  },
];

/** Items that match the given project type ("all" items always match). */
export function itemsForType(type: ProjectType): ChecklistItem[] {
  if (type === "all") return checklist;
  return checklist.filter(
    (i) => i.appliesTo.includes("all") || i.appliesTo.includes(type),
  );
}

/** Items grouped by category, in CATEGORY_ORDER, for a given project type. */
export function groupedItems(
  type: ProjectType = "all",
): { category: ChecklistCategory; items: ChecklistItem[] }[] {
  const items = itemsForType(type);
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
}

/** Count of required items for a type, used for the "minimum to ship" stat. */
export function requiredCount(type: ProjectType = "all"): number {
  return itemsForType(type).filter((i) => i.requirement === "required").length;
}
