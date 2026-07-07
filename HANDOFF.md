# Handoff, Portfolio + Next.js Handbook

_Last updated: 2026-07-07_

## TL;DR

Two surfaces under one brand: a developer portfolio and a fact-checked **Next.js Handbook** with one-drop AI ingestion. The project now has a sharpened north star: the handbook is Selwyn's **AI Operating Manual**, the single source of truth so a fresh AI can hear "read my handbook and let's build X" and know his whole process. The new flagship work toward that is the **AI-native handbook** (routing, workflows, discovery/PRD process docs), plus a new **Skills marketplace** (`/skills`) that packages his process as installable Claude Code skills, started 2026-07-07.

- **Current branch:** `feat/ai-native-handbook`, stacked on the unmerged `feat/handbook-usage-and-anti-slop` (1 commit, `53ad011`). Today's work is **uncommitted** on it: `plans/ai-native-handbook.md`, `content/docs/discovery.mdx`, `content/docs/prd.mdx`, this file.
- **`main`** is 2 commits ahead of `origin/main`. Nothing recent is pushed; Selwyn pushes/merges manually.
- **Brand:** red (`#e30613`) on near-black, dark-first, condensed all-caps display.

## The goal (agreed 2026-07-06)

The handbook is the primary long-term investment: an AI Operating Manual, structured for AI consumption, human-readable second. Editorial filter for every addition: "will this help an AI collaborate with me better while requiring fewer repeated prompts?" Success metric: a fresh AI, after reading the handbook, produces work matching how Selwyn thinks/plans/builds, needing only project-specific input.

## Skills marketplace (new direction, 2026-07-07)

New flagship feature: a **Skills marketplace** at `/skills` that packages Selwyn's process as installable **Claude Code Skills**. This is the answer to the hard truth in the research below: passive "an agent stumbles onto my `/llms.txt`" discovery is effectively dead, but the Claude Code plugin/skill install channel is a *deliberate, git-based* path agents actually use. The marketplace converts the handbook from "a static file I hope gets read" into "an installable capability someone actively pulls into their agent."

Decisions made (proceed-within-steps; revisit if wrong):

- **Card UI direction: B, "app-store card on a terminal skin."** App-store *information architecture* (icon tile, type label, name, verified/phases meta, description, needs chips, payload stat row, install + SKILL.md actions) rendered in the existing brand (poster red, Archivo condensed caps, Geist Mono, red glow, dot-grid). Not generic SaaS cards. A two-direction mockup (terminal registry vs app-store card) was built in the real tokens to choose from.
- **Skills live in the SAME repo** (`/skills/<name>/SKILL.md` + a `marketplace.json` at repo root), not a separate `selwyn-skills` repo. One source of truth; the registry generates both the human cards and can generate the skill files. "Git IS the database."
- **Architecture split (critical):** the `/skills` *page* on the site is the **storefront** (humans browse cards, copy the one-line install command). The **git repo** (`/skills/` + `marketplace.json`) is the **warehouse** Claude Code actually installs from. Same source data drives both.

### How Claude Code Skills actually work (verified via claude-code-guide, July 2026)

Do NOT design from training-data memory here; this is version-accurate as of the check.

- **`SKILL.md` frontmatter:** all fields optional; `description` is the load-bearing one (it is the activation/routing signal, matched against description text ONLY, not the body). `description` + `when_to_use` are capped at **1,536 chars** combined in the skill listing. Other useful fields: `name` (display only, except at plugin root), `allowed-tools`, `disable-model-invocation`, `user-invocable`, `model`, `effort`, `context: fork` + `agent`, `paths` (globs limiting auto-activation), `argument-hint`.
- **Bundle layout:** a skill is a directory whose only required file is `SKILL.md`. Optional `scripts/` (Claude *executes* these via bash), `references/`/`*.md` (loaded on demand when linked as `[ref](ref.md)`), `data/`. In-SKILL variables: `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`. `` !`cmd` `` inlines command output before Claude sees the skill.
- **Install locations (precedence):** enterprise > personal (`~/.claude/skills/<name>/SKILL.md`) > project (`.claude/skills/<name>/SKILL.md`) > plugin. Live-reloaded in-session if the dir existed at start.
- **Distribution is git-based, NOT raw-HTTP.** Skills ship inside **plugins** listed in a **`marketplace.json`**. Users run `/plugin marketplace add <github-owner>/<repo>` then `/plugin install <plugin>@<marketplace>`. Serving a bare `SKILL.md` from `/s/name.md` does NOT make it installable; URL-based marketplaces with relative paths break (only that one file downloads). **Use a GitHub `repo` source, npm, or git URL.** This honors the no-runtime/no-backend constraint perfectly: GitHub is the backend Anthropic already built.
- **Gotchas for auto-generation:** invalid frontmatter YAML is *silently ignored* (skill loads with empty metadata) so generated YAML must be valid; skills can't reference files outside their dir with `../` (not copied to cache) so shared files need symlinks inside the plugin; `/help --debug` surfaces parse errors.

