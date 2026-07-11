import fs from "node:fs";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL("../content/guides/", import.meta.url));
const read = (f) => fs.readFileSync(DIR + f, "utf8");
const seo = read("seo-foundations.html");
const aeo = read("aeo-foundations.html");
const geo = read("geo-foundations.html");
const stack = read("the-stack.html");
const clientkit = read("the-client-kit.html");

// Shared style block (identical across guides).
let style = seo.slice(seo.indexOf("<style>"), seo.indexOf("</style>") + 8);

// Inject part-divider + master-TOC CSS just before the .break rule.
const extraCss = `
  /* ---- Part dividers (mini-covers between the four parts) ---- */
  .part {
    /* A clean full dark panel filling the printable area exactly. Interior
       pages cannot bleed to the paper edge in the zero-dep Chrome renderer
       (negative margins trigger document-wide shrink-to-fit), so this reads as
       a deliberate framed divider. margin-top: 0 overrides the 9mm section
       margin and height stays 1mm under the 253mm printable height, or the
       panel splits and its tail paints onto the next page. */
    width: 100%; height: 252mm; margin-top: 0;
    background: var(--ink); color: var(--on-ink);
    padding: 26mm 22mm;
    display: flex; flex-direction: column; justify-content: center;
    page-break-before: always; page-break-after: always;
    page-break-inside: avoid;
    position: relative; overflow: hidden;
  }
  .part::before {
    content: ""; position: absolute; inset: auto -30mm -60mm auto;
    width: 160mm; height: 160mm;
    background: radial-gradient(closest-side, rgba(227,6,19,0.28), transparent 70%);
  }
  .part-kicker { font-family: "Geist Mono", monospace; font-size: 10pt; letter-spacing: 0.35em; text-transform: uppercase; color: var(--accent); }
  .part-title { margin-top: 6mm; font-size: 58pt; color: var(--on-ink); }
  .part-title em { font-style: normal; color: var(--accent); }
  .part-sub { margin-top: 8mm; max-width: 132mm; font-size: 12pt; line-height: 1.6; color: var(--on-ink-muted); }

  /* ---- Master table of contents (parts + section titles) ---- */
  .mtoc { page-break-before: always; page-break-after: always; }

  /* ---- Rights / edition page (front matter, after the cover) ---- */
  .rights { page-break-after: always; }
  .rights .lic { margin-top: 5mm; padding: 4.5mm 5.5mm; background: #f7f7f6; border: 1px solid #e4e2df; border-radius: 2mm; }
  .mtoc .grp { margin-top: 7mm; page-break-inside: avoid; }
  .mtoc .grp:first-of-type { margin-top: 6mm; }
  .mtoc .ph { display: flex; align-items: baseline; gap: 3mm; padding-bottom: 1.5mm; border-bottom: 1.5pt solid var(--text); }
  .mtoc .ph .pn { font-family: "Geist Mono", monospace; font-size: 7pt; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; background: var(--accent); padding: 0.6mm 1.8mm; border-radius: 1mm; }
  .mtoc .ph .pt { font-family: "Archivo", "Arial Narrow", sans-serif; font-weight: 800; font-stretch: 80%; text-transform: uppercase; letter-spacing: 0.02em; font-size: 12.5pt; }
  .mtoc ul { list-style: none; margin: 2.5mm 0 0 0; column-count: 2; column-gap: 8mm; }
  .mtoc li { font-size: 9pt; color: var(--muted); padding: 1mm 0; break-inside: avoid; }
  .mtoc li .m { font-family: "Geist Mono", monospace; font-size: 7pt; color: var(--accent); margin-right: 2mm; }
`;
style = style.replace("  .break { page-break-before: always; }", extraCss + "\n  .break { page-break-before: always; }");

// Extract the sections region (between </nav> and the colophon).
function bodySections(html) {
  const start = html.indexOf("</nav>") + "</nav>".length;
  const end = html.indexOf('<footer class="colophon">');
  return html.slice(start, end).trim();
}
let sSeo = bodySections(seo);
let sAeo = bodySections(aeo);
let sGeo = bodySections(geo);
let sStack = bodySections(stack);
let sClient = bodySections(clientkit);

