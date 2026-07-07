#!/usr/bin/env node
/**
 * check-slop.mjs, the mechanical half of the anti-slop check.
 *
 * Scans a file (or stdin) for the AI-writing tells a regex can catch reliably:
 * em-dashes and a small set of high-signal slop phrases. Prints every offending
 * line with its number and exits non-zero if any are found, so an agent can run
 * it, see the hits, and self-correct before showing its writing. The judgment
 * calls (inflated vocabulary in context, manufactured contrasts, hedging) live
 * in references/slop-rules.md; this catches the unambiguous ones fast.
 *
 * Usage:
 *   node check-slop.mjs <file>
 *   cat draft.md | node check-slop.mjs
 */

import { readFileSync } from "node:fs";

/** High-signal patterns. Each is [label, regex]. Kept conservative to avoid
 *  false positives; the reference doc covers the judgment-call rules. */
const PATTERNS = [
  ["em-dash", /—/],
  ["en-dash used as em-dash", /\s–\s/],
  ["manufactured contrast", /\bnot just\b[^.?!]*\bbut\b/i],
  ["manufactured contrast", /\bit'?s not (?:about|that)\b[^.?!]*\bit'?s\b/i],
  ["hedging / throat-clearing", /\bit'?s worth noting that\b/i],
  ["filler opener", /\bin (?:today'?s|our) (?:world|digital age|fast-paced)\b/i],
  ["inflated vocab", /\b(?:delve|leverage|utili[sz]e|seamless(?:ly)?|robust|elevate|unleash|harness)\b/i],
  ["accented spelling of a plain English word", /(?:résumé|café|naïve|fiancé|fiancée|cliché)/i],
];

function read() {
  const file = process.argv[2];
  if (file) return readFileSync(file, "utf8");
  return readFileSync(0, "utf8"); // stdin
}

function main() {
  let text;
  try {
    text = read();
  } catch (err) {
    console.error(`check-slop: cannot read input (${err.message})`);
    process.exit(2);
  }

  const lines = text.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, i) => {
    for (const [label, re] of PATTERNS) {
      if (re.test(line)) hits.push({ n: i + 1, label, line: line.trim() });
    }
  });

  if (hits.length === 0) {
    console.log("check-slop: clean, no obvious tells found.");
    process.exit(0);
  }

  console.error(`check-slop: ${hits.length} issue(s) found:\n`);
  for (const h of hits) {
    console.error(`  line ${h.n} [${h.label}]: ${h.line}`);
  }
  console.error(
    "\nRewrite these in plain words. See references/slop-rules.md for the fix per tell.",
  );
  process.exit(1);
}

main();
