# The AI-legibility checklist

What to verify so a site is legible to AI answer engines and coding agents, and
the published standard behind each check. Everything here is a boolean about the
site's own output. Nothing here claims a ranking or citation outcome, because
that depends on opaque engines the site does not control.

The single strongest command is `curl -s <url>` (it does not run JavaScript, the
way many AI crawlers do not). In one fetch it shows whether the content, the
JSON-LD, the `<h1>`, and the structure are actually in the served bytes.

## Content and structure

### Server-rendered content
- **Check:** `curl -s <url>` and confirm the real article/answer text is in the
  returned HTML, not just an empty shell. If the words show in a browser but not
  in `curl`, they are hydration-only and a non-JS crawler misses them.
- **Fix (Next.js):** keep content-bearing components as Server Components (the
  App Router default) or SSR; do not gate primary content behind `"use client"`
  + a `useEffect` fetch. Static rendering (`generateStaticParams`) puts the full
  content in prerendered HTML.
- **Standard:** documented crawler behavior. Most AI training/search crawlers
  fetch HTML and do not reliably execute client-side JS. Honest phrasing: report
  "content is / is not in the initial HTML" (verifiable), not "crawler X cannot
  see it" (depends on that crawler's undisclosed behavior).

### One h1 and clean heading hierarchy
- **Check:** exactly one `<h1>` in the served HTML; `<h2>`/`<h3>` nest without
  skipping levels.
- **Fix:** render one `<h1>` from the page title; let the body produce real
  `<h2>`/`<h3>`.
- **Standard:** HTML document-outline / WCAG heading practice. Note this is a
  structure and accessibility convention, not an AEO law.

### Semantic landmarks, links, alt text
- **Check:** a real `<article>` wraps the main content, `<nav>` wraps
  navigation, `<a>` text is descriptive (not "click here"), meaningful `<img>`
  has non-empty `alt`.
- **Fix:** emit semantic tags from Server Components; avoid div soup.
- **Standard:** HTML semantics. These make content parseable; they do not make
  it rank.

### JSON-LD structured data
- **Check:** a `<script type="application/ld+json">` block is present in the
  served HTML, parses as JSON, has a real `@context`/`@type`, and its fields
  match the visible content (e.g. `dateModified` equals the visible date).
- **Fix (Next.js):** build a plain object from typed data in a Server Component
  and render `<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify(obj) }} />`. There is no Metadata API field for it.
  Escape `<` in any user-authored field.
- **Types that matter:** `Article`/`BlogPosting`/`TechArticle`, `FAQPage`,
  `HowTo`, `Organization`, `Person` (with `sameAs`), `Product`, `BreadcrumbList`.
- **Standard:** JSON-LD is a W3C Recommendation; schema.org is published.
  Validity and type-correctness are checkable. Whether it changes AI behavior is
  not, so do not assert it.

### Freshness consistency
- **Check:** three-way agreement for a page: `dateModified` in the JSON-LD,
  `<lastmod>` for that URL in `/sitemap.xml`, and a visible date in the HTML.
- **Fix:** thread one canonical "updated" value into all three from your
  content frontmatter, so they cannot drift.
- **Standard:** sitemaps.org protocol; schema.org `dateModified`. Grade the
  consistency and truthfulness of the dates. Never back-date to fake freshness,
  which is a spam pattern and unverifiable as a benefit.

## Machine-readable surfaces

### Clean per-page markdown endpoint
- **Check:** a `/page.md` (or `/d/<slug>.md`) sibling returns 200 with a
  `text/markdown` (or `text/plain`) content type, is real markdown (headings,
  lists, code, no `<html>`/`<script>`/nav chrome), and mirrors the visible page
  content. Unknown slugs should 404, not soft-200.
- **Fix (Next.js):** a `force-static` route handler that looks the slug up in a
  registry and returns the clean body, `dynamicParams = false`.
- **Standard:** a convention, not a formal spec (the mechanism llms.txt assumes
  for its link targets). Verifiable surface = existence, content type, parity.

