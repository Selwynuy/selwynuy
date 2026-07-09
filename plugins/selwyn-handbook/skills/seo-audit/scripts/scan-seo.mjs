#!/usr/bin/env node
/**
 * scan-seo.mjs, the mechanical half of the SEO Audit.
 *
 * SEO in the App Router is typed exports Next.js turns into <head> tags and
 * crawler files. That makes most of it checkable: a page either exports
 * metadata or it does not. This script scans an app/ tree for the pieces of
 * the SEO layer and flags what looks bare, so a human confirms each gap.
 *
 * It is a signal finder, not a validator. It cannot tell whether a title is
 * GOOD, only whether one exists; it cannot run Google's Rich Results Test.
 * The judgment lives in references/seo-checklist.md.
 *
 * Usage:
 *   node scan-seo.mjs <app-dir>       # e.g. node scan-seo.mjs app
 *   node scan-seo.mjs .               # searches for an app/ dir under the path
 *
 * Exit codes:
 *   0  scan completed (read the output).
 *   2  no app directory found / unreadable path.
 */

import { readFileSync, statSync, readdirSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const SKIP_DIR = new Set(["node_modules", ".next", ".git", "dist", "build"]);

/** Find the app router dir: the given path if it is app/, else app/ or src/app/ under it. */
function findAppDir(target) {
  if (basename(target) === "app" && existsSync(target)) return target;
  for (const candidate of [join(target, "app"), join(target, "src", "app")]) {
    if (existsSync(candidate)) return candidate;
  }
  return existsSync(target) ? target : null;
}

/** Recursively collect .tsx/.ts/.jsx/.js files under a dir. */
function collect(dir, out) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) collect(full, out);
    else if (/\.(t|j)sx?$/.test(entry)) out.push(full);
  }
}

function read(file) {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

const isPage = (f) => /(^|[\\/])page\.(t|j)sx?$/.test(f);
const isRootLayout = (f, appDir) => {
  const rel = relative(appDir, f).replace(/\\/g, "/");
  return rel === "layout.tsx" || rel === "layout.jsx" || rel === "layout.ts" || rel === "layout.js";
};

function hasMetadataExport(text) {
  return (
    /export\s+(const|async\s+function|function)\s+(metadata|generateMetadata)\b/.test(text) ||
    /export\s+\{[^}]*\b(metadata|generateMetadata)\b/.test(text)
  );
}

function main() {
  const target = process.argv[2] ?? "app";
  const appDir = findAppDir(target);
  if (!appDir) {
    console.error(
      `scan-seo: no app directory found at or under "${target}". ` +
        "Pass the project root or the app/ directory.",
    );
    process.exit(2);
  }

  const files = [];
  collect(appDir, files);
  const cwd = process.cwd();
  const rel = (f) => relative(cwd, f) || f;

  const findings = [];

  // Root layout: metadataBase + title template.
  const rootLayout = files.find((f) => isRootLayout(f, appDir));
  if (!rootLayout) {
    findings.push(["ROOT", "No root layout found under app/. Set site-wide metadata defaults there."]);
  } else {
    const text = read(rootLayout);
    if (!/metadataBase\s*:/.test(text)) {
      findings.push([
        "ROOT",
        `${rel(rootLayout)}: no metadataBase. Relative OG/canonical URLs will not resolve. Set metadataBase: new URL(...) in the root layout.`,
      ]);
    }
    if (!/title\s*:\s*\{[\s\S]*?(template|default)\s*:/.test(text)) {
      findings.push([
        "ROOT",
        `${rel(rootLayout)}: no title.template/default. Add one so every route inherits the brand suffix and a fallback title.`,
      ]);
    }
    if (!/openGraph\s*:/.test(text)) {
      findings.push([
        "ROOT",
        `${rel(rootLayout)}: no default openGraph in the root layout. Set siteName/type/locale once so pages inherit them.`,
      ]);
    }
  }

  // Crawler files.
  const hasSitemap = files.some((f) => /(^|[\\/])sitemap\.(t|j)s$/.test(f));
  const hasRobots = files.some((f) => /(^|[\\/])robots\.(t|j)s$/.test(f));
  if (!hasSitemap) findings.push(["CRAWL", "No sitemap.ts under app/. Crawlers have no map; add one returning MetadataRoute.Sitemap."]);
  if (!hasRobots) findings.push(["CRAWL", "No robots.ts under app/. Add one returning MetadataRoute.Robots (and point it at /sitemap.xml)."]);

  // Open Graph image (static or generated), anywhere in the tree.
  const hasOgImage = files.some((f) => /opengraph-image\.(t|j)sx?$/.test(f)) ||
    existsSync(join(appDir, "opengraph-image.png")) ||
    existsSync(join(appDir, "opengraph-image.jpg"));
  if (!hasOgImage) {
    findings.push(["OG", "No opengraph-image found under app/. Add a static opengraph-image.png or a generated opengraph-image.tsx so shared links get a card."]);
  }

  // Per-page metadata + dynamic-route params footgun.
  for (const f of files) {
    if (!isPage(f)) continue;
    const text = read(f);
    if (!hasMetadataExport(text)) {
      findings.push([
        "PAGE",
        `${rel(f)}: exports no metadata or generateMetadata. It ships the layout default title. Add an intentional title, description, and alternates.canonical.`,
      ]);
    }
    // Next.js 16: params is a Promise. Reading params.slug directly is a bug.
    if (/\bparams\s*\.\s*\w+/.test(text) && !/await\s+params|use\(\s*params\s*\)/.test(text)) {
      findings.push([
        "PARAMS",
        `${rel(f)}: reads params.<x> directly. In Next.js 16 params is a Promise; await it (or use(params)) or metadata/OG will be undefined.`,
      ]);
    }
    if (hasMetadataExport(text) && !/canonical\s*:/.test(text)) {
      findings.push([
        "CANON",
        `${rel(f)}: has metadata but no alternates.canonical. Set one to avoid duplicate-content dilution.`,
      ]);
    }
  }

  console.log(`SEO audit of ${rel(appDir)} (${files.length} route files)\n`);
  if (findings.length === 0) {
    console.log("scan-seo: the SEO layer looks wired: metadataBase, title template, sitemap, robots, and an OG image are present, and pages export metadata.");
    console.log("Still validate the rendered <head> with Google's Rich Results Test and a social-card debugger before launch.");
    process.exit(0);
  }

  const byTag = {};
  for (const [tag, msg] of findings) {
    byTag[tag] = (byTag[tag] ?? 0) + 1;
    console.log(`  [${tag}] ${msg}`);
  }
  const summary = Object.entries(byTag).map(([t, n]) => `${t} ${n}`).join(", ");
  console.log(`\nscan-seo: ${findings.length} gap(s) to review — ${summary}.`);
  console.log("Each is a place to add or confirm the metadata by hand. See references/seo-checklist.md for the fix.");
  process.exit(0);
}

main();
