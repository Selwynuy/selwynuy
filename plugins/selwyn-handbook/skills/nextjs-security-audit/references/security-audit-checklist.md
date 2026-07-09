# The Next.js security audit

A full web-app security pass for a Next.js 16 App Router change, sourced to
Next.js's own bundled docs (`node_modules/next/dist/docs/01-app/02-guides/`)
and the Selwyn handbook. Verified against Next.js 16.2.6.

The one idea under all of it: **every Server Action and Route Handler is a
public POST endpoint.** It is reachable directly, not only through your UI. A
page-level or UI-level check is not a security boundary.

Each item below has a **signal** (what to look for) and a **fix**. Some
signals a grep can catch and the bundled scanner flags them. Others need
judgment and are marked *review*: a scanner cannot prove your authorization
is correct, so those are yours to confirm by reading the code.

## What Next.js protects by default (leave it working)

- Server/Client module isolation: secrets, env, and DB stay server-side.
- Encrypted, non-deterministic Server Action IDs; unused actions are stripped
  from the client bundle.
- Server Actions are POST-only, with the Origin header checked against Host
  (a CSRF baseline).
- Closed-over Server Action variables are encrypted per build.
- No cookie-set or revalidation during render (blocks a class of CSRF).
- Browser source maps are off in production by default.

This is defense in depth. None of it is your authorization layer. Do not lean
on it as one.

---

## Family 1: Access control and abuse

### 1.1 Missing auth re-check inside an action or handler *(review)*
- **Signal:** a `"use server"` function or `route.ts` handler that touches the
  DB with no `auth()` / `verifySession()` call, and no delegation to a DAL
  that does. A page-level `redirect()` does NOT count.
- **Fix:** first line after args: `const session = await auth(); if (!session?.user) throw new Error('Unauthorized')`, or delegate to a `server-only` DAL that does.
- Source: Next.js `data-security.md` (auth section); handbook `security-by-design.mdx`.

### 1.2 IDOR / missing ownership check *(review)*
- **Signal:** a `db.*.update/delete/findUnique({ where: { id } })` where `id`
  came from input, with no ownership comparison after auth.
- **Fix:** `if (row.ownerId !== session.user.id) throw new Error('Forbidden')`, or scope the query: `where: { id, userId: session.user.id }`.
- Source: handbook `security.mdx`, `security-by-design.mdx` decision table.

### 1.3 Rate limiting / the serverless in-memory trap
- **Signal (scanner):** a module-level `new Map(` used as a throttle counter
  (resets per lambda on serverless), or an auth/email/pay endpoint with no
  limiter at all, or per-IP only with no per-account key.
- **Fix:** a shared-store limiter (e.g. `@upstash/ratelimit`) keyed on BOTH IP
  and hashed account.
- Source: handbook `rate-limiting.mdx`.

### 1.4 User enumeration *(review)*
- **Signal:** an auth handler returning different messages/status for "no such
  user" vs "wrong password", or returning early before the hash compare (a
  timing leak).
- **Fix:** one generic message for every credential failure; always run the
  compare (dummy hash if absent) for uniform timing.
- Source: handbook `security-by-design.mdx`, `rate-limiting.mdx`.

### 1.5 CSRF on custom handlers / GET mutations *(review)*
- **Signal:** a `route.ts` that mutates without an Origin/Host or session
  check, or any mutation (`db.*.update`, `cookies().set`) inside a `GET`
  handler or a render body. (Plain `"use server"` POST actions are fine by
  default; do not flag them.)
- **Fix:** keep mutations behind Server Action POSTs; for hand-written
  handlers, verify session and check Origin against Host yourself.
- Source: Next.js `data-security.md` ("Allowed origins"); handbook `security-by-design.mdx`.

---

## Family 2: Injection

### 2.1 SQL injection *(review)*
- **Signal (scanner):** a `${...}` interpolation or `+` concatenation inside a
  `.query(` / `.raw(` / `$queryRawUnsafe(` call. (A tagged template
  `` sql`... ${x}` `` is SAFE; the driver binds it. The scanner flags the call
  for you to tell them apart.)
- **Fix:** parameter placeholder `db.query('... WHERE email = $1', [email])` or a tagged template. Never build SQL text from input.
- Source: handbook `security.mdx`, `security-by-design.mdx`.

### 2.2 SSRF (fetch to a user-supplied URL)
- **Signal (scanner):** a `fetch(` / axios call in a `"use server"` or
  `route.ts` file whose URL is a variable (not a literal), traceable to input.
  Lets an attacker reach `http://169.254.169.254/` (cloud metadata) or
  internal hosts.
