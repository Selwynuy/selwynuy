---
name: ai-legibility-audit
description: "Audit whether a site is legible to AI answer engines and coding agents, checking only what is mechanically verifiable, not ranking promises. Use before launch, or when adding AI-facing surfaces, to confirm content is server-rendered so a non-JS crawler sees it, there is one h1 and clean heading hierarchy, JSON-LD is present and valid, a sitemap and freshness dates are consistent, a clean per-page markdown endpoint mirrors the HTML, llms.txt is well-formed, and robots.txt names real AI user-agents. It asserts presence and correctness, never that any of it improves how often you get cited."
---

# AI Legibility Audit

Whether an AI answer engine can read and quote your content is partly in your control and partly not. The part you control is legibility: is the content actually in the HTML a crawler fetches, is it structured, are the machine-readable surfaces present and well-formed. The part you do not control is ranking: whether a given engine cites you, which depends on opaque systems that change on the order of weeks.

This audit checks only the first part. Every check is a boolean about your own site's bytes, backed by a published standard or documented crawler behavior. It never claims that passing a check improves how often you get cited, because that is not verifiable from the site.

## The honesty line, up front

- **In scope (verifiable):** does the file or endpoint exist, return the right status and content type, follow the right shape, and mirror the visible content. Is the content server-rendered. Is the JSON-LD valid. Does robots.txt name real AI user-agents.
- **Out of scope (not verifiable, so not asserted):** that any of this improves citations, visibility, or "gets you into AI answers"; that models read llms.txt at inference; that AI crawlers obey robots.txt. The audit reports presence and correctness, never outcome.

## How to run it

1. **Fetch the raw HTML with JS off.** The single strongest check. Curl a key route (`curl -s <url>`) and confirm the real content, the JSON-LD block, the single `<h1>`, and the `<article>`/`<nav>` structure are all in the returned bytes, not injected after hydration. If the text shows in a browser but is absent from `curl`, a non-JS crawler misses it.
2. **Run the bundled script** over the site or the app tree:
   `node ${CLAUDE_SKILL_DIR}/scripts/scan-ai-legibility.mjs <url-or-app-dir>`
   It checks server-rendered content, one `<h1>` and heading order, JSON-LD presence/validity, a clean markdown endpoint, `llms.txt` shape, `AGENTS.md`, and AI-crawler `robots.txt` rules, and reports each as present, valid, or missing.
3. **Work the surfaces** against `references/ai-legibility-checklist.md`, which pairs each check with the published standard behind it.
4. **Report honestly.** For each surface: present / valid / missing, with the evidence and the standard. State that these verify legibility, not ranking. Do not turn any unproven GEO tactic into a "do this" item.

## What it checks

- **Server-rendered content:** the words are in the initial HTML (RSC/SSR), not hydration-only.
- **Semantic structure:** exactly one `<h1>`, non-skipping headings, real `<article>`/`<nav>`, descriptive links, alt text.
- **JSON-LD:** present, valid, `@type` real, fields match the visible content.
- **Freshness consistency:** `dateModified` in the schema equals the sitemap `lastmod` and the visible date.
- **Clean markdown endpoint:** a `/page.md` (or `/d/<slug>.md`) mirror that is real markdown, not HTML chrome, and matches the page content.
- **llms.txt:** exists and follows the H1 to blockquote to H2-link-list to `## Optional` shape (llmstxt.org). Checked as a well-formed artifact, with the honest caveat that no major engine is documented as consuming it.
- **AGENTS.md:** exists at the repo root and carries real agent instructions.
- **robots.txt:** names real AI user-agents (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) with the intended allow or disallow, and points at the sitemap. Robots is a policy signal, not access control.

## What research suggests, and why this skill stops here

There is real research on generative-engine visibility (the Princeton GEO paper, KDD 2024, found adding citations, statistics, and quotations correlated with higher visibility in a simulated engine). It is a correlational finding on a modeled system from 2023 to 2024, it varies by domain, and answer engines have changed since. This skill deliberately does not turn any of it into an action item, because a repeatable skill that promised a ranking outcome would be manufacturing the exact false confidence the handbook rejects. That layer belongs in a dated reference guide with its hedges intact, not in an executable check.

Read the handbook pages this draws from: https://selwynuy.dev/d/seo.md and https://selwynuy.dev/d/how-to-use.md

## Bundled files

- `scripts/scan-ai-legibility.mjs` (script): fetches routes and checks the mechanical AI-legibility surfaces, reporting presence and validity only.
- `references/ai-legibility-checklist.md` (reference): every checkable surface with its verification and the published standard behind it, plus the dated, hedged note on GEO research.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/ai-legibility-audit
