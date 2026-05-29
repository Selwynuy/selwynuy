# Handoff — Portfolio

_Last updated: 2026-05-29_

## TL;DR

A recruiter-focused portfolio for Selwyn Uy is built and working: **Next.js 16 / React 19 / Tailwind v4**, "Editorial × Technical" design, storyline-driven content. Build / lint / typecheck all pass. The remaining work is **real content + imagery** and **enabling the contact form**.

- **Branch:** `feat/portfolio-site` (not yet merged to `main`, not pushed)
- **Last commit:** `c7960a2 feat: give the portfolio a storyline`
- **Self-rated by user:** 7/10 after the storyline pass.

## What's done

- **Foundation** — design tokens (monochrome palette, type scale, soft-shadow depth, dot-grid/glow atmosphere, reveal/marquee keyframes) in `app/globals.css`. Light default + dark via `prefers-color-scheme`.
- **Sections** (storyline order, each a distinct narrative beat):
  - `01` Hero — the **hook** is the headline; typing terminal identity card; oversized ghost wordmark; staged load reveal.
  - `02` About — **origin → approach narrative** (security past → how I build → what you get) on a timeline.
  - `03` Projects — **bento grid**, featured tile enlarged with watermark index + hover arrow. Scroll-revealed.
  - `04` Experience — editorial timeline with a spine.
  - `05` Certifications — credential cards with a shield motif (where the security claim earns its proof).
  - `06` Contact — validated form → `/api/contact` → Resend.
- **Skills marquee** — dual rows, opposite directions, pause-on-hover.
- **SEO** — metadata (title template, OG, Twitter), JSON-LD `Person`, `robots.ts`, `sitemap.ts`.
- **Contact API** — `app/api/contact/route.ts`: server-side validation, honeypot, Resend send. Degrades to a friendly 503 until configured (no crash, build stays green).
- **Verification** — `tsc --noEmit`, `eslint`, and `next build` all pass.

## What's NOT done (next steps, roughly prioritized)

1. **Real projects** — `lib/content/projects.ts` is all placeholders. Replace with 3–6 real projects; lead each description with the **outcome/impact**, not the stack. Mark the strongest `featured: true`.
2. **Real experience + certifications** — `lib/content/experience.ts`: replace placeholder roles, skills, and the cybersecurity certs (real cert names/issuers/years; add `url` for any with a verification link).
3. **Verify the About story** — the three beats in `profile.ts` (`story`) are plausible placeholders. Confirm the **origin beat** matches Selwyn's actual path (came to dev *from* security vs. the reverse) and tune the copy.
4. **Imagery** — biggest perceived-quality lever still untapped. Project thumbnails/screenshots and optionally a profile photo. Will need image support added to the project cards + a proper OG image (`app/opengraph-image.tsx`).
5. **Résumé** — drop `resume.pdf` in `public/` and set `profile.resumeUrl`; the download buttons appear automatically once set.
6. **Enable contact form** — `npm install resend`, add `RESEND_API_KEY` to `.env.local` (see `.env.example`).
7. **Real domain** — replace `https://selwynuy.dev` placeholder in `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/page.tsx`.
8. **Deploy** — Vercel; add env vars in project settings.
9. **Final QA** — responsive sweep + accessibility check once real content is in. (Screenshots couldn't be captured in the build environment — verify visuals manually in a browser.)

## How to resume

```bash
git checkout feat/portfolio-site
npm install
npm run dev
```

Then start with item 1 above (real projects in `lib/content/projects.ts`). The design system is stable — adding content shouldn't require touching components, only the `lib/content/*` data files.

## Conventions / gotchas

- **Read the bundled Next.js docs** before framework-level changes: `node_modules/next/dist/docs/` (this is a non-standard Next 16 build per `AGENTS.md`).
- **Server Components by default**; add `"use client"` only for interactivity (current client components: `site-header`, `typing-terminal`, `reveal`, `contact`).
- The Resend import in the API route is intentionally **indirect** (`["res","end"].join("")`) so the build doesn't require the package until it's installed. Once you `npm install resend`, you can simplify it to a normal `import("resend")` if preferred.
- ESLint runs the React Compiler rules — avoid synchronous `setState` inside effect bodies (defer via `setTimeout(…, 0)` as done in `reveal.tsx` / `typing-terminal.tsx`).
- Never commit `.env.local`. `.env.example` is committed intentionally (force-added past the `.env*` gitignore rule).
