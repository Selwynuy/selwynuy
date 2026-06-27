/**
 * Decisions and Defaults: every hard call in the handbook, in one place.
 *
 * Pure data, extracted from the prose so the answer to "what does Selwyn
 * actually pick / require?" is scannable without reading forty pages. Mirrors
 * the launch-checklist.ts pattern: the rendered <DecisionsTable> and the plain
 * markdown the one-drop endpoint serves both read from here, so the list never
 * diverges from what visitors see.
 *
 * Each row links to the page that argues for it. Strength is honest:
 *   - non-negotiable: a hard rule the handbook states as absolute.
 *   - strong-default: the recommended default; deviate with a reason.
 *   - opinion: still under review (drawn from a draft page); a starting point.
 */

export type DecisionStrength = "non-negotiable" | "strong-default" | "opinion";

export interface DecisionRow {
  /** The area being decided, e.g. "Email provider", "Styling". */
  topic: string;
  /** The concrete pick or rule. */
  choice: string;
  /** One sentence: the actual reason. No em-dashes (content guard enforces it). */
  why: string;
  /** How firm the call is. Sorts within a category. */
  strength: DecisionStrength;
  /** Handbook slug that argues for this row. Route: /docs/<slug>. */
  slug: string;
}

export interface DecisionCategory {
  /** Display heading for the group. */
  category: string;
  rows: DecisionRow[];
}

/** Rank for in-category ordering: firm rules first. */
const STRENGTH_RANK: Record<DecisionStrength, number> = {
  "non-negotiable": 0,
  "strong-default": 1,
  opinion: 2,
};

/**
 * The decision set, grouped and ordered like the build journey. Authored from a
 * full read of the handbook; keep a row's `slug` pointed at the page that makes
 * its case so a reader can jump straight to the reasoning.
 */
