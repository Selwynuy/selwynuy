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
- GROUP protection is not the same as ITEM protection. Numbered/tiered
  components (a playbook level with several `.step`s, a lettered/numbered
  `.breakdown` list) commonly protect each ITEM with `page-break-inside:
  avoid`, which stops an item's own text from splitting, but does nothing to
  stop the GROUP splitting BETWEEN items: item 1 renders alone at the bottom
  of a page while items 2+ push to the next page (verified bug: a 5-row
  breakdown rendered only 2 rows before the page ended, rows 3-5 landed on
  the next page). Fix: add `page-break-inside: avoid` to the GROUP CONTAINER
  itself (the tier/level wrapper, the breakdown list), not just its items.
  Safe whenever the group is short enough to fit one page (a handful of
  steps or rows, tens of mm each); Chrome degrades gracefully and just
  breaks anyway if a group is genuinely taller than a page.
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

## Covers and the brand mark

**Confirm the logo is the client's before you put it on every cover.**
Scaffolding tools leave decoy brand assets behind. v0.dev writes
`public/icon.svg`, which looks authoritative, sits exactly where a favicon
belongs, and is v0's own mark. Open the image and look at it. Then confirm
against what the running app renders: grep the header or navbar for the asset
it actually loads. A filename is not evidence, and a wrong mark shipped across
a document library is expensive to recall.

**Check the cost before embedding a raster.** A 354 KB logo PNG inlined into a
17-document library is roughly 6 MB of duplicated logo. If the only original
is a raster, trace it to a path once (optional, needs Python with Pillow and
scikit-image):

```python
import numpy as np
from PIL import Image
from skimage import measure

a = np.array(Image.open("logo.png").convert("RGBA"))[:, :, 3].astype(float)
ys, xs = np.where(a > 128)                     # crop to the ink
sub = np.pad(a[ys.min():ys.max()+1, xs.min():xs.max()+1], 2, constant_values=0)
parts = []
for c in measure.find_contours(sub, 128.0):    # outer shape, then counters
    c = measure.approximate_polygon(c, tolerance=0.4)
    if len(c) >= 3:
        parts.append("M" + " L".join(f"{x-2:.1f},{y-2:.1f}" for y, x in c) + "Z")
path = "".join(parts)                          # render with fill-rule="evenodd"
```

That is about 2 KB of path for a letterform against 354 KB of PNG per
document. Verify it: render the traced path and XOR it against the source
mask. Under roughly 0.5% mismatch is boundary antialiasing, not drift. Use the
mark's own bounding box as the viewBox, and set both width and height in mm so
the aspect ratio never depends on `auto`.

**Cover layout:**

- **One deliberate void, not three.** Put the title block in a flex column and
  give it `margin-top: auto` so the slack collects in a single place. A cover
  with a fixed margin on every element reads as a template with dead space
  stranded in the middle.
- **A white cover on white paper has no edge.** If the cover goes light, add a
  full-width color band at the top (2-3mm). Without it the sheet reads as an
  unfinished first page rather than a cover.
- **Chips stretch.** `align-self: flex-start` only does anything if the parent
  is a flex container. Add `display: inline-block` as well, or a tier chip
  becomes a full-width bar the moment someone wraps it in a plain div.
- **Emphasize by adding color, not by removing it.** On a colored field,
  fading the accent word to a low-alpha tint reads as a rendering mistake.
  Step the lead line back instead and keep the accent at full strength.
- **Oversized-mark texture is glyph-specific.** A watermark tuned to one logo
  will sit behind the title when the logo changes shape: a bulky letterform
  occupies far more area than a thin one at the same box size. Re-tune size,
  position, and opacity whenever the mark changes. Place it to fill the void
  *above* the title rather than behind it, keep it under about 10% opacity,
  and clip it with `overflow: hidden` on the cover, never with negative
  margins (see the iron rule in Page geometry).
- **Flat light tints band on cheap inkjets.** A large area of 8-12% tint is
  the classic case. If the document is meant to be printed, an outline of the
  same shape carries the idea with no banding risk.

**Review N covers before you render N documents.** When one theme file drives
a whole library, iterate the cover on a scaled HTML review page first. Lay out
real sheets at true paper geometry (`width: 215.9mm; height: 279.4mm`),
position them absolutely, and scale with
`transform: scale(containerWidth / paperWidthPx)` where `paperWidthPx` is
`mm * 96 / 25.4`. Stamp the container's height from that same scale factor
instead of trusting `aspect-ratio`, so the box can never disagree with the
sheet it holds. You get an honest side-by-side at any zoom and iterate in one
file rather than rebuilding the library on every tweak.

