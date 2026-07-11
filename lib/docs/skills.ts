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

import type { SkillCategory, SkillKind } from "./types";

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
  /** Which slice of the process this belongs to; drives the card's tint + category filter. */
  category: SkillCategory;
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
    category: "plan",
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
    category: "quality",
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
    name: "brand-voice",
    title: "Brand Voice",
    mark: "BV",
    kind: "workflow",
    category: "content",
    description:
      "Build a source-derived writing voice profile from real posts, docs, or site copy, then reuse it across content and outreach so every draft sounds like the same person instead of generic AI copy. Use before drafting anything user-facing when voice consistency matters: articles, launch notes, social posts, outbound messages. Falls back to Selwyn's own default voice (direct, plain-word, sourced) when no other source material is given, not a generic one.",
    blurb:
      "Derive a voice from real source material and reuse it, or fall back to my own default voice, sourced from my anti-slop rules, when there's nothing to derive from.",
    when: "drafting anything user-facing where voice consistency matters",
    needs: ["writing-without-ai-slop"],
    phases: [
      {
        phase: "Gather",
        directive:
          "Collect 5 to 20 real samples (posts, articles, launch notes, outbound messages, site copy), preferring recent material unless told older writing is more canonical.",
        docs: ["writing-without-ai-slop"],
      },
      {
        phase: "Extract",
        directive:
          "Pull the signature, not adjectives: rhythm, compression, how claims get made, what the source never does.",
        docs: ["writing-without-ai-slop"],
      },
      {
        phase: "Write",
        directive:
          "Produce the structured voice profile. If no source material exists, use the default voice and say so plainly instead of silently substituting it.",
        docs: ["writing-without-ai-slop"],
      },
    ],
    files: [
      {
        path: "references/voice-profile-schema.md",
        role: "reference",
        summary: "The structured VOICE PROFILE format a derived voice should follow.",
      },
    ],
    verified: false,
  },
  {
    name: "bootstrap-nextjs",
    title: "Bootstrap Next.js",
    mark: "NX",
    kind: "scaffold",
    category: "build",
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
  {
    name: "nextjs-16-facts",
    title: "Next.js 16 Facts",
    mark: "16",
    kind: "check",
    category: "build",
    description:
      "Verify Next.js App Router code against the exact installed version instead of stale training-data assumptions. Use before writing or reviewing anything touching params, route handlers, metadata, caching, or middleware in a Next.js 15+/16+ project. Next.js ships breaking changes across minor versions (params are now Promises, GET handlers are no longer cached, middleware is deprecated for proxy), so this reads the version and points at node_modules/next/dist/docs as ground truth.",
    blurb:
      "Next.js changes its API surface every few versions and training data is usually wrong about it. This checks your code against the version you actually installed, not what a model remembers.",
    when: "writing or reviewing Next.js routing, params, route handlers, metadata, caching, or middleware in a 15+/16+ project",
    needs: ["project-setup", "system-architecture", "type-system"],
    files: [
      {
        path: "scripts/check-next-version.mjs",
        role: "script",
        summary: "Reads the target's installed Next.js version and reports whether bundled docs exist to treat as ground truth.",
      },
      {
        path: "references/verified-facts.md",
        role: "reference",
        summary: "The version-specific breaking changes with the fix for each, and the rule that bundled docs override memory.",
      },
    ],
    verified: false,
  },
  {
    name: "nextjs-security-audit",
    title: "Next.js Security Audit",
    mark: "SA",
    kind: "check",
    category: "security",
    description:
      "Audit a Next.js change across the full web-app attack surface before it ships: access control, injection, XSS and output handling, secret exposure, and dangerous config. Use before shipping any Server Action, Route Handler, form, data flow, or next.config change. Next.js protects a real slice for you (server isolation, encrypted action IDs, a CSRF baseline), but every action and handler is still a public POST endpoint. This checks auth and ownership, SQL injection, dangerouslySetInnerHTML, SSRF, mass assignment, leaked secrets, missing security headers, and more, each flagged for review, not blindly certified.",
    blurb:
      "The security pass before you ship: auth and ownership, injection, XSS, SSRF, secret leaks, and missing headers. It flags what a grep can catch and hands you a review checklist for the rest, because a scanner cannot certify that your authorization is correct.",
    when: "shipping a Server Action, Route Handler, form, data flow, or next.config change in a Next.js app",
    needs: [
      "data-security",
      "security",
      "security-by-design",
      "authentication",
      "rate-limiting",
      "environment-and-secrets",
      "content-security-policy",
    ],
    phases: [
      {
        phase: "Scan",
        directive:
          "Run the scanner over the changed files to flag the mechanically-detectable risks (leaked secrets, interpolated SQL, dangerouslySetInnerHTML, fetch to a user URL, spread request bodies, missing security headers, dangerous image config) for review.",
        docs: ["security", "environment-and-secrets"],
      },
      {
        phase: "Access control",
        directive:
          "For every Server Action and Route Handler, confirm it re-checks authentication itself (a page check does not cover it), checks resource ownership to stop IDOR, validates client input, and rate limits anything expensive or abusable.",
        docs: ["security-by-design", "authentication", "rate-limiting"],
      },
      {
        phase: "Injection and output",
        directive:
          "Confirm queries are parameterized (never string-built), user HTML is sanitized before dangerouslySetInnerHTML, redirects and outbound fetches are allowlisted (open redirect, SSRF), and no request body is spread into a database write.",
        docs: ["security", "data-security"],
      },
      {
        phase: "Exposure and config",
        directive:
          "Confirm secrets stay server-only (no NEXT_PUBLIC_, process.env only in the data layer), only minimal DTOs cross to the client, errors do not leak stack traces, security headers are set, and next.config has no dangerous image options.",
        docs: ["environment-and-secrets", "data-security", "content-security-policy"],
      },
    ],
    files: [
      {
        path: "scripts/scan-security.mjs",
        role: "script",
        summary: "Greps the changed files for the high-confidence risk patterns across every vuln family and flags each for human review. It surfaces risks; it does not certify that the code is safe.",
      },
      {
        path: "references/security-audit-checklist.md",
        role: "reference",
        summary: "The full web-app audit: what Next.js protects by default versus what you own, every vuln class with its detection signal and fix, sourced to the framework's bundled docs and the handbook.",
      },
    ],
    verified: false,
  },
  {
    name: "verify-before-ship",
    title: "Verify Before Ship",
    mark: "VB",
    kind: "check",
    category: "quality",
    description:
      "Verify a change actually works by exercising the rendered output, not just by trusting a green build. Use before committing or shipping any nontrivial change: check the real HTML or UI for leaked frontmatter, unstyled text, broken layout, and placeholder strings, in both light and dark mode when the change touches styling. A passing typecheck or test suite proves the code compiles, not that the page is correct.",
    blurb:
      "A green build means the code compiles. This is the check that means the page is actually right, run against the real rendered output before anything ships.",
    when: "before committing or shipping a UI or content change, after the build already passes",
    needs: ["working-with-me", "error-handling-ux"],
    phases: [
      {
        phase: "Build",
        directive:
          "Run the smallest relevant checks first (typecheck, lint, tests). Treat a pass here as necessary, not sufficient.",
        docs: ["working-with-me"],
      },
      {
        phase: "Render",
        directive:
          "Start the dev server and load the actual page or component the change touches. Curl or screenshot the real output, don't infer correctness from the diff.",
        docs: ["working-with-me"],
      },
      {
        phase: "Inspect",
        directive:
          "Check for the specific failure class that a build can't catch: raw frontmatter leaking into the page, unstyled or truncated text, broken layout at common breakpoints, placeholder or TODO strings, and (if styling changed) both light and dark mode.",
        docs: ["error-handling-ux"],
      },
    ],
    files: [
      {
        path: "references/rendered-output-checklist.md",
        role: "reference",
        summary: "The specific things a green build hides: frontmatter leaks, broken empty states, theme regressions, and how to check for each.",
      },
    ],
    verified: false,
  },
  {
    name: "review-before-commit",
    title: "Review Before Commit",
    mark: "RC",
    kind: "check",
    category: "quality",
    description:
      "Review a diff against Selwyn's engineering standards before it is committed. Use after writing or changing code and before staging it. Checks for the things that pass a build but fail the bar: broad rewrites where a surgical edit would do, new dependencies or patterns added without justification, any on non-trivial data, dead code, leftover console logs or debug strings, and business logic that drifted into client components. Pairs with verify-before-ship, which checks the rendered page; this checks the code.",
    blurb:
      "The review I would give the diff before it goes in: smallest change that works, no new deps or patterns for no reason, no any on real data, no dead code, logic on the right side of the server boundary.",
    when: "after writing or changing code, before committing it",
    needs: ["working-with-me", "system-architecture", "type-system", "security-by-design"],
    phases: [
      {
        phase: "Diff",
        directive:
          "Read the actual diff (git diff), not the intent. Confirm the change is the smallest edit that solves the problem and did not rewrite or reformat code it did not need to touch.",
        docs: ["working-with-me"],
      },
      {
        phase: "Standards",
        directive:
          "Check against the standing rules: no new dependency or pattern without a clear reason, no any for non-trivial data, no dead code or leftover console logs, no business logic pushed into client components, secure-by-default wiring kept intact.",
        docs: ["working-with-me", "system-architecture", "type-system"],
      },
      {
        phase: "Report",
        directive:
          "List what must change before commit and what is optional, plainly. Do not commit on the author's behalf; the review ends at a clear verdict, the human decides.",
        docs: ["security-by-design"],
      },
    ],
    files: [
      {
        path: "references/review-checklist.md",
        role: "reference",
        summary: "The standards a diff is held to, grouped by scope, correctness, types, and architecture, each with what a violation looks like.",
      },
    ],
    verified: false,
  },
  {
    name: "seo-audit",
    title: "SEO Audit",
    mark: "SE",
    kind: "check",
    category: "quality",
    description:
      "Audit a Next.js App Router app for the SEO layer that Next.js turns into head tags and crawler files. Use before launch, or after adding routes, to confirm metadataBase and a title template in the root layout, a canonical URL on every indexable page, Open Graph and a social image, a typed sitemap.ts and robots.ts, JSON-LD for rich results, and no page missing an intentional title or description. Metadata in the App Router is typed exports, so most of this is checkable, not guesswork.",
    blurb:
      "The SEO pass before launch: metadataBase and a title template, a canonical on every page, an OG image, sitemap and robots, and JSON-LD. Next.js makes metadata typed exports, so this checks the ones you forgot.",
    when: "before launch, or after adding routes, to check a Next.js app's metadata, canonical, sitemap, robots, OG, and structured data",
    needs: ["seo", "performance"],
    phases: [
      {
        phase: "Defaults",
        directive:
          "Confirm the root layout sets metadataBase (absolute URLs) and a title.template with a default, so every new route inherits the brand suffix and social defaults instead of shipping bare.",
        docs: ["seo"],
      },
      {
        phase: "Per-page",
        directive:
          "Confirm every indexable page has an intentional title and description and an explicit alternates.canonical, and that dynamic routes use generateMetadata (awaiting params) with a cached data call, not a static object.",
        docs: ["seo"],
      },
      {
        phase: "Crawlers and cards",
        directive:
          "Confirm sitemap.ts and robots.ts exist and are typed, an Open Graph image resolves (static or generated), and JSON-LD is present where rich results apply. Remember robots.txt is not access control; gate private routes with real auth.",
        docs: ["seo", "performance"],
      },
    ],
    files: [
      {
        path: "scripts/scan-seo.mjs",
        role: "script",
        summary: "Scans the app/ tree for metadataBase, a title template, canonical usage, sitemap/robots files, and OG images, and flags routes that look unconfigured for review.",
      },
      {
        path: "references/seo-checklist.md",
        role: "reference",
        summary: "The full typed-metadata SEO layer with the fix for each gap, sourced to the Next.js metadata docs and the handbook's SEO page.",
      },
    ],
    verified: false,
  },
  {
    name: "launch-checklist-run",
    title: "Launch Checklist Run",
    mark: "LC",
    kind: "workflow",
    category: "ops",
    description:
      "Run a project through the launch checklist before shipping: the line between code that compiles and a site that reads as finished. Use before a launch or a first public deploy to walk the required, recommended, and optional items by category (foundation, brand, design, security, performance and SEO, pre-launch), filtered to the project type, and report what is done, what is missing, and what blocks the ship. A green build is not a finished product.",
    blurb:
      "The last mile before launch: favicon, social card, dead links, security headers, Core Web Vitals, a real domain. It walks the checklist by category, filtered to what you are building, and tells you what still blocks the ship.",
    when: "before a launch or first public deploy, to verify the site is finished, not just building",
    needs: ["launch-checklist", "deployment", "security"],
    phases: [
      {
        phase: "Scope",
        directive:
          "Pick the project type (marketing, app, or ecommerce) so the checklist filters to the items that actually apply, then separate required (the floor to ship) from recommended and optional.",
        docs: ["launch-checklist"],
      },
      {
        phase: "Walk",
        directive:
          "Go category by category (foundation, brand, design, security, performance and SEO, pre-launch) and check each item against the real rendered site, not the build. Verify the favicon, the social card, dead links, and a phone width by looking, not assuming.",
        docs: ["launch-checklist", "security"],
      },
      {
        phase: "Report",
        directive:
          "List what passed, what is missing, and specifically which required items still block the launch. Do not call it shippable while any required item is open.",
        docs: ["deployment"],
      },
    ],
    files: [
      {
        path: "references/launch-checklist.md",
        role: "reference",
        summary: "The full checklist by category, each item tagged required, recommended, or optional, with the project types it applies to and the handbook page that covers it.",
      },
    ],
    verified: false,
  },
  {
    name: "ai-legibility-audit",
    title: "AI Legibility Audit",
    mark: "AL",
    kind: "check",
    category: "quality",
    description:
      "Audit whether a site is legible to AI answer engines and coding agents, checking only what is mechanically verifiable, not ranking promises. Use before launch, or when adding AI-facing surfaces, to confirm content is server-rendered so a non-JS crawler sees it, there is one h1 and clean heading hierarchy, JSON-LD is present and valid, a sitemap and freshness dates are consistent, a clean per-page markdown endpoint mirrors the HTML, llms.txt is well-formed, and robots.txt names real AI user-agents. It asserts presence and correctness, never that any of it improves how often you get cited.",
    blurb:
      "Is your site legible to AI, the part you can actually verify? It checks server-rendered content, valid JSON-LD, a clean markdown mirror, a well-formed llms.txt, and AI-crawler robots rules. It grades your site's own bytes, never promises a ranking, because that part is a black box.",
    when: "before launch, or when adding AI-facing surfaces (llms.txt, markdown endpoints, structured data), to check a site is machine-legible",
    needs: ["seo", "how-to-use", "writing-without-ai-slop"],
    phases: [
      {
        phase: "Fetch",
        directive:
          "Curl each key route with JavaScript off (the raw HTML a non-JS crawler sees) and confirm the real content, the JSON-LD, the single h1, and the article structure are all present in the initial bytes, not injected after hydration.",
        docs: ["seo"],
      },
      {
        phase: "Structure",
        directive:
          "Confirm exactly one h1 and a non-skipping heading hierarchy, semantic article/nav landmarks, descriptive link text and alt attributes, valid JSON-LD whose fields match the visible content, and dateModified consistent with the sitemap lastmod and the visible date.",
        docs: ["seo"],
      },
      {
        phase: "AI surfaces",
        directive:
          "Confirm the machine-readable surfaces are present and well-formed: a clean per-page markdown endpoint that mirrors the HTML, an llms.txt in the H1 to blockquote to H2 shape, an AGENTS.md at the repo root, and a robots.txt that names real AI user-agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) with the intended allow or disallow.",
        docs: ["how-to-use"],
      },
      {
        phase: "Report honestly",
        directive:
          "Report each surface as present, valid, or missing with the byte-level evidence and the standard it was checked against. State plainly that these verify legibility, not ranking or citation, which depend on opaque engines outside the site. Do not turn any unproven GEO tactic into an action item.",
        docs: ["writing-without-ai-slop"],
      },
    ],
    files: [
      {
        path: "scripts/scan-ai-legibility.mjs",
        role: "script",
        summary: "Fetches routes and checks the mechanical AI-legibility surfaces (server-rendered content, one h1, JSON-LD, markdown endpoint, llms.txt shape, AI-crawler robots rules), reporting presence and validity only.",
      },
      {
        path: "references/ai-legibility-checklist.md",
        role: "reference",
        summary: "Every checkable surface with its verification and the published standard behind it, plus a dated, hedged note on what GEO research suggests and why this skill does not automate it.",
      },
    ],
    verified: false,
  },
  {
    name: "session-continuity",
    title: "Session Continuity",
    mark: "SC",
    kind: "workflow",
    category: "ops",
    description:
      "Save what a session accomplished, what's left, and why each decision was made, so the next session (yours or a fresh agent's) picks up cold without re-deriving context. Use at the end of a work session, or when switching between projects, to write a short structured record instead of losing the thread. Reads back automatically at the start of the next session in the same project.",
    blurb:
      "Write down what happened, what's left, and why, before you close the session. The next one starts already knowing it.",
    when: "ending a work session, or switching between projects mid-task",
    needs: ["working-with-me", "project-setup"],
    phases: [
      {
        phase: "Save",
        directive:
          "At the end of a session, record a one-line summary of what was accomplished, what was actively being worked on, the ordered next steps, and the reason behind any nontrivial decision made this session.",
        docs: ["working-with-me"],
      },
      {
        phase: "Resume",
        directive:
          "At the start of the next session in the same project, read the last saved record before doing anything else, so the first action is informed instead of a re-discovery.",
        docs: ["project-setup"],
      },
    ],
    files: [
      {
        path: "references/session-record-schema.md",
        role: "reference",
        summary: "The structured fields a session record should carry: summary, left-off point, next steps, decisions with their why, and open blockers.",
      },
    ],
    verified: false,
  },
  {
    name: "architecture-decision-log",
    title: "Architecture Decision Log",
    mark: "AD",
    kind: "workflow",
    category: "plan",
    description:
      "Capture an architectural decision the moment it's made, not after it's been forgotten: what was decided, the alternatives that lost, and why. Use whenever a project chooses between real alternatives (framework, data store, auth strategy, API shape) and the reasoning is worth keeping. Feeds the handbook's own Decisions page format instead of a separate, easily-ignored docs folder.",
    blurb:
      "Write down the decision, what it beat, and why, in the same place the handbook already keeps its own hard calls, so the reasoning survives past the conversation that produced it.",
    when: "choosing between real alternatives on architecture, data, or API design and the reasoning is worth keeping",
    needs: ["decisions", "nextjs-fit-check"],
    phases: [
      {
        phase: "Detect",
        directive:
          "Notice the decision moment: a stated conclusion after comparing alternatives, not a trivial or purely stylistic choice.",
        docs: ["decisions"],
      },
      {
        phase: "Record",
        directive:
          "Write the decision, the alternatives considered with why each lost, and the consequences (including the real trade-offs, not just the upside), in the handbook's Decisions format.",
        docs: ["decisions", "nextjs-fit-check"],
      },
      {
        phase: "Tag",
        directive:
          "Mark how firm the call is (non-negotiable, strong default, or opinion still under review) so a future reader knows how hard to hold the line.",
        docs: ["decisions"],
      },
    ],
    files: [
      {
        path: "references/decision-entry-schema.md",
        role: "reference",
        summary: "The fields a decision entry needs: the call, what it beat and why, consequences, and its firmness tag.",
      },
    ],
    verified: false,
  },
  {
    name: "pdf-generator",
    title: "PDF Generator",
    mark: "PD",
    kind: "workflow",
    category: "content",
    description:
      "Generate a designed, print-quality PDF (guide, report, whitepaper, multi-part book) from HTML using a browser the machine already has. Use when asked to produce, export, or design a PDF, or to turn markdown, docs, or research into a polished downloadable document. HTML-first: reads the print rulebook, authors print-first HTML from a branded template, renders via headless Chrome or Edge --print-to-pdf, stamps page numbers in post, and verifies objectively (a shrink-to-fit scan) plus page by page. Ships beginner-friendly components and a split-render-and-merge pipeline for books with full-bleed part dividers.",
    blurb:
      "Author print-first HTML from a branded template, render it with the browser already on the machine, stamp page numbers, and verify with a shrink-scan plus a page-by-page read. Design rules first, no cheap-looking output.",
    when: "producing a PDF: a guide, report, whitepaper, multi-part book, or any designed downloadable document",
    needs: ["design-tokens", "branding-overview", "writing-without-ai-slop"],
    phases: [
      {
        phase: "Rules",
        directive:
          "Read the print rulebook before writing any HTML: page geometry, break discipline, the shrink-to-fit trap (nothing may exceed the printable width), print typography, ink, and what Chrome's print pipeline cannot do.",
        docs: ["design-tokens"],
      },
      {
        phase: "Author",
        directive:
          "Copy the branded template and write the document to the rules: declared @page size, flowing sections, break-protected components, a plain-words explainer opening every section, diagrams over prose, and a tiered action plan closing the guide.",
        docs: ["branding-overview", "writing-without-ai-slop"],
      },
      {
        phase: "Render",
        directive:
          "Run the bundled renderer (finds an installed Chrome, Edge, or Chromium), then stamp page numbers with the paginate script; for books, render dividers as their own single-page documents and merge the pieces in order.",
        docs: [],
      },
      {
        phase: "Verify",
        directive:
          "Run the check script first (page count, page size, per-page shrink detection), then open the PDF and walk every page: full-bleed cover, no stranded headings or split components, display font actually loaded. Fix in the HTML and re-render until the pages pass.",
        docs: ["working-with-me"],
      },
    ],
    files: [
      {
        path: "scripts/build-pdf.mjs",
        role: "script",
        summary: "Cross-platform renderer: finds an installed Chrome, Edge, or Chromium and prints each HTML input to PDF, reporting size and page count. Zero dependencies.",
      },
      {
        path: "scripts/paginate-pdf.mjs",
        role: "script",
        summary: "Stamps a centered page number in the bottom margin of every page except the cover, in post, from the real page count.",
      },
      {
        path: "scripts/merge-pdfs.mjs",
        role: "script",
        summary: "Concatenates piece PDFs into one book in argument order, enabling full-bleed interior part dividers via split-render-and-merge.",
      },
      {
        path: "scripts/check-pdf.mjs",
        role: "script",
        summary: "Objective verification: page count, page size, and per-page shrink-to-fit detection read from the PDF's own drawing instructions.",
      },
      {
        path: "templates/guide.html",
        role: "template",
        summary: "The branded print document: full-bleed dark cover, light interior, flowing sections, and example markup for every break-protected component, from plain-words boxes to checklists and playbooks.",
      },
      {
        path: "references/print-design.md",
        role: "reference",
        summary: "The print rulebook: page geometry, break discipline, the shrink-to-fit trap, bleed mechanics, split-render-and-merge, typography, ink, verification checklist, troubleshooting table.",
      },
    ],
    verified: false,
  },
];

