# Blueprint — Portfolio × Next.js Handbook (with one-drop AI ingestion)

> **Objective.** Evolve Selwyn Uy's existing Next.js 16 / React 19 / Tailwind v4 portfolio into a
> **two-part branded site**: (1) a personal **dev portfolio** and (2) a living, opinionated,
> **fact-checked Next.js Handbook** (multi-page MDX) authored from Selwyn's real workflow.
> **Star feature:** a **one-drop** mechanism — every doc section is copyable as a plain-text/markdown
> endpoint that a user pastes to their AI, which fetches that section back and applies it to their own
> project. Endpoint-first now; architected so a hosted **MCP server** can wrap the same MDX later.

---

## Status board

| | |
|---|---|
| **Created** | 2026-06-12 |
| **Owner** | Selwyn Uy (Dakilang-Tamad) |
| **Repo** | `D:\Projects\portfolio` · branch `feat/portfolio-site` |
| **Mode** | **Direct mode** (git present; `gh` + remote absent → no PR/CI automation until Step 0) |
| **Fact-check source** | `node_modules/next/dist/docs/` (bundled Next.js 16 docs) — authoritative for framework claims |
| **Content rule** | Selwyn's workflow is the seed; **facts are the filter**. Nothing publishes to the handbook without a verifiable source + Selwyn's sign-off. |

### Decisions locked
- **One-drop:** plain-text/markdown endpoint **now** (`/d/<section>.md` + `/llms.txt` index); **MCP server later** (wraps same MDX).
- **Docs engine:** **MDX in-repo** (`/content/docs/*.mdx`). No CMS/DB — minimize attack surface, on-brand.
- **Rendering:** Server Components by default; `"use client"` only for interactivity.
- **Content authorship:** Selwyn brain-dumps real workflow **topic by topic, each with a direction prompt from the agent** → drafted into pages → **fact-checked against bundled Next.js docs** → Selwyn approves → published.
- **Design:** evolve the existing monochrome system toward Selwyn's **established brand**: **red (`#e30613`-ish) on near-black**, bold condensed all-caps display headlines, terminal/code aesthetic, "SELWYN UY" wordmark. Reference: his LinkedIn carousel posts under the `cseexamreview.com` / Selwyn Uy brand.
- **Hosting:** **Vercel** (confirmed).
- **AdSense:** **teach it in the handbook only** — Selwyn will apply later; do NOT wire live ads onto the portfolio.
- **Profile photo:** placeholder for now.
- **Scope:** go-big / full reinvention, all side quests in scope.

### Brand reference (from Selwyn's existing content)
- **Founder @ cseexamreview.com · Full-Stack** — this is the public identity.
- Palette: **red accent on near-black**, white text. High contrast.
- Type: **bold condensed all-caps** headline blocks (poster/carousel style), monospace for code.
- Motifs: red "RUN" terminal buttons, code editor framing, hook/fishhook iconography, bottom-anchored `SELWYN UY` signature.
- The site should feel like those carousels became an interactive site — same energy, more depth.

---

## Architecture at a glance

```
app/
  (site)/                 ← portfolio surface (existing sections, evolved)
    page.tsx
  docs/                   ← handbook surface (NEW)
    layout.tsx            ← sidebar nav + TOC shell
    page.tsx              ← handbook landing / index
    [...slug]/page.tsx    ← renders an MDX doc by slug
  d/[slug]/route.ts       ← ONE-DROP: serves raw markdown of a section (text/markdown)
  llms.txt/route.ts       ← ONE-DROP: index of all sections for AI agents (llms.txt convention)
  api/contact/route.ts    ← existing
  layout.tsx · globals.css · robots.ts · sitemap.ts
content/
  docs/*.mdx              ← single source of truth for handbook + one-drop + (future) MCP
lib/
  content/                ← portfolio data (existing, typed)
  docs/                   ← docs registry: frontmatter parsing, slug map, ordering, "verified" flag
components/
  docs/                   ← Sidebar, TOC, CopyForAI button, Callout, CodeBlock, VerifiedBadge
  sections/ · ui/         ← existing portfolio components (evolved)
```