### llms.txt
- **Check:** `/llms.txt` returns 200 and follows the shape: one `#` H1 (site
  name), an optional `>` blockquote summary, then `##` sections each with a
  bulleted list of `[name](url): notes` links. `## Optional` is the one H2 with
  special meaning (skippable links). A companion `/llms-full.txt` may
  concatenate everything for single-fetch ingestion.
- **Fix (Next.js):** a `force-static` route handler emitting that shape,
  generated from your content so it cannot drift.
- **Standard:** the llmstxt.org proposal (Jeremy Howard, Answer.AI, 2024-09-03).
- **Honest caveat:** it is an emerging proposal, not adopted by any standards
  body, and as of early 2026 no major AI vendor is documented as consuming it at
  inference; server-log analyses show AI crawlers often do not even request it.
  So check that it is well-formed. Do not claim it improves visibility.

### AGENTS.md
- **Check:** a file named exactly `AGENTS.md` at the repo root, valid markdown
  with operational guidance (build/test commands, conventions, rules). Nested
  `AGENTS.md` files in subprojects are allowed.
- **Standard:** the AGENTS.md open format (agents.md, ~August 2025). It is a repo
  artifact for coding agents, distinct from the served `llms.txt`/`.md`
  endpoints. Verifiable facts: it exists and is well-formed.

### robots.txt for AI crawlers
- **Check:** `/robots.txt` returns 200, valid RFC 9309 syntax, a `Sitemap:`
  line, and whether it names AI user-agents in dedicated groups. Tokens to grep:
  `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI), `ClaudeBot`,
  `Claude-SearchBot` (Anthropic), `PerplexityBot` (Perplexity), `Google-Extended`
  (Google AI training opt-out, not Search), `CCBot` (Common Crawl). For each,
  whether the group allows or blocks, and whether that matches intent.
- **Standard:** Robots Exclusion Protocol, RFC 9309 (IETF, 2022). The AI tokens
  are vendor-documented (GPTBot 2023-08, Google-Extended 2023-09, etc.).
- **Critical caveat:** robots.txt is a voluntary policy signal, not access
  control. It authenticates and blocks nothing; some AI crawlers ignore it (and
  at least one has been documented using rotating undeclared user-agents). You
  can verify the directives, never that they are enforced. Real blocking needs
  server/WAF controls.

## What research suggests (reference only, dated, not an action item)

There is real research on generative-engine visibility. The most cited is the
Princeton et al. paper "GEO: Generative Engine Optimization" (arXiv:2311.09735,
KDD 2024), which found that adding citations, statistics, and direct quotations
correlated with higher visibility, "up to 40%," and that keyword stuffing
performed worse than baseline.

Why this stays out of the executable checks:

- The main experiments ran against a **simulated** generative engine over a
  benchmark, with only narrower validation on Perplexity, not a controlled test
  on today's ChatGPT/Gemini/Claude.
- The authors report effectiveness **varies by domain**.
- It measures 2023-2024 systems that have since changed. Answer-engine ranking
  is opaque and shifts on the order of weeks; cross-platform citation overlap is
  small, so "optimizing for AI" is several divergent, moving targets.

So this is a research finding about a modeled engine, with hedges, not a
guaranteed lever. A skill that turned "add statistics because it boosts GEO 40%"
into a directive would manufacture the exact false confidence this whole approach
rejects. That layer belongs in a dated reference guide with its caveats intact.

## Sources

- llms.txt proposal, Jeremy Howard (Answer.AI), 2024-09-03.
- "GEO: Generative Engine Optimization," arXiv:2311.09735 (KDD 2024).
- Robots Exclusion Protocol, RFC 9309 (IETF, 2022); vendor bot docs (OpenAI,
  Google, Anthropic, Perplexity, Common Crawl).
- sitemaps.org protocol; schema.org; JSON-LD (W3C Recommendation).
- AGENTS.md open format (agents.md, 2025).
- This repo's own implementation (`app/llms.txt/route.ts`, `app/d/[slug]/route.ts`,
  `app/robots.ts`, `app/docs/[slug]/page.tsx`) as a reference example.