// Pull out the shared "one foundation, three layers" map section (kicker 02) from
// SEO/AEO/GEO; keep SEO's copy to repurpose as the book intro. (The Stack's 02 is the
// tool matrix, so it is left intact.)
function splitMap(sections) {
  const k = sections.indexOf(">02 — The map<");
  if (k < 0) return { sections, map: null };
  const s = sections.lastIndexOf("<section", k);
  const e = sections.indexOf("</section>", k) + "</section>".length;
  return { sections: sections.slice(0, s) + sections.slice(e), map: sections.slice(s, e) };
}
let r = splitMap(sSeo); sSeo = r.sections; let intro = r.map;
sAeo = splitMap(sAeo).sections;
sGeo = splitMap(sGeo).sections;

// Pull each part's own "Sources" list OUT of its content entirely, so the book
// carries ONE combined bibliography at the very end instead of five scattered
// copies (one per part, each stranded mid-book right before the next divider).
// Runs BEFORE xref/stripNums below so a source title that happens to contain a
// phrase like "GEO Foundations" is never mangled into "...Part III..." by the
// cross-reference rewrite meant for body prose, not citation text.
function stripSources(sections) {
  const m = sections.match(/<h3 class="break">Sources<\/h3>\s*<ul class="sources">([\s\S]*?)<\/ul>/);
  if (!m) return { sections, items: [] };
  const items = [...m[1].matchAll(/<li>[\s\S]*?<\/li>/g)].map((x) => x[0]);
  return { sections: sections.replace(m[0], "").trim(), items };
}
const seoSrc = stripSources(sSeo); sSeo = seoSrc.sections;
const aeoSrc = stripSources(sAeo); sAeo = aeoSrc.sections;
const geoSrc = stripSources(sGeo); sGeo = geoSrc.sections;
const stackSrc = stripSources(sStack); sStack = stackSrc.sections;
const clientSrc = stripSources(sClient); sClient = clientSrc.sections;

// The "Companion to the SEO/AEO/GEO guides, selwynuy.dev/guides" self-reference
// in The Stack's and The Client Kit's own lists pointed a standalone-guide
// reader at the rest of the trilogy; inside one combined book that part is
// already right here, so the entry is dropped rather than carried forward.
const dropSelfRef = (items) => items.filter((li) => !li.includes("Companion to the SEO, AEO, and GEO Foundations guides"));

function sourceGroup(num, name, items) {
  if (!items.length) return "";
  return `    <h3>Part ${num} — ${name}</h3>
    <ul class="sources">
      ${items.join("\n      ")}
    </ul>
`;
}
const sourcesSection = `  <section>
    <p class="kicker mono">Bibliography</p>
    <h2 class="head display">Sources</h2>
    <p>
      Every citation from every part, gathered in one place. Grouped by part so you can
      trace a claim back to where it was made.
    </p>
${sourceGroup("I", "SEO", seoSrc.items)}
${sourceGroup("II", "AEO", aeoSrc.items)}
${sourceGroup("III", "GEO", geoSrc.items)}
${sourceGroup("IV", "The Stack", dropSelfRef(stackSrc.items))}
${sourceGroup("V", "The Client Kit", dropSelfRef(clientSrc.items))}
  </section>
`;

// Strip the "NN — " numeric prefix from every kicker (part dividers replace numbering).
const stripNums = (s) => s.replace(/(<p class="kicker mono">)\d+\s+—\s+/g, "$1");
[sSeo, sAeo, sGeo, sStack, sClient, intro] = [sSeo, sAeo, sGeo, sStack, sClient, intro].map(stripNums);

// Rewrite inter-guide cross-references into intra-book part references.
function xref(s) {
  return s
    .replace(/read <strong>SEO Foundations<\/strong>/g, "see <strong>Part I</strong>")
    .replace(/read <strong>AEO Foundations<\/strong>/g, "see <strong>Part II</strong>")
    .replace(/read <strong>GEO Foundations<\/strong>/g, "see <strong>Part III</strong>")
    .replace(/the SEO, AEO, and GEO guides/g, "Parts I to III")
    .replace(/The Stack companion/g, "Part IV")
    .replace(/the GEO guide/g, "Part III")
    .replace(/the AEO guide/g, "Part II")
    .replace(/the SEO guide/g, "Part I")
    .replace(/AEO Foundations/g, "Part II")
    .replace(/GEO Foundations/g, "Part III")
    .replace(/SEO Foundations/g, "Part I");
}
[sSeo, sAeo, sGeo, sStack, sClient, intro] = [sSeo, sAeo, sGeo, sStack, sClient, intro].map(xref);

