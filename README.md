# Selwyn Uy

A two-part branded site: a personal developer portfolio, and a living, fact-checked **Next.js Handbook** whose every section can be dropped straight into an AI.

Built with **Next.js 16, React 19, Tailwind CSS v4, TypeScript**.
Brand: red on near-black, dark-first, condensed all-caps display headlines, a terminal motif. Red is an accent, never a flood.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run verify   # typecheck + lint + content guard + tests + build
npm run test     # vitest
npm run build    # production build
```

> This repo pins a specific Next.js 16 build with breaking changes from older versions. Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## The two surfaces

### Portfolio (`/`)
Hero, About, Projects, a Handbook teaser, Experience, Certifications, Contact. Content is decoupled into typed files under `lib/content/` (`profile.ts`, `projects.ts`, `experience.ts`). Edit those, no CMS.

### Handbook (`/docs`)
Multi-page MDX documentation in `content/docs/*.mdx`. Topics span Foundations, Security, Integrations, Growth, and Ship. Three-zone layout: left sidebar, readable prose column, right scroll-spy TOC. Cmd+K search.

## The one-drop feature

Every handbook section is consumable by an AI:

| Route | What it serves |
|-------|----------------|
| `/d/<slug>.md` | The section as clean markdown (`text/markdown`) with a context header. |
| `/llms.txt` | An `llmstxt.org`-format index of all sections. |
| `/llms-full.txt` | The whole handbook concatenated. |

Each doc page has a **Copy for AI** button that copies a ready prompt pointing at that section's `.md` URL, plus Open-in-ChatGPT / Open-in-Claude links. A real MCP server wrapping the same content is a planned follow-up.

## Content truth

A handbook page is marked `verified: true` only when its claims are fact-checked against the bundled Next.js 16 docs **and** a source is cited. The registry **fails the build** if a verified page has no sources. Pages still under review carry a visible draft badge. See `lib/docs/registry.ts`.

## Conventions

- **Server Components by default.** `"use client"` only for interactivity (header, terminal, reveal, contact, theme toggle, search, code-copy, one-drop button).
- **Design tokens** live in `app/globals.css` (`@theme inline` + CSS variables). Dark default, light via `prefers-color-scheme` or the toggle.
- **No em-dashes** in source. `scripts/check-content.mjs` enforces it (runs in `prebuild`, `verify`, CI, and a pre-commit hook via `git config core.hooksPath .githooks`).
- **MDX pipeline** (`next.config.mjs`): `remark-frontmatter`, `rehype-slug`, `rehype-pretty-code` (Shiki). Plugins are string names because Turbopack cannot pass functions to Rust.

## Editing content

| File | Holds |
|------|-------|
| `lib/content/profile.ts` | Name, role, hero hook, accent word, email, socials, resume path, About story. |
| `lib/content/projects.ts` | Project cards. Set `featured: true` and optional `image`. |
| `lib/content/experience.ts` | Work history, skills, certifications, section intros. |
| `content/docs/*.mdx` | Handbook pages (frontmatter: `title`, `summary`, `section`, `order`, `verified`, `sources`). |

## Environment

Copy `.env.example` to `.env.local`. Keys: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID` (analytics no-ops if unset), `RESEND_API_KEY` (contact form). All secrets are read server-side only.

## Deploying (Vercel)

1. Import the repo into Vercel.
2. Add the env vars from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the real domain (replaces the `selwynuy.dev` placeholder used by canonical URLs, sitemap, and the one-drop links).

See `plans/portfolio-nextjs-handbook.md` for the full construction plan and `HANDOFF.md` for current status.
