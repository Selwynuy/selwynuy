#!/usr/bin/env node
/**
 * carousel.mjs: the promo slide template. Copy this into the project, edit
 * the four blocks marked EDIT, run it, then render the HTML it writes:
 *
 *   node carousel.mjs                       # writes ./html/slide-N.html
 *   node ${SKILL}/scripts/render-slides.mjs html/*.html --out-dir out
 *   node ${SKILL}/scripts/contact-sheet.mjs out/slide-*.png
 *
 * One file rather than N hand-authored HTML files, on purpose. A carousel is
 * a sequence: the reader sees the slides back to back, so any drift in type
 * scale, margin or pill placement reads as sloppiness in a way it never would
 * on a standalone poster. Sharing one template makes drift impossible instead
 * of merely unlikely. Set SLIDES to a single entry for a one-off promo image.
 *
 * Read references/promo-design.md before editing. The layout numbers here are
 * load-bearing (see "Vertical budget" and "The watermark on a square"), and
 * the rules about what may appear in a screenshot are not style preferences.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "html");

// ===========================================================================
// EDIT 1: canvas and brand
// ===========================================================================

/**
 * Square by default. A square survives every crop a feed can apply to it,
 * which matters most where multi-image posts may be shown as a cropped
 * collage rather than a swipeable carousel. Other sizes in the reference.
 */
const CANVAS = { w: 1200, h: 1200 };

/** Lift these from the product's own stylesheet, not from a screenshot. */
const T = {
  page: "#fafbfc",
  surface: "#ffffff",
  line: "#e4e8ef",
  lineStrong: "#cfd6e0",
  subtle: "#9aa3b2",
  muted: "#6b7484",
  body: "#4e5666",
  ink: "#171c26",
  accent: "#2f578a",
  accentDeep: "#232f72",
  accentAlt: "#22736d",
  accentAltBright: "#2b9189",
  accentSoft: "#eff3fa",
};

const BRAND = { name: "PRODUCT", label: "BETA", site: "product.com" };

/** System stack only, and the same one the app renders in where possible. */
const FONT = '"Segoe UI", system-ui, -apple-system, sans-serif';

/**
 * EDIT 2: the brand mark, as vector paths.
 *
 * Not a PNG: blown up to 78% of the canvas a raster goes visibly soft, and a
 * raster cannot be tinted. Get the paths from whatever file the product's own
 * code draws (an inline SVG component, a paths JSON, the source .svg) so the
 * promo and the product are demonstrably the same mark. Leave `paths` empty
 * and the watermark simply does not render.
 */
const MARK = {
  viewBox: "0 0 100 100",
  paths: [
    // { d: "M...", fill: T.accent, opacity: 0.06 },
    // { d: "M...", fill: T.accentAlt, opacity: 0.12 },
  ],
};

// ===========================================================================
// Components
// ===========================================================================