After rendering, tile page 1 of every output into a single contact sheet and
look at them together. Reviewing documents one at a time hides inconsistency;
a row of covers makes the outlier obvious in a second.

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

## Diagramming at scale: build figures, don't draw them

"Diagram, don't describe" is easy for three figures and unmanageable for
thirty. Past a handful, stop hand-authoring SVG and write **data-driven
builders**: one function per figure type that takes content and returns markup.

```js
export const figure = (builder, args, caption) => {
  const { svg, h, w } = builder(args)
  return `<figure class="fig"><svg viewBox="0 0 ${w} ${h}">${svg}</svg>
          <figcaption>${esc(caption)}</figcaption></figure>`
}
```

The types that recur across almost any explanatory document:

- **scale / range** a value band with the healthy zone marked. Essential
  whenever several systems use different ranges and readers confuse them.
- **scaleStack** several ranges aligned at the same width. Shows at a glance
  that 80, 600 and 155 can all mean "good" on different models.
- **anatomy** a stylised document or screen with numbered pins into a legend.
  This is what turns "how do I read this" from a table of definitions into a
  guided tour, and it is also the right way to show a third-party interface:
  it never rots the way a screenshot does, it stays vector-small, and it reads
  as a diagram rather than a claim about today's UI.
- **timeline**, **flow**, **weightBars**, **compare** for sequences,
  pipelines, what-moves-what, and before/after.

**SVG has no word wrap.** Write a wrap helper and emit one `<text>` per line,
or long labels silently overflow their box. Height must be computed and
returned from the builder, since you cannot measure text before rendering.

**Budget space for every label, then look at it.** Three collisions that will
happen and that no exit code catches:

- a centred band label colliding with the axis maximum at the right edge. Draw
  it *inside* the band when the band is wide enough, above it when not.
- a note column overrun by a full-width bar. Reserve the note width from the
  longest note, do not assume a fixed padding.
- two numbered sequences ending up adjacent (row pins beside legend bullets)
  and reading as one doubled column. Separate them or merge them.

Flat fills only, no gradients: they band on cheap printers and inflate the
file. Size every figure `width: 100%` over a viewBox so it can never trigger
shrink-to-fit.

**Number the captions** so prose can refer to them. `counter()` works in normal
content, unlike `@page` margin boxes:

```css
body { counter-reset: figure; }
figure.fig { counter-increment: figure; }
figure.fig figcaption::before { content: "Figure " counter(figure) ". "; }
```

## The asset audit: sweep the whole document for missed pictures

Diagramming ad hoc means you diagram what happens to occur to you. Sweep for it
instead. Prose announces its own visual shape, and the announcements are
mechanical enough to grep for. Run this over the source before you call a
document finished.

| What the text says | What it wants to be |
| --- | --- |
| A range stated in words: "runs from 101 to 992", "0 to 100" | A scale, or a gauge for the hero number |
| A threshold or cutoff: "155 is the usual minimum", "80 means on time" | A marked point on that scale |
| Several ranges discussed together | A stacked scale set, aligned, so they cannot be confused |
| Ordinals: "first, then, after that", "Step 1 to 5", "week 1" | A timeline or numbered flow |
| A handoff chain: "you pay, the vendor reports, the bureau files" | A process flow with arrows |
| Two states contrasted: before/after, weak/strong, us/them | Side-by-side compare panels |
| Proportion language: "the largest factor", "carries most of the weight" | Weight bars, ordered |
| Tiering: "Tier 1, Tier 2, Tier 3", "starter, builder, established" | A ladder, with what each rung requires |
| A document or screen described field by field | An anatomy with numbered pins into a legend |
| Branching: "if you have partners... if you want investors..." | A decision path |
| A table with 3+ columns where one is numeric | Often a chart; check whether the numbers are the point |
| A list enumerated five or more times | A visual inventory rather than more bullets |
| A single number carrying a section | A stat tile, big, with its caption |

**Not everything should be a picture.** The counter-rule is what keeps this from
producing decoration:

> A figure earns its place only if it lets the reader stop holding something in
> their head. If a sentence conveys it just as fast, the sentence wins.

Test each candidate against that before building it. A stock-looking graphic
carrying no information makes a document look cheaper, not more expensive.

**Assets are not only diagrams.** The same sweep should consider a pull quote
for a line worth slowing down on, a big-number stat tile, an icon-led row, a
margin annotation, or a table restructured as a matrix. Reach for the lightest
form that does the job.

