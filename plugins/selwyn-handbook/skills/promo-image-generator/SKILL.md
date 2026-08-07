---
name: promo-image-generator
description: "Generate designed promo images and multi-slide social carousels from real product screenshots, using a browser the machine already has. Use when asked to make a launch graphic, a Facebook or LinkedIn or Instagram carousel, an OG image, a beta-recruiting post, or any social image that shows the product. HTML-first: composes slides from one shared template, puts whole app screens inside a laptop or browser mockup so a stranger recognises a web app, renders via headless Chrome --screenshot at 2x, and reviews the set on a contact sheet rather than file by file. Ships the arc for a carousel, CSS-overlay redaction for real data (mask, blur, replace) so screenshots are safe to publish, the oversized-brand-mark watermark, the resolution maths that decides mockup size, and a plaintext caption as part of the deliverable."
---

# Promo Image Generator

An HTML-to-PNG pipeline with the design half built in. The output is a promo
image or a carousel that shows the actual product, composed as HTML and
rendered by a browser that is already installed.

**Always HTML-first.** Never assemble a promo image in an image library. No
webfonts, no flexbox, no shadows worth having, no iteration, and it costs more
tokens for worse output. HTML is the design surface; the PNG is a compile
artifact. There are no dependencies at all: rendering, redaction and the
contact sheet all run on Node's standard library plus a browser.

## How to run it

1. **Read `references/promo-design.md` before writing any HTML.** It is mostly
   writing rules, not styling rules, so applying it afterwards means
   re-authoring. It covers: why whole screens beat crops for a cold audience,
   the arc a carousel needs, what may never appear in a screenshot, the
   resolution calculation that decides how big the mockup can be, the watermark
   maths (a hero's mask constants are wrong on a square and produce something
   that reads as a rendering fault), and the vertical budget.

2. **Work out what is actually live, and what the CTA can actually be.** This
   is a research step, not a formality, and it is where these posts usually go
   wrong. Read the product's own landing copy, pricing config, feature flags
   and signup path before writing a headline. If signup is behind an invite
   gate, a link in the caption converts nobody and the CTA has to be the door
   that is genuinely open. If billing is switched off, nothing may imply a
   purchase. **Write the findings down before designing**: what the product
   is, who it is for, what is free, what stage it is at, what a stranger can do
   today. Every headline on every slide has to stay true to that list.

3. **Get the screenshots, and decide what has to come out.** Capture at 2x if
   at all possible (§5 of the reference). Then check every shot against the
   list in §4: no third-party names, no account identifiers, no figures you
   would not publish, no trial banners, no negative totals, no empty tables, no
   scrollbars. **A demo account with invented data is the real fix**; scrubbing
   is a patch that costs a careful pass forever and fails silently once.

4. **Author the slides from `templates/carousel.mjs`.** Copy it into the
   project and edit the four blocks marked EDIT: canvas and brand tokens, the
   brand mark's vector paths, the slides, and rarely anything else. One file
   emits N slides from one template, which is the point. A carousel is seen
   back to back, so drift in type scale or pill placement reads as sloppiness
   in a way it never would on a standalone poster. Set `SLIDES` to a single
   entry for a one-off promo image.

   The template ships: the laptop mockup (base overhanging the lid, which is
   the entire silhouette cue) and a plain browser window for landscape
   canvases; the corner-bleeding brand watermark with a per-slide corner; the
   floating claim pill; check lists, CTA pill, note and footnote slots; and
   **CSS-overlay redaction** in three modes: `mask` for scrollbars and
   banners, `blur` for real figures, and `text` for a real name that has to
   stay a name, because an empty cell in a ruled table reads as a bug. Coordinates are
   percentages of the screenshot, so they survive resizing the mockup.

5. **Render.** `node ${CLAUDE_SKILL_DIR}/scripts/render-slides.mjs html/*.html
   --out-dir out`. Finds Chrome/Edge/Chromium across platforms, reads the
   canvas from the file's `promo-canvas` meta, renders at 2x, reports the pixel
   dimensions. `--size WxH`, `--scale N`, `--browser` as needed.

6. **Review the set, never the files.**
   `node ${CLAUDE_SKILL_DIR}/scripts/contact-sheet.mjs out/slide-*.png` tiles
   every slide into one image at deliberately small tiles: a slide that fails
   at 420px fails in a feed. Look for drift first (headline baseline, pill
   placement, screenshot warmth, watermark weight), then read slide 1 with the
   others covered, then check nothing a pill is parked on top of was needed,
   then read the headlines in order and ask whether they are still a sequence.
   Fix in the template and re-render.

7. **Ship the caption with the images.** Plaintext, in the same folder, not a
   suggestion that one be written. Lead with the reader's problem rather than
   the product, state the terms plainly, one CTA matching the slides exactly,
   no link where the CTA is a comment, plus a short variant for groups that cap
   promo length. Reference §10.

8. **Write down what shipped and what is still owed.** Which screenshots are
   scrubbed rather than invented, which platform behaviour is still unverified,
   what has to exist before posting. The next set is built by somebody without
   this session's context, quite possibly you.

## What this catches by construction

- **The cropped-panel trap**: the template's mockups take a whole screen, so
  the default is the thing that tells a stranger this is a web app.
- **Unreadable app type**: every screenshot slide has a pill slot, because
  showing the whole screen costs legibility and something has to pay for it.
- **Chrome hanging on a batch**: each render gets a throwaway `--user-data-dir`.
  Sharing the default profile makes the second invocation block on its lock
  rather than fail, so the build stops with nothing on stderr to explain why.
- **Silent upscaling**: the renderer reports real pixel dimensions, and the
  reference gives the one calculation that decides mockup size.
- **A watermark that reads as a scratch**: the template's mask is tuned for a
  square, not lifted from a full-viewport hero.
- **Headline and sub colliding, or floating apart**: the sub's position is
  computed from the headline's line count.
- **Drift across a sequence**: one template, one type scale, one set of
  margins, and a contact sheet step that makes any remaining drift obvious.
- **Publishing somebody else's data**: redaction is a first-class part of the
  slide, not a separate image-editing pass that is easy to skip.

## Bundled files

- `scripts/render-slides.mjs` (script): cross-platform renderer; finds an
  installed Chrome/Edge/Chromium, screenshots each HTML input at the declared
  canvas and scale, reports PNG dimensions. Zero dependencies.
- `scripts/contact-sheet.mjs` (script): tiles rendered slides into one review
  image by generating an HTML grid and rendering it with the same browser.
  Zero dependencies.
- `templates/carousel.mjs` (template): the slide generator, with brand tokens,
  watermark, laptop and browser mockups, claim pill, checks, CTA, and CSS
  redaction. Copy into the project and edit.
- `references/promo-design.md` (reference): the rulebook. The cold-audience
  rule, the carousel arc, matching the CTA to the product's real door, what may
  appear in a screenshot and how to redact it, resolution maths, canvas sizes
  and platform crop behaviour, the vertical budget, the watermark on a square,
  how to review a set, the caption, plus a troubleshooting table.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/promo-image-generator