/** Kinds present in the catalog, for the marketplace filter chips. */
export function skillKinds(): SkillKind[] {
  return [...new Set(SKILLS.map((s) => s.kind))];
}

/**
 * Category display metadata: a label for the filter chip, and a `tint` (1-5)
 * driving how bright the icon tile's red gradient runs. Brand rule is "red is
 * an accent, never a flood" (see globals.css), so categories are told apart by
 * WEIGHT within the same red family, never by a different hue. Ordered by
 * where each sits in the build journey (plan first, ops last).
 */
export const CATEGORY_META: Record<
  SkillCategory,
  { label: string; tint: 1 | 2 | 3 | 4 | 5 }
> = {
  plan: { label: "Plan", tint: 2 },
  build: { label: "Build", tint: 4 },
  security: { label: "Security", tint: 5 },
  quality: { label: "Quality", tint: 3 },
  content: { label: "Content", tint: 3 },
  ops: { label: "Ops", tint: 1 },
};

/** Categories present in the catalog, for the marketplace category filter. */
export function skillCategories(): SkillCategory[] {
  return [...new Set(SKILLS.map((s) => s.category))];
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
 * The GitHub marketplace the skills install from. This is the `owner/repo` a
 * user passes to `/plugin marketplace add`. Skills ship in-repo under /skills/
 * with a marketplace.json at the root; distribution is git-based, not raw HTTP.
 * Lives here (not registry.ts) so client components like InstallCommand can
 * import it without pulling in registry.ts's server-only filesystem reads.
 */
export const SKILLS_MARKETPLACE = "Selwynuy/selwynuy";

/**
 * The marketplace's own `name` field (marketplace.json `name`), distinct from
 * the `owner/repo` above. `/plugin install <plugin>@<marketplace-name>` needs
 * this, not the repo path, since a plugin name can collide across
 * marketplaces. Kept as its own constant (even though it currently equals
 * SKILLS_PLUGIN) so the two concepts don't drift silently if either changes.
 */
export const SKILLS_MARKETPLACE_NAME = "selwyn-handbook";

/**
 * Render the Skills section for /claude.md and /llms.txt: a one-time install
 * line for the plugin, then one WHEN line per skill (with phase directives
 * inline so a non-browsing consumer still gets the substance). `siteUrl`,
 * `marketplace` (owner/repo), and `marketplaceName` (the marketplace.json
 * `name` field, needed for `/plugin install <plugin>@<marketplace-name>`)
 * are passed in to keep this module config-free.
 */
export function skillsMarkdown(opts: {
  siteUrl: string;
  marketplace: string;
  marketplaceName: string;
}): string {
  const lines: string[] = [
    `Install once: \`/plugin marketplace add ${opts.marketplace}\` then ` +
      `\`/plugin install ${SKILLS_PLUGIN}@${opts.marketplaceName}\`. Then invoke a skill as ` +
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
