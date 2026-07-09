---
name: review-before-commit
description: "Review a diff against Selwyn's engineering standards before it is committed. Use after writing or changing code and before staging it. Checks for the things that pass a build but fail the bar: broad rewrites where a surgical edit would do, new dependencies or patterns added without justification, any on non-trivial data, dead code, leftover console logs or debug strings, and business logic that drifted into client components. Pairs with verify-before-ship, which checks the rendered page; this checks the code."
---

# Review Before Commit

The review I would give a diff before it goes in. It runs after the code is written and before it is staged, and it holds the change to the same standards a careful human reviewer would, not just to whether it compiles.

This is the code half of the pair. `verify-before-ship` checks that the rendered page is actually right; this checks that the code that produced it is clean. Run both before calling a change done.

## How to run it

1. **Read the real diff, not the intent.** Run `git diff` (or `git diff --staged`). Review what actually changed, not what the change was supposed to be.
2. **Check the diff against the standards below.** Go rule by rule. For each violation, note the file and line.
3. **Report a plain verdict.** List what must change before commit and what is optional. Do not commit on the author's behalf. The review ends at a clear verdict; the human decides.

## The standards

Grouped by what they protect. The full checklist with an example of each violation is in `references/review-checklist.md`.

### Scope

- The change is the smallest edit that solves the problem. It did not rewrite, reorder, or reformat code it did not need to touch.
- No new dependency added without a clear reason. Existing utilities and components were reused where they fit.
- No new pattern or abstraction introduced where the repo already has one for this.

### Correctness and hygiene

- No dead code, commented-out blocks, leftover `console.log`, or debug values.
- No unused imports or variables left behind.
- Error and edge cases the change introduces are handled, not ignored.

### Types

- No `any` on non-trivial data. Types are specific enough to catch a wrong shape.
- Function signatures say what they take and return; no silent widening.

### Architecture

- Business logic stayed on the server. It did not drift into client components.
- Data access, validation, UI, and integration concerns stayed separated.
- Secure-by-default wiring (auth checks, env handling) was kept intact, not loosened for convenience.

## Why "before commit"

Once a diff is committed it is part of the history and the next change builds on top of it. The cheapest moment to hold the line on scope and quality is before it goes in, while it is still one small, reversible diff. This skill is that gate.

Read the standards this draws from: https://selwynuy.dev/d/working-with-me.md

## Bundled files

- `references/review-checklist.md` (reference): the standards a diff is held to, grouped by scope, correctness, types, and architecture, each with what a violation looks like.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/review-before-commit
