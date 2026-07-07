# AI-Native Handbook: navigation, workflow routing, page discovery

_Drafted 2026-07-06. Status: discovery + PRD docs drafted (verified: false, on `feat/ai-native-handbook`); routing metadata and workflows not started. Awaiting Selwyn's sign-off on the doc drafts and the workflow list._

## Goal

Upgrade the handbook from "a library an AI can read" to "an operating manual an AI can navigate." A fresh agent that fetches `/claude.md` should know, without being told:

- which page to read for the task in front of it (navigation),
- what sequence of pages and actions a common job requires (workflow routing),
- what exists at all, with enough metadata to match a novel task to the right page (discovery).

Parent goal: the "AI Operating Manual" vision. Editorial filter for everything below: does it reduce repeated prompts?

## Constraints (already decided, do not relitigate)

- No runtime AI on the site. No search API, no embeddings, no router endpoint. Static generation only; the consumer LLM does the matching against good metadata.
- The inline rule dump in `/claude.md` stays. Non-browsing AIs cannot fetch links; navigation is a layer on top, not a replacement.
- Registry is the single source of truth (`lib/docs/registry.ts`). Every new surface derives from it so front doors never diverge.
- Trigger phrases and workflows describe Selwyn's real process. Draft them, mark drafts, get sign-off. Do not invent his process and pass it off as method.
- Content guard rules apply (no em-dashes, frontmatter parser quirks).

## Design

### 1. Routing metadata (navigation + discovery)

Add optional frontmatter to each doc:

```yaml
when:                       # task triggers, imperative, agent-facing
  - "adding login, signup, or protected routes"
  - "choosing between Supabase auth and rolling your own"
requires: [supabase-setup]  # slugs worth reading first (validated against registry)
```

- `parseDoc` validates: every `requires` slug must exist (same fail-loud pattern as the existing frontmatter checks).
- `/llms.txt` entries gain the triggers: `- [Auth](...): summary. Read when: adding login...`
- `/claude.md` gains a `## Where to look things up` routing table near the top: one line per doc, `WHEN <trigger>: fetch <site>/d/<slug>.md`. Rules-dump sections below are unchanged.
- Drafting the `when:` lines is a one-pass extraction over all ~41 docs (same approach that produced `decisions.ts`), then Selwyn reviews the list in one sitting.

### 2. Workflows (`lib/docs/workflows.ts` + `/w/<name>.md`)

Pure data module, mirroring `decisions.ts` / `launch-checklist.ts`:

```ts
type WorkflowPhase = {
  phase: string;          // "Discovery"
  directive: string;      // what the agent does in this phase
  slugs: string[];        // docs to fetch, validated against registry
};
type Workflow = { name: string; title: string; when: string; phases: WorkflowPhase[] };
```

- Route `app/w/[name]/route.ts`, same one-drop pattern as `/d/[slug]`: emits the workflow as plain markdown with each phase's directive and fetch links, plus the referenced docs' distilled directives inline so a non-browsing consumer still gets substance.
- `/claude.md` gains `## Workflows`: `WHEN <workflow.when>: fetch <site>/w/<name>.md and follow it phase by phase.`
- `/llms.txt` gains a `## Workflows` section.
- Unit test invariant: every slug in every phase is a real doc (the `fit-check.ts` invariant pattern).

Initial workflow set (draft, needs sign-off):

1. `start-new-project` (elaborated by Selwyn 2026-07-06, the flagship):
   - Phase 1, Validate: AI researches the market itself (competitors, pricing, demand, marketability), reports findings, gives an honest build / reshape / do-not-build verdict. Gate: no PRD for a dead idea. Docs: `discovery` (stage 1), `nextjs-fit-check`.
   - Phase 2, Discover: seed questions from the site, then AI-generated follow-ups in small batches until every PRD section can be filled without guessing. Docs: `discovery` (stage 2).
   - Phase 3, PRD: AI drafts from recorded answers, marks gaps `[OPEN]`, loops back to questioning until zero remain (components, design decisions, App Router structure, src/ layout, data, auth, hosting all decided with a why), then explicit sign-off. Docs: `prd`, `decisions`.
   - Phase 4, Build: scaffold -> conventions -> first deploy. Docs: `project-setup` and onward.
   - Division of labor principle (applies to all workflows): the site ships seed questions, the interrogation protocol, and the definition of done; the consumer AI supplies adaptive questioning, live market research, and judgment. No runtime AI on the site.
2. `add-auth`: Supabase setup -> auth pages -> route protection -> security review.
3. `add-payments`: provider decision -> integration -> webhooks -> testing.
4. `pre-launch`: launch checklist -> SEO -> analytics -> error states -> domains.
5. `write-content`: anti-slop rules -> voice -> SEO copy.

### 3. New content the workflows force into existence

Docs the `start-new-project` workflow references (drafted 2026-07-06, `verified: false`, awaiting sign-off):

- `discovery.mdx` (Start Here, order 6): stage 1 idea validation (AI researches market first, honest verdict gate) + stage 2 seed questions grouped by the PRD section they feed + the questioning protocol (small batches, force concrete choices, stop when guesses run out).
- `prd.mdx` (Start Here, order 7): the 11-section PRD, a copyable template with `[OPEN]` gap markers, definition of done, and the AI-drives-human-decides rules (draft from answers only, loop on `[OPEN]`, explicit sign-off before scaffolding).

A third, flagged earlier and still the highest-leverage single page: `working-with-me.mdx`, the collaboration rules currently living only in private Claude memory (proceed within steps, verify rendered output not just builds, UI bar, research-first design). Feeds `/claude.md` like everything else.

## Build order

1. **Routing metadata**: types + `parseDoc` validation + `when:` extraction pass over all docs + `/llms.txt` and `/claude.md` emission. Foundation, touches every doc file but only frontmatter.
2. **Workflows**: data module + `/w/` route + claude.md/llms.txt sections + invariant tests. Ship with the 3 workflows whose pages all exist (`add-auth`, `pre-launch`, `write-content`).
3. **Missing docs**: `discovery-questions`, `prd-process`, `working-with-me` (drafts), then enable `start-new-project`.
4. **Later**: the MCP server (existing plan step 10) wraps the same registry; the manifest becomes a resource list and each workflow becomes a tool. This design is MCP-shaped for free; build nothing extra now.

## Out of scope

- Any runtime AI, search endpoint, or embedding index.
- Rebranding the handbook. Open question for Selwyn: process docs (discovery, PRD, working-with-me) sit in Start Here under the existing Next.js branding, or get their own section label.

## Verification

Per phase: `npm run verify` (known pre-existing failure: `launch-checklist.tsx:51` lint), plus fetch the rendered `/llms.txt`, `/claude.md`, and one `/w/` route locally and read the actual output. The success metric test from the vision (fresh AI session, "read my handbook and build X", score against a rubric) becomes runnable once phase 3 lands.
