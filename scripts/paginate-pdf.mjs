#!/usr/bin/env node
/**
 * paginate-pdf.mjs — stamp page numbers onto a rendered PDF.
 *
 * Chrome's --print-to-pdf cannot number pages (counter(page) only works in
 * @page margin boxes, which Chrome does not implement). Rather than re-flow the
 * whole document through Paged.js and risk the tuned full-bleed cover, we
 * post-process the finished PDF: open it, draw a small centered page number in
 * the bottom margin of every page except the cover, and save. This never
 * touches the native pagination.
 *
 * The number sits inside the bottom margin, below the text block, in a subtle
 * gray. Page 1 (the full-bleed cover) is skipped. On dark divider pages the
 * gray number is effectively invisible, which reads as a clean unnumbered part
 * page — the book convention.
 *
 * Requires pdf-lib (`npm i -D pdf-lib`), the one optional dependency in this
 * skill; only the post-processing scripts need it, rendering does not.
 *
 * Usage: node paginate-pdf.mjs [--skip-last] <file.pdf> [more.pdf ...]
 *   --skip-last  also leave the final page unnumbered (a dark back cover).
 * Edits each file in place. Re-run after every re-render.
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

let skipLast = false;
const files = process.argv.slice(2).filter((a) => {
  if (a === "--skip-last") {
    skipLast = true;
    return false;
  }
  return true;
});
if (files.length === 0) {
  console.error("usage: node paginate-pdf.mjs [--skip-last] <file.pdf> [more.pdf ...]");
  process.exit(2);
}

let failed = 0;
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`SKIP  ${file} (not found)`);
    failed++;
    continue;
  }
  const pdf = await PDFDocument.load(readFileSync(file));
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  pages.forEach((page, i) => {
    if (i === 0) return; // skip the full-bleed cover
    if (skipLast && i === pages.length - 1) return; // skip the back cover
    const { width } = page.getSize();
    const label = String(i + 1);
    const size = 8;
    const w = font.widthOfTextAtSize(label, size);
    page.drawText(label, {
      x: (width - w) / 2,
      y: 34, // ~12mm up from the bottom edge, inside a 24mm margin
      size,
      font,
      color: rgb(0.47, 0.45, 0.42),
    });
  });

  writeFileSync(file, await pdf.save());
  const last = skipLast ? pages.length - 1 : pages.length;
  console.log(`OK    ${file}  (${pages.length} pages, numbered 2-${last})`);
}

process.exit(failed > 0 ? 1 : 0);
