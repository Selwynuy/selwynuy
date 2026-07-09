---
name: nextjs-security-audit
description: "Audit a Next.js change across the full web-app attack surface before it ships: access control, injection, XSS and output handling, secret exposure, and dangerous config. Use before shipping any Server Action, Route Handler, form, data flow, or next.config change. Next.js protects a real slice for you (server isolation, encrypted action IDs, a CSRF baseline), but every action and handler is still a public POST endpoint. This checks auth and ownership, SQL injection, dangerouslySetInnerHTML, SSRF, mass assignment, leaked secrets, and missing security headers, each flagged for review, not blindly certified."
---

# Next.js Security Audit

The security pass before you ship a change. Next.js protects a real slice of the attack surface for you; it does not protect the slice you own. This audit covers the whole surface, grouped into families, and is honest about what a scanner can catch versus what a human has to read.

The one idea under all of it: **every Server Action and Route Handler is a public POST endpoint.** It is reachable by a direct request, not only through your UI. A page-level or UI-level check is not a security boundary.

## What Next.js already does, and what you own

| Next.js gives you | You still have to |
| --- | --- |
| Server/Client isolation; secrets and DB stay server-side | Not leak a secret via `NEXT_PUBLIC_`, not pass raw rows to the client |
| Encrypted Server Action IDs + dead-code elimination | Re-verify auth AND ownership inside every action and handler |
| Server Actions POST-only, Origin/Host checked (CSRF baseline) | Protect hand-written `route.ts`, and never mutate on GET |
| Source maps off in production by default | Set security headers, keep image/build config safe |

Full detail with the fix for every class is in `references/security-audit-checklist.md`, sourced to Next.js's own bundled docs and the handbook.

## How to run it

1. **Scan the changed files.** Run the bundled script over the diff:
   `node ${CLAUDE_SKILL_DIR}/scripts/scan-security.mjs <changed-files-or-dir>`
   It flags the high-confidence risk patterns across every family (leaked secrets, interpolated SQL, `dangerouslySetInnerHTML`, `fetch` to a user URL, spread request bodies, missing security headers, dangerous image config, and more). It surfaces risks; it does not certify that any of them is safe.
2. **Work the four families** against `references/security-audit-checklist.md`:
   - **Access control and abuse:** auth re-check, ownership (IDOR), rate limiting, user enumeration, CSRF on custom handlers.
   - **Injection:** parameterized queries, SSRF, mass assignment, open redirect (and command/path/NoSQL/SSTI if they apply).
   - **Output and XSS:** `dangerouslySetInnerHTML`, `javascript:` URLs, DOM writes, Markdown pipelines, CSP, security headers.
   - **Exposure and config:** secrets server-only, minimal DTOs, no leaked stack traces, secure session cookies, safe image/build config.
3. **Confirm the judgment-only classes by reading the code.** The scanner cannot prove that an action re-checks its caller, that a query is scoped to the right user, or that a DTO carries only safe fields. Those are marked *(review)* in the checklist and are yours to verify.

## The failures this catches

- A Server Action that trusts the page already checked the user (it did not; the action is a direct POST endpoint).
- A handler that checks "is logged in" but not "owns this record" (IDOR).
- `fetch(userUrl)` in a Server Action reaching the cloud metadata endpoint (SSRF).
- `{ ...formData }` spread into `db.update` letting a caller set `isAdmin` (mass assignment).
- `dangerouslySetInnerHTML` on a user comment (stored XSS).
- A secret prefixed `NEXT_PUBLIC_` and inlined into the browser bundle.
- No `X-Frame-Options` or CSP `frame-ancestors`, so the app is framable (clickjacking).

## The honest limit

A grep flags shapes. It cannot certify security. Absence of a flag is not a pass. This skill's value is that no risky shape ships unreviewed and that the judgment-only classes are on a checklist you actually work, not left to memory.

Read the handbook pages this draws from:
- https://selwynuy.dev/d/security.md
- https://selwynuy.dev/d/security-by-design.md
- https://selwynuy.dev/d/data-security.md

## Bundled files

- `scripts/scan-security.mjs` (script): flags the high-confidence risk patterns across every vuln family and hands each to you for review.
- `references/security-audit-checklist.md` (reference): the full web-app audit, every class with its detection signal and fix, sourced to the framework's bundled docs and the handbook.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/nextjs-security-audit
