---
name: seo-audit
description: "Audit a Next.js App Router app for the SEO layer that Next.js turns into head tags and crawler files. Use before launch, or after adding routes, to confirm metadataBase and a title template in the root layout, a canonical URL on every indexable page, Open Graph and a social image, a typed sitemap.ts and robots.ts, JSON-LD for rich results, and no page missing an intentional title or description. Metadata in the App Router is typed exports, so most of this is checkable, not guesswork."
---

# SEO Audit

SEO in the App Router is not a plugin and not an afterthought. It is a set of typed exports Next.js turns into `<head>` tags and crawler files at build time. That means most of it is checkable: a page either exports the metadata or it does not. This audit finds the routes that ship bare.

## How to run it

1. **Scan the app tree.** Run the bundled script over `app/`:
   `node ${CLAUDE_SKILL_DIR}/scripts/scan-seo.mjs app`
   It checks for `metadataBase` and a `title.template` in the root layout, `sitemap.ts` and `robots.ts`, an Open Graph image, and which page/route files export metadata versus which look bare. It flags gaps for review.
2. **Work the layer** against `references/seo-checklist.md`:
   - **Defaults:** root layout sets `metadataBase` (absolute URLs) and `title.template` with a `default`.
   - **Per-page:** every indexable page has an intentional title, description, and an explicit `alternates.canonical`. Dynamic routes use `generateMetadata` (awaiting `params` in Next.js 16) with a `cache`-wrapped data call.
   - **Crawlers and cards:** `sitemap.ts` and `robots.ts` are typed and present, an OG image resolves (static `opengraph-image.png` or a generated `opengraph-image.tsx`), and JSON-LD is rendered server-side where rich results apply.
3. **Validate the output, not just the source.** A `<head>` can look right and still fail a validator over one wrong `@type` or a relative image URL that never resolved. Run the page through Google's Rich Results Test and a social-card debugger before calling it done.

## The gaps this catches

- A root layout with no `metadataBase`, so relative OG image URLs never resolve.
- A page with no `title` (it ships the layout default or "Create Next App").
- No `alternates.canonical`, so query strings and trailing slashes dilute the page.
- A dynamic route reading `params.slug` directly (it is a Promise in Next.js 16; the card shows the fallback).
- No `sitemap.ts` / `robots.ts`, quietly capping how well the site can ever rank.
- `robots.ts` trusting `disallow` as protection. It is a public file, not access control; gate private routes with real auth.

## The security note that rides along

`generateMetadata` runs on the server and is a real trust boundary. Never echo unsanitized user input into a title or description, and never `fetch` from a URL built out of raw `params` without validating the shape first. For JSON-LD, the values come from typed data you control, and `JSON.stringify` escapes them; if any field could be user-authored, escape `<` in the output so a value cannot break out of the `</script>` tag.

Read the handbook page this draws from: https://selwynuy.dev/d/seo.md

## Bundled files

- `scripts/scan-seo.mjs` (script): scans `app/` for metadataBase, a title template, canonical usage, sitemap/robots, and OG images, and flags routes that look unconfigured.
- `references/seo-checklist.md` (reference): the full typed-metadata SEO layer with the fix for each gap, sourced to the Next.js metadata docs and the handbook.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/seo-audit
