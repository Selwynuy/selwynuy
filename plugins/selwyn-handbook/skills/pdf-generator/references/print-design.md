# Print design for browser-rendered PDFs

The rulebook behind `templates/guide.html` and `scripts/build-pdf.mjs`. Chrome's
print pipeline is a real typesetter if you feed it real print CSS; almost every
ugly HTML-to-PDF result traces back to screen CSS being printed as-is. Read this
BEFORE authoring the HTML, not after the PDF comes out wrong: these are writing
rules, not a repair checklist.

## Page geometry

- Declare the paper explicitly: `@page { size: A4; margin: 20mm 18mm 24mm }`.
  Without `size`, Chrome falls back to the OS locale default (often US Letter)
  and the layout shifts per machine.
- Full-bleed cover, the correct way: `@page :first { margin: 0 }` plus a
  `.cover` at `width: 210mm; height: 296mm` with NO negative margins. Page 1
  has no margins, so a paper-width block fits exactly and bleeds cleanly.
- THE SHRINK-TO-FIT TRAP (the single most important rule in this file): if ANY
  element anywhere in the document extends past its page's printable width,
  Chrome print silently scales the ENTIRE document down (shrink factor =
  printable width / widest overflow extent) and clips paint to the printable
  box. Symptoms: every page renders with an even white frame, covers look
  inset, text shrinks, page bottoms gain dead space. Two ways to trigger it,
  both verified the hard way: an in-flow block wider than the content area
  (e.g. a 210mm part divider inside 18mm margins), and NEGATIVE MARGINS used
  to fake a bleed (the right edge still overflows scrollWidth). Never use
  negative margins for bleed; never exceed the printable width.
- To DETECT shrink objectively, decompress a page's content stream and
  multiply the first two `cm` matrix scales: 0.75 (pt per CSS px) means 100%;
  anything lower means the document was shrunk. Do this check after layout
  changes rather than eyeballing thumbnails.
- INTERIOR full-bleed pages (e.g. part dividers) are NOT achievable inside one
  document with the CLI `--print-to-pdf` renderer: negative margins trigger the
  shrink trap, and named `@page` rules ignore their `size` (fall back to
  Letter -> spill). The working technique is SPLIT-RENDER-AND-MERGE: render
  each full-bleed interior page as its OWN single-page document (where it is
  page 1 and `@page { margin: 0 }` applies, exactly like a cover), render the
  content between them as separate documents (overriding any shared
  `@page :first { margin: 0 }` back to normal margins), then concatenate the
  piece PDFs in order with pdf-lib (`scripts/merge-pdfs.mjs` in the portfolio
  repo) and stamp page numbers afterwards. Name pieces with sortable prefixes
  (00-front, 10-divider, 11-part, ...) so filename order is book order. This
  works because parts naturally start on fresh pages, so splitting at dividers
  never changes the flow.
- Bottom margin deserves more than the top (24 vs 20mm): visually centered
  is not arithmetically centered on paper.

## Break discipline

Pages must never break mid-component. Flow text freely; protect the rest:

- `page-break-after: avoid` on every heading and kicker, so a title never
  strands at the bottom of a page with its body on the next.
- `page-break-inside: avoid` on callouts, stat rows, tables, figures, and
  `pre` blocks.
- `orphans: 3; widows: 3` on `p, li` keeps single lines from separating.
- Let sections FLOW; do not give every section `page-break-before: always`.
  Per-section breaks waste the bottom of every page a short section ends on
  (verified: removing them cut a real document ~20%). The heading protection
  above already keeps a section top intact when it lands near a page bottom.
  Reserve the explicit `.break` for pages the design demands (Sources,
  backmatter, appendices).
- After rendering, CHECK the actual breaks. Break rules are hints; a
  component taller than one page will still split.
- Watch for STRANDING: a break-protected block (callout, colophon) that
  misses the current page by a few lines gets pushed alone onto a nearly
  blank page. Fixes, in order: trim a redundant line so it fits; give
  backmatter (sources, appendix) its own page with an explicit break so the
  document ends on a full page; add `break-before: avoid` so a few preceding
  lines travel with the block instead of leaving it alone. Corollary: never
  place a break-protected block as the LAST element before a forced page
  break; move it earlier in the section so prose closes the page.