**Borrow existing visual literacy where it exists.** If your readers already
know a visual convention from elsewhere in their life, a gauge for a score, a
progress bar, a traffic-light band, using it costs you nothing and buys instant
comprehension. Inventing a novel encoding for a familiar quantity spends the
reader's attention for no gain.

**Where the data is proprietary, visualise only what your own text already
states.** It is easy to draw a five-band scale and hard to source the band
boundaries. Drawing them implies a precision you may not have. Either cite the
thresholds in the prose and then visualise them, or show a single marked range
and say the bands vary.

## Teaching devices: what a textbook has that a guide usually doesn't

Break-protected components carry structure. They do not, on their own, make a
document teach. If the reader is a beginner and the document is something they
paid for, add the pedagogical layer:

- **`.opener`** at the head of each section: what you will be able to do
  afterwards (outcomes, not topics), an estimated reading time, and what it
  assumes you already know. Cheap to build and it is the difference between a
  document and a course.
- **`.summary`** three to five key takeaways closing each section, so the
  document becomes reviewable rather than re-readable.
- **`.key`** one highlighted sentence per spread. If everything has the same
  visual weight the eye has nowhere to land. Two on a page and neither works.
- **`.worked`** one concrete case followed end to end with real numbers. The
  highest-value device for any subject where "good" is abstract, because a
  reader who has never seen good cannot pattern-match to it.
- **`.selfcheck`** two or three questions per chapter with an answer key at the
  back. Turns passive reading into retention.
- **`.glossary`** with a heading. An unlabelled definition list just reads as a
  run of bold words.

**Derive the set from the actual audience, and find the audience in the
codebase rather than assuming it.** An About page, pricing copy or plan
definitions usually state who the product serves. Beginners who were already
rejected once need diagnosis and reassurance; experts need density and
reference. The devices differ.

## Patching many documents without breaking them

When one theme drives a library, you will be inserting the same devices into a
dozen content files. Do it with **anchored insertions that assert an exact
single match**, never a blind regex replace:

```python
def after_h2(self, h2, html):
    a = f'<h2 class="head display">{h2}</h2>'
    assert self.src.count(a) == 1, f"{self.name}: {h2!r} matched {self.src.count(a)}x"
    self.src = self.src.replace(a, a + "\n" + html, 1)
```

Every patch then either lands where intended or fails loudly with the file and
anchor named. A patch script that reports "14/14 applied, 0 missed" is evidence;
one that silently no-ops is not.

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

## Don't let a short section end a document with a near-empty page

A different failure from stranding: a whole SECTION (not a protected block)
is simply short, and it happens to be the last content in its document or
piece before something else starts fresh (a forced divider, the end of a
split-render-and-merge piece). There is no "break" pushing anything away;
the content just runs out, leaving the final page mostly blank under a
couple of orphaned lines. Symptom: 2-3 lines of prose alone at the top of an
otherwise empty page. Real example: a book's front-matter intro ended with a
short closing paragraph that spilled alone onto its own near-blank page
right before Part I's divider.

Fixes, cheapest first:
- Merge short closing paragraphs into the paragraph before them. A single
  flowing paragraph that happens to wrap across the page boundary reads as
  normal running text; a short SEPARATE paragraph alone on a page reads as a
  mistake. `orphans`/`widows` (already set to 3) then guarantee a sane
  minimum line count on each side of the wrap.
- If that is not enough, compact the section's own spacing (not the shared
  stylesheet): give the section a scoped class and inject overrides for it.
  In split-render-and-merge, this is one line: pass a scoped `extraCss`
  string to that piece's `doc()` call. Effective levers, most to least
  impactful: shrink an SVG figure's WIDTH (not `max-height`, see below),
  tighten callout/plain-box padding and margin, nudge paragraph
  `margin-top`/`line-height` down slightly. Iterate by re-rendering ONLY the
  affected piece (fast) and checking its page count before doing a full
  rebuild.
- `max-height` does not reliably shrink an SVG sized `width:100%;
  height:auto`: the height is derived from the viewBox aspect ratio at the
  CURRENT width, so height alone is not an independent lever. Reduce WIDTH
  (e.g. `width: 58%; margin: 0 auto;`) and height follows proportionally.