### Research: is anyone else building this? (deep-research, 106 agents, 25 claims verified 0 refuted, 2026-07-07)

Verdict: **the individual ingredients all exist and have names; Selwyn's exact fusion does not exist anywhere the research found.** Novelty is in the *combination*, not any one primitive.

Closest prior art (know these names):

- **Nathaniel Whittemore, `personal-context-portfolio`** (host of The AI Daily Brief): literally calls itself "an operating manual for any AI that works for you," same reduce-repeated-prompts goal. BUT: 10 markdown files read top-to-bottom (no routing/triggers), delivered at **runtime via MCP** (not static), and it is an identity/context package, not a "how I think/plan/build" methodology. This is the nearest match to the *framing*.
- **`Me.md` (getmemd.com):** a "personal README for AI" (a bio/preferences card), no routing, not a build methodology.
- **The "manager README / how to work with me" genre** (e.g. `DenizOkcu/Leadership`): established but 100% human-facing, zero AI affordances. Selwyn is porting this human genre into agent-facing territory.

Established terminology (adopt this vocabulary on the site):

| Selwyn built | The world calls it | Origin |
| --- | --- | --- |
| `/llms.txt`, `/llms-full.txt` | **llms.txt standard** | Jeremy Howard, Answer.AI, Sept 3 2024 |
| `/claude.md` split from human pages | **AGENTS.md / "README for agents"** | OpenAI+Google+Cursor, Aug 2025, now Linux Foundation's Agentic AI Foundation |
| per-doc frontmatter that triggers on a `description` | **Agent Skills / progressive disclosure** | Anthropic, Oct 2025 |
| `WHEN task X: fetch /d/y.md` routing | **mcpdoc "global rule" routing** | LangChain, Mar 2025 (but runtime via MCP, not static) |

**Where the novelty concentrates:** taking mcpdoc-style WHEN-routing OUT of an MCP runtime and baking it STATICALLY into a PERSONAL "how I think/plan/build" operating manual served like llms.txt/AGENTS.md. No single artifact combines static + no-runtime + personal + WHEN-routing + workflows.

