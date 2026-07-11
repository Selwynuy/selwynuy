#!/usr/bin/env node
/**
 * check-pdf.mjs — objective post-render checks a thumbnail review can miss.
 *
 * The one that matters: SHRINK-TO-FIT DETECTION. If any element in the source
 * HTML is wider than its page's printable area, Chrome silently scales the
 * ENTIRE document down and clips paint to the printable box. Covers render
 * inset in a white frame, text shrinks, page bottoms gain dead space — and at
 * thumbnail size it is easy to misread as fine. The scale is baked into each
 * page's content stream: the product of the first two `cm` matrix scales is
 * 0.75 (pt per CSS px) at 100%; anything lower means the document was shrunk.
 *
 * Checks per file: page count, page size, per-page scale. Exit 1 if any page
 * is shrunk. Run this after every layout change, before the visual review.
 *
 * Requires pdf-lib (`npm i -D pdf-lib`).
 *
 * Usage: node check-pdf.mjs <file.pdf> [more.pdf ...]
 */

import { PDFDocument, PDFName, PDFArray } from "pdf-lib";
import { readFileSync, existsSync } from "node:fs";
import zlib from "node:zlib";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node check-pdf.mjs <file.pdf> [more.pdf ...]");
  process.exit(2);
}

let failed = 0;
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`SKIP  ${file} (not found)`);
    failed++;
    continue;
  }
  const src = await PDFDocument.load(readFileSync(file));
  const n = src.getPageCount();
  const { width, height } = src.getPage(0).getSize();
  const shrunk = [];

  for (let i = 0; i < n; i++) {
    const page = src.getPage(i);
    let stream = src.context.lookup(page.node.get(PDFName.of("Contents")));
    if (stream instanceof PDFArray) stream = src.context.lookup(stream.get(0));
    let data;
    try {
      data = zlib.inflateSync(Buffer.from(stream.getContents()));
    } catch {
      data = Buffer.from(stream.getContents());
    }
    const scales = [...data.toString("latin1").matchAll(/(-?\.?[\d.]+) 0 0 (-?\.?[\d.]+) (-?[\d.]+) (-?[\d.]+) cm/g)]
      .slice(0, 2)
      .map((m) => Math.abs(parseFloat(m[1])));
    if (scales.length >= 2 && Math.abs(scales[0] * scales[1] - 0.75) > 0.005) {
      shrunk.push(`p${i + 1}=${(scales[0] * scales[1]).toFixed(3)}`);
    }
  }

  const mm = (pt) => (pt / 2.8346).toFixed(0);
  const status = shrunk.length ? "SHRUNK" : "OK";
  console.log(
    `${status.padEnd(6)}${file}  (${n} pages, ${mm(width)}x${mm(height)}mm${shrunk.length ? `, shrunk: ${shrunk.join(" ")}` : ", all pages at 100%"})`,
  );
  if (shrunk.length) {
    console.log("       -> something in the HTML exceeds the printable width; find and remove it (see references/print-design.md, shrink-to-fit trap)");
    failed++;
  }
}

process.exit(failed > 0 ? 1 : 0);