- When editing generated pieces (a `.mjs` assembler), verify a source-file
  string match actually lands before trusting it: `String.replace` fails
  SILENTLY (returns the string unchanged, no error) if the substring is not
  found, and CRLF line endings in a source `.html` file will break any
  literal `\n`-based match. Use a regex with `\r?\n` (or `\s*`) instead of a
  hardcoded `\n`, and confirm the injected class/text actually appears in
  the generated output (`grep -c` for it) before re-rendering to check the
  fix.

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
7. Rendering a library, not one document: tile page 1 of every output into a
   contact sheet and check the covers against each other. Also check the
   longest title in the set, not just the first document, since a title block
   anchored with `margin-top: auto` moves with its own content.

## Verify the claims, not just the pages

Everything above verifies the *render*. A document can be typographically
perfect and still ship a false statement about the client's product, which is
the more expensive failure. When a document markets the thing that publishes
it, verify the content too.

**Pattern-matching for banned phrases is necessary and not sufficient.** It
produces false positives ("all four" that means four form fields, "$350,000"
that is a use-of-funds total, not the regulatory threshold you were hunting)
and false negatives (a claim phrased in words the pattern did not anticipate).
Never report a library "clean" on the strength of a regex sweep alone.

**The reliable test: extract every sentence that names the product and read
all of them.** The volume is always manageable, 45 sentences across a
213-page, 58,000-word library, and nothing can hide in it:

```python
for name, txt in docs.items():
    flat = re.sub(r"\s+", " ", txt)
    for s in re.split(r"(?<=[.!?]) ", flat):
        if re.search(r"\bPRODUCTNAME\b", s):
            print(name, s)
```

**Sentence-level compliance is not substance-level compliance.** Once every
individual claim is defensible, count what the library actually *teaches*
against what the product actually *does*. A set of guides that mentions
capabilities the client does not have 252 times, and the two it does have 135
times, still leaves the reader concluding the product does the former, even
though no single sentence lies. Count mentions per capability, compare the
ratio to reality, and check the paid tiers hardest: a customer who pays for a
guide about a capability the product lacks has a grievance no disclaimer
covers.

**Reconcile every asserted quantity against the artifacts.** An index that
says "23 files" when 24 sit on disk, a catalogue with page counts that no
longer match the rendered PDFs, a directory that claims 36 entries and lists
30. These drift silently on every rebuild, so check them on every rebuild.

**Count boilerplate repetition.** A promotional sentence inserted into every
document reads as an advertisement the moment someone opens two of them. If
the same claim appears in most of the library in near-identical words, vary it
or cut it. The same goes for forward-looking promises ("more X coming soon"):
repeated across a dozen documents, that stops being a note and becomes a
commitment.

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
| The cover logo is not the client's logo | A scaffolding tool left a decoy asset (v0 writes `public/icon.svg`); open the image and confirm it against the asset the app's own header renders |
| Library size doubles after adding a logo | A raster logo is embedded once per document; trace it to a path instead |
| `SyntaxError: Unexpected identifier` from a theme module | A backtick closed a CSS template literal early. Backticks inside comments in `export const CSS = ` ... ` ` break the module; write the word plainly |
| Tier chip renders as a full-width bar | `align-self: flex-start` with no flex parent; add `display: inline-block` |
| Watermark sits behind the title after a logo swap | Texture geometry is glyph-specific; re-tune size, position, and opacity for the new mark |
| Long SVG labels overflow their box | SVG has no word wrap; wrap in code and emit one `<text>` per line |
| A figure label collides with an axis end label | Draw it inside the band when wide enough, above it when not; never below, where the axis labels live |
| Device counts read as zero when scanning the rendered PDF | Letter-spaced small-caps extract with spaces between every glyph; strip all whitespace from both sides before matching |
| Adding depth re-skews a balance you already fixed | Deep-dives pull toward whatever they explain. Re-measure the ratio after adding content, not just the claims |
| `ERR_MODULE_NOT_FOUND: pdf-lib` from paginate/check/merge, and `NODE_PATH` does not fix it | ESM resolves packages from the SCRIPT's location, not the caller's env. On a machine without pdf-lib, `npm i pdf-lib` once in a scratch directory and copy the scripts beside that `node_modules`; run them from there against the PDF by absolute path |
| A cover gradient renders as a flat magenta slab in a pdf.js-based rasterizer (page review, thumbnails) | pdf.js limitation (`Unsupported ShadingType`), not a defect in the PDF. Verify the cover with a headless Chrome screenshot of the HTML instead. Or avoid the false alarm entirely: traced-path watermarks render faithfully everywhere, gradients do not |
| A grew-longer TOC strands its closing block on the next page | The `.toc` forces a break after itself, so an overflowing contents list leaves the next page nearly empty. Tighten row padding and let one-line descriptions win (`white-space: nowrap` on titles, wider description column) until the list plus its callout fit one page |
