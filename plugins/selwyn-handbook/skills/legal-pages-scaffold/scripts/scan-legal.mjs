#!/usr/bin/env node
/**
 * scan-legal.mjs, the mechanical half of the Legal Pages Scaffold skill.
 *
 * The five legal pages (Privacy, Terms, Disclaimer, Refunds, Data Deletion)
 * either exist as real routes or they do not, so most of this is checkable:
 * does the route exist, do the five pages share one layout component instead
 * of five hand-copied headers, does the footer link to them, and does a
 * payment integration exist without a matching Refunds page. This script
 * finds the gaps; references/legal-pages-checklist.md carries the judgment
 * (which pages actually apply, and what each one must say).
 *
 * It is a signal finder, not a validator. It cannot tell whether a
 * disclaimer's wording is correct, only whether the page, the layout, and
 * the footer link exist.
 *
 * Usage:
 *   node scan-legal.mjs <project-root>   # e.g. node scan-legal.mjs .
 *   node scan-legal.mjs app              # or point straight at app/
 *
 * Exit codes:
 *   0  scan completed (read the output).
 *   2  no app directory found / unreadable path.
 */

import { readFileSync, statSync, readdirSync, existsSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";

const SKIP_DIR = new Set(["node_modules", ".next", ".git", "dist", "build"]);
const CODE_EXT = /\.(t|j)sx?$/;

const PAGES = [
  { key: "privacy", label: "Privacy" },
  { key: "terms", label: "Terms" },
  { key: "disclaimer", label: "Disclaimer" },
  { key: "refunds", label: "Refunds" },
  { key: "data-deletion", label: "Data Deletion" },
];

const NO_AFFILIATION_RE = /not affiliated|no affiliation|not endorsed|no official affiliation/i;
const PAYMENT_RE = /stripe|paymongo|xendit|lemonsqueezy|paddle|paypal|razorpay|gcash|braintree/i;

/** Find the app router dir: the given path if it is app/, else app/ or src/app/ under it. */
function findAppDir(target) {
  if (basename(target) === "app" && existsSync(target)) return target;
  for (const candidate of [join(target, "app"), join(target, "src", "app")]) {
    if (existsSync(candidate)) return candidate;
  }
  return existsSync(target) ? target : null;
}

/** Best-effort project root: prefer a package.json alongside the target or above the app dir. */
function findProjectRoot(target, appDir) {
  if (existsSync(join(target, "package.json"))) return target;
  const appParent = dirname(appDir);
  if (existsSync(join(appParent, "package.json"))) return appParent;
  const grandparent = dirname(appParent);
  if (existsSync(join(grandparent, "package.json"))) return grandparent;
  return appParent;
}

/** Recursively collect code files (.ts/.tsx/.js/.jsx) under a dir. */
function collect(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) collect(full, out);
    else if (CODE_EXT.test(entry)) out.push(full);
  }
}