const esc = (s) => String(s).replace(/&(?![a-z#])/g, "&amp;");

function watermark(corner = "tr") {
  if (!MARK.paths.length) return "";
  const paths = MARK.paths
    .map((p) => `<path d="${p.d}" fill="${p.fill}" fill-opacity="${p.opacity}" fill-rule="evenodd"/>`)
    .join("");
  return `<div class="wm ${corner}"><svg viewBox="${MARK.viewBox}" xmlns="http://www.w3.org/2000/svg">${paths}</svg></div>`;
}

const LOCKUP = `
  <div class="lockup">
    <span class="glyph">${
      MARK.paths.length
        ? `<svg viewBox="${MARK.viewBox}" xmlns="http://www.w3.org/2000/svg">${MARK.paths
            .map((p) => `<path d="${p.d}" fill="${p.fill}" fill-rule="evenodd"/>`)
            .join("")}</svg>`
        : ""
    }</span>
    <span class="name">${BRAND.name}</span>
    <span class="bar"></span>
    <span class="plat">${BRAND.label}</span>
    <span class="site">${BRAND.site}</span>
  </div>`;

/**
 * Redaction, done in CSS over the screenshot rather than in the pixels.
 *
 * Coordinates are percentages of the screenshot box, so they survive every
 * change to the mockup's size. Three modes:
 *   mask: flat fill, for something that should not be there at all
 *   blur: legible as a deliberate redaction, which a crop is not. Use it for
 *         real figures, and say so on the slide
 *   text: fill plus replacement text, for a real name that has to stay a
 *         name because an empty cell reads as a bug
 * Match `font` and `color` to the cell being replaced, italics and all.
 */
function redactions(src, list = []) {
  return list
    .map((r) => {
      const box = `left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%`;
      if (r.mode === "blur") {
        // A copy of the shot, offset and blurred, sized so its own box lines
        // up with the original underneath. backdrop-filter would be tidier
        // but needs compositing that headless Chrome cannot be relied on for.
        return `<div class="rd blur" style="${box}"><img src="${src}" style="width:${(10000 / r.w).toFixed(3)}%;left:${(-r.x / r.w) * 100}%;top:${(-r.y / r.h) * 100}%;filter:blur(${r.radius || 7}px)"></div>`;
      }
      const fill = r.fill || T.surface;
      const label = r.mode === "text" ? `<span>${esc(r.text)}</span>` : "";
      const type = r.mode === "text" ? `font:${r.font || `italic 14px Georgia, serif`};color:${r.color || T.muted};` : "";
      return `<div class="rd" style="${box};background:${fill};${type}">${label}</div>`;
    })
    .join("");
}

/**
 * A whole app screen inside a laptop.
 *
 * The base runs wider than the lid on both sides; that overhang is the entire
 * silhouette cue, and without it the drawing reads as a monitor. The browser
 * bar stays: a screenshot in a laptop could be a desktop app, and the chrome
 * plus a real URL are what say "this runs in a tab".
 */
function laptop(src, url, { top = 500, redact = [] } = {}) {
  const left = 26;
  const width = CANVAS.w - left * 2 - 52; // base overhang lands on the edges
  return `
  <div class="laptop" style="left:${left}px;top:${top}px;width:${width}px">
    <div class="lid">
      <div class="cam"></div>
      <div class="screen">
        <div class="chrome"><i></i><i></i><i></i><span class="url">${esc(url)}</span></div>
        <div class="shot"><img src="${src}" alt="">${redactions(src, redact)}</div>
      </div>
    </div>
    <div class="base"></div>
  </div>`;
}

/** A plain browser window. Lighter than the laptop; better on wide canvases. */
function windowShot(src, url, { left = 88, top = 520, width = 1000, redact = [] } = {}) {
  return `
  <div class="win" style="left:${left}px;top:${top}px;width:${width}px">
    <div class="chrome"><i></i><i></i><i></i><span class="url">${esc(url)}</span></div>
    <div class="shot"><img src="${src}" alt="">${redactions(src, redact)}</div>
  </div>`;
}

/**
 * The claim the screen behind it is making, at a size a feed can read.
 *
 * A whole app screen at this scale renders the product's own type far too
 * small to read on a phone. That is the price of showing the whole screen and
 * this is what pays it: the screenshot is the proof, the pill is the argument.
 * Place it clear of whatever the slide is actually pointing at.
 */
function pill(title, detail, { left = 660, top = 948 } = {}) {
  return `
  <div class="pill" style="left:${left}px;top:${top}px">
    <span class="ico">${TICK}</span>
    <span><span class="t">${esc(title)}</span><span class="d">${esc(detail)}</span></span>
  </div>`;
}

const TICK = `<svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M4 10.4l4 4 8-9" stroke="${T.accentAltBright}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW = `<svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d="M3.5 10h12M11 5.5l4.5 4.5L11 14.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function checks(items, { left = 88, top = 552 } = {}) {
  const rows = items
    .map((t) => `    <div class="check">${TICK}<span>${t}</span></div>`)
    .join("\n");
  return `\n  <div class="checks" style="left:${left}px;top:${top}px">\n${rows}\n  </div>`;
}

function cta(label, { left = 88, top = 660 } = {}) {
  return `\n  <div class="cta" style="left:${left}px;top:${top}px">${label}${ARROW}</div>`;
}

function note(text, { left = 88, top = 800, width = 1010 } = {}) {
  return `\n  <p class="note" style="left:${left}px;top:${top}px;width:${width}px">${text}</p>`;
}

function foot(text) {
  return `\n  <p class="foot">${text}</p>`;
}

// ===========================================================================
// EDIT 3: the slides
// ===========================================================================

/**
 * A sequence with an arc, not a shelf of features. Slide 1 is the thumbnail
 * and most people see only it, so it leads with the reader's problem. The
 * last slide is the CTA and nothing comes after it. Rotate `corner` so seven
 * backgrounds do not read as seven copies of one.
 *
 * Headlines are two lines: a statement, then a greyed line that turns it. At
 * 60px two lines fit the vertical budget with the mockup; three do not.
 */
const SLIDES = [
  {
    corner: "tr",
    badge: "NOW IN BETA &middot; 50 TESTERS",
    h1: "The thing they are afraid of.<br><span class='muted'>Said back to them.</span>",
    sub: "One sentence of what it does, in their words, with the single "
      + "concrete <strong>noun that proves it is real</strong>.",
    body:
      laptop("../shots/screen-one.png", `${BRAND.site}/the-page`, {
        redact: [
          // A browser scrollbar down the right edge. Inside a drawn laptop it
          // reads as a rendering fault, and a flat fill in the page colour is
          // all it takes. Same recipe for a sidebar's own scrollbar.
          // { x: 98.9, y: 0, w: 1.1, h: 100, mode: "mask", fill: T.page },
          // Real figures. Blurred rather than cropped so it reads as a
          // decision, and the slide says so in `foot`.
          // { x: 36.5, y: 55, w: 62, h: 45, mode: "blur", radius: 9 },
          // A real third party's name, replaced rather than blanked.
          // { x: 24.6, y: 57.3, w: 8.7, h: 2.4, mode: "text",
          //   text: "Invented Client Co.", font: "italic 14px Georgia, serif",
          //   color: "#7a8595" },
        ],
      }) + pill("What is on this screen", "Said at a size a phone can read"),
    // foot: "Amounts blurred. They are my own, not a sample account.",
  },
  {
    corner: "bl",
    eyebrow: "The everyday bit",
    h1: "It is an ordinary app.<br><span class='muted'>The hard part happens later.</span>",
    sub: "The reassurance slide. Somebody frightened of the domain needs to "
      + "see a plain form before any of the rest lands.",
    body:
      laptop("../shots/screen-two.png", `${BRAND.site}/another-page`) +
      pill("A second claim", "From the screen behind it"),
  },
  {
    corner: "tl",
    eyebrow: "The offer",
    h1: "Fifty testers.<br><span class='muted'>Nothing to pay.</span>",
    h1Size: 66,
    sub: "State the terms plainly. Whatever is genuinely unusual about them "
      + "is the part worth saying out loud.",
    body:
      checks([
        "<b>Invite only.</b> One code, one account.",
        "<b>Seven days of everything.</b> No card, nothing renews.",
        "<b>Your data stays</b> in your account when it launches.",
        "<b>One group chat</b> with me in it, not a support queue.",
      ]) +
      note(
        "It is beta, so some of it will break, and telling me what broke is " +
          "the whole point.",
        { top: 900 },
      ),
  },
  {
    corner: "br",
    h1: "I had this problem<br>myself.<br><span class='muted'>So I built this.</span>",
    h1Size: 62,
    h1Top: 250,
    sub: "Two sentences of who you are and why you built it. This slide is "
      + "deliberately a different rhythm: mostly type, no UI.",
    body:
      cta("Comment <b>KEYWORD</b>") +
      note(
        "Say exactly what happens next, and make it something the reader can " +
          "do in one tap without leaving the feed.",
      ) +
      `\n  <p class="sig">Whatever disclaimer honesty requires.<br>Stated plainly, not buried.</p>`,
  },
];

// ===========================================================================
// EDIT 4: nothing below here usually needs changing
// ===========================================================================

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{width:${CANVAS.w}px;height:${CANVAS.h}px;overflow:hidden;
  font-family:${FONT};-webkit-font-smoothing:antialiased}
.stage{position:relative;width:${CANVAS.w}px;height:${CANVAS.h}px;
  background:${T.page};overflow:hidden}
.stage > *:not(.wm):not(.glow){position:absolute;z-index:1}

/* The mark oversized as texture. Two passes at different alphas: the
   secondary colour carries roughly twice the first because it covers a
   fraction of the area, and matched alphas turn the pair into a grey smudge.
   See "The watermark on a square" in the reference before touching the
   percentages; they are not the ones a full-viewport hero uses. */
.wm{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.wm svg{position:absolute;width:${Math.round(CANVAS.w * 0.78)}px;height:auto}
.wm.tr{-webkit-mask-image:radial-gradient(110% 110% at 100% 0%,#000 12%,transparent 82%)}
.wm.tr svg{top:-6%;right:-8%}
.wm.tl{-webkit-mask-image:radial-gradient(110% 110% at 0% 0%,#000 12%,transparent 82%)}
.wm.tl svg{top:-6%;left:-8%}
.wm.bl{-webkit-mask-image:radial-gradient(110% 110% at 0% 100%,#000 12%,transparent 82%)}
.wm.bl svg{bottom:-6%;left:-8%}
.wm.br{-webkit-mask-image:radial-gradient(110% 110% at 100% 100%,#000 12%,transparent 82%)}
.wm.br svg{bottom:-6%;right:-8%}

/* One cool light so the mockup lifts off the page. Keep it weak: with the
   mark this large, two textures fight. */
.glow{position:absolute;inset:0;z-index:0;background:radial-gradient(
  58% 42% at 82% 78%, rgba(54,173,163,.10), transparent 70%)}

.lockup{left:88px;top:80px;display:flex;align-items:center;gap:13px;
  width:${CANVAS.w - 176}px}
.lockup .glyph{display:flex;width:40px;height:40px}
.lockup .glyph svg{width:40px;height:auto}
.lockup .name{font-size:29px;font-weight:700;letter-spacing:-.005em;color:${T.ink}}
.lockup .bar{width:1px;height:22px;background:${T.lineStrong};margin:0 3px}
.lockup .plat{font-size:13px;font-weight:700;letter-spacing:.19em;color:${T.accentAlt}}
.lockup .site{margin-left:auto;font-size:17px;color:${T.subtle}}

.badge{left:88px;top:164px;display:inline-flex;align-items:center;gap:10px;
  padding:11px 21px 11px 17px;background:${T.surface};border:1px solid ${T.line};
  border-radius:999px;box-shadow:0 1px 2px rgba(23,28,38,.04);
  font-size:13.5px;font-weight:700;letter-spacing:.14em;color:${T.ink}}
.badge .dot{width:8px;height:8px;border-radius:50%;background:${T.accentAltBright};
  box-shadow:0 0 0 3.5px rgba(43,145,137,.16)}

.eyebrow{left:88px;top:172px;font-size:14px;font-weight:700;letter-spacing:.17em;
  text-transform:uppercase;color:${T.accent}}

h1{left:88px;width:${CANVAS.w - 176}px;font-weight:700;line-height:1.07;
  letter-spacing:-.03em;color:${T.ink}}
h1 .muted{color:${T.subtle}}

.sub{left:88px;width:960px;font-size:21px;line-height:1.58;color:${T.body}}
.sub strong{color:${T.ink};font-weight:600}

/* ---- the laptop ---- */
.laptop .lid{background:linear-gradient(180deg,#2c3341,#191e27);
  border-radius:21px 21px 7px 7px;padding:14px 14px 16px;
  box-shadow:0 44px 84px rgba(23,28,38,.26),0 10px 24px rgba(23,28,38,.11)}
.laptop .cam{width:6px;height:6px;border-radius:50%;background:#596273;margin:0 auto 8px}
.laptop .screen{border-radius:5px;overflow:hidden;background:${T.surface}}
.laptop .base{position:relative;height:15px;margin:0 -26px;
  background:linear-gradient(180deg,#dde1e8,#a8b0bd);border-radius:0 0 13px 13px;
  box-shadow:0 14px 26px rgba(23,28,38,.15)}
.laptop .base::after{content:"";position:absolute;left:50%;top:0;
  transform:translateX(-50%);width:108px;height:6px;background:#98a1b0;
  border-radius:0 0 7px 7px}

/* ---- a plain window ---- */
.win{background:${T.surface};border:1px solid ${T.line};border-radius:14px;
  overflow:hidden;box-shadow:0 34px 70px rgba(23,28,38,.15),0 6px 18px rgba(23,28,38,.06)}

.chrome{height:26px;display:flex;align-items:center;gap:6px;padding:0 12px;
  background:#f1f4f8;border-bottom:1px solid ${T.line}}
.chrome i{width:8px;height:8px;border-radius:50%;background:${T.lineStrong}}
.chrome .url{margin-left:9px;flex:1;height:15px;border-radius:999px;
  background:${T.surface};border:1px solid ${T.line};display:flex;align-items:center;
  padding:0 8px;font-size:8.5px;color:${T.subtle}}

.shot{position:relative;font-size:0}
.shot img{display:block;width:100%}
.rd{position:absolute;overflow:hidden;display:flex;align-items:center;
  padding-left:2px;line-height:1}
.rd.blur{padding:0}
.rd.blur img{position:absolute;max-width:none}

/* ---- overlays ---- */
.pill{display:flex;align-items:center;gap:15px;padding:16px 24px 16px 17px;
  background:rgba(255,255,255,.96);border:1px solid ${T.line};border-radius:15px;
  box-shadow:0 18px 38px rgba(23,28,38,.18),0 3px 8px rgba(23,28,38,.07)}
.pill .ico{flex:none;width:38px;height:38px;border-radius:10px;
  background:${T.accentSoft};display:flex;align-items:center;justify-content:center}
.pill .t{display:block;font-size:19px;font-weight:700;color:${T.ink}}
.pill .d{display:block;font-size:15px;color:${T.muted};margin-top:2px}

.checks{width:${CANVAS.w - 176}px;display:grid;gap:26px}
.check{display:flex;align-items:flex-start;gap:16px;font-size:25px;
  line-height:1.35;color:#3b4250}
.check svg{flex:none;margin-top:5px;width:26px;height:26px}
.check b{color:${T.ink};font-weight:700}

.cta{display:inline-flex;align-items:center;gap:14px;padding:22px 40px;
  background:${T.accentDeep};border-radius:999px;color:#fff;font-size:29px;
  font-weight:600;box-shadow:0 14px 32px rgba(35,47,114,.26)}
.cta b{font-weight:800;letter-spacing:.02em}

.note{font-size:19px;line-height:1.62;color:${T.muted}}
.note b{color:#262c38;font-weight:700}
.sig{left:88px;top:${CANVAS.h - 200}px;font-size:16px;line-height:1.6;color:${T.subtle}}
/* Anything a viewer would otherwise have to guess about, a blur or a mocked
   number, is said here rather than left ambiguous. */
.foot{left:88px;top:${CANVAS.h - 60}px;font-size:15px;color:${T.subtle}}
`;

function render(slide, i) {
  const size = slide.h1Size || 60;
  const top = slide.h1Top || 230;
  const lines = slide.h1.split("<br>").length;
  // Computed, not fixed: a fixed sub position leaves a hole under a two-line
  // headline and collides with a three-line one.
  const subTop = top + Math.round(lines * size * 1.07) + 26;

  const head = slide.badge
    ? `<div class="badge"><span class="dot"></span>${slide.badge}</div>`
    : slide.eyebrow
      ? `<div class="eyebrow">${slide.eyebrow}</div>`
      : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="promo-canvas" content="${CANVAS.w}x${CANVAS.h}">
<title>${BRAND.name} promo ${i}</title>
<style>${CSS}</style></head>
<body><div class="stage">
  ${watermark(slide.corner)}
  <div class="glow"></div>
${LOCKUP}
  ${head}
  <h1 style="top:${top}px;font-size:${size}px">${slide.h1}</h1>
  <p class="sub" style="top:${subTop}px">${slide.sub}</p>
${slide.body || ""}${slide.foot ? foot(slide.foot) : ""}
</div></body></html>
`;
}

mkdirSync(OUT, { recursive: true });
SLIDES.forEach((slide, i) => {
  const file = join(OUT, `slide-${i + 1}.html`);
  writeFileSync(file, render(slide, i + 1), "utf8");
  console.log(`wrote ${file}`);
});
console.log(`\n${SLIDES.length} slides. Render them, then build a contact sheet and review the set.`);