// Turn the intro's "Read this guide if" router into a "How to read this book" note.
// The note goes right after the hero figure (not at the section's end) so it never
// strands alone on a near-blank page before the Part I divider's forced break.
// The two closing paragraphs are merged into one: this is the book's only short
// section immediately followed by the end of its document piece (the Part I
// divider starts a fresh document), so a short second paragraph would otherwise
// end up alone atop an almost-blank trailing page. A single flowing paragraph
// that happens to wrap across the page boundary reads as normal running text
// instead of a stranded fragment, and .intro-compact below shaves the figure and
// callout enough that both paragraphs usually fit on one page outright.
intro = intro
  .replace(">The map<", ">Introduction<")
  .replace(/<section>(\r?\n\s*<p class="kicker mono">Introduction<)/, '<section class="intro-compact">$1')
  .replace(/<div class="callout">[\s\S]*?<\/div>\s*<\/section>/, "</section>")
  .replace(
    /retrieve and cite\.\s*<\/p>\s*<p>\s*A page cannot win AEO/,
    "retrieve and cite. A page cannot win AEO",
  )
  .replace("</figure>", `</figure>
    <div class="callout">
      <p class="label">How to read this book</p>
      <p>
        Five parts, one method. <strong>Part I (SEO)</strong> gets you found and ranked.
        <strong>Part II (AEO)</strong> makes you the passage the engine extracts.
        <strong>Part III (GEO)</strong> gets your brand named and recommended by AI.
        <strong>Part IV (The Stack)</strong> is the tooling that measures all three.
        <strong>Part V (The Client Kit)</strong> is how to work on a client's site safely.
        Read straight through, or jump to the part that matches where you are stuck.
      </p>
    </div>`);

// Scoped spacing compaction for the book's intro only (never touches the
// standalone SEO guide, where this same section flows into section 03 with no
// forced break after it, so it never has this problem). Trims the figure and
// callout enough to close, or at least shrink, the trailing near-empty page.
const INTRO_CSS = `
  /* SVG is sized width:100%;height:auto elsewhere, so height only shrinks by
     shrinking width (auto height then follows the viewBox ratio); max-height
     alone does not reliably resize a plain width/height:auto SVG. */
  .intro-compact figure.fig { margin-top: 2.5mm; margin-bottom: 0; }
  .intro-compact figure.fig svg { width: 58%; margin: 0 auto; }
  .intro-compact figure.fig figcaption { margin-top: 1.2mm; }
  .intro-compact .plain { margin-top: 2.5mm; padding: 2.5mm 3.5mm; }
  .intro-compact .plain p { line-height: 1.42; }
  .intro-compact .callout { margin-top: 2.5mm; padding: 2.5mm 3.5mm; }
  .intro-compact p { margin-top: 2mm; line-height: 1.46; }
  .intro-compact h2.head { margin-top: 1.2mm; }
  .intro-compact .kicker { margin-bottom: 0; }
`;

// Part dividers.
function part(num, title, sub) {
  return `  <section class="part">
    <p class="part-kicker mono">Part ${num}</p>
    <h2 class="part-title display">${title}</h2>
    <p class="part-sub">${sub}</p>
  </section>
`;
}
const partI = part("I", "SEO", "How search works in 2026, the technical layer you control, and the content system that ranks and gets cited.");
const partII = part("II", "AEO", "Becoming the passage that snippets, People Also Ask, AI Overviews, and voice assistants extract and attribute.");
const partIII = part("III", "GEO", "Getting retrieved, cited, and recommended inside AI answers, with the evidence base and an honest map of the unknowns.");
const partIV = part("IV", "The&nbsp;Stack", "The tooling under all three: GA4, Tag Manager, Search Console, research and AI-visibility tools, wired together.");
const partV = part("V", "The&nbsp;Client&nbsp;Kit", "Working on someone else's site: getting access the safe way without a password, reading the CMS, and editing a live site without breaking it.");