- **Fix:** allowlist the host and block private/link-local ranges before
  fetching: `if (!ALLOWED_HOSTS.has(new URL(input).hostname)) throw ...`.
- Source: gap in both docs; OWASP SSRF. **This skill adds it.**

### 2.3 Mass assignment / over-posting
- **Signal (scanner):** a `db.*.create/update({ data: { ...body } })` or
  `Object.assign(record, body)` spreading untrusted input into a write. Lets a
  caller set `role`, `isAdmin`, `ownerId`.
- **Fix:** validate into an explicit schema and write only named fields:
  `const { name, bio } = Schema.parse(input); db.user.update({ data: { name, bio } })`.
- Source: gap in the handbook; the fix pattern (named-field write) is shown in `security-by-design.mdx`. **This skill names the attack.**

### 2.4 Open redirect *(review)*
- **Signal (scanner):** `redirect(` / `NextResponse.redirect(` whose argument
  derives from `searchParams` / `params` / `formData` (a `?next=` value).
- **Fix:** allowlist: `redirect(SAFE.has(next) ? next : '/dashboard')`, or reject non-relative (`next.startsWith('/') && !next.startsWith('//')`).
- Source: handbook `security.mdx` (outbound-URL RuleCard).

### 2.5 Command injection / path traversal / NoSQL / SSTI *(check if applicable)*
- Command injection: `child_process` `exec`/`execSync` with interpolated
  input. Use `execFile`/`spawn` with an arg array, no shell.
- Path traversal: `fs.readFile`/`writeFile` with a user path. Look the
  resource up by a validated key instead; if unavoidable, `resolve` and assert
  it stays under the base dir.
- NoSQL injection: a Mongo `.find(rawBody)` where a field can be an operator
  object. Coerce every field to a primitive with a schema first.
- SSTI: a **non-issue in JSX** (React escapes by default). Only real if you
  bolt on a template engine (`Handlebars.compile(userInput)`, `eval`,
  `new Function`). Do not compile user input as a template.
- Source: handbook `security.mdx` injection Callout ("input is data, never code").

---

## Family 3: Output handling and XSS

### 3.1 XSS via `dangerouslySetInnerHTML`
- **Signal (scanner):** every `dangerouslySetInnerHTML` occurrence. Review:
  is the `__html` a fixed literal you control (safe) or does it trace to user
  data / DB rows (stored XSS)?
- **Fix:** render as text (`<div>{value}</div>`, React escapes it). If HTML is
  required, `DOMPurify.sanitize(html)` with `isomorphic-dompurify`.
- Source: handbook `security.mdx` (render-HTML RuleCard).

### 3.2 `javascript:` URLs in `href` / `src` *(review)*
- **Signal:** `href={` / `src={` bound to a user-controlled variable. React
  does NOT sanitize URL attributes; `javascript:alert(...)` executes on click.
- **Fix:** allowlist the scheme: `const safe = /^https?:\/\//.test(url) || url.startsWith('/') ? url : '#'`.
- Source: gap. **This skill adds it.**

### 3.3 DOM-based XSS in Client Components
- **Signal (scanner):** `.innerHTML` / `.outerHTML` / `insertAdjacentHTML` /
  `document.write` / `eval(` / `new Function(` in a `"use client"` component.
- **Fix:** route the value through React state so React escapes it; if raw DOM
  insertion is unavoidable, sanitize with default DOMPurify config.
- Source: gap. **This skill adds it.**

### 3.4 Un-sanitized Markdown / rich text
- **Signal (scanner):** `rehype-raw` / `allowDangerousHtml` / `marked(` /
  `markdown-it` feeding a `dangerouslySetInnerHTML`.
- **Fix:** pair `react-markdown` with `rehype-sanitize`, or wrap `marked(md)`
  output in `DOMPurify.sanitize(...)`.
- Source: gap (generic sink is covered; the markdown pipeline is not).

### 3.5 Weak or missing Content Security Policy
- **Signal (scanner):** `'unsafe-inline'` or `'unsafe-eval'` in a `script-src`
  outside a dev-only guard, or no CSP anywhere in `proxy.ts` / `next.config`.
- **Fix:** nonce-based `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
  minted in `proxy.ts` (with `await connection()` on each protected page), or
  the static SRI path (`experimental.sri`). Never ship `'unsafe-inline'`.
- Source: handbook `content-security-policy.mdx` (thorough); Next.js CSP guide.

### 3.6 Clickjacking / missing security headers
- **Signal (scanner):** none of `X-Frame-Options`, `frame-ancestors`,
  `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy` present in `next.config` or `proxy.ts`.
- **Fix:** set via `async headers()` in `next.config.mjs`:
  `X-Frame-Options: DENY` (plus `frame-ancestors 'none'` in the CSP),
  `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  and a locked-down `Permissions-Policy`.
