---
name: discovery-to-prd
description: "Take a raw app idea to a signed-off PRD the way Selwyn does. Use when starting a new project, validating an idea, or turning a vague concept into a build-ready spec. Researches the market for an honest build/reshape/kill verdict, interrogates the idea in small question batches until every PRD section can be filled without guessing, drafts the PRD marking gaps [OPEN], and loops until zero remain before build."
---

# Discovery to PRD

Validate an idea against the market, interrogate it into a complete PRD, sign off, then build. The whole kickoff, the way Selwyn runs it. Work through the phases in order; do not skip ahead to building.

## 1. Validate

Research the market yourself before any spec work. Look up competitors, pricing, and real demand. Then give an honest verdict: build, reshape, or do-not-build. Do not write a PRD for a dead idea; that is the point of this gate.

Read: https://selwynuy.dev/d/discovery.md and https://selwynuy.dev/d/nextjs-fit-check.md

## 2. Discover

Ask the seed questions, then your own follow-ups, in small batches of three to four. Force concrete answers; do not accept a vague one and move on. Keep going until every PRD section can be filled without guessing. Stop when your questions stop surfacing new decisions.

Read: https://selwynuy.dev/d/discovery.md

## 3. PRD

Draft the PRD from the recorded answers only. Do not invent requirements. Mark every gap `[OPEN]`. Loop back to questioning until no `[OPEN]` markers remain, then get explicit sign-off before touching code. The architecture decisions (App Router structure, src/ layout, data, auth, hosting) each get a decision with a why.

Read: https://selwynuy.dev/d/prd.md and https://selwynuy.dev/d/decisions.md

Use the bundled template as the skeleton: `templates/PRD.md`.

## 4. Build

Only after sign-off. Scaffold to the conventions, wire the decided stack, ship a first deploy.

Read: https://selwynuy.dev/d/project-setup.md and https://selwynuy.dev/d/getting-started.md

## Bundled files

- `templates/PRD.md` (template): the 11-section PRD skeleton with `[OPEN]` gap markers.
- `references/questioning-protocol.md` (reference): the interrogation protocol, batch size, when to stop, how to force concrete answers.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/discovery-to-prd
