---
name: nextjs-16-facts
description: "Verify Next.js App Router code against the exact installed version instead of stale training-data assumptions. Use before writing or reviewing anything touching params, route handlers, metadata, caching, or middleware in a Next.js 15+/16+ project. Next.js ships breaking changes across minor versions (params are now Promises, GET handlers are no longer cached, middleware is deprecated for proxy), so this reads the version and points at node_modules/next/dist/docs as ground truth."
---

# Next.js 16 Facts

Next.js changes its App Router API surface across major and even minor versions. Training data is frequently stale on this, so code that looks right from memory can be wrong for the version actually installed. Verify against the repo before writing.

## How to run it

1. **Read the installed version first.** Run the bundled script:
   `node ${CLAUDE_SKILL_DIR}/scripts/check-next-version.mjs`
   It reads `next` from the target's `package.json` and reports whether `node_modules/next/dist/docs/` exists.
2. **If bundled docs exist, treat them as ground truth** over both this skill and anything a model remembers. Read the relevant file under `node_modules/next/dist/docs/01-app/` before changing routing, params, route handlers, metadata, caching, or config.
3. **Use `references/verified-facts.md` as a fast checklist** of what commonly trips people up, not a replacement for the check above.
4. **When a fact here turns out stale for the installed version, fix it against the bundled docs** rather than silently working around it.

## The facts that catch people

- `params` and `searchParams` are Promises everywhere (pages, layouts, `route.ts`, `generateMetadata`). Await them in Server Components; use `use(params)` in Client Components. They were synchronous in Next.js 14.
- A `route.ts` `GET` handler is NOT cached by default. Add `export const dynamic = 'force-static'` if you need a static endpoint.
- `middleware.ts` is deprecated in favor of `proxy.ts`. Prefer `proxy` for new code; leave an existing `middleware.ts` in place unless asked to migrate it.
- A single route segment cannot export both a static `metadata` object and a `generateMetadata` function. Pick one.
- `images.domains` is deprecated. Use `images.remotePatterns`.

## Why this is a skill and not a memory

The whole premise: the version installed in the repo is the authority, not the model's training data. This skill's job is to force the version check and the docs read before code gets written, every time, so a stale assumption never ships.

Read the full sourced facts: https://selwynuy.dev/skills/nextjs-16-facts

## Bundled files

- `scripts/check-next-version.mjs` (script): reads the installed Next.js version and reports whether bundled docs exist to treat as ground truth.
- `references/verified-facts.md` (reference): the version-specific breaking changes with the fix for each.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/nextjs-16-facts
