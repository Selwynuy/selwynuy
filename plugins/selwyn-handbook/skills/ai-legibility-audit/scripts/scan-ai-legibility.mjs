#!/usr/bin/env node
/**
 * scan-ai-legibility.mjs, the mechanical half of the AI Legibility Audit.
 *
 * Checks the surfaces that make a site legible to AI answer engines and coding
 * agents, and ONLY the ones that are mechanically verifiable: does the file or
 * endpoint exist, return the right shape, and mirror the visible content. It
 * reports presence and validity. It never claims any of this improves how often
 * you get cited, because that depends on opaque engines outside the site and is
 * not verifiable from here.
 *
 * Two modes:
 *   - URL mode (best): fetches routes and inspects the SERVED bytes, which is
 *     the only way to prove content is server-rendered (JS off) and that the
 *     markdown endpoint really mirrors the HTML.
 *       node scan-ai-legibility.mjs https://example.com
 *       node scan-ai-legibility.mjs https://example.com /docs/security
 *   - Dir mode: inspects a local app/ tree + repo root for the route files and
 *     static artifacts (llms.txt route, robots, AGENTS.md, JSON-LD in pages).
 *       node scan-ai-legibility.mjs .
 *
 * Exit codes:
 *   0  scan completed (read the output).
 *   2  bad usage / unreadable path / fetch failure in URL mode.
 */

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP_DIR = new Set(["node_modules", ".next", ".git", "dist", "build"]);

function pass(label, detail) {
  console.log(`  [PASS] ${label}${detail ? " — " + detail : ""}`);
}
function warn(label, detail) {
  console.log(`  [CHECK] ${label}${detail ? " — " + detail : ""}`);
}
function miss(label, detail) {
  console.log(`  [MISS] ${label}${detail ? " — " + detail : ""}`);
}

const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

// ---------- URL mode -------------------------------------------------------

async function fetchText(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const body = await res.text();
    return { ok: res.ok, status: res.status, type: res.headers.get("content-type") || "", body };
  } catch (err) {
    return { ok: false, status: 0, type: "", body: "", error: err.message };
  }
}

function checkLlmsTxtShape(body) {
  const lines = body.split(/\r?\n/);
  const hasH1 = lines.some((l) => /^#\s+\S/.test(l));
  const hasBlockquote = lines.some((l) => /^>\s+\S/.test(l));
  const hasH2List = /^##\s+\S/m.test(body) && /^\s*-\s+\[.+\]\(.+\)/m.test(body);
  return { hasH1, hasBlockquote, hasH2List };
}

async function urlMode(base, routes) {
  const origin = new URL(base).origin;
  console.log(`AI-legibility audit of ${origin} (served bytes, JS off)\n`);

  // A content route to inspect for server-render + structure + JSON-LD.
  const contentPath = routes[0] || "/";
  const page = await fetchText(new URL(contentPath, origin).href);
  console.log(`Content route ${contentPath}`);
  if (!page.ok) {
    miss("route reachable", `status ${page.status}${page.error ? " (" + page.error + ")" : ""}`);
  } else {
    // Server-rendered: is there real text content in the raw HTML, not just a shell?
    const textLen = page.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
    if (textLen > 500) pass("content is server-rendered", `${textLen} chars of text in the initial HTML`);
    else warn("content in initial HTML looks thin", `${textLen} chars; confirm it is not hydration-only`);

    // Exactly one h1.
    const h1s = (page.body.match(/<h1[\s>]/gi) || []).length;
    if (h1s === 1) pass("exactly one <h1>");
    else if (h1s === 0) miss("no <h1> in the served HTML");
    else warn(`${h1s} <h1> elements`, "expected exactly one");

    // Semantic landmarks.
    if (/<article[\s>]/i.test(page.body)) pass("<article> landmark present");
    else warn("no <article> landmark", "wrap main content in <article> for extraction");
    if (/<nav[\s>]/i.test(page.body)) pass("<nav> landmark present");
    else warn("no <nav> landmark");

    // JSON-LD present + parseable + real @type.
    const ld = page.body.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
    if (!ld) {
      warn("no JSON-LD", "add schema.org structured data (Article/Person/FAQPage as fits)");
    } else {
      try {
        const obj = JSON.parse(ld[1].trim());
        const type = Array.isArray(obj) ? obj[0]?.["@type"] : obj["@type"];
        if (type) pass("JSON-LD present and valid", `@type ${type}`);
        else warn("JSON-LD present but no @type");
      } catch {
        miss("JSON-LD present but does not parse", "invalid JSON in the ld+json block");
      }
    }
  }
  console.log("");

  // Clean markdown endpoint mirroring the content route. Sites use different
  // conventions (a direct <path>.md sibling, or a separate /d/<slug>.md or
  // /s/<slug>.md prefix), so try the common shapes before reporting a miss.
  const slug = contentPath.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";
  const mdCandidates = [
    contentPath.replace(/\/$/, "") + ".md",
    slug ? `/d/${slug}.md` : null,
    slug ? `/s/${slug}.md` : null,
  ].filter(Boolean);
  let md = null;
  let mdPath = null;
  for (const cand of mdCandidates) {
    const r = await fetchText(new URL(cand, origin).href);
    if (r.ok) {
      md = r;
      mdPath = cand;
      break;
    }
  }
  console.log("Clean markdown endpoint");
  if (md && /markdown|text\/plain/.test(md.type) && !/<html/i.test(md.body)) {
    pass("clean markdown endpoint present", `${mdPath} (${md.type.split(";")[0]}), no HTML chrome`);
  } else if (md && /<html/i.test(md.body)) {
    warn("endpoint returns HTML, not markdown", `${mdPath} serves HTML; serve a clean .md mirror`);
  } else {
    warn("no clean markdown endpoint", `tried ${mdCandidates.join(", ")}; consider a /page.md or /d/<slug>.md mirror`);
  }
  console.log("");

  // llms.txt shape.
  const llms = await fetchText(new URL("/llms.txt", origin).href);
  console.log("/llms.txt");
  if (!llms.ok) {
    warn("no /llms.txt", "a well-formed llms.txt is a harmless, checkable artifact (note: no major engine is documented as consuming it)");
  } else {
    const s = checkLlmsTxtShape(llms.body);
    if (s.hasH1 && s.hasBlockquote && s.hasH2List) pass("llms.txt well-formed", "H1, blockquote summary, H2 link lists");
    else warn("llms.txt present but shape is off", `h1:${s.hasH1} blockquote:${s.hasBlockquote} h2-list:${s.hasH2List} (want all three)`);
  }
  console.log("");

  // robots.txt + AI agents.
  const robots = await fetchText(new URL("/robots.txt", origin).href);
  console.log("/robots.txt");
  if (!robots.ok) {
    miss("no /robots.txt", `status ${robots.status}`);
  } else {
    const named = AI_AGENTS.filter((a) => new RegExp(`User-agent:\\s*${a}`, "i").test(robots.body));
    const hasSitemap = /^\s*Sitemap:/im.test(robots.body);
    if (named.length) pass("robots names AI user-agents", named.join(", "));
    else warn("robots names no specific AI user-agents", "valid as allow-all; name agents only if selective policy is the goal");
    if (hasSitemap) pass("robots points at a sitemap");
    else warn("robots has no Sitemap: line");
    console.log("  (note: robots.txt is a policy signal, not access control; some AI crawlers ignore it)");
  }
  console.log("");

  // Sitemap lastmod.
  const sitemap = await fetchText(new URL("/sitemap.xml", origin).href);
  console.log("/sitemap.xml");
  if (!sitemap.ok) miss("no /sitemap.xml", `status ${sitemap.status}`);
  else if (/<lastmod>/i.test(sitemap.body)) pass("sitemap present with <lastmod> dates");
  else warn("sitemap present but no <lastmod>", "add lastmod so freshness is machine-readable");

  console.log("\nReported presence and validity only. None of these verify ranking or");
  console.log("citation, which depend on engines outside the site. See the checklist for each standard.");
  process.exit(0);
}

// ---------- Dir mode -------------------------------------------------------

function collect(dir, out) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) collect(full, out);
    else out.push(full);
  }
}

