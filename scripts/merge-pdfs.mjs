#!/usr/bin/env node
/**
 * merge-pdfs.mjs — concatenate PDFs into one, in argument order.
 *
 * Exists for multi-part books: interior pages cannot bleed to the paper edge
 * in Chrome's CLI renderer, so each full-bleed interior page (a part divider)
 * is rendered as its OWN single-page document — where it is page 1 and
 * `@page { margin: 0 }` applies, exactly like a cover — and the piece PDFs are
 * merged here, then page-numbered by paginate-pdf.mjs. Name pieces with
 * sortable prefixes (00-front, 10-divider, 11-part, ...) so filename order is
 * book order. See references/print-design.md, "split-render-and-merge".
 *
 * Requires pdf-lib (`npm i -D pdf-lib`).
 *
 * Usage: node merge-pdfs.mjs <out.pdf> <in1.pdf> <in2.pdf> [...]
 */

import { PDFDocument } from "pdf-lib";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [out, ...ins] = process.argv.slice(2);
if (!out || ins.length < 2) {
  console.error("usage: node merge-pdfs.mjs <out.pdf> <in1.pdf> <in2.pdf> [...]");
  process.exit(2);
}

const merged = await PDFDocument.create();
for (const file of ins) {
  if (!existsSync(file)) {
    console.error(`missing input: ${file}`);
    process.exit(1);
  }
  const src = await PDFDocument.load(readFileSync(file));
  const pages = await merged.copyPages(src, src.getPageIndices());
  pages.forEach((p) => merged.addPage(p));
}
writeFileSync(out, await merged.save());
console.log(`OK    ${out}  (${merged.getPageCount()} pages from ${ins.length} pieces)`);
