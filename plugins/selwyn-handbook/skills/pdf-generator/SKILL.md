---
name: pdf-generator
description: "Generate a designed, print-quality PDF (guide, report, whitepaper, multi-part book) from HTML using a browser the machine already has. Use when asked to produce, export, or design a PDF, or to turn markdown/docs/research into a polished downloadable document. HTML-first: authors print-first HTML from a branded template, renders via headless Chrome/Edge --print-to-pdf, stamps page numbers, and verifies objectively (shrink-scan) plus page by page. Ships beginner-friendly components (plain-words explainers, checklists, copy-paste requests, inline-SVG infographics, tiered playbooks) and a split-render-and-merge pipeline for books with full-bleed part dividers."
---

# PDF Generator

An HTML-to-PDF pipeline with the design half built in. Chrome's print engine is
a capable typesetter; what makes browser PDFs look cheap is screen CSS printed
as-is. This skill works in the other order: read the print rules first, author
the document to them, render with a browser the machine already has, verify
objectively, then review the actual pages.

**Always HTML-first.** Never draw a designed document directly with a PDF
library: no fonts, no flexbox, no SVG, no iteration, and it costs more tokens
for worse output. HTML is the design surface; the PDF is a compile artifact.
pdf-lib appears only in post-processing (page numbers, merging, checks) and is
the skill's one optional dependency (`npm i -D pdf-lib`); rendering itself
needs nothing installed beyond a browser.

## How to run it

1. **Read the rules before writing any HTML.** `references/print-design.md`
   covers page geometry, break discipline, the shrink-to-fit trap, print
   typography, ink, footers, and what Chrome's print pipeline can and cannot
   do. These are writing rules; applying them after rendering means
   re-authoring.
2. **Author the document from the template.** Copy `templates/guide.html` and
   replace its placeholder content. The template ships: full-bleed dark cover
   (`@page :first { margin: 0 }` + a 210×296mm block — never fake bleed with
   negative margins), contents page, kicker + condensed-caps section heads,
   callouts, stat rows, tables, code blocks, and these content components,
   every one break-protected:
   - **`.plain` — "In plain words".** A jargon-free 1–3 sentence explainer
     placed directly after each section heading, so a beginner gets the easy
     version before the depth. Everyday words, jargon defined in the same
     breath, no stats or citations, second person, no em-dashes. This is what
     keeps a novice reading a deep document to the end.
   - **`figure.fig` — inline-SVG infographics.** Diagram the systems, don't
     just describe them: pipelines, layers, trends, anatomies, decision fans,
     6-node loops. Brand palette, never decorative stock imagery.
   - **`.breakdown` — a scannable definition list.** When prose spells out
     several named parts (an acronym like E-E-A-T, a set of traps, a set of
     roles), render each as a banded row: a big letter or number anchor, a red
     heading, a plain description, and an optional inline-SVG icon. A reader
     scans it in seconds where a paragraph forces them to parse. Letters for
     acronyms, numbers for enumerations.
   - **`.playbook` — tiered action plan.** Starter → Practitioner → Advanced;
     each step names the exact tool, the concrete action, and a durable
     "Done when" check.
   - **`.checklist` — tickable hollow-box lists** with mono group labels, for
     onboarding/offboarding/pre-publish lists a reader works through.
   - **`.req` — copy-paste request blocks**, ready-to-send messages with exact
     click-paths (e.g. access requests a freelancer sends a client).
   Let sections **flow** (no per-section page breaks): short sections share
   pages instead of stranding whitespace; heading break-protection keeps
   section tops intact. Keep the document self-contained: inline CSS, no JS,
   webfonts with real fallback stacks. Restyle the tokens block to the client
   brand when this is not a selwynuy.dev document.
3. **Render.** `node ${CLAUDE_SKILL_DIR}/scripts/build-pdf.mjs <file.html>`
   (multiple inputs fine; `--out`, `--out-dir`, `--browser`, `--budget` as
   needed). Finds Chrome/Edge/Chromium across platforms, prints with
   `--no-pdf-header-footer`, gives webfonts a virtual-time budget.