- Source: gap (handbook has none of these). **This skill adds it.**

---

## Family 4: Secret exposure and dangerous config

### 4.1 Secret leaked via `NEXT_PUBLIC_`
- **Signal (scanner):** `NEXT_PUBLIC_` on a name that looks secret
  (`SECRET`/`KEY`/`TOKEN`/`PASSWORD`/`PRIVATE`/`DSN`). The value is inlined
  into the client bundle at build time. Corroborate: `grep -r "SECRET" .next/static`.
- **Fix:** drop the prefix, read server-side only in a `server-only` module.
- Source: handbook `environment-and-secrets.mdx`, `security.mdx`.

### 4.2 `process.env` / DB client outside the data layer *(review)*
- **Signal (scanner):** `process.env` read (or a DB-client import) outside
  `data/` / `lib/`, especially in a `"use client"` file.
- **Fix:** move the read into one `server-only` DAL module; components call DAL
  functions, never `process.env` directly.
- Source: handbook `data-security.mdx`, `security-by-design.mdx`.

### 4.3 Raw row or full record crossing to the client *(review)*
- **Signal:** a Server Component passing a whole fetched row as a prop to a
  `"use client"` component, or a DAL `SELECT *` returned unfiltered. The prop
  is serialized into the page payload with every column.
- **Fix:** return a minimal DTO with an explicit field list; declare a narrow
  prop type on the client. Optionally enable `experimental.taint` as a backstop.
- Source: handbook `data-security.mdx` (primary topic).

### 4.4 Sensitive Server Action return value *(review)*
- **Signal (scanner):** `return db.` / `return await db.` / `return prisma.` in
  a `"use server"` file (returns the raw record, serialized to the client).
- **Fix:** return only what the UI needs: `return { success: true }` or a DTO.
- Source: Next.js `data-security.md` ("Controlling return values"); handbook `security.mdx`.

### 4.5 Stack trace / DB error leaked in an error boundary *(review)*
- **Signal (scanner):** `{error.message}` / `{error.stack}` /
  `JSON.stringify(error)` rendered in `error.tsx` or `global-error.tsx`.
- **Fix:** render a static generic message; log details server-side via
  `useEffect(() => console.error(error), [error])`. `error.digest` alone is safe.
- Source: handbook `security-by-design.mdx` ("Errors that do not leak").

### 4.6 Insecure session cookies *(review)*
- **Signal (scanner):** a `cookies().set(` for a session cookie whose options
  omit `httpOnly: true`, `secure: true`, or `sameSite`.
- **Fix:** `{ httpOnly: true, secure: true, sameSite: 'lax', expires, path: '/' }`.
- Source: gap in the handbook; Next.js `authentication.md` ("recommended options"). **This skill adds it.**

### 4.7 Insecure image / build config
- **Signal (scanner):** `dangerouslyAllowSVG: true`, deprecated `domains:`, a
  `remotePatterns` with `hostname: '**'`, `dangerouslyAllowLocalIP`,
  `productionBrowserSourceMaps: true`, or a Sentry config missing
  `deleteSourcemapsAfterUpload`.
- **Fix:** avoid `dangerouslyAllowSVG` (or pair with `contentDispositionType:
  'attachment'` + a locked CSP); use specific `remotePatterns`; keep source
  maps out of the public bundle; `poweredByHeader: false`.
- Source: gap (Next.js config reference; handbook `sentry-setup.mdx` covers the source-map half). **This skill adds the image/config half.**

### 4.8 Dependency / supply-chain *(out of scope for a per-diff scan)*
- A diff rarely contains the vuln; it lives in the lockfile. If the change
  touches `package.json`, run `npm audit`; use Dependabot and `npm ci` in CI.
- Source: not statically detectable per-diff. Checklist mention only.

---

## The honest limit

The scanner flags the families above where a pattern is reliable. It cannot
prove that an action re-checks its caller, that a query is scoped to the right
user, or that a DTO carries only safe fields. Absence of a flag is not a
pass. Every *(review)* item is yours to confirm by reading the code against
this checklist.

## Sources

- Next.js bundled guides (`node_modules/next/dist/docs/01-app/02-guides/`):
  `data-security.md`, `authentication.md`, `content-security-policy.md`.
- Handbook: `security.mdx`, `security-by-design.mdx`, `data-security.mdx`,
  `rate-limiting.mdx`, `content-security-policy.mdx`, `environment-and-secrets.mdx`,
  `sentry-setup.mdx`.
- Verified against Next.js 16.2.6.
