---
name: session-continuity
description: "Save what a session accomplished, what's left, and why each decision was made, so the next session (yours or a fresh agent's) picks up cold without re-deriving context. Use at the end of a work session, or when switching between projects, to write a short structured record instead of losing the thread. Read it back at the start of the next session in the same project."
---

# Session Continuity

A session that ends without a record forces the next one to re-discover context that already existed once, and sometimes re-decide things that were already decided, differently. This writes down the five things worth keeping, in a form short enough to actually get read.

## How to run it

1. **At the end of a session**, write a record with: a one-sentence `summary` of what was accomplished, the specific `leftOff` point (name the file or feature, don't describe it abstractly), an ordered list of concrete `nextSteps`, every nontrivial `decision` made as a `{what, why}` pair, and any current `blockers` (empty if none).
2. **Keep it short.** A five-field record gets read at the start of the next session. A wall of prose gets skipped, which defeats the point.
3. **At the start of the next session** in the same project, read the last record before doing anything else. Skipping this means re-asking questions that already have answers.
4. **If `nextSteps` is stale** by the time you read it back (already done, no longer relevant), update the record instead of silently working around it.

## Why the "why" matters more than the "what"

Six months, or six hours, from now the decision itself is usually obvious from the code. The reason it was made isn't, unless it's written down. That's the field worth the extra sentence.

## Bundled files

- `references/session-record-schema.md` (reference): the structured fields a session record should carry, and when to write versus skip one.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/session-continuity

Adapted from the session-memory pattern in `ck` (Context Keeper) by sreedhargs89 (https://github.com/sreedhargs89/context-keeper, MIT licensed), distributed via [Everything Claude Code](https://github.com/affaan-m/everything-claude-code): the save-and-resume shape is the same, rewritten as a standalone skill instead of a set of Node.js CLI commands.