- Full-page interior panels (framed dividers) must zero the inherited section
  margin, use an exact height at least 1mm under the printable height, and
  carry `page-break-inside: avoid`, or the panel splits and its tail paints
  onto the next page.

## Typography

- Points, not pixels: 10pt body at 1.6–1.7 leading is the print sweet spot.
  9pt is the floor for captions; below that, ink and screens both blur.
- Display type earns its size by contrast: condensed all-caps headlines
  (Archivo 800, `font-stretch: 80%`) against quiet body text. All-caps needs
  positive tracking (`letter-spacing: 0.01em+`) to stay legible.
- Line length inside A4 with 18mm margins at 10pt lands near 85 characters.
  If a layout goes wider (landscape, narrower margins), add columns or raise
  the size.
- Webfonts load over the network at render time. Keep real fallback stacks,
  and let `--virtual-time-budget` (the script defaults to 15s of virtual
  time) cover the fetch. Offline machine: fonts fall back, PDF still renders.

## Color and ink

- `print-color-adjust: exact` (plus the `-webkit-` prefix) on `html, body`,
  or Chrome silently strips background colors and the dark cover prints white.
- Dark cover, light interior. A dark cover carries the brand and costs one
  page of ink; 15 dark interior pages punish anyone who prints. Body pages
  are near-black text on white with one accent color doing all the work.
- Accent red on white: use the deep shade (`#99040c`) for inline links and
  small text; the bright brand red (`#e30613`) is for kickers, rules, and
  display sizes where it has mass. Small bright-red text vibrates on white.

## Footers and page numbers: what Chrome cannot do

- Do NOT use `position: fixed` for a repeating footer. The spec says fixed
  elements repeat on every page box, but headless Chrome paints them at
  inconsistent vertical offsets from page to page, colliding with body text
  mid-page (verified empirically with this template, both with negative
  bottom offsets and paper-coordinate offsets). It is not a usable mechanism.
- Automatic page numbers are also NOT available: `counter(page)` only works
  in `@page` margin boxes, which Chrome does not implement. Do not fake
  numbers with hardcoded text that goes stale.
- What works instead: put identity on the cover (kicker + colophon line) and
  close the document with a colophon block, as the template does. Clean,
  footer-less interior pages read as a choice, not a gap.
- If running footers or page numbers are a hard requirement, add
  [Paged.js](https://pagedjs.org/) (a script include that polyfills margin
  boxes, page counters, and running headers) and raise `--budget` so its
  re-pagination finishes before printing. That is the reliable in-document path.
- The pragmatic alternative, used for the guides shelf, is a two-step
  render-then-stamp pipeline: render normally, then post-process the finished
  PDF with `pdf-lib` to draw a page number in the bottom margin of every page.
  This never disturbs the tuned native pagination (full-bleed cover, part
  dividers). Skip page index 0 (the cover), draw a centered number at ~34pt
  from the bottom (inside the 24mm margin), size 8pt, gray `rgb(0.47,0.45,0.42)`.
  Re-run it after every re-render, since it edits the PDF in place. Reference
  implementation: `scripts/paginate-pdf.mjs` in the portfolio repo.

## Diagram, don't just describe

Dense reference prose overwhelms a beginner. Anything with structure, a
pipeline, layers, a relationship between things, a trend, an anatomy, reads
faster as a picture. Draw it.

- Use **inline SVG**, never raster images. It is vector-crisp at print
  resolution, adds zero external requests, and is styled with the same brand
  tokens as the text (ink strokes, the accent red, the mono/display fonts).
  Decorative stock imagery is the AI-slop trap; every figure must carry
  information, not fill space.
- A reusable diagram vocabulary covers most needs: horizontal **flows**
  (numbered boxes + arrows) for pipelines; nested rectangles for **layered /
  concentric** models; two columns of pills + connecting lines for **node
  graphs** (this echoes a network/constellation look); ascending **bars** for
  a trend or a two-value comparison; stacked bands for a **pyramid /
  hierarchy**; an annotated mock card for an **anatomy**.
- Wrap every figure in `<figure class="fig">` with a one-line `<figcaption>`
  (mono, muted) that states the takeaway and names the source. Give the `<svg>`
  a `viewBox` (so it scales to the column) and a `role="img"` + `aria-label`.
- Set font-family, size, and fill inline on SVG `<text>`; `text-anchor` and
  a `<g>` wrapper keep groups consistent. Escape `&` as `&amp;` inside SVG.
