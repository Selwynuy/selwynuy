# The promo image rulebook

Read this before authoring any HTML. Most of it is writing rules, not styling
rules: applying them after rendering means re-authoring the slide.

---

## 1 · The audience does not know what your product is

This is the rule the rest hangs off. A promo image is seen by somebody who has
never heard of the product, scrolling, on a phone, at maybe 400px wide, deciding
in under a second whether to stop.

Three things follow:

**Show the whole screen, not the interesting panel.** The instinct is to crop to
the table or the card that makes the point, because it composes better. It fails
the job: a cropped panel does not tell a stranger this is software, and it
certainly does not tell them it runs in a browser. Show the app entire: sidebar,
top bar, browser chrome, real URL. The sidebar is doing real work for free: it
shows the fourteen other things the product does without spending a word of copy
on them.

**Put it in a device.** A bare screenshot is a picture of a thing. A screenshot
in a laptop is a product someone uses. For a web app keep the browser bar inside
the device, because a screenshot in a laptop could just as easily be a desktop
app and the URL is what settles it.

**Pay for the legibility you just lost.** A whole screen at device scale renders
the app's own type unreadable in a feed. Every slide therefore carries one
floating pill restating the single claim that screen is making, in 19px type on
a 1200px canvas. The screenshot is the proof; the pill and the headline are the
argument. If you cannot name the one claim, the screen does not belong in the
set.

## 2 · A carousel is a sequence, not a shelf

- **The slides need an arc.** Each one earns the swipe to the next. A working
  default: the reader's problem → the reassurance that it is an ordinary app →
  the strongest single reason to care → the fear it removes → the proof of depth
  → the offer → the close. Cut from the middle, never from either end.
- **Slide 1 is the thumbnail and most people see only it.** It must work with
  none of the others present, and it should lead with the reader's problem
  rather than with the product's name.
- **The last slide is the CTA.** Nothing comes after it.
- **Consistency matters far more than on a standalone poster.** Seen back to
  back, a headline two pixels lower or a pill in a different corner reads as
  sloppiness. This is why the slides come out of one template rather than N
  hand-authored files.
- **One caption for the whole post**, not one per image.

## 3 · The CTA must be the product's actual door

Look at what a reader can really do, in the code, before writing the CTA. If
signup is behind an invite gate, "sign up" and a link convert nobody and the
post is wasted, so the CTA has to be the thing that actually gets them in
(comment, DM, join a chat). If checkout is disabled, do not imply a purchase.

Ask, in this order: what happens when a stranger acts on this? Is that path
open? Is it open *today*, before the post goes out? Anything that has to exist
before the first comment lands (a group chat, a waitlist form, a code batch)
gets made first, because the first comment arrives within minutes.

## 4 · What may appear in a screenshot

Assume every pixel will be zoomed into by somebody. Before a shot is composed:

- **Nothing that identifies a third party.** A real client name in a real ledger
  is somebody who did not agree to be in an advertisement.
- **No account identifiers** you would not print on a billboard: tax IDs,
  customer numbers, internal IDs, email addresses.
- **No figures you would not publish.** Your own revenue counts.
- **No trial or upgrade banners, no negative totals, no ▼99% deltas, no empty
  tables.** These are all true and all read as "the product is not working".
- **No scrollbars.** In a drawn device they read as a rendering fault.

**The real fix is a demo account with invented data**, shot end to end. Scrubbing
is a patch: it costs a careful pass on every new screenshot forever and one
missed cell is a live disclosure. Build the demo account when the set is worth
more than one post.

### Redact in CSS, not in the pixels

Position overlays over the screenshot inside the slide HTML. No image library,
no Python, and you can nudge coordinates while looking at what is underneath.
`templates/carousel.mjs` takes percentages of the shot box, so redactions
survive every change to the mockup's size.

| Mode | For | Why not something else |
|---|---|---|
| `mask` | Scrollbars, banners, anything that should not be there | A flat fill in the page colour is invisible |
| `blur` | Real figures | A blur is legible as a deliberate redaction; a crop just looks like a crop, and the viewer never knows something was removed |
| `text` | A real name that has to stay a name | An empty cell in a ruled table reads as a bug. Match the font, size and colour of the cell: a table rendered with Tailwind's `font-serif` is Georgia on Windows, so Georgia italic is an exact match, not an approximation |

Two things to check every time:

- **Zoom to full size and confirm the fill actually covers the original.** A box
  two pixels short leaves a legible ascender poking out, and at thumbnail size
  you will not see it.
- **Say what you blurred, on the slide.** A grey smudge with no explanation
  reads as a bug; "Amounts blurred, they are my own" reads as honesty and costs
  one line. That is what the `foot` slot is for.

One caveat: CSS redaction only cleans the *rendered PNG*. The original is still
in the shots folder. Do not ship the source folder anywhere the deliverable
goes, and if the underlying data is genuinely sensitive, fix it at capture.

## 5 · Resolution, and the one calculation to do first

Slides render at `canvas × scale`, default `1200 × 2 = 2400px`. A screenshot
displayed at *W* CSS px from a source *S* px wide is being scaled by
`(W × scale) / S`.

Work it out before choosing the mockup size:

- **≤ 1.0.** A downscale. Always crisp.
- **1.0 to ~1.3.** Mild upscale. Fine, because feeds resample the master down
  to roughly 1080 or 2048 wide anyway, which more than undoes it.
- **> 1.5.** Visible softness. Either shrink the mockup or recapture.

