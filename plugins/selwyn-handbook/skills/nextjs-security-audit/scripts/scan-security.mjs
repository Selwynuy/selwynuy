#!/usr/bin/env node
/**
 * scan-security.mjs, the mechanical half of the Next.js Security Audit.
 *
 * Every Server Action and Route Handler in a Next.js app is a public POST
 * endpoint, reachable directly, not only through the UI. This script scans the
 * files you changed for the high-confidence risk patterns across the whole
 * web-app attack surface (access control, injection, XSS, secret exposure,
 * dangerous config) and flags each for human review.
 *
 * IMPORTANT: this is a signal finder, NOT a security certifier. A grep cannot
 * prove that an action re-checks the caller, that a query is scoped to the
 * right user, or that a DTO carries only safe fields. Absence of a flag here
 * does NOT mean the code is safe. It makes sure no risky shape gets shipped
 * unreviewed. The judgment, and the classes only a human can catch, live in
 * references/security-audit-checklist.md.
 *
 * Usage:
 *   node scan-security.mjs <file-or-dir> [more files...]
 *   node scan-security.mjs app/            # scan a tree
 *
 * Exit codes:
 *   0  scan completed (findings may or may not exist; read the output).
 *   2  bad usage or unreadable path.
 */

import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, extname, relative } from "node:path";

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIR = new Set(["node_modules", ".next", ".git", "dist", "build"]);

/** Recursively collect code files from a path (file or dir). */
function collect(target, out) {
  let st;
  try {
    st = statSync(target);
  } catch (err) {
    console.error(`scan: cannot read ${target} (${err.message})`);
    process.exit(2);
  }
  if (st.isDirectory()) {
    for (const entry of readdirSync(target)) {
      if (SKIP_DIR.has(entry)) continue;
      collect(join(target, entry), out);
    }
  } else if (CODE_EXT.has(extname(target))) {
    out.push(target);
  }
}

/**
 * Per-line risk patterns. Each is [family, regex, note]. The note tells the
 * reviewer what to CONFIRM, since none of these is automatically a bug. A
 * tagged SQL template, a fixed-literal dangerouslySetInnerHTML, or a NEXT_PUBLIC_
 * value that is genuinely public are all fine; the flag means "look here".
 */
