# Session record schema

Keep this short enough that the next session actually reads it. A wall of
text gets skipped; a five-field record gets used.

## Fields

| Field | What it holds |
| --- | --- |
| `summary` | One sentence, what this session accomplished. Not a changelog, the headline. |
| `leftOff` | The specific file, feature, or bug that was actively being worked on when the session ended. Name it, don't describe it in the abstract. |
| `nextSteps` | An ordered list of concrete next actions. "Fix the thing" is not a next step. "Add the missing `category` field to the Skill type in lib/docs/skills.ts" is. |
| `decisions` | Every nontrivial call made this session, as `{what, why}` pairs. The why matters more than the what, it's the part that doesn't survive in the diff. |
| `blockers` | What's currently stuck and on what. Empty array if nothing's blocked, don't pad it. |

## When to write one

At the end of a work session, or right before switching to a different
project in the same working set. Not after every small task, that's noise;
write it when picking the thread back up would otherwise mean re-deriving
context that already existed once.

## When to read one back

At the start of the next session in the same project, before doing anything
else. A fresh session that skips this re-asks questions that were already
answered and can re-decide things that were already decided, sometimes
differently, which is its own kind of bug.

## What NOT to do

- Don't write a session record as a substitute for commit messages. Commits
  describe what changed in the code; the session record describes what was
  understood, decided, and left unfinished, information a diff doesn't carry.
- Don't let `nextSteps` go stale. If the next session starts and the first
  listed step is already done or no longer relevant, update the record,
  don't just skip past it silently.