function read(file) {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

/** Strip Next.js route-group segments like (site) or (marketing) from a relative path. */
function stripGroups(relPath) {
  return relPath
    .split(/[\\/]/)
    .filter((seg) => !/^\(.*\)$/.test(seg))
    .join("/");
}

const isPageFile = (f) => /(^|[\\/])page\.(t|j)sx?$/.test(f);

function hasMetadataExport(text) {
  return (
    /export\s+(const|async\s+function|function)\s+(metadata|generateMetadata)\b/.test(text) ||
    /export\s+\{[^}]*\b(metadata|generateMetadata)\b/.test(text)
  );
}

function main() {
  const target = process.argv[2] ?? ".";
  const appDir = findAppDir(target);
  if (!appDir) {
    console.error(
      `scan-legal: no app directory found at or under "${target}". Pass the project root or the app/ directory.`,
    );
    process.exit(2);
  }
  const projectRoot = findProjectRoot(target, appDir);

  // One walk over the whole project covers app/ pages, components (layout,
  // footer), and lib (site-config, billing) without separate traversals.
  const allFiles = [];
  collect(projectRoot, allFiles);
  const appFiles = allFiles.filter((f) => relative(appDir, f) && !relative(appDir, f).startsWith(".."));

  const cwd = process.cwd();
  const rel = (f) => relative(cwd, f) || f;
  const findings = [];

  // Shared layout component, found early: the date check below needs to know
  // whether "last updated" lives there once instead of per page.
  const layoutFile = allFiles.find((f) => /legal-layout|legallayout/i.test(basename(f)));
  const layoutText = layoutFile ? read(layoutFile) : "";
  const sharedDate = /last\s+updated/i.test(layoutText);

  // 1. The five legal pages.
  const found = {};
  for (const p of PAGES) {
    const match = appFiles.find(
      (f) => isPageFile(f) && stripGroups(relative(appDir, f)).includes(`legal/${p.key}/page.`),
    );
    found[p.key] = match ?? null;
    if (!match) {
      findings.push(["MISSING", `No ${p.label} page found (expected legal/${p.key}/page.tsx under app/, route groups allowed).`]);
      continue;
    }
    const text = read(match);
    if (!hasMetadataExport(text)) {
      findings.push(["PAGE", `${rel(match)}: exports no metadata. It ships the layout default title, not an intentional, indexable one.`]);
    }
    if (!sharedDate && !/last\s+updated/i.test(text)) {
      findings.push(["DATE", `${rel(match)}: no visible "Last updated" date, and none found in a shared layout either. A dated policy is one you can prove was current when a given user read it.`]);
    }
  }

  // Legal hub page.
  const hasIndex = appFiles.some(
    (f) => isPageFile(f) && /(^|\/)legal\/page\.(t|j)sx?$/.test(stripGroups(relative(appDir, f))),
  );
  if (!hasIndex) {
    findings.push(["INDEX", "No legal/page.tsx hub found under app/. A visitor who finds one legal page should be able to find the rest."]);
  }

  // 2. Whether each present page imports the shared layout, if one exists.
  const presentPages = PAGES.filter((p) => found[p.key]);
  if (presentPages.length >= 2) {
    if (!layoutFile) {
      findings.push([
        "LAYOUT",
        `${presentPages.length} legal pages exist with no shared layout component found (looked for a *legal-layout* file). Five hand-copied headers drift the moment one gets edited.`,
      ]);
    } else {
      const layoutName = basename(layoutFile).replace(CODE_EXT, "");
      const layoutImportRe = new RegExp(layoutName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      for (const p of presentPages) {
        const text = read(found[p.key]);
        if (!layoutImportRe.test(text) && !/LegalLayout/.test(text)) {
          findings.push(["LAYOUT", `${rel(found[p.key])}: does not appear to import the shared legal layout (${rel(layoutFile)}). Confirm it is not duplicating the header by hand.`]);
        }
      }
    }
  }

  // 3. Footer wiring. A footer is often inline in a root/site layout rather
  // than its own component, so look for a *footer* filename OR a <footer>
  // tag anywhere, and treat every match as one combined surface.
  const footerCandidates = allFiles.filter(
    (f) => /footer/i.test(basename(f)) || /<footer[\s>]/.test(read(f)),
  );
  if (footerCandidates.length === 0) {
    findings.push(["FOOTER", "No footer found (looked for a *footer* file or a <footer> tag). The five legal pages need a sitewide link, not just cross-links between themselves."]);
  } else {
    const footerText = footerCandidates.map(read).join("\n");
    if (!/\/legal/.test(footerText)) {
      findings.push(["FOOTER", `${footerCandidates.map(rel).join(", ")}: does not appear to link to /legal or its subpages. Content pages get more search traffic than /legal ever will.`]);
    }
    if (found.disclaimer) {
      const disclaimerText = read(found.disclaimer);
      if (NO_AFFILIATION_RE.test(disclaimerText) && !NO_AFFILIATION_RE.test(footerText)) {
        findings.push(["FOOTER", `${footerCandidates.map(rel).join(", ")}: the Disclaimer page states a no-affiliation line but the footer does not repeat it. State it in the footer too.`]);
      }
    }
  }

  // 4. Payment evidence without a matching Refunds page.
  if (!found.refunds) {
    let paymentEvidence = null;
    const pkgPath = join(projectRoot, "package.json");
    if (existsSync(pkgPath) && PAYMENT_RE.test(read(pkgPath))) {
      paymentEvidence = "package.json dependency";
    }
    if (!paymentEvidence) {
      const billingFile = allFiles.find((f) => /billing|entitlement|subscription/i.test(f));
      if (billingFile) paymentEvidence = rel(billingFile);
    }
    if (paymentEvidence) {
      findings.push(["REFUNDS", `Payment or billing evidence found (${paymentEvidence}) but no Refunds page. Payment processors and app stores expect a stated refund policy, and it reduces chargeback disputes.`]);
    }
  }

  console.log(`Legal pages scan of ${rel(projectRoot)}\n`);
  if (findings.length === 0) {
    console.log("scan-legal: all five pages are present, share a layout, are wired into the footer, and carry an update date.");
    console.log("Still read references/legal-pages-checklist.md for the content each page actually needs; presence is not correctness.");
    process.exit(0);
  }

  const byTag = {};
  for (const [tag, msg] of findings) {
    byTag[tag] = (byTag[tag] ?? 0) + 1;
    console.log(`  [${tag}] ${msg}`);
  }
  const summary = Object.entries(byTag).map(([t, n]) => `${t} ${n}`).join(", ");
  console.log(`\nscan-legal: ${findings.length} gap(s) to review, ${summary}.`);
  console.log("See references/legal-pages-checklist.md for which pages apply and the fix for each gap.");
  process.exit(0);
}

main();
