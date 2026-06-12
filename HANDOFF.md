# Handoff, Portfolio + Next.js Handbook

_Last updated: 2026-06-13_

## TL;DR

The site is reinvented into **two surfaces under one brand**: a developer portfolio and a fact-checked **Next.js Handbook** with a one-drop AI ingestion feature. Build, lint, typecheck, content guard, and tests are all green. The remaining work is **real portfolio content** (needs Selwyn's data), **a real domain**, and **going live**.

- **Branch:** `main` (pushed to `origin`)
- **Brand:** red (`#e30613`) on near-black, dark-first, condensed all-caps display.

## What is done

- **Brand system** (`app/globals.css`): dark-first red-on-near-black, three type roles (condensed Archivo display, Geist body, Geist Mono), light fallback + toggle.
- **MDX docs engine** (`lib/docs/registry.ts`, `app/docs/`): single content source feeding rendered pages, the one-drop endpoints, and a future MCP server. Frontmatter parsed; the verified-requires-sources invariant fails the build if broken.
- **Handbook content:** 13 pages across Foundations, Security, Integrations, Growth, Ship. Framework claims fact-checked against the bundled Next.js 16 docs and marked verified with citations; integration/opinion pages (Supabase, Resend, email templates, AdSense) are drafts awaiting Selwyn's sign-off.
- **One-drop feature:** `/d/<slug>.md`, `/llms.txt`, `/llms-full.txt`, a Copy-for-AI split button (View as Markdown / Open in ChatGPT / Open in Claude).
- **Navigation:** global navbar with a lit WORK/HANDBOOK switch; docs sidebar, breadcrumb, prev/next pager, scroll-spy TOC, Cmd+K search.
- **Code blocks:** Shiki via rehype-pretty-code, branded chrome (filename bar, always-visible copy button, red line-highlight).
- **SEO + analytics:** Metadata, sitemap (includes docs), robots, JSON-LD (Person + TechArticle). GA4 via next/script, env-gated (no-op until `NEXT_PUBLIC_GA_ID` set). AdSense is taught in the handbook only, not wired live.
- **Quality gates:** Vitest suite (registry + the content invariant), GitHub Actions CI, Lighthouse budget, skip link + a11y pass, security headers, and a content guard (no em-dashes / placeholders) wired into prebuild, verify, CI, and a pre-commit hook.
- **Visitor-empathy features:** homepage handbook teaser, theme toggle, search, pager. Added after a role-play audit.
- **Anti-slop review:** an adversarial pass fixed duplicate section numbers, a bad JSON-LD type, TOC anchor matching (rehype-slug), the copy-button position, and added security headers + search a11y.

## What is NOT done (needs Selwyn)

1. **Real portfolio content** (`lib/content/projects.ts`, `experience.ts`, `profile.ts`): still placeholders ("Replace Me"). The guard allow-lists those three files until then; remove the allow-list entries in `scripts/check-content.mjs` once filled. This is the most visible gap.
2. **Sign off the draft handbook pages:** Supabase, Resend, email templates, AdSense, and the Security flagship are `verified: false`. Review, correct against your real workflow, then flip to `verified: true` with sources.
3. **Real domain:** set `NEXT_PUBLIC_SITE_URL` and retire the `selwynuy.dev` placeholder.
4. **Enable the contact form:** `npm install resend`, set `RESEND_API_KEY`. (The dynamic-import obfuscation in `app/api/contact/route.ts` can be simplified to a normal import once installed.)
5. **Deploy to Vercel** and verify the one-drop works from a real external AI against the live URL.
6. **Profile photo + project imagery + resume PDF.**

## How to resume

```bash
git checkout main
npm install
npm run dev
npm run verify   # everything green before shipping
```

Full plan and step status: `plans/portfolio-nextjs-handbook.md`.

## Gotchas

- Read the bundled Next.js 16 docs before framework changes (`node_modules/next/dist/docs/`, per `AGENTS.md`). Notable: `params` is a Promise (await it), `middleware` is renamed `proxy`, route handler GET is uncached by default, MDX config must be `.mjs`, Turbopack plugins are string names.
- No em-dashes in source. The guard will block the commit.
- Server Components by default; defer `setState` out of effect bodies (React Compiler lint).
