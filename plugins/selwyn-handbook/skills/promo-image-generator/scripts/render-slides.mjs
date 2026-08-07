#!/usr/bin/env node
/**
 * render-slides.mjs, the mechanical half of the Promo Image Generator.
 *
 * Renders HTML to PNG with a browser the machine already has: headless
 * Chrome, Edge, or Chromium via --screenshot. No npm installs, no Puppeteer
 * download, no design tool. The page's own CSS decides what the image looks
 * like; this script finds a browser, sets the canvas, and drives it.
 *
 * It is a renderer, not a designer. Whether the image is GOOD (arc, legible
 * at thumbnail size, honest about what it shows) is decided in the HTML you
 * feed it; the rules live in references/promo-design.md and the starting
 * point in templates/carousel.mjs.
 *
 * Usage:
 *   node render-slides.mjs <slide.html> [more.html ...]   # sibling .png each
 *   node render-slides.mjs html/*.html --out-dir out
 *   node render-slides.mjs slide.html --size 1080x1350    # portrait feed
 *   node render-slides.mjs slide.html --scale 2           # default; 2400px
 *   node render-slides.mjs slide.html --browser "C:/path/chrome.exe"
 *   node render-slides.mjs sheet.html --quiet            # no advice, for scripts
 *
 * Canvas resolution order: --size flag, then a
 * `<meta name="promo-canvas" content="1200x1200">` in the file, then
 * 1200x1200. The rendered pixel size is canvas x scale.
 *
 * Browser resolution order: --browser flag, CHROME_PATH env, then known
 * install locations for Chrome / Edge / Chromium per platform, then PATH.
 *
 * Exit codes:
 *   0  every PNG rendered (dimensions reported, read the output).
 *   1  a render failed or produced an empty file.
 *   2  bad usage or no browser found.
 */

import { existsSync, statSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname, basename, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  console.log(
    "Usage: node render-slides.mjs <slide.html> [more.html ...] [--out-dir dir] [--size WxH] [--scale N] [--browser path]",
  );
  process.exit(args.length === 0 ? 2 : 0);
}

/** Pull `--flag value` out of the arg list, returns [value|null, rest]. */
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
let outDir, sizeFlag, scaleFlag, browserFlag;
const quiet = rest.includes("--quiet");
rest = rest.filter((a) => a !== "--quiet");
[outDir, rest] = takeFlag(rest, "--out-dir");
[sizeFlag, rest] = takeFlag(rest, "--size");
[scaleFlag, rest] = takeFlag(rest, "--scale");
[browserFlag, rest] = takeFlag(rest, "--browser");

const inputs = rest;
if (inputs.length === 0) {
  console.error("No input .html files given.");
  process.exit(2);
}
const scale = Number(scaleFlag) || 2;

function parseSize(text) {
  const m = /^\s*(\d{2,5})\s*[x×]\s*(\d{2,5})\s*$/i.exec(text || "");
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}
const sizeOverride = sizeFlag ? parseSize(sizeFlag) : null;
if (sizeFlag && !sizeOverride) {
  console.error(`--size wants WxH, e.g. 1080x1350 (got "${sizeFlag}")`);
  process.exit(2);
}

/** Candidate browser locations per platform, most preferred first. */
function browserCandidates() {
  const env = process.env;
  const fromEnv = [env.CHROME_PATH, env.EDGE_PATH].filter(Boolean);
  if (process.platform === "win32") {
    const pf = env["ProgramFiles"] || "C:\\Program Files";
    const pf86 = env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    const local = env["LOCALAPPDATA"] || "";
    return [
      ...fromEnv,
      join(pf, "Google/Chrome/Application/chrome.exe"),
      join(pf86, "Google/Chrome/Application/chrome.exe"),
      local && join(local, "Google/Chrome/Application/chrome.exe"),
      join(pf86, "Microsoft/Edge/Application/msedge.exe"),
      join(pf, "Microsoft/Edge/Application/msedge.exe"),
    ].filter(Boolean);
  }
  if (process.platform === "darwin") {
    return [
      ...fromEnv,
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
  }
  return fromEnv; // linux: fall through to PATH lookup below
}

/** Find an executable on PATH, cross-platform. */
function onPath(name) {
  const probe = process.platform === "win32" ? "where" : "which";
  const r = spawnSync(probe, [name], { encoding: "utf8" });
  if (r.status === 0 && r.stdout.trim()) return r.stdout.trim().split(/\r?\n/)[0];
  return null;
}

function findBrowser() {
  if (browserFlag) {
    if (existsSync(browserFlag)) return browserFlag;
    console.error(`--browser path not found: ${browserFlag}`);
    process.exit(2);
  }
  for (const candidate of browserCandidates()) {
    if (existsSync(candidate)) return candidate;
  }
  for (const name of [
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "chrome",
    "msedge",
  ]) {
    const hit = onPath(name);
    if (hit) return hit;
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  console.error(
    "No Chrome, Edge, or Chromium found. Install one, or point CHROME_PATH (or --browser) at the executable.",
  );
  process.exit(2);
}

/** PNG dimensions straight out of the IHDR chunk. No dependency needed. */
function pngSize(file) {
  try {
    const b = readFileSync(file);
    if (b.length < 24 || b.toString("latin1", 12, 16) !== "IHDR") return null;
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  } catch {
    return null;
  }
}

if (!quiet) console.log(`Browser: ${browser}\n`);
let failed = 0;

for (const input of inputs) {
  const inPath = resolve(input);
  if (!existsSync(inPath)) {
    console.error(`SKIP  ${input} (not found)`);
    failed++;
    continue;
  }

  const html = readFileSync(inPath, "utf8");
  const declared = /<meta\s+name=["']promo-canvas["']\s+content=["']([^"']+)["']/i.exec(html);
  const canvas = sizeOverride || (declared && parseSize(declared[1])) || { w: 1200, h: 1200 };

  const outPath = resolve(
    outDir || dirname(inPath),
    basename(inPath).replace(/\.html?$/i, "") + ".png",
  );
  mkdirSync(dirname(outPath), { recursive: true });

  // A throwaway profile per render. Sharing the default one makes the second
  // and later invocations block on its lock instead of failing, so a batch
  // hangs with nothing on stderr to explain why.
  const profile = mkdtempSync(join(tmpdir(), "promo-shot-"));
  const r = spawnSync(
    browser,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--force-device-scale-factor=" + scale,
      `--window-size=${canvas.w},${canvas.h}`,
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=10000",
      `--screenshot=${outPath}`,
      pathToFileURL(inPath).href,
    ],
    { encoding: "utf8", timeout: 120_000 },
  );
  rmSync(profile, { recursive: true, force: true });

  const ok = r.status === 0 && existsSync(outPath) && statSync(outPath).size > 0;
  if (!ok) {
    console.error(`FAIL  ${input}`);
    if (r.stderr) console.error(r.stderr.trim().split("\n").slice(-4).join("\n"));
    failed++;
    continue;
  }
  const kb = Math.round(statSync(outPath).size / 1024);
  const dim = pngSize(outPath);
  console.log(`OK    ${outPath}  (${dim ? `${dim.w}x${dim.h}, ` : ""}${kb} KB)`);
}

if (failed === 0 && !quiet) {
  console.log(
    "\nRendered. Now REVIEW the set, not the files: build a contact sheet " +
      "(scripts/contact-sheet.mjs) and look at every slide at once. Drift " +
      "between slides is invisible one at a time.",
  );
}
process.exit(failed > 0 ? 1 : 0);
