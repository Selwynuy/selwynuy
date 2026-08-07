#!/usr/bin/env node
/**
 * contact-sheet.mjs: tile every rendered slide into one image.
 *
 * A carousel is a sequence, and drift between slides is close to invisible
 * when you open them one at a time: a headline two pixels lower, a pill in a
 * different corner, one screenshot a shade warmer. Side by side it is
 * obvious in a second. So this is not a nicety, it is the review step.
 *
 * Zero dependencies: it writes an HTML grid that points at the PNGs and
 * renders that with render-slides.mjs, the same browser doing the same job.
 *
 * Usage:
 *   node contact-sheet.mjs out/slide-*.png
 *   node contact-sheet.mjs out/*.png --out review/sheet.png --cols 4
 *
 * Exit codes:
 *   0  sheet rendered.
 *   1  the render failed.
 *   2  bad usage or no inputs.
 */

import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  console.log("Usage: node contact-sheet.mjs <slide.png ...> [--out sheet.png] [--cols N]");
  process.exit(args.length === 0 ? 2 : 0);
}

function takeFlag(list, flag) {
  const i = list.indexOf(flag);
  if (i === -1) return [null, list];
  const value = list[i + 1];
  if (!value) {
    console.error(`${flag} needs a value`);
    process.exit(2);
  }
  return [value, [...list.slice(0, i), ...list.slice(i + 2)]];
}

let rest = args;
let outFlag, colsFlag;
[outFlag, rest] = takeFlag(rest, "--out");
[colsFlag, rest] = takeFlag(rest, "--cols");

const shots = rest.map((p) => resolve(p)).filter((p) => existsSync(p));
if (shots.length === 0) {
  console.error("No existing .png inputs given.");
  process.exit(2);
}

const outPath = resolve(outFlag || join(dirname(shots[0]), "contact-sheet.png"));
mkdirSync(dirname(outPath), { recursive: true });

// Tiles are deliberately small. If a slide fails at 420px it fails in a feed,
// which is the size that actually decides whether anyone stops scrolling.
const TILE = 420;
const GAP = 14;
const PAD = 18;
const cols = Math.max(1, Math.min(Number(colsFlag) || 4, shots.length));
const rows = Math.ceil(shots.length / cols);
const width = PAD * 2 + cols * TILE + (cols - 1) * GAP;
const height = PAD * 2 + rows * (TILE + 26) + (rows - 1) * GAP;

const cells = shots
  .map(
    (p, i) => `  <figure>
    <img src="${pathToFileURL(p).href}" alt="">
    <figcaption>${i + 1} &middot; ${basename(p)}</figcaption>
  </figure>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="promo-canvas" content="${width}x${height}">
<title>contact sheet</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${width}px;height:${height}px;background:#eef1f5;padding:${PAD}px;
    font-family:"Segoe UI",system-ui,sans-serif;overflow:hidden}
  .grid{display:grid;grid-template-columns:repeat(${cols},${TILE}px);gap:${GAP}px}
  figure{width:${TILE}px}
  img{display:block;width:${TILE}px;background:#fff;
    box-shadow:0 2px 10px rgba(20,25,35,.14)}
  figcaption{margin-top:6px;font-size:11px;color:#6b7484;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style></head>
<body><div class="grid">
${cells}
</div></body></html>
`;

// Same basename as the target, so render-slides names the PNG exactly
// what the caller asked for. Deleted either way once the render returns.
const tmpHtml = outPath.replace(/\.png$/i, "") + ".html";
writeFileSync(tmpHtml, html, "utf8");

// Scale 1: the sheet is for judging composition and consistency, not detail.
const r = spawnSync(
  process.execPath,
  [join(HERE, "render-slides.mjs"), tmpHtml, "--scale", "1", "--quiet",
   "--out-dir", dirname(outPath)],
  { encoding: "utf8", stdio: "inherit" },
);
rmSync(tmpHtml, { force: true });

if (r.status !== 0) process.exit(1);

console.log(
  `Contact sheet: ${outPath}\n\nLook for drift first: headline baseline, ` +
    `pill placement, screenshot warmth, watermark weight. Then read slide 1 ` +
    `alone and ask whether it works with none of the others. Then read the ` +
    `headlines in order and ask whether they are still a sequence.`,
);
