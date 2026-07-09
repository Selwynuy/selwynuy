# Decision entry schema

Matches the handbook's own Decisions page: the conclusion, not the essay
that led to it. A reader should get the call in under a minute.

## Fields

| Field | What it holds |
| --- | --- |
| The call | The decision itself, stated as the present-tense choice: "Use Server Components by default," not "We will consider using Server Components." |
| What it beat | The real alternatives that were on the table, and the specific reason each lost. "We just picked it" is not a reason. |
| Consequences | The honest trade-off, including what gets harder, not just what gets easier. Every real decision costs something. |
| Firmness | One of: non-negotiable (breaking it is a security hole or a production bug), strong default (the choice unless there's a specific reason not to), or opinion (a call still under review, worth arguing with). |

## When to record one

When a project chooses between real, stated alternatives on something that
matters: framework, data store, auth strategy, API shape, a pattern that
will get copied elsewhere in the codebase. Not for naming or formatting
choices, those don't need a paper trail.

## What makes a good entry

- Specific, not generic. "Use Prisma over raw SQL for the ORM layer" beats
  "use an ORM."
- The why outlives the what. Six months from now the decision is obvious
  from the code; the reason it was made usually isn't, unless it's written
  down.
- Short. If the reasoning needs more than a few lines, the entry is trying
  to be the design doc instead of the conclusion of one.

## What NOT to do

- Don't backfill silently. If recording a decision that was actually made
  weeks ago, say so, don't imply it just happened.
- Don't record a decision as settled when it's still genuinely open. Tag it
  as an opinion instead, so a future reader knows they can push back on it.
- Don't skip the alternatives. A decision with no stated alternative isn't a
  decision, it's the only option anyone considered, which is worth saying
  plainly if that's actually what happened.
