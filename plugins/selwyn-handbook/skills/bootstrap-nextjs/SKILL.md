---
name: bootstrap-nextjs
description: "Scaffold a production Next.js app to Selwyn's conventions. Use when starting a new Next.js codebase or aligning an existing one to his defaults: App Router with Server Components, src/ layout, the decided data/auth/hosting stack, and secure-by-default wiring. Installs the handbook's CLAUDE.md so every future session inherits the rules."
---

# Bootstrap Next.js

Stand up a Next.js project with Selwyn's structure, stack, and secure-by-default wiring already in place.

## How to run it

1. Install the handbook rules into the project so every future session inherits them:
   `bash ${CLAUDE_SKILL_DIR}/scripts/install-claude-md.sh`
   This fetches https://selwynuy.dev/claude.md and writes it to the project root as `CLAUDE.md` (merging if one exists).
2. Read `references/conventions.md` for the src/ layout, App Router structure, and stack defaults, each with the reason behind it.
3. Apply the conventions as you scaffold. Prefer Server Components; add `"use client"` only for interactivity or browser APIs. Never expose secrets to the client; validate and authorize every mutation on the server.

## The defaults

- App Router, Server Components by default, fetch on the server.
- `src/` layout, typed throughout, scaffolded with `--typescript`.
- The decided data, auth, and hosting stack (see the decisions page).
- Secure by default: the things most teams patch later, wired from the first commit.

Read: https://selwynuy.dev/d/project-setup.md, https://selwynuy.dev/d/getting-started.md, https://selwynuy.dev/d/decisions.md, and https://selwynuy.dev/d/security-by-design.md

## Bundled files

- `scripts/install-claude-md.sh` (script): fetches the handbook /claude.md and writes it to the project root.
- `references/conventions.md` (reference): the src/ layout, App Router structure, and stack defaults with the why for each.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/bootstrap-nextjs