Capture at 2× device pixel ratio if you can (browser devtools device toolbar, or
a 2× display). A 3840px-wide capture makes every one of these decisions
disappear. A 1× capture of a 1920px window shown at 1120 CSS px on a 1200 canvas
lands at 1.18×, which is the practical ceiling for the laptop mockup.

## 6 · Canvas sizes

| Use | Canvas | Notes |
|---|---|---|
| Feed carousel, safest | 1200×1200 | Square survives every crop, including a collage grid |
| Portrait feed | 1080×1350 | More vertical room; crops badly to square |
| Link preview / OG | 1200×630 | Landscape, so use `windowShot`; the laptop does not fit |
| Story / reel | 1080×1920 | Keep everything out of the top and bottom 15% |

**Verify how the platform actually renders a multi-image post before committing
to a long set.** Facebook in particular has historically shown organic
multi-image posts as a cropped collage rather than a swipeable carousel; that is
mainly an *ad* format. Post a test set to your own timeline first. If it
collages, either drop to two or three images or make every headline survive a
centre-square crop. Either way the defensive move is the same: **design square,
keep everything important inside the middle ~85%, and make slide 1
self-sufficient.**

## 7 · Vertical budget on a square

The numbers in the template are load-bearing. On a 1200×1200 canvas with a
laptop:

```
  80   lockup
 170   eyebrow or badge
 230   headline, 60px, two lines
 384   sub, 21px, two lines            (computed from the headline, not fixed)
 500   laptop top
1116   laptop bottom
1140   footnote, if any
```

Which means: **two headline lines, not three.** At 66px a third line pushes the
laptop below where it fits. If a headline will not say it in two lines at 60px,
the headline is doing too much.

The sub's top is computed from the headline's line count rather than fixed. A
fixed one leaves a hole under a short headline and collides with a long one, and
you will spend a render cycle discovering that on each slide.

## 8 · The watermark on a square

The oversized brand mark, low opacity, bleeding off a corner, is what holds a
set together as one object. Copy the technique from the product's own site so
promo and product match:

- **Vector, not the PNG.** At 78% of the canvas a raster goes visibly soft, and
  a raster cannot be tinted.
- **Two passes at different alphas.** Roughly 0.06 for the primary and 0.12 for
  the secondary: the secondary covers a fraction of the area, and matched alphas
  collapse the pair into a grey smudge.
- **Bleed it off a corner, clip it, and fade it with a radial mask anchored at
  that corner.** The mask is the part that matters. Without it the strokes run
  through the headline and read as rendering noise; a linear mask leaves a hard
  diagonal edge that reads as a scratch.
- **Rotate the corner slide to slide**, keeping the treatment identical, so the
  set has rhythm without looking like N copies of one background.

**Do not copy a hero section's mask constants onto a square.** A `75% 75%` fade
is a percentage of the *box*, so on a tall viewport it covers the masthead and
on a 1200px square it kills everything more than ~650px from the corner, which
leaves one arm of the mark showing and no mark, texture that reads as a bug. On
a square, run the mask to about `110% 110%` and size the mark at ~78% of the
canvas. Never raise the opacity to make it more visible; that is how texture
becomes clutter.

**One texture at a time.** If the background already has the mark, drop the
grids, the ledger rules and the second gradient.

## 9 · Review the set, never the files

Render, then build a contact sheet and look at all of it at once
(`scripts/contact-sheet.mjs`). Tiles are deliberately small: if a slide fails at
420px it fails in a feed, which is the size that decides whether anyone stops.

Look for, in this order:

1. **Drift:** headline baseline, pill placement, mockup size, screenshot
   warmth, watermark weight. Invisible one file at a time, obvious in a row.
2. **Slide 1 alone.** Cover the others. Does it work?
3. **Anything a pill is covering** that the slide needed. A pill parked at the
   shared position will sometimes land on the one badge or number the slide is
   about; move that one and leave the rest.
4. **The arc.** Read the headlines in order with nothing else. Do they still
   make a sequence, or has it become a shelf of features?

## 10 · The caption is part of the deliverable

Ship a plaintext caption with the images, not a suggestion to write one.

- **Lead with the problem, not the product.** "I never knew what to put in my
  books" gets replies; "Introducing X" does not.
- **State the terms plainly:** what it costs, what stage it is at, what happens
  when the trial ends. Stated up front, it filters out the people who would
  churn and complain.
- **One CTA**, matching the slides exactly.
- **No link** where the CTA is a comment: it converts nobody and most feeds
  suppress reach on posts carrying one.
- Ship a **short variant** too. Many groups cap promo length or allow it only on
  a set day, and rewriting under pressure is how the claims drift.
- Note anything a commenter will predictably ask, including what the blur on
  slide 3 is.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The batch hangs with nothing on stderr | Chrome is blocking on the default profile's lock | A throwaway `--user-data-dir` per render; `render-slides.mjs` already does this |
| Screenshot looks soft | Displayed wider than roughly half its pixel width at scale 2 | Shrink the mockup or recapture at 2× (§5) |
| Watermark reads as diagonal stripes | Hero mask constants on a square canvas | Mask to ~110%, mark at ~78% (§8) |
| The sub collides with the headline, or floats far below it | Fixed sub position | Compute it from the headline's line count |
| The device reads as a monitor | The base is not wider than the lid | The overhang is the whole silhouette cue |
| Redaction leaves a legible sliver | Fill box short by a pixel or two | Check at full size, not on the contact sheet |
| Blur overlay is offset from what it should cover | Inner image offset maths | The copy must be `100/w × 100%` wide at `-x/w × 100%` left, `-y/h × 100%` top |
| Text looks different from the app's | Wrong font stack | Match what the app resolves to on this OS; Tailwind `font-serif` is Georgia on Windows |
