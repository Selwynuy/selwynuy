---
name: architecture-decision-log
description: "Capture an architectural decision the moment it's made: what was decided, the alternatives that lost, and why. Use whenever a project chooses between real alternatives (framework, data store, auth strategy, API shape) and the reasoning is worth keeping. Writes into the handbook's own Decisions format instead of a separate docs folder nobody reads."
---

# Architecture Decision Log

A decision made without a written reason is a decision the next person (or the next session) has to make again from scratch, possibly differently. This captures the call, what it beat, and why, in the same scannable format the handbook already uses for its own decisions.

## How to run it

1. **Notice the decision moment**: a stated conclusion after comparing real alternatives on something that matters (framework, data store, auth strategy, API shape, a pattern that will get copied elsewhere). Skip naming or formatting choices, those don't need a paper trail.
2. **Record the call** as the present-tense choice: "Use Server Components by default," not "we'll probably use Server Components."
3. **Record what it beat**, with the specific reason each alternative lost. "We just picked it" isn't a reason worth writing down.
4. **Record the honest consequences**, including what gets harder, not just what gets easier. Every real decision costs something.
5. **Tag its firmness**: non-negotiable (breaking it causes a security hole or a production bug), strong default (the choice unless there's a specific reason not to), or opinion (a call still under review, worth arguing with).

## What makes a good entry

- Specific over generic: "Use Prisma over raw SQL for the ORM layer" beats "use an ORM."
- Short: if the reasoning needs more than a few lines, it's trying to be the design doc instead of the conclusion of one.
- Honest about alternatives: a decision with no stated alternative isn't a decision, it's the only option anyone considered, worth saying plainly if that's what happened.

## Bundled files

- `references/decision-entry-schema.md` (reference): the fields a decision entry needs, and what separates a good one from a rubber stamp.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/architecture-decision-log

Adapted from the `architecture-decision-records` skill in [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) (MIT licensed) by Affaan Mustafa: the capture-alternatives-and-consequences shape is the same, rewritten to feed the handbook's existing Decisions page format instead of a separate `docs/adr/` tree.