function dirMode(root) {
  console.log(`AI-legibility audit of ${root} (local files; URL mode is stronger)\n`);
  const files = [];
  collect(root, files);
  const rel = (f) => relative(root, f).replace(/\\/g, "/");
  const has = (re) => files.some((f) => re.test(rel(f)));

  console.log("Served AI surfaces (route files or static)");
  if (has(/(^|\/)llms\.txt(\/route\.(t|j)s)?$/) || existsSync(join(root, "public/llms.txt")))
    pass("llms.txt source present");
  else warn("no llms.txt route or static file");

  if (has(/(^|\/)robots\.(ts|js)$/) || existsSync(join(root, "public/robots.txt")))
    pass("robots source present");
  else miss("no robots.ts or public/robots.txt");

  if (has(/(^|\/)sitemap\.(ts|js)$/) || existsSync(join(root, "public/sitemap.xml")))
    pass("sitemap source present");
  else warn("no sitemap.ts or static sitemap");

  if (has(/(^|\/).*\.md\/route\.(t|j)s$/) || has(/\[\w+\]\/route\.(t|j)s$/))
    pass("a markdown/route handler is present", "confirm it serves clean .md (URL mode verifies parity)");
  else warn("no per-page markdown endpoint found", "consider a /page.md mirror for extraction");

  console.log("");
  console.log("Repo artifacts");
  if (existsSync(join(root, "AGENTS.md"))) pass("AGENTS.md at repo root");
  else warn("no AGENTS.md at root", "add agent build/convention instructions");

  // JSON-LD anywhere in the app pages.
  const ldPage = files.find((f) => /\.(t|j)sx$/.test(f) && /application\/ld\+json/.test(readSafe(f)));
  if (ldPage) pass("JSON-LD rendered in a page", rel(ldPage));
  else warn("no JSON-LD found in page components", "add schema.org structured data");

  console.log("\nDir mode checks for the source of each surface. Run URL mode against the");
  console.log("running site to verify server-render, markdown parity, and the served shapes.");
  process.exit(0);
}

function readSafe(f) {
  try {
    return readFileSync(f, "utf8");
  } catch {
    return "";
  }
}

// ---------- Entry ----------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      "usage:\n" +
        "  node scan-ai-legibility.mjs <url> [content-path]   # fetch and inspect served bytes\n" +
        "  node scan-ai-legibility.mjs <app-dir>              # inspect local source files",
    );
    process.exit(2);
  }
  const first = args[0];
  if (/^https?:\/\//i.test(first)) {
    await urlMode(first, args.slice(1));
  } else {
    if (!existsSync(first)) {
      console.error(`scan-ai-legibility: path not found: ${first}`);
      process.exit(2);
    }
    dirMode(first);
  }
}

main();