const LINE_PATTERNS = [
  // Family 1: access control and abuse
  [
    "access",
    /['"]use server['"]/,
    "Server Action: a public POST endpoint. Confirm it re-checks auth AND resource ownership (IDOR), and validates its arguments.",
  ],
  [
    "access",
    /new Map\(|new Set\(/,
    "In-memory Map/Set: if this is a rate-limit counter, it resets per lambda on serverless and does not limit anything. Use a shared store keyed on IP AND account.",
  ],
  // Family 2: injection
  [
    "injection",
    /\.(query|raw|\$queryRawUnsafe|execute)\s*\(\s*[`'"][^)]*\$\{/,
    "Possible SQL injection: interpolation inside a query call. A tagged template `sql`...${x}`` is safe (bound); a manually built string is not. Confirm the value is bound, not concatenated.",
  ],
  [
    "injection",
    /\bfetch\s*\(\s*(?!['"`])[A-Za-z_$]/,
    "fetch() with a non-literal URL: if the URL derives from user input, this is SSRF (reachable: cloud metadata, internal hosts). Allowlist the host before fetching.",
  ],
  [
    "injection",
    /data:\s*\{?\s*\.\.\.|Object\.assign\([^,]+,\s*(body|req|formData|input|data|json)/,
    "Spread into a DB write: mass assignment. A caller could set role/isAdmin/ownerId. Validate into a schema and write only named fields.",
  ],
  [
    "injection",
    /\bredirect\s*\(|NextResponse\.redirect\s*\(/,
    "redirect(): if the target derives from searchParams/params/formData, this is an open redirect. Allowlist known-safe paths.",
  ],
  [
    "injection",
    /child_process|\bexecSync\s*\(|\bexec\s*\(\s*[`'"]/,
    "child_process / exec: if a command string includes user input, that is command injection. Use execFile/spawn with an argument array, no shell.",
  ],
  // Family 3: output handling and XSS
  [
    "xss",
    /dangerouslySetInnerHTML/,
    "dangerouslySetInnerHTML: XSS if the __html traces to user data. Safe only if it is a fixed literal you control. Otherwise sanitize with isomorphic-dompurify.",
  ],
  [
    "xss",
    /\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML\(|document\.write\(/,
    "Direct DOM write: DOM-based XSS if the value is user-controlled. Route it through React state, or sanitize before insertion.",
  ],
  [
    "xss",
    /\beval\s*\(|new Function\s*\(/,
    "eval / new Function: arbitrary code execution if fed user input. Remove it, or never pass untrusted input.",
  ],
  [
    "xss",
    /rehype-raw|rehypeRaw|allowDangerousHtml/,
    "Raw HTML in a Markdown pipeline: re-enables embedded <script>. Pair react-markdown with rehype-sanitize, or sanitize the output.",
  ],
  [
    "xss",
    /['"]unsafe-inline['"]|['"]unsafe-eval['"]/,
    "unsafe-inline / unsafe-eval in a CSP: this is barely a CSP (unless dev-only). Use a nonce or hash-based policy.",
  ],
  // Family 4: secret exposure and dangerous config
  [
    "exposure",
    /NEXT_PUBLIC_\w*(SECRET|KEY|TOKEN|PASSWORD|PRIVATE|CREDENTIAL|DSN)/i,
    "NEXT_PUBLIC_ on a secret-looking name: this value is inlined into the client bundle at build time. Drop the prefix and read it server-side only.",
  ],
  [
    "exposure",
    /\{\s*error\.(message|stack)\s*\}|JSON\.stringify\(\s*error\s*\)/,
    "Rendering error.message/stack: leaks stack traces or DB errors to the user. Show a generic message; log details server-side.",
  ],
  [
    "exposure",
    /return\s+(await\s+)?(db|prisma)\./,
    "Returning a raw DB record from a Server Action: the whole row is serialized to the client. Return only a minimal DTO or { success: true }.",
  ],
  [
    "config",
    /dangerouslyAllowSVG|dangerouslyAllowLocalIP/,
    "Dangerous image config: SVGs can carry scripts; local-IP fetches enable SSRF. Avoid it, or pair SVG with contentDispositionType + a locked CSP.",
  ],
  [
    "config",
    /images\s*:\s*\{[^}]*\bdomains\s*:|hostname:\s*['"]\*\*?['"]/,
    "Broad image config (deprecated `domains` or wildcard hostname): turns the optimizer into an open proxy. Use specific remotePatterns.",
  ],
  [
    "config",
    /productionBrowserSourceMaps:\s*true/,
    "productionBrowserSourceMaps: true ships unminified source publicly. Keep it off, or upload-then-delete the maps.",
  ],
];

/** route.ts / route.tsx is a Route Handler by file convention. */
function isRouteHandler(file) {
  const base = file.replace(/\\/g, "/").toLowerCase();
  return /\/route\.(t|j)sx?$/.test(base);
}

/** next.config or proxy: the place security headers and CSP should live. */
function isConfigOrProxy(file) {
  const base = file.replace(/\\/g, "/").toLowerCase();
  return /\/next\.config\.(m|c)?[jt]s$/.test(base) || /\/proxy\.(t|j)sx?$/.test(base);
}

const HEADER_NAMES = [
  "X-Frame-Options",
  "frame-ancestors",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
];

function scanFile(file) {
  const findings = [];
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return findings;
  }

  if (isRouteHandler(file)) {
    findings.push({
      family: "access",
      n: 1,
      note: "Route Handler (route.ts): a public endpoint. Confirm it returns 401/403 for unauthenticated/unauthorized callers, and that a GET does not mutate (CSRF).",
    });
  }

  // Whole-file checks for config/proxy: missing security headers, insecure cookies.
  if (isConfigOrProxy(file)) {
    const hasAnyHeader = HEADER_NAMES.some((h) => text.includes(h));
    if (!hasAnyHeader) {
      findings.push({
        family: "config",
        n: 1,
        note: "No security headers found in this config/proxy: app is framable (clickjacking) and MIME-sniffable. Add X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy via headers().",
      });
    }
  }

  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const [family, re, note] of LINE_PATTERNS) {
      if (re.test(line)) findings.push({ family, n: i + 1, note });
    }
    // Insecure session cookie: a cookies().set( whose line/nearby options omit a flag.
    if (/cookies\(\)[\s\S]{0,20}\.set\(|cookieStore\.set\(/.test(line)) {
      findings.push({
        family: "exposure",
        n: i + 1,
        note: "cookies().set(): confirm the session cookie sets httpOnly:true, secure:true, and sameSite. Missing any of these leaves the token stealable or cross-site-attachable.",
      });
    }
  });
  return findings;
}

const FAMILY_LABEL = {
  access: "ACCESS-CONTROL",
  injection: "INJECTION",
  xss: "XSS/OUTPUT",
  exposure: "SECRET-EXPOSURE",
  config: "CONFIG",
};

function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error(
      "usage: node scan-security.mjs <file-or-dir> [more...]\n" +
        "Scans changed files for Next.js security risk patterns across every vuln family.",
    );
    process.exit(2);
  }

  const cwd = process.cwd();
  const files = [];
  for (const t of targets) collect(t, files);

  const byFamily = {};
  let total = 0;

  for (const file of files) {
    const findings = scanFile(file);
    if (findings.length === 0) continue;
    const rel = relative(cwd, file) || file;
    console.log(`\n${rel}`);
    for (const f of findings) {
      total++;
      byFamily[f.family] = (byFamily[f.family] ?? 0) + 1;
      console.log(`  [${FAMILY_LABEL[f.family] ?? f.family}] line ${f.n}`);
      console.log(`    ${f.note}`);
    }
  }

  console.log("");
  if (total === 0) {
    console.log("scan: no high-confidence risk patterns found in the given files.");
    console.log(
      "Note: this does NOT certify safety. The judgment-only classes (IDOR, DTO",
    );
    console.log(
      "crossing, user enumeration) have no reliable grep. If the change touches",
    );
    console.log(
      "auth or data, review it against references/security-audit-checklist.md anyway.",
    );
    process.exit(0);
  }

  const summary = Object.entries(byFamily)
    .map(([fam, n]) => `${FAMILY_LABEL[fam] ?? fam} ${n}`)
    .join(", ");
  console.log(`scan: ${total} finding(s) to review — ${summary}.`);
  console.log(
    "None of these is automatically a bug. Each is a place to CONFIRM the fix",
  );
  console.log(
    "by hand. A grep cannot prove auth, authorization, or data minimization is",
  );
  console.log("correct. See references/security-audit-checklist.md for each class.");
  process.exit(0);
}

main();
