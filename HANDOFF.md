# Handoff, Portfolio + Next.js Handbook

_Last updated: 2026-06-15_

## TL;DR

Two surfaces under one brand: a developer portfolio and a fact-checked **Next.js Handbook** with one-drop AI ingestion. The site now has **real content** (Selwyn's experience, projects, certifications), a **real brand identity** (S-mark favicon, logo, dynamic OG image), a **reorganized handbook**, and **error/404 pages**. Build, lint, typecheck, content guard, and tests are all green.

- **Branch:** `main`. There are **12 unpushed commits** from 2026-06-14/15 (Selwyn pushes manually). Push them, then redeploy.
- **Brand:** red (`#e30613`) on near-black, dark-first, condensed all-caps display.

## What changed since the last handoff (2026-06-14 / 06-15)

- **Real portfolio content wired** (`lib/content/`): three defensible projects (CSE Exam Review featured, Penethodix, SelVis), three real roles (cseexamreview founder, Forthwith web dev, Black Bear VAPT intern), the real skills list, and **20 certifications** (18 with real certificate images). The "Replace Me" placeholders and their content-guard allow-list entries are gone.
- **Certifications UI:** curated preview (6 on desktop, 3 on mobile) with a "show all" toggle, certificate-image cards, and a separate Google Cloud skill-badge strip with real verify links.
- **Brand identity:** S-mark **favicon** set (favicon.ico + icon.png + apple-icon.png, white-corner fringe fixed), the S mark in the header beside the wordmark, and a **dynamic OG/Twitter share image** generated with `next/og` (`app/opengraph-image.tsx`).
- **Error states:** branded **404** (`app/not-found.tsx`) and **runtime error boundary** (`app/error.tsx`), both matching the hero's visual language and returning correct status codes.
- **Handbook reorganized** into a numbered build journey: `01 Start Here, 02 Architecture, 03 Design, 04 Build, 05 Security, 06 Grow, 07 Ship, 08 Operate`. Index and sidebar show section numbers; Getting Started is badged "Start here". 38 pages total.
- **New handbook content:** "The Launch Checklist" page (Ship) with an interactive, localStorage-backed checklist widget (`lib/docs/launch-checklist.ts` + `components/docs/launch-checklist.tsx`), plus pages added earlier for auth, payments, contact, legal, rate limiting, observability, affiliates, performance, responsive design.
- **Contact form fixed for production:** the obfuscated dynamic `import("resend")` (marked `webpackIgnore`) was never bundled into the Vercel function, causing a production 500. Now a normal `import { Resend } from "resend"`. Sender switched from `onboarding@resend.dev` to `contact@selwynuy.dev` (domain verified in Resend).
- **Navbar simplified:** just the WORK/HANDBOOK switch + utilities, identical on both surfaces (no per-section anchors).

## What is NOT done

1. **Push + redeploy.** 12 commits are local-only. After pushing, set the production env on Vercel (below) and redeploy.
2. **Vercel env vars (production):** confirm `RESEND_API_KEY`, `CONTACT_TO_EMAIL=selwyn.cybersec@gmail.com`, and **`CONTACT_FROM_EMAIL=contact@selwynuy.dev`** are set, then redeploy so the live contact form sends from the brand domain. (Local `.env.local` is already correct; production reads Vercel's own vars.)
3. **Sign off draft handbook pages:** several integration/opinion pages are still `verified: false`. Review against the real workflow, then flip to `verified: true` with sources.
4. **Profile photo** for the portfolio (deferred).
5. **Google OAuth via Supabase + Cloud Console branding** (see "To discuss tomorrow").

## To discuss tomorrow (Google OAuth + consent-screen branding)

Goal: when a user signs in with Google, the consent screen reads **"Sign in to selwynuy.dev"**, not "Sign in to <project>.supabase.co".

The reason it shows the Supabase URL by default: Supabase's hosted OAuth uses its own callback domain (`<ref>.supabase.co/auth/v1/callback`), and Google shows the OAuth client's domain on the consent screen. To brand it:

- **Custom domain for Supabase auth** (e.g. `auth.selwynuy.dev`) so the callback and shown domain are yours. This is a Supabase Pro feature (custom domains / vanity auth URL), so check the plan.
- **Google Cloud Console** (`console.cloud.google.com`): configure the **OAuth consent screen** (App name = the brand, support email, app logo, authorized domains incl. `selwynuy.dev`), and create OAuth credentials whose **Authorized redirect URI** points at the Supabase (or custom-domain) callback. Verify domain ownership so the consent screen shows the real app name/domain.
- The handbook already has **"Authentication and Google Sign-In"** (Build section) and **"Supabase Setup"**, plus **"Domains and DNS"**, this work should update those pages with the real consent-screen-branding steps once done.
- Open questions for tomorrow: is Supabase on a plan that allows a custom auth domain? Pick the auth subdomain. Decide whether to brand now or ship with the default Supabase URL first.

## How to resume

```bash
git checkout main
npm install
npm run dev
npm run verify   # typecheck, lint, content guard, tests, build, all green
```

Full plan and step status: `plans/portfolio-nextjs-handbook.md`.

## Gotchas (still current, Next.js 16)

- Read the bundled Next.js 16 docs before framework changes (`node_modules/next/dist/docs/`, per `AGENTS.md`). Notable this session: the `error.tsx` retry prop is **`unstable_retry`** (not `reset`); `_`-prefixed route folders are **private** (unrouted); icons/OG use the `app/` file conventions (`favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.tsx`).
- **No em-dashes in source.** The content guard blocks the commit. YAML frontmatter: avoid a quote-then-colon combo in `summary:` (it breaks the parser).
- A runtime dependency used in a route must be a **normal import**, not a `webpackIgnore` dynamic import, or Vercel will not bundle it (the contact-form 500 root cause).
- Server Components by default; defer `setState` out of effect bodies (React Compiler lint).
- `.env.local` is gitignored, real config (the Resend key, the from-address) lives there and in Vercel, never in committed files.
