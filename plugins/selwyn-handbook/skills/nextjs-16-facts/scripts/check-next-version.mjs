#!/usr/bin/env node
/**
 * check-next-version.mjs, the grounding half of the Next.js 16 Facts check.
 *
 * Reads the `next` version the target repo actually installed and reports
 * whether the bundled docs (node_modules/next/dist/docs) are present. Those
 * bundled docs are the authoritative API surface for that exact version, so
 * when they exist an agent should read them before writing routing, params,
 * caching, or config code, rather than trusting training data. The point is
 * to force the version check first; the reference doc carries the fast-recall
 * facts once the version is known.
 *
 * Usage:
 *   node check-next-version.mjs [project-dir]   # defaults to cwd
 *
 * Exit codes:
 *   0  Next.js found; version and docs status reported.
 *   1  Next.js not found in this project (wrong dir, or not a Next.js app).
 *   2  Could not read package.json / node_modules (see message).
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");

/** Read the declared next version from package.json, if any. */
function declaredVersion() {
  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return (
      pkg.dependencies?.next ??
      pkg.devDependencies?.next ??
      pkg.peerDependencies?.next ??
      null
    );
  } catch (err) {
    console.error(`check-next-version: cannot parse package.json (${err.message})`);
    process.exit(2);
  }
}

/** Read the installed (resolved) next version from node_modules, if present. */
function installedVersion() {
  const installedPkg = join(root, "node_modules", "next", "package.json");
  if (!existsSync(installedPkg)) return null;
  try {
    return JSON.parse(readFileSync(installedPkg, "utf8")).version ?? null;
  } catch {
    return null;
  }
}

function main() {
  const declared = declaredVersion();
  const installed = installedVersion();

  if (!declared && !installed) {
    console.error(
      "check-next-version: no `next` dependency found here. " +
        "Run this from the Next.js project root (pass the dir as an argument if needed).",
    );
    process.exit(1);
  }

  console.log("Next.js version");
  console.log(`  declared in package.json: ${declared ?? "not listed"}`);
  console.log(`  installed in node_modules: ${installed ?? "not installed (run install)"}`);

  const docsDir = join(root, "node_modules", "next", "dist", "docs", "01-app");
  const hasDocs = existsSync(docsDir);
  console.log("");
  console.log("Ground truth");
  if (hasDocs) {
    console.log(`  Bundled docs FOUND at node_modules/next/dist/docs/01-app.`);
    console.log(
      "  Read the relevant file there before writing routing, params, route",
    );
    console.log(
      "  handlers, metadata, or caching code. It overrides both memory and this skill.",
    );
  } else {
    console.log("  Bundled docs NOT found for this install.");
    console.log(
      "  Fall back to references/verified-facts.md, and confirm behavior against the",
    );
    console.log("  official docs for this exact version before trusting training data.");
  }

  process.exit(0);
}

main();
