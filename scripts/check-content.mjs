#!/usr/bin/env node
/**
 * Content guard. Fails if user-visible source contains forbidden characters or
 * leaked scaffolding. Runs in CI and as a pre-commit hook so these regressions
 * never reach the repo again.
 *
 * Checks:
 *   1. No em-dash (U+2014) in authored source. Use commas, colons, parentheses.
 *   2. No stray "Replace Me" / "lorem ipsum" placeholders in shipped content.
 *
 * Scope: app/, components/, content/, lib/ (excludes node_modules, plans/,
 * scripts/, and *.md plan docs). Code comments are included on purpose: the
 * cost of avoiding an em-dash in a comment is zero, and it keeps the rule simple.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "content", "lib"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx", ".md", ".css"]);
const EM_DASH = "—";
const PLACEHOLDERS = [/replace me/i, /lorem ipsum/i];

/** Files allowed to contain placeholders (still-pending real content). */
const PLACEHOLDER_ALLOW = [
  // Portfolio data now holds real content; the guard protects it. Add a path
  // here only if a file legitimately needs a placeholder during development.
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const problems = [];
for (const root of ROOTS) {
  let files;
  try {
    files = walk(root);
  } catch {
    continue; // root may not exist yet
  }
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (line.includes(EM_DASH)) {
        problems.push(`${file}:${i + 1}  em-dash (U+2014): ${line.trim().slice(0, 80)}`);
      }
      if (!PLACEHOLDER_ALLOW.some((a) => file.endsWith(a))) {
        for (const re of PLACEHOLDERS) {
          if (re.test(line)) {
            problems.push(
              `${file}:${i + 1}  placeholder: ${line.trim().slice(0, 80)}`,
            );
          }
        }
      }
    });
  }
}

if (problems.length > 0) {
  console.error("\nContent guard failed:\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    `\n${problems.length} issue(s). Replace em-dashes with commas/colons/parentheses; remove placeholders.\n`,
  );
  process.exit(1);
}
console.log("Content guard passed: no em-dashes or stray placeholders.");