4. **Stamp page numbers.** Chrome cannot number pages; post-process instead:
   `node ${CLAUDE_SKILL_DIR}/scripts/paginate-pdf.mjs <file.pdf>` draws a
   centered gray number in the bottom margin of every page except the cover.
   Re-run after every re-render (it edits in place).
5. **Verify objectively, then visually.**
   `node ${CLAUDE_SKILL_DIR}/scripts/check-pdf.mjs <file.pdf>` catches the
   failure a thumbnail review misses: shrink-to-fit. If anything in the HTML
   exceeds the printable width, Chrome silently scales the whole document
   down (covers inset in a white frame, text small, dead space at page
   bottoms) — the script reads the scale baked into each page and fails if it
   is not 100%. Then open the PDF and walk it: cover bleeds fully, no
   stranded headings or split components, the condensed display face loaded
   (fallback Arial Narrow is a visible tell), dark backgrounds present. Fix
   in the HTML and re-render; iterate until the pages pass.

## Multi-part books (full-bleed interior dividers)

Interior pages cannot bleed inside one Chrome-rendered document (negative
margins trigger shrink-to-fit; named `@page` sizes are ignored). Use
**split-render-and-merge**: emit the book as pieces — front matter, each part
divider as its own single-page document (where it is page 1, so
`@page { margin: 0 }` bleeds it exactly like a cover), each part body as a
normal document (override any shared `@page :first { margin: 0 }` back to
real margins) — then concatenate with
`node ${CLAUDE_SKILL_DIR}/scripts/merge-pdfs.mjs <out.pdf> <pieces...>` and
paginate the merged file. Name pieces with sortable prefixes (00-front,
10-divider, 11-part, 20-divider, ...) so filename order is book order.
Splitting at dividers never changes flow because parts start on fresh pages
anyway.

## What this catches by construction

- US-Letter drift: the template declares `@page { size }` so paper does not
  depend on the rendering machine's locale.
- White-cover syndrome: `print-color-adjust: exact` is already set; without
  it Chrome strips dark backgrounds silently.
- The shrink-to-fit trap: the iron rule (nothing wider than the printable
  area, no negative-margin bleed) is in the template comments, and
  check-pdf.mjs proves every page is at 100%.
- Mid-component page breaks: headings, callouts, stats, tables, code blocks,
  plain boxes, checklist items, and request blocks all carry break
  protection. Corollary: never place a break-protected block as the last
  element before a forced page break, or it strands alone on a near-blank
  page.
- Whitespace-wasting layouts: sections flow by default instead of each
  claiming a page.
- The stamped date-and-URL header Chrome adds by default; the render script
  always suppresses it.
- Stale fake page numbers: numbers are stamped from the real page count in
  post, never typed into the HTML.
- Wall-of-text guides: plain-words explainers, figures, playbooks,
  checklists, and request blocks exist so a beginner is carried through and
  an expert still gets the depth.

## Bundled files

- `scripts/build-pdf.mjs` (script): cross-platform renderer; finds an
  installed Chrome/Edge/Chromium, prints each HTML input to PDF, reports
  size and best-effort page count. Zero dependencies.
- `scripts/paginate-pdf.mjs` (script): stamps page numbers in post, skipping
  the cover. Needs pdf-lib.
- `scripts/merge-pdfs.mjs` (script): concatenates piece PDFs into a book, in
  argument order. Needs pdf-lib.
- `scripts/check-pdf.mjs` (script): objective verification — page count, page
  size, and per-page shrink-to-fit detection. Needs pdf-lib.
- `templates/guide.html` (template): the branded print document, dark
  full-bleed cover and light interior, with every component break-protected
  and example markup for each.
- `references/print-design.md` (reference): the print rulebook — including
  the shrink-to-fit trap, bleed mechanics, split-render-and-merge — plus the
  verification checklist and troubleshooting table.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/pdf-generator