const RAW: DecisionCategory[] = [
  {
    category: "Foundations",
    rows: [
      {
        topic: "Language",
        choice: "TypeScript, scaffolded with --typescript",
        why: "Types pay for themselves the first time a refactor would silently break call sites.",
        strength: "non-negotiable",
        slug: "getting-started",
      },
      {
        topic: "Router and rendering",
        choice:
          "App Router with Server Components by default; fetch on the server, ship the browser only what it needs",
        why: "It is the single biggest lever for shipping less JavaScript to the browser.",
        strength: "non-negotiable",
        slug: "getting-started",
      },
      {
        topic: "Client boundary",
        choice:
          'Push "use client" down to the smallest interactive leaf; never mark a whole page client for one button',
        why: "Once a file carries the directive, every module it imports and child it renders joins the client bundle.",
        strength: "non-negotiable",
        slug: "project-setup",
      },
      {
        topic: "Route files",
        choice:
          "Keep page.tsx, layout.tsx, and route.ts thin; data access, validation, and integrations live in lib/",
        why: "A route's job is to wire data to UI, not own fetching, parsing, or validation.",
        strength: "non-negotiable",
        slug: "project-setup",
      },
      {
        topic: "App layering",
        choice:
          "Four layers: thin routes (app/), server-only data access (lib/data/), Zod validation (lib/validation/), isolated integrations (lib/integrations/), each talking only to the layer below",
        why: "Every kind of logic gets one home and dependencies stay one-directional, so the skeleton scales from a weekend to years.",
        strength: "non-negotiable",
        slug: "system-architecture",
      },
      {
        topic: "Vendor SDKs",
        choice:
          "Never import a database client or vendor SDK inside a component or route handler; one module per external service",
        why: "It couples UI to infrastructure and makes the data layer impossible to reuse or swap.",
        strength: "non-negotiable",
        slug: "system-architecture",
      },
      {
        topic: "Next.js 16 async APIs",
        choice:
          "Treat params, searchParams, headers(), and cookies() as Promises and always await them",
        why: "In Next.js 16 they are no longer plain objects, so synchronous access fails typechecking and throws at runtime.",
        strength: "non-negotiable",
        slug: "project-setup",
      },
      {
        topic: "Data at the boundary",
        choice:
          "Validate and type external data into a named type once at the edge; never pass res.json() or any any-typed value into the tree",
        why: "res.json() is typed any and any spreads, so untyped data at the boundary becomes untyped data everywhere.",
        strength: "non-negotiable",
        slug: "project-setup",
      },
      {
        topic: "Mutations",
        choice:
          "Writes go through a Server Action that validates input with a Zod schema before the data layer sees it",
        why: "Invalid input never reaches the database.",
        strength: "strong-default",
        slug: "system-architecture",
      },
      {
        topic: "Linting",
        choice:
          "ESLint wired in from the first commit, enforcing no-unused-vars and no stray console",
        why: "Problems surface while they are still cheap to fix and the conventions cannot quietly erode.",
        strength: "strong-default",
        slug: "getting-started",
      },
      {
        topic: "Dependency versioning",
        choice: "Pin the Next.js version (e.g. next@16.x) in real projects",
        why: "A pinned version will not silently jump a major and break under you later.",
        strength: "strong-default",
        slug: "getting-started",
      },
    ],
  },
  {
    category: "When to Reach Elsewhere",
    rows: [
      {
        topic: "Default framework",
        choice:
          "Reach for Next.js whenever the deliverable is HTML in a browser that also needs server-side logic",
        why: "That shape covers the large majority of builds and reaching for it there is never wrong.",
        strength: "non-negotiable",
        slug: "nextjs-fit-check",
      },
      {
        topic: "Mismatched workloads",
        choice:
          "Never put persistent sockets, on-device native, long-running compute, or static-only content inside Next.js; run the right tool beside it over an API",
        why: "Bolting those onto a Next.js app produces a fragile hybrid.",
        strength: "non-negotiable",
        slug: "nextjs-fit-check",
      },
      {
        topic: "Many concurrent websockets",
        choice:
          "Use a dedicated socket server (Phoenix Channels, Go) or a managed service like Ably or Pusher",
        why: "Request/response handlers cannot hold thousands of long-lived connections and serverless bills brutally for them.",
        strength: "strong-default",
        slug: "nextjs-fit-check",
      },
      {
        topic: "Heavy ML or batch jobs",
        choice:
          "Use a Python service behind a queue-and-worker model; Next.js takes the upload, enqueues, and shows status",
        why: "Serverless has time limits and cold starts while the ML tooling and time budget live in Python.",
        strength: "strong-default",
        slug: "nextjs-fit-check",
      },
      {
        topic: "Architecture granularity",
        choice: "Decide per surface, not per project, and run the fit checklist before scaffolding",
        why: "Most real products mix tools and the expensive failure is sunk-cost commitment after the architecture sets.",
        strength: "strong-default",
        slug: "nextjs-fit-check",
      },
    ],
  },
  {
    category: "Design and Branding",
    rows: [
      {
        topic: "Type roles",
        choice:
          "Exactly three roles (display, body, mono); never set a condensed display face on body copy",
        why: "Three roles create hierarchy without a ransom-note page, and condensed faces wreck paragraph readability.",
        strength: "non-negotiable",
        slug: "type-system",
      },
      {
        topic: "Font loaders",
        choice:
          'Call each next/font loader exactly once in app/fonts.ts and import the object everywhere, declaring subsets: ["latin"]',
        why: "Each loader call hosts a separate instance, so calling it twice ships the same font twice and breaks preloading.",
        strength: "non-negotiable",
        slug: "type-system",
      },
      {
        topic: "Accent color",
        choice: "Pick exactly ONE accent reserved for emphasis; never add a second to balance it",
        why: "The accent earns its weight precisely because it is rare, and a second accent halves the impact of both.",
        strength: "non-negotiable",
        slug: "branding-overview",
      },
      {
        topic: "Accent on prose",
        choice: "Never set body copy in the accent color; keep it on affordances only",
        why: "The accent marks where to act while reading wants a high-contrast neutral, not a saturated hue that fails contrast.",
        strength: "non-negotiable",
        slug: "choose-your-palette",
      },
      {
        topic: "Base colors",
        choice:
          "Near-black like #0b0b0c for dark and off-white like #fafafa for light, never pure #000 or #fff",
        why: "Pure black crushes shadows and vibrates against white, leaving no headroom for a layered surface system.",
        strength: "non-negotiable",
        slug: "choose-your-palette",
      },
      {
        topic: "Body contrast",
        choice: "Body text must clear WCAG AA 4.5:1 (large text 3:1) on the actual surface it sits on",
        why: "Contrast is the step people skip and it decides whether the product is usable.",
        strength: "non-negotiable",
        slug: "choose-your-palette",
      },
      {
        topic: "Token architecture",
        choice:
          "Two layers, a raw scale and a semantic role layer that points at it; components touch only semantic roles, never raw hex",
        why: "Raw values rarely change but roles get reassigned constantly, so the split lets you re-theme by editing one place.",
        strength: "non-negotiable",
        slug: "design-tokens",
      },
      {
        topic: "Components from tokens",
        choice:
          "Components read only token utilities (bg-accent, ring-hairline); never hardcode hex, rgb(), one-off grays, or arbitrary brackets",
        why: "A hardcoded shade stops tracking the token, so the next theme change leaves the component the wrong color.",
        strength: "non-negotiable",
        slug: "components-from-tokens",
      },
      {
        topic: "Re-theming",
        choice: "A token change is the only way to restyle the brand; never edit components to re-theme",
        why: "If re-theming requires editing components, they are holding colors they should be borrowing and the system has drifted.",
        strength: "non-negotiable",
        slug: "components-from-tokens",
      },
      {
        topic: "Tailwind v4 wiring",
        choice: "Expose semantic roles via @theme inline, and give --accent-foreground its own token",
        why: "The inline keyword makes utilities resolve to var() at runtime so reassigning a variable actually re-themes.",
        strength: "strong-default",
        slug: "design-tokens",
      },
      {
        topic: "Readable measure",
        choice: "Cap body copy at a 66ch measure, negative tracking on large display, positive on small caps",
        why: "Measure is the single biggest lever on readability and past it the eye loses the next line's start.",
        strength: "strong-default",
        slug: "type-system",
      },
      {
        topic: "Card depth",
        choice: "Use bg-surface-raised plus ring-1 ring-hairline plus shadow-soft-md, a ring not a hard border",
        why: "A ring sits outside the box model so the layout never shifts by a pixel on hover or focus.",
        strength: "strong-default",
        slug: "components-from-tokens",
      },
    ],
  },
  {
    category: "Responsive and Theming",
    rows: [
      {
        topic: "Authoring order",
        choice:
          "Style the smallest screen first (unprefixed), then layer sm:/md:/lg: to widen; never start desktop and patch down",
        why: "A layout born on the hardest screen works everywhere while squeezing a desktop layout down makes every override a patch.",
        strength: "non-negotiable",
        slug: "responsive-design",
      },
      {
        topic: "Tap targets and overflow",
        choice:
          "Give anything tappable a 44x44px hit area and contain overflow so the page never scrolls sideways on mobile",
        why: "Fingers are not cursors and one element wider than the viewport is the most common mobile bug.",
        strength: "non-negotiable",
        slug: "responsive-design",
      },
      {
        topic: "Theme default and flash",
        choice:
          "Put dark values directly on :root, resolve the stored theme with a tiny synchronous inline script before paint, and add suppressHydrationWarning to <html>",
        why: "Dark is the product so it must render with zero conditions met, and effects run after paint which is exactly when the flash happens.",
        strength: "non-negotiable",
        slug: "dark-and-light",
      },
      {
        topic: "Inline script safety",
        choice:
          'Keep the dangerouslySetInnerHTML string a fixed literal, never interpolate request data, and validate the stored value is exactly "light" or "dark"',
        why: "A fixed literal introduces no injection surface and validation ensures a tampered entry can only produce a known-good attribute.",
        strength: "non-negotiable",
        slug: "dark-and-light",
      },
      {
        topic: "Mobile navigation",
        choice:
          "Below lg, collapse nav into a static hamburger that opens a side drawer with a real close X inside it",
        why: "The morph-to-X animation reads as generic and a drawer with a real close button is clearer about what is happening.",
        strength: "strong-default",
        slug: "responsive-design",
      },
      {
        topic: "Component responsiveness",
        choice: "Prefer container queries (@container) over viewport breakpoints for components that adapt to their container",
        why: "The component stays responsive wherever you drop it, not just relative to the whole page.",
        strength: "strong-default",
        slug: "responsive-design",
      },
    ],
  },
  {
    category: "Data and Auth",
    rows: [
      {
        topic: "Session verification",
        choice:
          "Always verify with auth.getUser() on the server through one cached Data Access Layer function; never trust getSession()",
        why: "getUser() cryptographically re-verifies the JWT while getSession() just reads the cookie a forged value could fake.",
        strength: "non-negotiable",
        slug: "authentication",
      },
      {
        topic: "Service role key",
        choice:
          "Never prefix the service role key with NEXT_PUBLIC_ or reference it from any client file; server-only, for trusted webhooks and admin work",
        why: "It bypasses RLS entirely, and once inlined into the bundle a value is public forever with rotation the only recovery.",
        strength: "non-negotiable",
        slug: "supabase-setup",
      },
      {
        topic: "Row Level Security",
        choice:
          "Enable RLS on every table the anon key can reach and open access one minimal policy at a time",
        why: "The default posture is deny and access is opened deliberately, which is what makes the anon key safe to expose.",
        strength: "non-negotiable",
        slug: "supabase-setup",
      },
      {
        topic: "Supabase clients",
        choice:
          "Split the browser and server clients into separate files (lib/supabase/client.ts and server.ts), both on the anon key",
        why: "The separation is structural, not a matter of remembering which import is safe where.",
        strength: "non-negotiable",
        slug: "supabase-setup",
      },
      {
        topic: "Auth input validation",
        choice:
          "Validate every auth form with a Zod schema inside a server action before calling Supabase, with a real password policy, accept-terms, and honeypot",
        why: "Validation belongs at the boundary in a mutation, and the policy, terms, and honeypot stop weak passwords and bots.",
        strength: "non-negotiable",
        slug: "authentication",
      },
      {
        topic: "Open-redirect protection",
        choice: "Allowlist any next/returnTo value to a path starting with '/', else fall back to /dashboard",
        why: "A user-controlled redirect target is an open redirect used for phishing and to bounce sessions off-site.",
        strength: "non-negotiable",
        slug: "authentication",
      },
      {
        topic: "User-specific caching",
        choice:
          "Embed relations in one query to avoid N+1, and never cache a user-dependent query unless the cache key includes that user",
        why: "N+1 multiplies round trips and caching user-specific results without a per-user key leaks data.",
        strength: "non-negotiable",
        slug: "database-scalability",
      },
      {
        topic: "Database",
        choice:
          "Supabase Postgres through the Supavisor transaction-mode pooler on port 6543; reserve direct port 5432 for migrations",
        why: "Transient functions talking to Postgres directly exhaust the connection slot limit during traffic spikes.",
        strength: "strong-default",
        slug: "database-scalability",
      },
      {
        topic: "Auth stack",
        choice: "Supabase Auth with @supabase/ssr in the App Router, email+password plus Google OAuth",
        why: "It is the auth stack the whole page is built on for a side project on Supabase.",
        strength: "strong-default",
        slug: "authentication",
      },
      {
        topic: "Indexing",
        choice:
          "Index every column you filter, join, or order by (notably the tenant FK and composites), confirmed by explain analyze",
        why: "Postgres does not auto-index foreign keys and unindexed WHERE columns turn into fatal sequential scans at scale.",
        strength: "strong-default",
        slug: "database-scalability",
      },
      {
        topic: "Pagination",
        choice: "Use keyset (cursor) pagination instead of OFFSET",
        why: "OFFSET makes Postgres read and discard rows so deep pages get slower, while keyset rides the index at constant cost.",
        strength: "strong-default",
        slug: "database-scalability",
      },
      {
        topic: "Session refresh location",
        choice: "Refresh expiring sessions in proxy (the Next.js 16 rename of middleware), never enforce access there",
        why: "The docs are explicit that proxy is for optimistic checks only and real authorization belongs in the data layer.",
        strength: "strong-default",
        slug: "supabase-setup",
      },
    ],
  },
  {
    category: "Security",
    rows: [
      {
        topic: "Zero-trust entry points",
        choice:
          "Treat every Server Action and route handler as a public endpoint reachable by direct POST; never treat the UI as access control",
        why: "An exported Server Action is reachable even when no component renders its button.",
        strength: "non-negotiable",
        slug: "security-by-design",
      },
      {
        topic: "Mutation check order",
        choice:
          "Three checks in order inside every handler: validate input with Zod, authenticate, then authorize by ownership",
        why: "Skipping the ownership check is the IDOR bug, the most common way a logged-in user reads or deletes another user's data.",
        strength: "non-negotiable",
        slug: "security-by-design",
      },
      {
        topic: "Secrets handling",
        choice:
          "Read process.env only in server code, add import 'server-only' to every secret-touching module, and never give a secret a NEXT_PUBLIC_ prefix",
        why: "server-only turns an accidental client import into a build error and NEXT_PUBLIC_ inlines the value into shipped JavaScript forever.",
        strength: "non-negotiable",
        slug: "security",
      },
      {
        topic: "NEXT_PUBLIC_ discipline",
        choice:
          "Treat NEXT_PUBLIC_ as publishing to the world; never add it to silence a missing-env error, move the read to the server instead",
        why: "The error means a secret is being read on the client and the correct fix is server-side reading, not exposure.",
        strength: "non-negotiable",
        slug: "environment-and-secrets",
      },
      {
        topic: "Env files in git",
        choice:
          "Never commit .env.local or any file with a real credential; commit .env.example with blank values",
        why: "A secret in git history is leaked even after deletion, so real values must never reach the repository.",
        strength: "non-negotiable",
        slug: "environment-and-secrets",
      },
      {
        topic: "Data Access Layer",
        choice:
          "One server-only DAL owns every DB call and process.env read, runs authorization, and is the single audit surface",
        why: "Auditing one server-only module beats grepping the whole app for stray queries, secrets, and missing checks.",
        strength: "non-negotiable",
        slug: "security-by-design",
      },
      {
        topic: "SQL queries",
        choice:
          "Parameterize via tagged template or query builder; never interpolate user input into a query string",
        why: "String interpolation in a query is SQL injection waiting to happen.",
        strength: "non-negotiable",
        slug: "security-by-design",
      },
      {
        topic: "Server-to-client data",
        choice:
          "Map to a minimal DTO with only the fields the UI renders; never pass a raw DB row or full User object across the boundary",
        why: "Every field on a passed object is serialized into the client payload, so the unrendered fields leak.",
        strength: "non-negotiable",
        slug: "data-security",
      },
      {
        topic: "Content Security Policy",
        choice:
          "Nonce-based CSP minted in proxy.ts, fresh per request; never use 'unsafe-inline' in script-src, allow 'unsafe-eval' only in dev",
        why: "Only scripts tagged with the exact per-request token run, which is exactly what an injected XSS payload lacks.",
        strength: "non-negotiable",
        slug: "content-security-policy",
      },
      {
        topic: "Rate-limit backend",
        choice:
          "Shared Redis-backed limiter (Upstash, sliding window) in production; never a per-process Map, with an in-memory dev fallback",
        why: "A module-level Map resets per serverless cold start, so the counter must be visible to every instance to limit anything.",
        strength: "non-negotiable",
        slug: "rate-limiting",
      },
      {
        topic: "Error exposure",
        choice:
          "Model expected errors as return values; throw only unexpected ones to an error boundary, never render error.message or a raw DB error",
        why: "A leaked stack trace or raw DB error is a reconnaissance gift to an attacker.",
        strength: "non-negotiable",
        slug: "security-by-design",
      },
      {
        topic: "Shipping verification",
        choice: "Run next build and grep .next/static for known secret strings to confirm nothing leaked",
        why: "A secret string appearing under .next/static proves it leaked into the browser bundle.",
        strength: "strong-default",
        slug: "environment-and-secrets",
      },
    ],
  },
  {
    category: "Forms, Email, and Errors",
    rows: [
      {
        topic: "Form submission",
        choice:
          "Submit forms through a server action that validates every field with Zod first; never fetch a third party or expose a provider key from the client",
        why: "It keeps API keys and provider calls on the server and treats all client input as untrusted before any field is used.",
        strength: "non-negotiable",
        slug: "contact-and-forms",
      },
      {
        topic: "Email provider",
        choice:
          "Resend behind one uncached POST handler that validates first, builds the client second, sends last",
        why: "Email is a side effect on untrusted input that needs one trusted choke point and mutations must never be cached.",
        strength: "non-negotiable",
        slug: "email-with-resend",
      },
      {
        topic: "Sender address",
        choice: "Keep from on a verified domain and set replyTo to the visitor; never spoof from with the visitor's address",
        why: "Spoofing from gets you marked as spam and breaks SPF and DKIM.",
        strength: "non-negotiable",
        slug: "email-with-resend",
      },
      {
        topic: "Untrusted content in email",
        choice:
          "HTML-escape every user-supplied value before substituting it, and build action URLs from trusted server state only",
        why: "Raw form input can break layout or smuggle a tracking pixel and an attacker-controlled value must never become the link target.",
        strength: "non-negotiable",
        slug: "email-templates",
      },
      {
        topic: "Email layout",
        choice: "Build with HTML tables, never flexbox or grid, and always send a plain-text fallback",
        why: "Outlook renders with Word's engine so tables are the only layout that renders the same across clients, and plain text aids deliverability.",
        strength: "non-negotiable",
        slug: "email-templates",
      },
      {
        topic: "Destructive actions",
        choice:
          "Use a controlled dialog that names the target and disables while pending, never window.confirm, and re-check ownership server-side",
        why: "window.confirm cannot show context and the modal is UX, not authorization, since a fetch client skips it entirely.",
        strength: "non-negotiable",
        slug: "error-handling-ux",
      },
      {
        topic: "Root 404",
        choice: "Always ship app/not-found.tsx as the app-wide catch-all for unmatched URLs",
        why: "The root not-found doubles as the catch-all for any unmatched URL across the app.",
        strength: "non-negotiable",
        slug: "error-handling-ux",
      },
      {
        topic: "Spam defense",
        choice: "Add a CSS-hidden honeypot rejected when filled plus a per-IP rate limit, instead of a captcha",
        why: "Together they stop the bulk of automated spam without forcing a captcha on real users.",
        strength: "strong-default",
        slug: "contact-and-forms",
      },
      {
        topic: "Feedback UI",
        choice:
          "Drive UI from the server action's returned state via useActionState, tie each error to its input with aria-describedby, disable submit while pending",
        why: "Typed returned state plus ARIA wiring gives accessible inline errors and clear pending feedback.",
        strength: "strong-default",
        slug: "contact-and-forms",
      },
    ],
  },
  {
    category: "Growth: SEO, Analytics, Monetization",
    rows: [
      {
        topic: "metadataBase and canonicals",
        choice: "Set metadataBase once in the root layout and an explicit alternates.canonical on every indexable page",
        why: "Relative OG and canonical URLs resolve against it and the canonical is the strongest signal against duplicate-content dilution.",
        strength: "non-negotiable",
        slug: "seo",
      },
      {
        topic: "robots.txt is not access control",
        choice:
          "Never rely on robots.txt disallow to protect admin, account, or API paths; gate sensitive routes with real authorization",
        why: "robots.txt is a public, polite request that tells everyone exactly where to look.",
        strength: "non-negotiable",
        slug: "seo",
      },
      {
        topic: "generateMetadata as a trust boundary",
        choice: "Validate params shape before fetching and never echo unsanitized user input into title or description",
        why: "A crafted slug reaching an internal service is request forgery, not an SEO bug.",
        strength: "non-negotiable",
        slug: "seo",
      },
      {
        topic: "Analytics load and placement",
        choice:
          "Load GA4 via next/script at afterInteractive, mounted once in app/layout.tsx referencing NEXT_PUBLIC_GA_ID literally, rendering nothing when unset",
        why: "afterInteractive keeps the tag off the critical path, per-page mounting double-counts, and a computed env key silently no-ops.",
        strength: "non-negotiable",
        slug: "analytics",
      },
      {
        topic: "AdSense rendering and policy",
        choice:
          "Load the loader once via next/script afterInteractive, render units through a client component with a silent try/catch; place units only in finished content, never click your own ads",
        why: "A missing ad must never break the page, and self-clicks or empty pages are policy violations that get accounts permanently banned.",
        strength: "non-negotiable",
        slug: "monetization-adsense",
      },
      {
        topic: "Consent default",
        choice: "Load the CMP beforeInteractive and default analytics_storage to denied until the visitor opts in",
        why: "Collecting nothing until consent is the secure-by-default posture that keeps you on the right side of GDPR.",
        strength: "strong-default",
        slug: "analytics",
      },
      {
        topic: "Title and OG strategy",
        choice: "Use title.template plus title.default in the root layout and the opengraph-image.tsx file convention via ImageResponse",
        why: "Child pages inherit the brand suffix for free and the file convention auto-wires og:image at higher priority than config.",
        strength: "strong-default",
        slug: "seo",
      },
    ],
  },
  {
    category: "Affiliates and Referrals",
    rows: [
      {
        topic: "Referral identifier",
        choice: "Sign the ref value (HMAC or signed JWT) in an httpOnly cookie and verify the signature before trusting it",
        why: "A raw ?ref= value is attacker-editable and lets anyone credit themselves or burn a competitor.",
        strength: "non-negotiable",
        slug: "affiliates-referrals",
      },
      {
        topic: "Commission source of truth",
        choice: "Never credit a commission from the browser; compute amounts server-side from the verified gross payment and your own tier table",
        why: "There must be no step where editing a URL or replaying a request can manufacture a credit.",
        strength: "non-negotiable",
        slug: "affiliates-referrals",
      },
      {
        topic: "Attribution and conversion",
        choice: "Claim attribution once, idempotently keyed on the new user id, and record the conversion inside the payment webhook after the row commits",
        why: "An atomic RPC keyed on the user prevents double-attribution and ties the commission to real settled money.",
        strength: "non-negotiable",
        slug: "affiliates-referrals",
      },
      {
        topic: "Refunds and chargebacks",
        choice: "Reverse or void the conversion when a commission-earning payment is refunded or charged back",
        why: "A paid-out commission on refunded revenue is a direct loss, so commission must track real settled money.",
        strength: "non-negotiable",
        slug: "affiliates-referrals",
      },
      {
        topic: "Auth-callback side effects",
        choice: "Make attribution best-effort and never block the redirect; swallow errors and continue",
        why: "A failed attribution is a bookkeeping problem but a blocked sign-in is a lost customer.",
        strength: "strong-default",
        slug: "affiliates-referrals",
      },
    ],
  },
  {
    category: "Payments and Cost",
    rows: [
      {
        topic: "Source of truth for access",
        choice: "Grant access only from the signed provider webhook, never from the browser checkout redirect",
        why: "The browser can be closed, replayed, or forged, while the webhook is a signed server-to-server call.",
        strength: "non-negotiable",
        slug: "payments-billing",
      },
      {
        topic: "Webhook signature verification",
        choice: "Verify the signature against the raw req.text() body before parsing, never req.json()",
        why: "The signature is computed over the exact bytes, so parsing first invalidates verification.",
        strength: "non-negotiable",
        slug: "payments-billing",
      },
      {
        topic: "Trusting webhook amounts",
        choice: "Re-fetch the payment from the provider API by id and trust that for amount, currency, and status",
        why: "The webhook body is only a spoofable hint while the provider API is authoritative.",
        strength: "non-negotiable",
        slug: "payments-billing",
      },
      {
        topic: "Idempotency",
        choice:
          "Insert under a unique constraint keyed on payment id (and event id) and treat a 23505 violation as an already-processed no-op",
        why: "Providers retry and fire sibling events per payment, so a non-idempotent grant can grant twice.",
        strength: "non-negotiable",
        slug: "payments-billing",
      },
      {
        topic: "Checkout pricing",
        choice: "Set amounts and SKU on the server from my own pricing table, never from a client-sent price",
        why: "A client-supplied amount is a free-product exploit.",
        strength: "non-negotiable",
        slug: "payments-billing",
      },
      {
        topic: "Domain registrar",
        choice:
          "Register at an at-cost registrar like Cloudflare (or Porkbun, Namecheap) and check the renewal price, never just the first-year promo",
        why: "At-cost registrars charge wholesale while others quietly gouge on renewals.",
        strength: "non-negotiable",
        slug: "cost-to-launch",
      },
      {
        topic: "Domain upsells",
        choice: "Never buy domain privacy, premium DNS, or SSL add-ons",
        why: "WHOIS privacy is free at decent registrars and Vercel issues and renews TLS for free.",
        strength: "non-negotiable",
        slug: "cost-to-launch",
      },
      {
        topic: "Commercial licensing",
        choice: "Move Vercel to Pro the same day a project becomes commercial, never run commercial work on Hobby",
        why: "Vercel Hobby forbids commercial use, so this is a licensing rule independent of traffic.",
        strength: "non-negotiable",
        slug: "cost-to-launch",
      },
      {
        topic: "Access checks",
        choice: "Decide access by querying a live entitlement (active and not expired), not a boolean flag flipped once",
        why: "Expiry, refunds, and downgrades need a queryable source of truth, not a stale flag.",
        strength: "strong-default",
        slug: "payments-billing",
      },
      {
        topic: "Launch stack and upgrades",
        choice:
          "Launch on free tiers (Vercel Hobby, Supabase, Resend, Sentry, GA4) and upgrade one line at a time only when its specific trigger fires",
        why: "Every tool has a production-usable free tier, so pre-buying Pro pays for headroom you have not earned.",
        strength: "strong-default",
        slug: "cost-to-launch",
      },
    ],
  },
  {
    category: "Ship: Deploy and CI",
    rows: [
      {
        topic: "Hosting and environments",
        choice:
          "Deploy to Vercel via GitHub push with main as production, feature branches as previews, and run npm run ship locally first",
        why: "Previews build from the exact commit that ships and the local gate makes CI a backstop, not a surprise.",
        strength: "strong-default",
        slug: "deployment",
      },
      {
        topic: "Secrets handling",
        choice:
          "Set every production env var in Vercel settings scoped to Production, Preview, or Development, never ship them in the repo",
        why: "Committed secrets get published to GitHub and separate scopes stop a preview from writing production data.",
        strength: "non-negotiable",
        slug: "deployment",
      },
      {
        topic: "Linting in Next.js 16",
        choice: "Run eslint directly as its own script step in both the ship gate and CI, never next lint",
        why: "next lint is removed and next build no longer runs the linter, so skipping this means lint never runs.",
        strength: "non-negotiable",
        slug: "ci-cd-pipelines",
      },
      {
        topic: "CI gate",
        choice:
          "Run one GitHub Actions verify job of five steps (typecheck, lint, check:content, test, build) on every PR and push to main",
        why: "A green Vercel build only proves it compiled, so types, lint, content, and tests need their own gate.",
        strength: "non-negotiable",
        slug: "ci-cd-pipelines",
      },
      {
        topic: "Test command",
        choice: "Use vitest run, never bare vitest, for the CI test step",
        why: "Bare vitest stays in watch mode and CI hangs forever.",
        strength: "non-negotiable",
        slug: "ci-cd-pipelines",
      },
      {
        topic: "Branch protection",
        choice:
          "Require the verify check and up-to-date branches, require a PR with one approval, and disallow bypass for everyone including admins",
        why: "A gate admins can bypass does not exist, because the one midnight bypass is when the broken build ships.",
        strength: "non-negotiable",
        slug: "ci-cd-pipelines",
      },
      {
        topic: "DNS records",
        choice:
          "Point the domain at Vercel with exactly an A record on the apex and a CNAME on www, deleting stale records first and keeping Cloudflare DNS-only",
        why: "The apex cannot be a CNAME, and stale or orange-cloud-proxied records are the top reasons a domain will not connect.",
        strength: "non-negotiable",
        slug: "dns-and-domains",
      },
      {
        topic: "Definition of shipped",
        choice:
          "Never treat implemented as shipped; shipping includes brand, edge cases, empty states, the phone view, and verifying the rendered live output",
        why: "A passing build only confirms it compiled, nothing about whether the page looks right or works.",
        strength: "non-negotiable",
        slug: "launch-checklist",
      },
      {
        topic: "Node version",
        choice: "Pin the same Node major (20.x or 22.x) locally, in CI, and on Vercel",
        why: "Matching versions means a green build locally and in CI almost certainly means Vercel is green too.",
        strength: "strong-default",
        slug: "deployment",
      },
      {
        topic: "Pre-ship manual checks",
        choice:
          "Open the live page, click every button, check both themes, resize to phone, verify the share card, and ship a real favicon with no dead links",
        why: "Each check catches a class of bug the build never will, and a default icon or 404 is the loudest unfinished tell.",
        strength: "strong-default",
        slug: "launch-checklist",
      },
    ],
  },
  {
    category: "Operate: Performance and Observability",
    rows: [
      {
        topic: "Per-user caching",
        choice:
          "Cache only what is identical for everyone and tag it; never cache a per-user response under a key that omits the user",
        why: "A user-specific response under a shared key leaks one user's data to another.",
        strength: "non-negotiable",
        slug: "performance",
      },
      {
        topic: "Images",
        choice: "Use next/image with width, height, and sizes, never a raw full-resolution img tag",
        why: "Next serves a fitted modern-format image and reserves layout space to avoid CLS.",
        strength: "non-negotiable",
        slug: "performance",
      },
      {
        topic: "Logging failures",
        choice: "Every logging path must swallow its own errors and never rethrow",
        why: "Logging is a side effect on the hot path and must never take down the request it only observes.",
        strength: "non-negotiable",
        slug: "observability-logging",
      },
      {
        topic: "PII in logs",
        choice:
          "Keep PII out of log fields and the msg string by default, with key-based redaction in the logger as a backstop",
        why: "Doing redaction in the logger stops any call site leaking personal data, but it cannot catch concatenated values.",
        strength: "non-negotiable",
        slug: "observability-logging",
      },
      {
        topic: "Sentry DSN and source maps",
        choice:
          "Use NEXT_PUBLIC_SENTRY_DSN in the browser, keep SENTRY_AUTH_TOKEN secret, and set deleteSourcemapsAfterUpload so maps strip from the public bundle",
        why: "A server-only DSN captures nothing client-side while a leaked token or shipped source map exposes your source.",
        strength: "non-negotiable",
        slug: "sentry-setup",
      },
      {
        topic: "Sentry client instrumentation",
        choice: "Run client instrumentation only from instrumentation-client.ts, not the legacy sentry.client.config.ts",
        why: "Next 16 only executes client instrumentation from instrumentation-client.ts.",
        strength: "non-negotiable",
        slug: "sentry-setup",
      },
      {
        topic: "Policy honesty",
        choice:
          "Never paste a generic policy template you never read; treat any data-flow change (analytics, processor, OAuth scope) as shipping with a policy edit",
        why: "A policy describing data flows you do not have is a promise you are silently breaking.",
        strength: "non-negotiable",
        slug: "legal-pages",
      },
      {
        topic: "Caching and invalidation",
        choice:
          "Cache rarely-changing shared reads with use cache plus cacheLife, invalidate by tag, and wrap request-time parts in Suspense",
        why: "Recomputing identical data per request wastes work while tags keep precise control over staleness.",
        strength: "strong-default",
        slug: "performance",
      },
      {
        topic: "Pagination",
        choice:
          "Default to cursor (keyset) pagination for feeds and paginate every list that can grow, using offset only for small fixed page-number UIs",
        why: "An unbounded findMany stalls the page as the table grows, while keyset seeks straight to the cursor row at constant cost.",
        strength: "strong-default",
        slug: "performance",
      },
      {
        topic: "Structured logging",
        choice:
          "Emit one structured JSON line per event with a namespaced name (domain.action.outcome), forward warnings and errors to Sentry from the log helper, and await log.flush() before a serverless handler returns",
        why: "Queryable events beat free text, helper-level forwarding reports every error with no call-site changes, and flushing stops a freezing instance dropping sends.",
        strength: "strong-default",
        slug: "observability-logging",
      },
      {
        topic: "Legal pages",
        choice:
          "Ship privacy, terms, disclaimer, and data-deletion pages under one indexable /legal prefix, linked from the footer and signup with stored consent",
        why: "These are the gates Google sign-in, AdSense, and app stores check, and a page no one can find does not count.",
        strength: "strong-default",
        slug: "legal-pages",
      },
      {
        topic: "What to log",
        choice:
          "Log decisions worth an incident review (payment received, webhook rejected, rate limit, auth failure, job done or failed), not entered-function chatter",
        why: "A handful of well-named events per flow beats a hundred console.logs that bury the signal.",
        strength: "opinion",
        slug: "observability-logging",
      },
    ],
  },
];