**Hard truth to stay clear-eyed about:** llms.txt is barely consumed in practice (Google's John Mueller: "no AI system currently uses llms.txt"; ~97% of valid-llms.txt domains got zero agent requests, May 2026). The handbook does NOT win on passive discovery. It wins on the *deliberate handoff* ("read my handbook, let's build X") and on the **skill-install channel** (which agents do use). That is why the skills marketplace is the right next move, not a side quest.

**Opportunity flagged:** there is no established name for "declarative WHEN->fetch routing tables baked into static docs." mcpdoc does it at runtime; Selwyn does it statically. A term he could coin and own on the site.

## What changed today (2026-07-06, uncommitted)

1. **Plan: `plans/ai-native-handbook.md`** — the design for "AI-native operating manual with autonomous navigation, workflow routing, and contextual page discovery," de-slopped into three concrete artifacts:
   - Routing metadata: per-doc `when:` triggers + `requires:` in frontmatter, validated in the registry, emitted into `/llms.txt` and a routing table in `/claude.md` (WHEN task X: fetch /d/y.md).
   - Workflows: `lib/docs/workflows.ts` + `/w/<name>.md` one-drop routes; ordered phases pointing at doc slugs. Flagship is `start-new-project`: Validate (AI researches market, honest build/reshape/kill verdict as a gate) -> Discover (seed questions + AI follow-ups) -> PRD (draft with `[OPEN]` markers, loop until zero, explicit sign-off) -> Build.
   - Discovery = a good manifest, NOT a search API. Hard constraint: no runtime AI on the site, static only; the consumer LLM does the matching. The inline rule dump in `/claude.md` stays (non-browsing AIs cannot fetch links).
2. **Two new handbook pages, drafted and live in the build** (`verified: false`, Start Here):
   - `content/docs/discovery.mdx` (order 6) — "Project Discovery": stage 1 idea validation (AI researches competitors/pricing/demand FIRST, then gives an honest verdict), stage 2 seed questions grouped by the PRD section they feed, and the questioning protocol (batches of 3-4, force concrete answers, stop when guesses run out).
   - `content/docs/prd.mdx` (order 7) — "The PRD": 11 sections (incl. architecture decisions: App Router structure, src/ layout, data, auth, hosting, each with a why), a copyable `PRD.md` template with `[OPEN]` gap markers, definition of done, and AI-drives/human-decides rules.
   - Both pages' `WHEN ...:` RuleCards flow into the generated `/claude.md` automatically (now ~100 directives), so bootstrapped projects already inherit the discovery/PRD behavior.
3. **HANDOFF.md** refreshed earlier today for the pre-existing state, then again now.

Previous branch's work (committed as `53ad011`, still unmerged): How to Use doc, Decisions and Defaults doc + 111-row `lib/docs/decisions.ts`, anti-slop ruleset (`lib/docs/anti-slop.ts`) injected into `/claude.md`. See that commit's message and `plans/ai-native-handbook.md` for context.

## Verification status (checked today)

- `typecheck`, `check:content` (em-dash guard), `test` (20 passing), `build` (43 doc pages) all green.
- Rendered output verified against a running production server, not just the build: `/d/discovery.md` and `/d/prd.md` flatten cleanly (no leaked JSX, template fence intact), `/llms.txt` lists both as drafts, `/claude.md` carries the new directives, both HTML pages return 200.
- **Known pre-existing failure:** `npm run lint` errors on `components/docs/launch-checklist.tsx:51` (`react-hooks/set-state-in-effect`). Predates all of this; because `npm run verify` chains lint second, run the other checks individually or fix it first (a lazy `useState` initializer would do it).

## What is NOT done

1. **Selwyn reviews the two draft docs.** They encode HIS process (discovery questions, PRD definition of complete). Once approved, flip to `verified: true` (note: the registry requires a non-empty `sources` array on verified pages; decide what "source" means for first-person process pages).
2. **Phase 1 of the plan: routing metadata** (`when:`/`requires:` frontmatter across all ~43 docs + registry validation + llms.txt/claude.md emission). Not started.
3. **Phase 2: workflows module** (`lib/docs/workflows.ts`, `/w/` route, tests). Ship first with the 3 workflows whose pages all exist (`add-auth`, `pre-launch`, `write-content`); `start-new-project` enables once its docs are signed off.
4. **`working-with-me.mdx`** — the collaboration rules doc (proceed within steps, verify rendered output not just builds, UI bar). Flagged as the highest-leverage single page; not started.
5. **Merge/push decision** — two stacked unmerged branches now; Selwyn's call.
6. Carried over: sign off remaining draft pages, profile photo, Google OAuth consent-screen branding (custom Supabase auth domain + Cloud Console), confirm Vercel prod env vars (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL=contact@selwynuy.dev`).

## How to resume

```bash
git checkout feat/ai-native-handbook   # today's work is UNCOMMITTED here; check git status first
npm install
npm run dev
npm run typecheck && npm run check:content && npm run test && npm run build   # skip chained verify until the lint fix
```

The working plan: `plans/ai-native-handbook.md` (design, build order, open questions). Older plans: `plans/portfolio-nextjs-handbook.md`, `plans/handbook-depth.md`, `plans/copy-for-ai-playbook.md`.

## Gotchas (still current, Next.js 16)

- Read the bundled Next.js 16 docs before framework changes (`node_modules/next/dist/docs/`, per `AGENTS.md`) — this version has breaking changes vs. training data.
- **No em-dashes in source.** The content guard blocks them. YAML frontmatter: avoid a quote-then-colon combo in `summary:` (it breaks the parser).
- New MDX components that should appear in `/d/*.md` and `/llms-full.txt` need a flatten case in `lib/docs/registry.ts` `toPlainMarkdown()`, or they render as dead tags. Authoring pattern that needs NO new code: `<RuleCard trigger="..." rule="...">` becomes a `- WHEN ...:` directive and is auto-extracted into `/claude.md`; `<Rule>`/`<Rule type="dont">` become `> Do:`/`> Don't:` and are extracted too.
- A runtime dependency used in a route must be a normal import, not a `webpackIgnore` dynamic import, or Vercel will not bundle it.
- Server Components by default; defer `setState` out of effect bodies (React Compiler lint) — see the one known exception above.
- `.env.local` is gitignored; real config (Resend key, from-address) lives there and in Vercel, never in committed files.
