---
name: anti-slop-check
description: "Write user-facing text (copy, docs, comments, READMEs, commit messages) to Selwyn's anti-AI-slop rules from the first draft, then verify with a mechanical check before showing it. Avoids em-dashes, inflated vocabulary, manufactured contrasts, and hedging by writing plainly from the start, not by catching them after the fact."
---

# Anti-Slop Check

Load the rules before you draft, not after. The point is to write plainly the first time; the check at the end is a safety net for what slips through, not the method.

## How to write with it

1. **Before drafting**, read the core rules below (or the full ruleset in `references/slop-rules.md`) so they shape word choice as you write, the same way you would not write a sentence you knew was factually wrong and fix it later.
2. Draft the text writing directly in plain words: the plainest accurate word, no manufactured contrast, no hedging, no em-dash.
3. **After drafting**, run the bundled script to catch anything mechanical that slipped through:
   `node ${CLAUDE_SKILL_DIR}/scripts/check-slop.mjs <file>`
   It exits non-zero and prints the offending lines if it finds em-dashes or known slop patterns.
4. Read the draft once more for the judgment calls a script cannot catch: inflated vocabulary, manufactured "it's not X, it's Y" contrasts, hedging, empty throat-clearing. Fix anything left in plain words.

## The core rules

- No em-dashes. Use a period or a comma.
- No inflated vocabulary when a plain word works (delve, leverage, utilize, robust, seamless).
- No accented spellings of naturalized English words (résumé, café, naïve). Use resume, cafe, naive.
- No manufactured contrasts ("it's not just X, it's Y").
- No hedging or throat-clearing ("it's worth noting that", "in today's world").
- Write the way the author would: direct, specific, concrete.

Read the full sourced ruleset: https://selwynuy.dev/d/writing-without-ai-slop.md

## Bundled files

- `scripts/check-slop.mjs` (script): scans text for em-dashes and slop tells, exits non-zero with the offending lines.
- `references/slop-rules.md` (reference): the full sourced ruleset, with the plain-word rewrite for each tell.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/anti-slop-check
