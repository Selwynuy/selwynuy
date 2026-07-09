# The launch checklist

The line between code that compiles and a site that reads as finished. Generated
from the same data the handbook's interactive checklist uses, so it never diverges.

Each item is tagged **required** (the floor to ship at all), **recommended**
(what makes it good), or **optional** (the finishing touch), and shows which
project types it applies to. Filter to what you are building, then work the
required items first. A green build is not a finished product.

How to use it: pick your project type (marketing, app, or ecommerce), skip the
items whose "applies to" does not include it or `all`, and check every remaining
item against the real rendered site, not the build. Do not call it shippable
while any required item is open.

## Foundation

- **[RECOMMENDED] Scope the work before writing code.** Decide what done looks like first. A half-page of intent beats a feature you have to unbuild. _(applies to: all)_
- **[REQUIRED] Typecheck and lint pass with zero errors.** No any on real data, no unused imports, no stray console logs. Green before you ship, every time. _(applies to: all)_
- **[REQUIRED] Production build succeeds locally.** next build catches what dev hides: bad image config, server/client boundary leaks, type errors in routes. _(applies to: all)_ (handbook: `deployment`)
- **[REQUIRED] Secrets are server-only and .env is gitignored.** No keys in client bundles, no .env.local committed. Verify what NEXT_PUBLIC_ actually exposes. _(applies to: all)_ (handbook: `environment-and-secrets`)
- **[REQUIRED] Verify the rendered output, not just the build.** A green build is not a working page. Open it. Click the buttons. Check both themes and a phone width. _(applies to: all)_

## Brand & Identity

- **[REQUIRED] Real favicon, not the framework default.** The default triangle screams unfinished. Ship favicon.ico plus icon and apple-icon, and check the corners do not fringe on a dark tab. _(applies to: all)_ (handbook: `branding-overview`)
- **[REQUIRED] Open Graph / social share image.** When someone shares the link, a branded card matters. A blank or broken preview is the second unfinished tell after the favicon. _(applies to: all)_ (handbook: `seo`)
- **[REQUIRED] Page titles and meta descriptions are real.** No 'Create Next App' in the tab. Every route has an intentional title and description. _(applies to: all)_ (handbook: `seo`)
- **[RECOMMENDED] A consistent logo or wordmark.** One mark used the same way everywhere (header, favicon, social) so the site reads as one brand. _(applies to: all)_ (handbook: `branding-overview`)

## Design & Polish

- **[RECOMMENDED] Colors and type come from tokens, not magic values.** One accent, a small scale, semantic tokens. Changing the theme should mean editing one place, not fifty. _(applies to: all)_ (handbook: `design-tokens`)
- **[REQUIRED] No dead links or placeholder content.** Every link resolves, every 'coming soon' is real or gone. A 404 from your own nav is worse than omitting the link. _(applies to: all)_
- **[RECOMMENDED] Consistent spacing, alignment, and card heights.** Mixed-height cards and ragged rows read as broken. Make repeated elements uniform so the eye trusts the grid. _(applies to: all)_
- **[RECOMMENDED] Empty, loading, and error states exist.** The happy path is the easy 20 percent. Design the empty list, the spinner, the failed fetch, the 404. _(applies to: app, ecommerce)_ (handbook: `error-handling-ux`)
- **[REQUIRED] Responsive and mobile-first, verified on a real width.** Most traffic is mobile. Check tap targets, the nav collapse, and that nothing overflows at 390px. _(applies to: all)_ (handbook: `responsive-design`)
- **[OPTIONAL] Dark and light both look intentional.** If you support a theme toggle, every surface and image has to hold up in both, not just the one you built in. _(applies to: all)_ (handbook: `dark-and-light`)
- **[RECOMMENDED] Accessibility basics: alt text, labels, focus, contrast.** Images have alt text, inputs have labels, focus is visible, text passes contrast. Cheap to do, expensive to retrofit. _(applies to: all)_

## Security

- **[RECOMMENDED] Baseline security headers are set.** Clickjacking protection, no MIME sniffing, a tight referrer policy. The site that preaches security should practice it. _(applies to: all)_ (handbook: `security`)
- **[REQUIRED] Every input is validated server-side.** Client validation is UX, not security. Validate and authorize on the server for every mutation. _(applies to: app, ecommerce)_ (handbook: `security-by-design`)
- **[RECOMMENDED] Forms and auth routes are rate limited.** A contact form or login with no limit is a spam and brute-force magnet. Add a limiter and a honeypot. _(applies to: all)_ (handbook: `contact-and-forms`)
- **[REQUIRED] Auth and access control are enforced at the data layer.** Least-privilege access on every protected read and write, checked server-side, not hidden behind a UI route. _(applies to: app, ecommerce)_ (handbook: `data-security`)
- **[RECOMMENDED] Privacy policy and terms exist if you collect data or charge.** Non-negotiable once you take emails, payments, or run ads. Also a hard requirement for AdSense and most processors. _(applies to: app, ecommerce, marketing)_ (handbook: `legal-pages`)

## Performance & SEO

- **[RECOMMENDED] Images are fitted and use the framework image pipeline.** Ship the size you render, in a modern format. One unoptimized hero image can dwarf the rest of the page. _(applies to: all)_ (handbook: `performance`)
- **[RECOMMENDED] Core Web Vitals are in the green.** LCP, CLS, INP. Run Lighthouse on the production build, not dev. Layout shift and slow LCP cost rankings and trust. _(applies to: all)_ (handbook: `performance`)
- **[RECOMMENDED] Sitemap, robots, and canonical URLs.** Tell crawlers what to index and how. Missing these quietly caps how well you can ever rank. _(applies to: marketing, ecommerce)_ (handbook: `seo`)
- **[OPTIONAL] Structured data (JSON-LD) for rich results.** Person, Product, Article, or Organization schema earns richer search listings and is cheap to add. _(applies to: marketing, ecommerce)_ (handbook: `seo`)
- **[OPTIONAL] Analytics is wired (and privacy-aware).** You cannot improve what you cannot see. Add analytics, but load it so it no-ops when the key is unset. _(applies to: all)_ (handbook: `analytics`)

## Pre-Launch

- **[REQUIRED] Custom domain with HTTPS and DNS verified.** A real domain on HTTPS, not the deploy preview URL. Confirm the records resolve before you announce. _(applies to: all)_ (handbook: `dns-and-domains`)
- **[RECOMMENDED] Error tracking and logging are live.** Know when production breaks before your users tell you. One JSON line per event, errors forwarded to a tracker. _(applies to: app, ecommerce)_ (handbook: `observability-logging`)
- **[RECOMMENDED] CI gates every deploy on green checks.** Typecheck, lint, tests, and build run on every pull request so a red build can never reach production. _(applies to: all)_ (handbook: `ci-cd-pipelines`)
- **[RECOMMENDED] Final walkthrough on a fresh device.** Open the live URL on a phone you did not build on. First impression, every link, the share preview, the favicon. _(applies to: all)_

## The floor to ship

12 of 30 items are **required** for a general project. Filtering to a specific project type changes which count. Every required item must be checked and passing before launch; recommended and optional items make it good and polished but do not block the ship.

## Source

Generated from `lib/docs/launch-checklist.ts` (the handbook's own checklist data). Handbook page: `launch-checklist`.