- Every figure carries `page-break-inside: avoid` (the `.fig` class does this).
  If a figure plus its section intro strand a heading, lead the section with
  the figure so the visual and its explanation travel together.
- When a diagram carries the structure, TRIM the prose it replaces. The point
  is fewer words a beginner must read, not a diagram bolted on top of the same
  paragraph.

## Don't leave a named list as prose: the breakdown

When a paragraph enumerates several NAMED parts, each with a short definition
(an acronym like E-E-A-T; a set of biases, traps, roles, or reasons), it reads
as an undifferentiated wall. Lift it into a `.breakdown`: one banded row per
item, each with a big letter-or-number anchor, a red heading, and a plain
description. The reader scans the headings in seconds and drops into the one
they need. Use a LETTER anchor for a genuine acronym (E, E, A, T) and a NUMBER
anchor for a non-acronym enumeration. Add an inline-SVG icon per row only when
the icons are distinct and earn their space (E-E-A-T's four concepts do); a set
of five biases does not need five icons. Keep each description to a line or two
so rows stay compact. This is the print equivalent of the annotated "definition
graphic" every good explainer uses instead of a defining sentence.

## Write for the beginner too: the "In plain words" box

A deep, cited document loses novice readers by the third section. The fix
that preserves the depth: open EVERY section with a `.plain` box directly
after the heading — 1 to 3 short sentences that re-tell the section to
someone on day one. Rules for the box copy: everyday words; define any
jargon in the same breath ("a CMS, the system a site's content is edited
in"); no statistics, citations, or unexplained acronyms; answer "what is
this section saying and why should I care"; warm second person; no
em-dashes. The expert skips them; the beginner is carried to the end. Do not
reword the deep content to compensate — the pairing is the point.

## Give a tiered action plan, don't stop at description

A guide that only explains leaves a beginner asking "so what do I actually
do?" Close it with a **playbook**: an ordered, tool-by-tool action plan.

- Three tiers, one continuous numbering: **Starter -> Practitioner ->
  Advanced**. A beginner follows top to bottom; an expert jumps to their tier.
  The `.playbook` counter numbers steps across all levels automatically.
- Every step is three lines: the **action** (imperative), the **how** (the
  exact tool or URL in `.dest` mono, and the specific thing to do), and a
  **`Done when:`** check.
- Make the check **durable**. UI walkthroughs ("click the gear icon") rot the
  day the tool redesigns. Describe the destination and the goal in stable
  terms, and let "Done when" state an observable outcome ("the report lists
  your pages"), not a click path.

## Verification (the render is not the review)

A zero exit from the script means Chrome printed SOMETHING. Before shipping:

1. Open the PDF (agents: read it as pages, it is an image-readable format).
2. Cover: full bleed, no white edge strip, no spilled blank page after it.
3. Walk every page for bad breaks: stranded headings, split tables or
   callouts, single-line orphans.
4. Fonts: condensed display face actually loaded (fallback Arial Narrow is
   visibly wider and lighter, an instant tell).
5. Dark backgrounds present (if missing: `print-color-adjust` or a run
   without the virtual-time budget).
6. File size sanity: a 15-page text guide is well under 2 MB. Tens of MB
   means an unoptimized image is embedded.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Backgrounds/colors missing | `print-color-adjust: exact` absent, or the color only exists in a `@media screen` block |
| Wrong paper size per machine | No `size` in `@page`; declare it |
| Fallback fonts in output | Webfont fetch lost the race; raise `--budget`, check the fonts URL, or vendor the font as a local `@font-face` |
| Blank extra page after cover | Cover exactly paper height plus a margin somewhere; use 296mm and `margin: 0` on `@page :first` |
| Every page has an even white frame; covers inset; text small | Shrink-to-fit: something exceeds the printable width (a too-wide block, or negative margins faking a bleed); find and remove the overflow, then confirm the content-stream scale is back to 0.75 |
| Dark band on the page BEFORE a divider | A negative top margin is leaking onto the previous page; interior pages cannot bleed, use a clean full panel (`min-height: 248mm`) instead |
| Content clipped at right edge | Fixed `width` in px on a container; size in mm relative to the page box |
| Header/footer with date and URL stamped on | Missing `--no-pdf-header-footer` (the script always passes it) |
| Render hangs | A script or animation never settles; virtual time budget caps it, or strip JS from the document entirely |