// Master TOC: introduction + a group per part with its section titles.
function titles(sections) {
  const re = /<h2 class="head display">([\s\S]*?)<\/h2>/g;
  const out = [];
  let m;
  while ((m = re.exec(sections))) out.push(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
  return out;
}
function group(num, name, sections) {
  const items = titles(sections)
    .map((t, i) => `<li><span class="m">${String(i + 1).padStart(2, "0")}</span>${t}</li>`)
    .join("\n        ");
  return `    <div class="grp">
      <p class="ph"><span class="pn">Part ${num}</span><span class="pt">${name}</span></p>
      <ul>
        ${items}
      </ul>
    </div>`;
}
const mtoc = `  <nav class="mtoc">
    <p class="kicker mono">Contents</p>
    <h2 class="head display">The whole system</h2>
    <div class="grp">
      <p class="ph"><span class="pn">Intro</span><span class="pt">One foundation, three layers</span></p>
    </div>
${group("I", "SEO", sSeo)}
${group("II", "AEO", sAeo)}
${group("III", "GEO", sGeo)}
${group("IV", "The Stack", sStack)}
${group("V", "The Client Kit", sClient)}
  </nav>
`;

const cover = `  <header class="cover">
    <p class="cover-kicker mono">The Foundations · Complete Edition · selwynuy.dev/guides</p>
    <h1 class="cover-title display">The<br /><em>Foundations</em></h1>
    <p class="cover-sub">
      The complete 2026 system for getting found: SEO, AEO, GEO, the tooling under all three,
      and the field guide for working on client sites, as one connected method. Five parts,
      cited throughout, built to be read by a human or handed to an AI whole.
    </p>
    <div class="cover-meta mono">
      <span><strong>Selwyn Uy</strong> · selwynuy.dev</span>
      <span>Edition 2026.07</span>
    </div>
  </header>
`;

const colophon = `  <footer class="colophon">
    <span>Selwyn Uy — selwynuy.dev/guides</span>
    <span>The Foundations · Complete Edition · 2026.07</span>
  </footer>`;

// Rights / edition page: front matter a sold ebook needs. Sits on page 2, right
// after the full-bleed cover; the master TOC that follows breaks to its own page.
const rights = `  <section class="rights">
    <p class="kicker mono">The Foundations · Complete Edition</p>
    <h2 class="head display">Rights and edition</h2>
    <p>Edition 2026.07. First published July 2026 at selwynuy.dev/guides.</p>
    <div class="lic">
      <p>
        <strong>© 2026 Selwyn Uy. All rights reserved.</strong> This ebook is licensed for the
        personal use of the original purchaser. Use everything inside it in your own work and
        for your clients freely; please do not resell, repost, or redistribute the file itself.
      </p>
    </div>
    <h3>About this edition</h3>
    <p>
      Everything here is current as of July 2026 and cited to primary sources throughout.
      Search, AI answer engines, and the tools around them move fast: prices and platform
      menus drift, so verify anything time-sensitive against the vendor before you quote it.
      This book is independent and vendor-neutral. It is not affiliated with, authorized by,
      or endorsed by Google, OpenAI, Microsoft, or any product named inside.
    </p>
  </section>
`;

// Closing back cover: a dark full-bleed bookend that mirrors the front cover.
// Rendered as its own single-page piece so @page :first margin 0 bleeds it.
const closing = `  <header class="cover">
    <p class="cover-kicker mono">The Foundations · Complete Edition · selwynuy.dev/guides</p>
    <h1 class="cover-title display">Now go<br /><em>build.</em></h1>
    <p class="cover-sub">
      The guides are the map; the work is repetition. Pick one page or one client, run the
      loop, keep a change log, and let the compounding do the rest. You have the whole system
      now, from getting crawled to getting cited to getting hired.
    </p>
    <div class="cover-meta mono">
      <span><strong>Selwyn Uy</strong> · selwynuy.dev/guides</span>
      <span>Edition 2026.07</span>
    </div>
  </header>
`;

// ---------------------------------------------------------------------------
// Emit the book as PIECES rather than one monolith. Reason: interior pages
// cannot bleed to the paper edge in Chrome's CLI renderer (negative margins
// trigger document-wide shrink-to-fit; named @page sizes are ignored). But a
// page that is the FIRST page of its own document can, via @page :first
// margin 0, exactly like the cover. So each part divider is rendered as its
// own single-page document and the PDFs are merged in order with pdf-lib
// (scripts/merge-pdfs.mjs), then paginated. Piece filenames sort into book
// order: 00-front, 10-divider, 11-part, 20-divider, 21-part, ...
// ---------------------------------------------------------------------------
function doc(title, body, extraCss = "") {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<!--
  Piece of The Foundations Complete Edition. GENERATED by
  scripts/assemble-complete-guide.mjs; do not hand-edit. Render every piece in
  content/guides/complete-parts/ with build-pdf.mjs, merge with
  scripts/merge-pdfs.mjs, then paginate. Output: public/guides/the-complete-guide.pdf
-->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap"
  rel="stylesheet"
/>
${style}
${extraCss ? `<style>\n${extraCss}\n</style>` : ""}
</head>
<body>
${body}
</body>
</html>
`;
}

// Divider docs: the panel IS page 1 of its own document, so it bleeds like the
// cover. 296mm (1mm under A4) so rounding never spills a blank page 2.
const DIVIDER_CSS = `  @page { margin: 0; }
  .part {
    width: 210mm; height: 296mm; margin: 0; padding: 26mm 22mm;
    page-break-before: auto; page-break-after: auto;
  }`;
// Content docs: undo the shared @page :first margin 0 (their first page is a
// normal content page, not a cover).
const CONTENT_CSS = `  @page :first { margin: 20mm 18mm 24mm; }`;

const PARTS_DIR = DIR + "complete-parts/";
fs.mkdirSync(PARTS_DIR, { recursive: true });
const pieces = [
  ["00-front.html", doc("The Foundations — Complete Edition", `${cover}\n${rights}\n${mtoc}\n  ${intro}`, INTRO_CSS)],
  ["10-divider.html", doc("Part I — SEO", partI, DIVIDER_CSS)],
  ["11-part.html", doc("Part I — SEO", `  ${sSeo}`, CONTENT_CSS)],
  ["20-divider.html", doc("Part II — AEO", partII, DIVIDER_CSS)],
  ["21-part.html", doc("Part II — AEO", `  ${sAeo}`, CONTENT_CSS)],
  ["30-divider.html", doc("Part III — GEO", partIII, DIVIDER_CSS)],
  ["31-part.html", doc("Part III — GEO", `  ${sGeo}`, CONTENT_CSS)],
  ["40-divider.html", doc("Part IV — The Stack", partIV, DIVIDER_CSS)],
  ["41-part.html", doc("Part IV — The Stack", `  ${sStack}`, CONTENT_CSS)],
  ["50-divider.html", doc("Part V — The Client Kit", partV, DIVIDER_CSS)],
  ["51-part.html", doc("Part V — The Client Kit", `  ${sClient}`, CONTENT_CSS)],
  ["55-sources.html", doc("Sources", `${sourcesSection}\n${colophon}`, CONTENT_CSS)],
  ["60-closing.html", doc("Closing", closing)],
];
let total = 0;
for (const [name, content] of pieces) {
  fs.writeFileSync(PARTS_DIR + name, content);
  total += content.length;
}
console.log(`wrote ${pieces.length} pieces to complete-parts/ (${(total / 1024).toFixed(0)}kb)`);
console.log("SEO sections:", titles(sSeo).length, "| AEO:", titles(sAeo).length, "| GEO:", titles(sGeo).length, "| Stack:", titles(sStack).length, "| Client Kit:", titles(sClient).length);
console.log("intro has map hero:", intro.includes("aria-label=\"SEO contains AEO"));
const all = pieces.map(([, c]) => c).join("");
console.log("leftover 'Foundations</strong>' refs:", (all.match(/Foundations<\/strong>/g) || []).length);