**One content source, three front doors:** MDX file → (a) rendered HTML page, (b) `/d/<slug>.md` plain text, (c) future MCP resource. Author once; never diverges.

---

## Verified technical spec (from bundled Next.js 16 docs — trust over training data)

> Researched against `node_modules/next/dist/docs/`. These differ from older Next.js and MUST be honored.

- **`next.config` must be `.mjs`** for MDX (ESM requirement for remark/rehype plugins). The repo currently ships `next.config.ts` → **migrate to `next.config.mjs`** when wiring MDX. (Step 2)
- **`mdx-components.tsx` at project root is REQUIRED** with `@next/mdx` + App Router. Without it MDX won't work. (Step 2)
- **`params` is a `Promise` everywhere** (pages, `route.ts` handlers, `generateMetadata`, `generateSitemaps`) and must be `await`ed. Client Components use React `use(params)`. v16 enforces this. (Steps 2, 4, 6)
- **Route Handler `GET` is NOT cached by default** (since v15 RC). For static one-drop endpoints add `export const dynamic = 'force-static'` so `/d/[slug]` and `/llms.txt` are prerendered. (Step 4)
- **Return raw markdown** via `new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })`. (Step 4)
- **`sitemap.ts` → `MetadataRoute.Sitemap`**, **`robots.ts` → `MetadataRoute.Robots`**; both cached by default. (Step 6)
- **`generateStaticParams`** for `[...slug]` returns `{ slug: string[] }[]`; runs at build, not on revalidate. (Step 2)
- **`middleware` is deprecated → use `proxy`** in v16. Relevant to the security handbook page (don't teach the deprecated name). (Step 5)
- **Server Components only** for `generateMetadata`; can't export both static `metadata` and `generateMetadata` from one segment. (Step 2)
- MDX page metadata is a JS `export const metadata`, not YAML frontmatter, when a file IS a page. Our docs use a registry that parses frontmatter from `content/docs/*.mdx` instead (frontmatter lives in the file, registry reads it). (Step 2)

## Verified UI/UX spec (anti-slop — researched against real docs sites)

> Sourced from Nextra, Fumadocs, Vercel/Next.js docs, Tailwind, Stripe, Supabase, Mintlify, llmstxt.org, Awwwards.

- **Docs layout = three zones:** left nav sidebar (240-280px, collapsible), center prose column capped at **65-68ch** (`max-w-prose`), right TOC rail with scroll-spy active state (clerk-style moving thumb). Full-width prose is the #1 templated tell.
- **One global navbar, lit mode-switch:** wordmark left, `WORK` / `HANDBOOK` switch with red underline/glow on the active surface, utility cluster right (search, theme, GitHub). Portfolio has NO sidebar (scroll-driven); docs HAS the sidebar. Sidebar presence itself is the "you are in the handbook" signal. Do not swap whole navbars on route change.
- **Red is an ACCENT, not a flood.** Near-black base (`~#0B0B0C`, not pure black), neutral readable body text, red reserved for: copy button, active tab underline, line-highlight bar, prompt caret, focus rings, verified badge. A monochrome-red UI reads as find-replace branding (slop).
- **Type = three roles:** condensed all-caps for DISPLAY only (H1/H2, labels, nav) with +0.02-0.05em tracking; a neutral readable humanist sans (or serif) for body at 16-18px / line-height ~1.65 / 65-68ch; one monospace for code + terminal motifs. Customize Tailwind `prose` (headings, links, hr, blockquote, code) — never ship raw `prose`.
- **Code blocks = Shiki (build-time, zero runtime JS)** + rehype-pretty-code: header bar with filename/lang label left + ALWAYS-VISIBLE copy button right (+ "Copied" state), tab strip for npm/pnpm/bun or multi-file, line highlight + diff markers (`// [!code highlight]`, `[!code ++]`). Bespoke near-black theme, neutral token palette, red only in chrome. ≥7:1 contrast on code.
- **One-drop UX (match Vercel/Mintlify/Fumadocs exactly):** per-page split button top-right of prose column: primary `COPY AS MARKDOWN`, dropdown for "View as Markdown" (`.md` URL), "Open in ChatGPT", "Open in Claude" (prefilled `?q=` deep links). `.md` URL twins + content negotiation (serve markdown when `Accept: text/markdown`). Keyboard shortcut to copy page as md.
- **`llms.txt` spec (implement exactly, per llmstxt.org):** `# H1` (site name, required) → `> blockquote` summary → optional prose → `## H2` sections each a list of `[name](url): note` → a `## Optional` section (skippable for shorter context). ALSO expose `/llms-full.txt` (whole handbook concatenated). Generate from the registry so it never drifts. → **add to Step 4.**
- **Search:** add Pagefind (static, no key, no backend) behind `Cmd/Ctrl+K` ONLY once the handbook crosses ~15-20 pages. Below that, sidebar + TOC suffices; an empty search box is a slop tell. → **deferred task, gated on page count.**
- **Anti-slop checklist (enforce in review):** no full-width prose, no raw `prose`, no everything-red, no hover-only/mystery copy buttons, no sidebar/search on a tiny site, no two-surfaces-without-orientation, no condensed caps in body, no centered template hero ("Hi I'm X" + 3 feature cards), no decorative-but-dead terminal (if terminal motif is used it must DO something — the Cmd+K palette, the copy-as-md), no dumped `llms.txt`.

---

## Dependency graph

```
Step 0  Foundation: remote + gh + deploy baseline ─┐
Step 1  Branding & design-token evolution ─────────┤
                                                    ├─→ Step 2  MDX docs engine + registry
Step 1 ───────────────────────────────────────────→ Step 3  Portfolio content + imagery (parallel w/ 2)
Step 2 ─→ Step 4  One-drop endpoint + llms.txt + CopyForAI
Step 2 ─→ Step 5  Handbook content authoring (fact-checked)  ← gated on Selwyn brain-dump
Step 4, Step 5 ─→ Step 6  SEO + analytics + AdSense (incl. handbook's own subject matter, dogfooded)
Step 2,3,4 ─→ Step 7  Testing + CI
Step 7 ─→ Step 8  Performance budget + accessibility AA
Step 8 ─→ Step 9  Deploy pipeline + custom domain + final QA
(later) Step 10 MCP server side quest (wraps Step 4/5 content)
```

**Parallelizable:** Step 2 ∥ Step 3 (different files: docs engine vs. portfolio data). Step 5 content pages can be authored in parallel batches once Step 2 lands.

**Serial chokepoints:** Step 2 (engine) gates 4 & 5. Step 5 (content) is gated on Selwyn's brain-dump — the human-input critical path; start the brain-dump early.

---

## Invariants (verified after EVERY step)

1. `npx tsc --noEmit` passes (no type errors).
2. `npm run lint` passes (incl. React Compiler rules — no sync `setState` in effect bodies).
3. `npm run build` succeeds.
4. No secrets in client bundles; `RESEND_API_KEY` and any analytics IDs read server-side or via documented public env only.
5. Server Components remain the default; `"use client"` added only where interactivity demands.
6. No CMS/DB dependency introduced.
7. **No handbook page is marked `verified: true` without a cited source** (bundled Next.js docs or a linked authority) **and Selwyn's sign-off.**
8. Existing design tokens are extended, not duplicated/forked.

---

# Steps

> Each step is **self-contained**: a fresh agent can execute it cold from the context brief without
> reading other steps. Verify all invariants after each step. Commit at each step's exit.

---

## Step 0 — Foundation: remote, tooling, deploy baseline
**Model:** default · **Depends on:** none · **Parallel:** no · **Rollback:** none (additive/config only)

**Context brief.** The repo is local-only: `git` is present, but `gh` CLI and a git remote are absent, and nothing is deployed. Before building features, establish the pipeline so later steps can deploy and (optionally) use PR/CI. The existing branch is `feat/portfolio-site`; local default branch is `master` (no `main` yet).

**Tasks.**
- [ ] Decide hosting target: **Vercel** (assumed — matches Next.js, existing README references). Confirm with Selwyn.
- [ ] Create a GitHub repo and add it as `origin`. Install `gh` CLI (optional but unlocks PR/CI workflow). *Requires Selwyn — interactive auth.* Suggest he run `! gh auth login` in-session.
- [ ] Normalize default branch to `main` (rename `master` → `main`, or create `main`) to match conventions and README.
- [ ] Connect repo to Vercel (Selwyn does the import); confirm a baseline build deploys (current placeholder site is fine).
- [ ] Confirm `.env.local` is git-ignored and `.env.example` stays committed.

**Verification.** `git remote -v` shows origin; a Vercel preview URL builds green from the current branch.
**Exit criteria.** Repo pushed; one successful remote deploy of the *current* site exists as a baseline.
**Note.** If Selwyn defers hosting, mark Step 0 PARTIAL (push to remote only) and proceed; Step 9 will revisit.

---

## Step 1 — Branding & design-token evolution
**Model:** strongest · **Depends on:** none · **Parallel:** with Step 0 · **Rollback:** revert `globals.css` + token files

**Context brief.** The site has a monochrome "editorial × technical" system in `app/globals.css` (`@theme inline` + CSS vars: palette, type scale, soft-shadow depth, dot-grid/glow, reveal/marquee keyframes; light default + dark via `prefers-color-scheme`). Goal: give the brand a **deliberate identity** that scales across BOTH surfaces (portfolio + docs) without forking tokens. Use the `ecc:frontend-design` and `ecc:design-system` skills for direction.

**Tasks.**
- [ ] Define the brand: name/wordmark treatment, an **accent color** (currently pure monochrome — introduce ONE signature accent for links, focus rings, "verified" badges, code highlights), and a docs-vs-portfolio visual relationship (same brand, docs slightly more utilitarian).
- [ ] Extend tokens in `globals.css`: accent scale, docs-specific spacing/measure (readable line length for prose), code-block theme tokens. Keep light/dark.
- [ ] Create a real **favicon + logo/wordmark** (replace stock Next.js SVGs in `public/`). Add an OG image generator (`app/opengraph-image.tsx`) using the brand.
- [ ] Document the brand decisions in a short `docs/CODEMAPS/brand.md` or comment block so future steps stay consistent.

**Verification.** Build green; toggle dark mode; accent appears consistently; no duplicated token definitions.
**Exit criteria.** A documented brand system both surfaces can consume. Logo/favicon/OG image shipped.

---

## Step 2 — MDX docs engine + registry  ⟵ chokepoint
**Model:** strongest · **Depends on:** Step 1 (tokens) · **Parallel:** with Step 3 · **Rollback:** remove `app/docs/`, `content/docs/`, `lib/docs/`, MDX deps

**Context brief.** Add an in-repo MDX documentation system. This is the single source of truth feeding the rendered docs, the one-drop endpoint (Step 4), and a future MCP server. **Read the bundled Next.js 16 docs first** (`node_modules/next/dist/docs/01-app/`) for the *current* App Router conventions on MDX, dynamic routes, and metadata — this is a non-standard Next 16 build; do not assume training-data APIs. Per `AGENTS.md`.

**Tasks.**
- [ ] Add MDX support per the bundled Next 16 docs (likely `@next/mdx` + `next.config.ts` `pageExtensions`, or a content-collection approach — **verify against the bundled docs**, not memory).
- [ ] `content/docs/*.mdx` with frontmatter: `title`, `slug`, `summary`, `order`, `section`, `verified` (bool), `sources` (string[]), `updated`.
- [ ] `lib/docs/registry.ts`: read frontmatter, build ordered slug map, expose `getDoc(slug)`, `getAllDocs()`, `getRawMarkdown(slug)`. Typed.
- [ ] `app/docs/layout.tsx` (sidebar nav from registry + on-page TOC), `app/docs/page.tsx` (index), `app/docs/[...slug]/page.tsx` (renders MDX; `generateStaticParams` + per-doc `generateMetadata`).
- [ ] `components/docs/`: `Sidebar`, `Toc`, `Callout`, `CodeBlock` (with copy button), `VerifiedBadge` (shows `verified` + sources).
- [ ] Seed **3 demo pages** (`getting-started`, `project-setup`, `security`) — short, real, fact-checked — to prove the engine. Full authoring is Step 5.

**Verification.** `/docs` lists pages; a page renders with TOC + sidebar; `generateStaticParams` builds all slugs; build green; tsc/lint clean.
**Exit criteria.** Navigable handbook shell with 3 real pages; registry is the single content source.

---

## Step 3 — Portfolio content + imagery (real, verified-with-Selwyn)
**Model:** default · **Depends on:** Step 1 · **Parallel:** with Step 2 · **Rollback:** revert `lib/content/*` + image assets

**Context brief.** Portfolio data in `lib/content/` (`profile.ts`, `projects.ts`, `experience.ts`) is ALL placeholder. Replace with Selwyn's real material. Design system is stable — **only data files + image assets change**, not components (per HANDOFF). Imagery is the biggest untapped quality lever.

**Tasks.**
- [ ] Collect from Selwyn: real projects (3–6, outcome-first descriptions), real roles/skills, **real certifications** (names/issuers/years + verification URLs — the security claim must be provable), confirmed About origin story, location, résumé PDF.
- [ ] Replace placeholders; set the strongest project `featured: true`.
- [ ] Add project imagery: extend `Project` type + cards with optional `image`; add screenshots/thumbnails to `public/`. Add profile photo if desired.
- [ ] Drop `resume.pdf` in `public/`; set `profile.resumeUrl`.
- [ ] Update JSON-LD `Person` + any hardcoded `selwynuy.dev` once the real domain is known (coordinate with Step 9).

**Verification.** No "Replace Me" strings remain; images optimized via `next/image`; build green.
**Exit criteria.** Portfolio shows only real, Selwyn-approved content. **Gate: Selwyn confirms every factual claim.**

---

## Step 4 — One-drop endpoint + llms.txt + CopyForAI  ⟵ STAR FEATURE
**Model:** strongest · **Depends on:** Step 2 · **Parallel:** no · **Rollback:** remove `app/d/`, `app/llms.txt/`, CopyForAI component

**Context brief.** The differentiator. Every handbook section must be fetchable as clean plain-text/markdown so a user can paste a one-line prompt to their AI and have it pull THAT section back and apply it. Convention: `llms.txt` (a discoverable index for AI agents) + per-section raw markdown routes. **Check the bundled Next 16 docs** for Route Handler conventions (`route.ts`, `Response`, caching/`revalidate`, content-type) before implementing.

**Tasks.**
- [ ] `app/d/[slug]/route.ts`: returns `getRawMarkdown(slug)` with `Content-Type: text/markdown; charset=utf-8`. Strips JSX/imports so output is portable plain markdown. 404 for unknown slug. Cache headers per bundled-docs guidance.
- [ ] `app/llms.txt/route.ts`: emits the `llms.txt`-format index (site description + a linked list of every section's `/d/<slug>.md` URL with one-line summaries). Generated from the registry so it never drifts.
- [ ] `components/docs/CopyForAI`: a button on every doc page that copies a ready-made prompt, e.g. `Apply Selwyn Uy's Next.js <topic> setup to my project: <absolute-url>/d/<slug>.md`. Uses the site's canonical URL.
- [ ] A short `/docs` explainer: "Use these docs with your AI" — how the one-drop works, with the `llms.txt` link.
- [ ] **Security review** (`ecc:security-review`): these are public read-only endpoints — confirm no path traversal via slug, no info leak, safe caching, rate-limit consideration. On-brand to get this right.

**Verification.** `curl /d/security.md` returns clean markdown; `/llms.txt` lists all sections; CopyForAI copies a working prompt; an actual AI fetch of the URL returns usable content. Security review passes.
**Exit criteria.** Any section is one-drop ingestible by an external AI. Index auto-generated. Endpoints reviewed.

---

## Step 5 — Handbook content authoring (fact-checked, Selwyn-signed)
**Model:** strongest (research-heavy) · **Depends on:** Step 2 · **Parallel:** batches · **Rollback:** revert affected `.mdx`

**Context brief.** The substance. Author the real handbook pages from Selwyn's brain-dump, **fact-checked against the bundled Next.js 16 docs** (`node_modules/next/dist/docs/`) and linked authorities. **Workflow is the seed; facts are the filter** — where Selwyn's habit is outdated/wrong, flag it, cite the correct current practice, and reconcile with him before publishing. Each page carries `verified` + `sources` frontmatter; `verified: true` requires a citation AND Selwyn's sign-off.

**Section list (confirmed with Selwyn — includes integrations + ready-made templates).**
- [ ] **Getting started** — opinionated project bootstrap from scratch (create-next-app flags, folder structure, TS config, the "why").
- [ ] **Project setup & conventions** — Server Components default, data fetching, env handling, file structure rules.
- [ ] **Security (flagship)** — secure-by-default: input validation, authn/authz, least privilege, secrets never on client, headers/CSP, common Next.js footguns. This page must be airtight — it's the brand.
- [ ] **Supabase setup** — wiring Supabase into Next.js: client/server clients, auth, RLS (least-privilege, on-brand), env handling, server-only access patterns.
- [ ] **Email with Resend** — transactional email setup, server-only API key, the contact-form pattern this very site uses (dogfood).
- [ ] **Ready-made email templates** — copy-paste email templates (welcome, contact-reply, magic-link, notification). These are prime **one-drop** payloads — droppable straight into a user's project.
- [ ] **SEO** — metadata API, `sitemap.ts`/`robots.ts`, JSON-LD, OG images, canonical URLs.
- [ ] **Analytics** — Google Analytics (GA4) setup in App Router (script strategy, consent, Server Components caveats).
- [ ] **Monetization (teach-only)** — Google AdSense setup (script placement, policy/consent realities, what NOT to do). **Documented, NOT wired onto this site** — Selwyn applies later.
- [ ] **Deployment** — Vercel + env vars + preview/prod, plus the perf/a11y gates.
- [ ] *(stretch)* **Testing**, **Performance**, **Accessibility** — can mirror what this very project does (dogfooding).

> **Authoring direction:** topic by topic. For each section the agent provides a **direction/outline prompt** ("here's the skeleton + the questions I need answered"), Selwyn fills in his real approach, then it's fact-checked and signed off. Start with **Security** (flagship).

**Process per page.**
1. Selwyn brain-dumps the topic. 2. Draft in his voice. 3. Fact-check each claim vs bundled docs/authority; insert `sources`. 4. Flag conflicts → reconcile. 5. Selwyn signs off → `verified: true`. 6. Verify it also renders + one-drops cleanly.

**Verification.** Each published page has ≥1 source and Selwyn sign-off; no `verified: true` without citation; pages render and one-drop correctly.
**Exit criteria.** Core sections (getting-started, project-setup, security, SEO, analytics, AdSense, deployment) published & verified. **Hard human gate.**

---

## Step 6 — SEO, analytics & AdSense (dogfood the handbook's own advice)
**Model:** default · **Depends on:** Steps 4 & 5 · **Parallel:** no · **Rollback:** remove analytics scripts/config

**Context brief.** Implement on THIS site exactly the SEO/analytics/AdSense practices the handbook teaches — so the docs are demonstrably true and the site itself is discoverable and (optionally) monetized. Cross-link: each implemented feature links to its handbook page ("see how this is built").

**Tasks.**
- [ ] Extend `sitemap.ts` to include all docs slugs + `/llms.txt`. Confirm `robots.ts` allows `/d/` and `/llms.txt` for AI crawlers.
- [ ] Per-page metadata + canonical URLs for docs (`generateMetadata`).
- [ ] GA4 via the App Router pattern documented in Step 5 (env-driven `NEXT_PUBLIC_GA_ID`; no-op if unset, like the contact form degrades).
- [ ] AdSense integration *only if Selwyn wants ads on a portfolio* — gate behind a decision; if yes, implement per the handbook page; if no, the handbook page still teaches it.
- [ ] JSON-LD: add `TechArticle`/`Article` schema to docs pages; keep `Person` on the portfolio.

**Verification.** GA fires only with ID set; sitemap includes docs; Lighthouse SEO ~100; no client secret leaks.
**Exit criteria.** Site practices what the handbook preaches; analytics opt-in; docs cross-link to live implementations.

---

## Step 7 — Testing + CI
**Model:** default · **Depends on:** Steps 2, 3, 4 · **Parallel:** no · **Rollback:** remove test deps/config + workflow

**Context brief.** There are currently **zero project tests** and no test runner. Add a lean suite focused on the risky/dynamic parts (the one-drop endpoints, the docs registry, content invariants) — not exhaustive UI tests. Use `ecc:e2e-testing` for a couple of smoke journeys. Wire CI if Step 0 added a remote/`gh`.

**Tasks.**
- [ ] Add Vitest (unit) — test `lib/docs/registry.ts` (ordering, unknown slug), the raw-markdown stripping in `/d/[slug]`, and a content invariant ("no `verified: true` without `sources`").
- [ ] Add Playwright smoke (`ecc:e2e-testing`): home loads, `/docs` loads, a doc page renders, CopyForAI copies, `/d/<slug>.md` returns markdown, `/llms.txt` returns the index.
- [ ] Add `test`/`test:e2e` scripts to `package.json`.
- [ ] CI: GitHub Actions running `tsc --noEmit`, `lint`, `build`, `test` on push/PR (only if remote exists; else document the commands for local pre-deploy).

**Verification.** `npm test` green locally; CI green on a push (if enabled).
**Exit criteria.** Risky surfaces covered; the content invariant is enforced by a test, not vibes.

---

## Step 8 — Performance budget + accessibility AA
**Model:** default · **Depends on:** Step 7 · **Parallel:** no · **Rollback:** revert perf/a11y fixes

**Context brief.** Lock quality bars. Use `ecc:benchmark` / a Lighthouse pass for perf; audit for WCAG AA. The marquee, reveal animations, custom focus styles, and color contrast (especially the new accent on monochrome) are the likely a11y risks; doc prose readability + code-block contrast matter too.

**Tasks.**
- [ ] Establish a performance budget (e.g., LCP < 2.0s, CLS < 0.1, JS payload ceiling). Optimize images (`next/image`), fonts, and any client JS. Confirm docs pages are static where possible.
- [ ] Accessibility AA: keyboard nav across portfolio + docs sidebar/TOC, focus-visible everywhere, `prefers-reduced-motion` honored by reveal/marquee, color-contrast for accent + code themes, alt text on imagery, semantic headings in MDX.
- [ ] Add a Lighthouse CI check or a documented manual gate.

**Verification.** Lighthouse: Perf ≥ 90, A11y ≥ 95, Best-Practices/SEO ~100. `prefers-reduced-motion` disables animation. Keyboard-only pass works.
**Exit criteria.** Documented budgets met; AA audit passes; reduced-motion respected.

---

## Step 9 — Deploy pipeline + custom domain + final QA
**Model:** default · **Depends on:** Step 8 · **Parallel:** no · **Rollback:** Vercel instant rollback to prior deploy

**Context brief.** Ship it. Finalize the real domain and replace all `selwynuy.dev` placeholders (or the actual chosen domain) across `layout.tsx`, `robots.ts`, `sitemap.ts`, `page.tsx`, JSON-LD, and the CopyForAI canonical URL. Enable the contact form (Resend).

**Tasks.**
- [ ] Finalize domain; replace every hardcoded placeholder URL (grep for `selwynuy.dev` and `example.com`).
- [ ] Configure Vercel env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_GA_ID`, AdSense IDs (if used), `NEXT_PUBLIC_SITE_URL` (used by CopyForAI/llms.txt).
- [ ] `npm install resend`; verify the contact form sends end-to-end (or keep the graceful 503 if Selwyn defers).
- [ ] Merge `feat/portfolio-site` → `main`; production deploy.
- [ ] Final QA: responsive sweep, real-device check, verify one-drop works from an actual external AI against the LIVE URL, confirm `llms.txt` is reachable in prod.

**Verification.** Live domain serves both surfaces; contact form sends; an external AI successfully ingests a `/d/<slug>.md` from production.
**Exit criteria.** Public, on a real domain, contact working, one-drop verified live. **This is the shippable milestone.**

---

## Step 10 — MCP server side quest (LATER — the engineering flex)
**Model:** strongest · **Depends on:** Steps 4 & 5 stable · **Parallel:** independent · **Rollback:** remove MCP server (site unaffected)

**Context brief.** Wrap the SAME `content/docs/*.mdx` registry behind a real **MCP server** so users can add `selwyn-nextjs-docs` to their AI client once and pull any section by name as an MCP resource/tool — no copy-paste. Use `ecc:mcp-server-patterns`. The site's markdown endpoints already prove the content contract; this is purely an additive front door. Decide hosting (e.g., a small serverless MCP endpoint) and document setup on a handbook page (dogfood again: "here's how I built the MCP server you're using").

**Tasks (outline — detail when scheduled).**
- [ ] MCP server exposing `list_sections` + `get_section(slug)` reading the shared registry.
- [ ] Host it; document the one-time client config.
- [ ] Handbook page explaining the MCP build (turns the flex into more content).

**Exit criteria.** Users can consume the handbook via MCP; the site remains the single content source.

---

## Resolved decisions
1. ✅ **Hosting** — Vercel.
2. ⏳ **Domain** — Selwyn replaces `selwynuy.dev` later → **deferred to dev backlog** (Step 9 picks it up).
3. ✅ **Accent color** — **red** (matches existing brand). See Brand reference.
4. ✅ **AdSense** — **teach-only**; Selwyn applies later. Do not wire live ads.
5. ✅ **Section list** — confirmed + Supabase, Resend, ready-made email templates added (Step 5).
6. ✅ **Brain-dump** — topic by topic, agent gives direction per topic (Step 5).
7. ✅ **Profile photo** — placeholder for now (Step 3).

## Dev backlog (deferred — revisit at the noted step)
- [ ] **Buy/choose real domain** and replace ALL placeholders (`selwynuy.dev`, `example.com`) across `layout.tsx`, `robots.ts`, `sitemap.ts`, `page.tsx`, JSON-LD, CopyForAI canonical URL, `NEXT_PUBLIC_SITE_URL`. → **Step 9**
- [ ] **Apply for Google AdSense**, then (optionally, separately) decide whether to actually place ads. Handbook page is teach-only regardless. → post-launch
- [ ] **Real profile photo** to replace placeholder. → post-Step 3
- [ ] **Install `gh` CLI** to unlock PR/CI workflow (currently direct mode). → Step 0 / Step 7

## First-session recommendation
Run **Step 0 (push to a remote — backup first)** + **Step 1 (branding)** + kick off the **Step 5 brain-dump** in parallel,
since content is the long human-dependent path. Step 2 (engine) can start as soon as Step 1's tokens are drafted.
