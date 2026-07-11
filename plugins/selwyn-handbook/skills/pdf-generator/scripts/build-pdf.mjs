#!/usr/bin/env node
/**
 * build-pdf.mjs, the mechanical half of the PDF Generator.
 *
 * Renders HTML to PDF with a browser the machine already has: headless
 * Chrome, Edge, or Chromium via --print-to-pdf. No npm installs, no
 * Puppeteer download, no wkhtmltopdf. The page's own @page CSS controls
 * size and margins; this script just finds a browser and drives it.
 *
 * It is a renderer, not a designer. Whether the PDF is GOOD (breaks, cover,
 * type, contrast) is decided in the HTML you feed it; the rules live in
 * references/print-design.md and the starting point in templates/guide.html.
 *
 * Usage:
 *   node build-pdf.mjs <input.html> [more.html ...]   # sibling .pdf per input
 *   node build-pdf.mjs guide.html --out out/guide.pdf # single input, exact path
 *   node build-pdf.mjs *.html --out-dir public/pdf    # many inputs, one dir
 *   node build-pdf.mjs guide.html --browser "C:/path/chrome.exe"
 *   node build-pdf.mjs guide.html --budget 20000      # ms of virtual time
 *
 * Browser resolution order: --browser flag, CHROME_PATH env, then known
 * install locations for Chrome / Edge / Chromium per platform, then PATH.
 *
 * Exit codes:
 *   0  every PDF rendered (sizes reported, read the output).
 *   1  a render failed or produced an empty file.
 *   2  bad usage or no browser found.
 */

import { existsSync, statSync, mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname, basename, join } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help")) {
  console.log(
    "Usage: node build-pdf.mjs <input.html> [more.html ...] [--out file.pdf | --out-dir dir] [--browser path] [--budget ms]",
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
let out, outDir, browserFlag, budget;
[out, rest] = takeFlag(rest, "--out");
[outDir, rest] = takeFlag(rest, "--out-dir");
[browserFlag, rest] = takeFlag(rest, "--browser");
[budget, rest] = takeFlag(rest, "--budget");

const inputs = rest;
if (inputs.length === 0) {
  console.error("No input .html files given.");
  process.exit(2);
}
if (out && inputs.length > 1) {
  console.error("--out only works with a single input; use --out-dir for many.");
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

/**
 * Best-effort page count: Chrome writes uncompressed /Type /Pages nodes.
 * The page tree can nest, so take the MAX /Count seen (the root's total),
 * never the first match (which may be a subtree).
 */
function pageCount(pdfPath) {
  try {
    const raw = readFileSync(pdfPath, "latin1");
    const counts = [...raw.matchAll(/\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/g)].map((m) =>
      Number(m[1]),
    );
    return counts.length ? Math.max(...counts) : null;
  } catch {
    return null;
  }
}

console.log(`Browser: ${browser}\n`);
let failed = 0;

for (const input of inputs) {
  const inPath = resolve(input);
  if (!existsSync(inPath)) {
    console.error(`SKIP  ${input} (not found)`);
    failed++;
    continue;
  }
  const outPath = out
    ? resolve(out)
    : resolve(outDir || dirname(inPath), basename(inPath).replace(/\.html?$/i, "") + ".pdf");
  mkdirSync(dirname(outPath), { recursive: true });

  // --virtual-time-budget lets webfonts and layout settle before printing;
  // --no-pdf-header-footer kills the default date/URL chrome would stamp on.
  const r = spawnSync(
    browser,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--virtual-time-budget=${Number(budget) || 15000}`,
      `--print-to-pdf=${outPath}`,
      pathToFileURL(inPath).href,
    ],
    { encoding: "utf8", timeout: 120_000 },
  );

  const ok = r.status === 0 && existsSync(outPath) && statSync(outPath).size > 0;
  if (!ok) {
    console.error(`FAIL  ${input}`);
    if (r.stderr) console.error(r.stderr.trim().split("\n").slice(-4).join("\n"));
    failed++;
    continue;
  }
  const kb = Math.round(statSync(outPath).size / 1024);
  const pages = pageCount(outPath);
  console.log(`OK    ${outPath}  (${kb} KB${pages ? `, ${pages} pages` : ""})`);
}

if (failed === 0) {
  console.log(
    "\nRendered. Now VERIFY the output: open each PDF and check the cover, page breaks, and fonts. A clean exit is not a design review.",
  );
}
process.exit(failed > 0 ? 1 : 0);