/**
 * The decision set, with every category's rows ordered firm-first.
 * The single source the rendered table and the one-drop markdown both read.
 */
export const decisions: DecisionCategory[] = RAW.map((c) => ({
  category: c.category,
  rows: [...c.rows].sort((a, b) => STRENGTH_RANK[a.strength] - STRENGTH_RANK[b.strength]),
}));

/** Total decisions across all categories, for the page's summary line. */
export function decisionCount(): number {
  return decisions.reduce((n, c) => n + c.rows.length, 0);
}

/** Human label for a strength, used by the badge and the markdown output. */
export const STRENGTH_LABEL: Record<DecisionStrength, string> = {
  "non-negotiable": "Non-negotiable",
  "strong-default": "Strong default",
  opinion: "Opinion",
};

/**
 * Render the whole decision set as grouped markdown, so the one-drop endpoint
 * and llms.txt carry the real table instead of a dead <DecisionsTable /> tag.
 * Mirrors checklistMarkdown() in registry.ts.
 */
export function decisionsMarkdown(siteUrl?: string): string {
  const lines: string[] = [];
  for (const { category, rows } of decisions) {
    lines.push(`\n**${category}**\n`);
    for (const r of rows) {
      const ref = siteUrl ? ` (${siteUrl}/docs/${r.slug})` : ` (/docs/${r.slug})`;
      lines.push(`- ${r.topic}: ${r.choice}. ${STRENGTH_LABEL[r.strength]}. Why: ${r.why}${ref}`);
    }
  }
  return lines.join("\n");
}
