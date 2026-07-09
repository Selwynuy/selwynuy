---
name: verify-before-ship
description: "Verify a change actually works by exercising the rendered output, not just trusting a green build. Use before committing or shipping any nontrivial UI or content change: check the real HTML or UI for leaked frontmatter, unstyled text, broken layout, and placeholder strings, in both light and dark mode when styling changed. A passing typecheck or test suite proves the code compiles, not that the page is correct."
---

# Verify Before Ship

A green build proves the code compiles and the logic under test is correct. It proves nothing about whether the page a real visitor sees is actually right. Run this after the automated checks pass, before calling anything done.

## How to run it

1. **Run the automated checks first** (typecheck, lint, tests). Treat a pass as necessary, not sufficient, the checklist below is what a pass doesn't cover.
2. **Start the dev server and load the real route** the change touches. Curl it for the raw HTML, or open it in a browser if the defect is visual. Don't infer correctness from the diff, the diff shows intent, not what actually rendered.
3. **Check for the specific failure class a build can't catch**, using `references/rendered-output-checklist.md`: frontmatter leaking into the page as literal text, unstyled or truncated content, broken layout at phone and tablet widths (not just the desktop viewport you built at), placeholder or debug strings, and theme regressions if the change touched color or spacing.
4. **If the change touches styling**, check both light and dark mode. A token that only exists in one theme's root block passes typecheck and looks broken in the other.

## What a build hides

- Raw `---` or `key: value` frontmatter rendering as text instead of being parsed
- A component with no CSS applied because a class name was typo'd
- Text truncated because a container assumed a shorter string than the real content
- `TODO`, `Lorem ipsum`, or a hardcoded test value that was meant to be temporary
- Layout that only breaks below the viewport width you were looking at while coding

## Bundled files

- `references/rendered-output-checklist.md` (reference): the specific things a green build hides, and how to check for each.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/verify-before-ship
