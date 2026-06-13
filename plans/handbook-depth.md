# Plan — Handbook Depth (tutorials, rules, branding track)

> **Problem.** The handbook engine is excellent but the content is thin: ~5,600 words
> across 13 pages (~430 words each, one code block apiece). It reads as reference
> snippets, not something a developer learns from or returns to. No step-by-step
> tutorials, no opinionated rules, and the "personalize your brand" track Selwyn
> asked for does not exist at all. Thin content does not earn the "drop into your AI
> and build" promise.

## Decisions locked (from Selwyn)
- **Format:** step-by-step tutorials. Prerequisites, numbered steps with full runnable
  code, checkpoints, a "you now have X" outcome, and a Next link. Hybrid rule callouts
  are welcome inside the tutorial spine.
- **Branding:** a full design-system track, taught as the repeatable method behind this
  very site (palette + accent, type roles, tokens, dark/light, components from tokens).
- **Authoring:** draft everything now (verified where citable against bundled Next 16
  docs, draft where it is opinion), Selwyn refines later.

## Strategy: build the components first, then author into them

A tutorial format needs components the MDX system does not have yet. Build a small,
reusable set (registered globally so authors do not import per file), then author every
page into that structure. This also makes every page visually richer, which fixes the
"just a page with thin text" feel even before word count grows.

### Phase A — Tutorial component kit (in `mdx-components.tsx` + `components/docs/`)
- [ ] `<Steps>` / `<Step title n>` — numbered vertical stepper with a connecting spine
      (mirrors the portfolio experience timeline; brand-consistent red index markers).
- [ ] `<Prereqs>` — a boxed checklist at the top of a tutorial (what you need first).
- [ ] `<Outcome>` — a "you now have X" success box at the end of a tutorial.
- [ ] `<Rule type="do|dont">` — pull-out rule callout (red accent, memorable).
- [ ] `<Callout type="note|warn|tip|security">` — info/warning/tip/security asides.
- [ ] `<Compare>` with `<Bad>` / `<Good>` — wrong-way/right-way code pairs.
- [ ] `<NextStep href>` — the "continue to ___" footer link (complements the auto pager).
- Register all globally in `mdx-components.tsx`. Verify a sample renders before authoring.

### Phase B — Restructure existing pages into tutorials (deep rewrite)
Rewrite each existing page from reference into a real tutorial with the new components.
Target depth: roughly 900-1,500 words + 3-6 runnable code blocks + rules + checkpoints.
Fact-check every framework claim against `node_modules/next/dist/docs/`. Keep `verified`
honest: cite sources for framework claims; opinion/integration stays draft for sign-off.

- [ ] getting-started, project-setup (Foundations)
- [ ] environment-and-secrets, security, content-security-policy, data-security (Security)
- [ ] supabase-setup, email-with-resend, email-templates (Integrations)
- [ ] seo, analytics, monetization-adsense (Growth)
- [ ] deployment (Ship)

### Phase C — NEW: Branding / design-system track (the missing piece)
A multi-page track that teaches what we did to THIS site as a repeatable method. New
section in the registry: **"Design"** (insert in SECTION_ORDER between Foundations and
Security, or as its own track). Pages:
- [ ] `branding-overview` — the philosophy: one accent, restraint, why it reads as
      "designed" not templated. Links into the track.
- [ ] `choose-your-palette` — picking a base + ONE accent, near-black vs pure black,
      contrast, the "accent not a flood" rule.
- [ ] `type-system` — display vs body vs mono, condensed for headlines only, pairing,
      `next/font` setup, the letter-spacing/measure details.
- [ ] `design-tokens` — CSS variables + Tailwind v4 `@theme inline`, semantic naming,
      step-by-step from blank `globals.css` to a working token set.
- [ ] `dark-and-light` — dark-first with `prefers-color-scheme`, the explicit override
      toggle, the `:not([data-theme])` guard, no-flash inline script.
- [ ] `components-from-tokens` — building a button, card, and callout purely from tokens
      so the brand stays consistent. Ends with "now your starter is yours."

### Phase D — Getting-started becomes a true zero-to-deployed spine
- [ ] Make `getting-started` the anchor tutorial that links out to every track
      (setup -> security -> branding -> integrations -> ship), so a newcomer has one
      obvious path. Add a short "How to use this handbook" intro on `/docs`.

## Invariants (unchanged, still enforced)
1. `npm run verify` green (typecheck, lint, content guard, tests, build).
2. No em-dashes anywhere (guard blocks it).
3. `verified: true` only with cited sources (registry fails build otherwise).
4. Every framework claim checked against the bundled Next 16 docs, not training memory.
5. New components are accessible (semantic, keyboard-ok, reduced-motion safe).
6. Rendered-output verification after each phase (curl the dev server), not just build.

## Execution order
A (components) -> B + C authored in parallel via a workflow (independent files) ->
D (wire the spine) -> verify -> commit per phase. New "Design" section added to the
registry in Phase A so Phase C pages have a home.

## Definition of done
- Every page is a tutorial or rules page with the new components, not a text snippet.
- The branding track exists and teaches the method end to end.
- Handbook word count and code-block depth roughly 2-3x current.
- A developer can land on Getting Started and follow one path to a deployed, branded,
  secure Next.js app, dropping any section into their AI along the way.
