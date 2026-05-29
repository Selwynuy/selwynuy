# Selwyn Uy — Portfolio

A recruiter-focused personal portfolio for **Selwyn Uy**, Full Stack Next.js Web Developer.

Built with **Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript**.
Design direction: **Editorial × Technical** (magazine typography + a subtle terminal/security motif). Storyline-driven so each section advances a distinct narrative beat instead of repeating the pitch.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

> **Note:** This repo pins a specific Next.js 16 build with breaking changes from older versions. Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Editing content

All site content lives in typed files under `lib/content/` — edit these, then redeploy. No CMS.

| File | What it holds |
|------|---------------|
| `lib/content/profile.ts` | Name, role, hero **hook/subhook**, SEO tagline, email, social links, résumé path, and the **About story beats** (`story`). |
| `lib/content/projects.ts` | Project cards (currently **placeholders**). Set `featured: true` on your strongest one — it gets the large bento tile. |
| `lib/content/experience.ts` | Work history (`experience`), `skills` (marquee), `certifications`, and `sectionIntros` (the framing lines per section). |
| `lib/content/types.ts` | Shared TypeScript types for all of the above. |

## Architecture

- **Server Components by default.** Only interactive pieces are client components:
  `site-header` (scroll blur), `typing-terminal` (load animation), `reveal` (scroll reveal), `contact` (form).
- **Design tokens** live in `app/globals.css` (`@theme inline` + CSS variables): monochrome palette, type scale, soft-shadow depth tiers, dot-grid/glow atmosphere, reveal/marquee keyframes. Light default, dark via `prefers-color-scheme`.
- **Sections** (`components/sections/`) are composed in `app/page.tsx` in storyline order:
  Hero → About → Projects → Experience → Certifications → Contact.
- **Contact form** posts to `app/api/contact/route.ts` (server-only), which sends via Resend.

## Contact form setup

The form works end-to-end once Resend is configured. Until then it returns a friendly 503 and the build stays green.

1. Get a free API key at [resend.com](https://resend.com).
2. Copy `.env.example` → `.env.local` and fill in `RESEND_API_KEY` (and optionally `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`).
3. Install the package: `npm install resend`.

The API key is read **only on the server** and is never exposed to the client.

## Deploying (Vercel)

1. Push the branch and import the repo into Vercel.
2. Add the env vars from `.env.example` in the Vercel project settings.
3. Update the hardcoded `siteUrl` (`https://selwynuy.dev`) in `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, and the JSON-LD in `app/page.tsx` to your real domain.

See `HANDOFF.md` for current status and the prioritized next steps.
