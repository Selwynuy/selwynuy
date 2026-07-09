# The Next.js SEO layer

The App Router SEO stack is typed exports Next.js renders into `<head>` tags
and crawler files at build time. This checklist is what to confirm, with the
fix for each gap. Sourced to the Next.js metadata docs
(`node_modules/next/dist/docs/01-app/`) and the handbook's SEO page.

How metadata resolves: Next.js evaluates from the root layout down to the
page and shallowly merges each segment. A child `title` replaces the parent;
a child `openGraph` replaces the ENTIRE parent `openGraph` (no deep merge).
Set site-wide defaults in `app/layout.tsx`, override per route.

## Defaults (root layout)

### metadataBase
- **Gap:** no `metadataBase`. Relative OG and canonical URLs do not resolve
  (a relative `openGraph.images` is a build error without it).
- **Fix:** `metadataBase: new URL("https://example.com")` in the root layout.

### Title template
- **Gap:** no `title.template` / `title.default`. New pages ship a bare or
  default title.
- **Fix:**
  ```ts
  title: { default: "Example", template: "%s | Example" }
  ```
  A page that sets `title: "About"` then renders `About | Example`. The
  template applies to children only; the layout's own title is `default`.

### Default Open Graph / Twitter
- **Gap:** no default `openGraph` / `twitter`. Every page has to repeat them.
- **Fix:** set `openGraph.siteName`/`type`/`locale` and
  `twitter.card: "summary_large_image"` once in the root layout.

## Per-page

### Intentional title and description
- **Gap:** a page exports no `metadata` / `generateMetadata`. It inherits the
  layout default; the tab may read "Create Next App".
- **Fix:** export a `metadata` object (static pages) with a real title and
  description.

### Canonical URL
- **Gap:** no `alternates.canonical`. Query strings, trailing slashes, and
  tracking params dilute the page as duplicate content.
- **Fix:** `alternates: { canonical: "/about" }` on every indexable page. It
  resolves against `metadataBase`.

### Dynamic routes use generateMetadata
- **Gap:** a dynamic route exports a static `metadata`, or reads `params.slug`
  directly. In Next.js 16 `params` is a Promise; reading it directly is
  `undefined` and the card shows the fallback. You also cannot export both
  `metadata` and `generateMetadata` from one segment.
- **Fix:** export `async function generateMetadata({ params })`, `await params`,
  and wrap the data call in React `cache` so `generateMetadata` and the page
  share one fetch per request.

## Crawlers and cards

### sitemap.ts and robots.ts
- **Gap:** either file missing. Crawlers have no map or rulebook, which
  quietly caps ranking.
- **Fix:** `app/sitemap.ts` returning `MetadataRoute.Sitemap`, `app/robots.ts`
  returning `MetadataRoute.Robots` with `sitemap: ".../sitemap.xml"`. Both are
  cached and prerendered unless they read a request-time API.
- **Do NOT** treat `robots.ts` `disallow` as protection. It is a public file
  and a polite request; it tells everyone where your private paths are. Gate
  sensitive routes with real authorization.
- **Longest-match trap:** Google applies the longest matching rule.
  `disallow: ["/library/"]` silently drops an allowed `/library` listing.
  Block specific private subpaths, not a broad prefix.

### Open Graph image
- **Gap:** no OG image. Shared links show a blank card (the second unfinished
  tell after the favicon).
- **Fix:** a static `app/opengraph-image.png` for the whole site, or a
  per-route generated `opengraph-image.tsx` using `ImageResponse` from
  `next/og`. The file convention wires `og:image` and `twitter:image`
  automatically; do not also list it in `openGraph.images`. `ImageResponse`
  supports flexbox only, no `display: grid`.

### JSON-LD structured data
- **Gap:** no structured data where rich results apply (Article, Product,
  Person, Organization).
- **Fix:** render `<script type="application/ld+json">` server-side with the
  payload `JSON.stringify`-ed. Build the object from typed data, never raw
  user HTML.

## Search Console (one-time, then revisit)

- Verify the property (DNS TXT for the whole domain, or the
  `verification: { google: "..." }` metadata tag for one origin).
- Submit `/sitemap.xml` in Search Console; do not wait for discovery.
- After launch, check Coverage for crawl errors and use URL Inspection to
  request indexing on important new pages. Treat "Discovered but not indexed"
  as a signal the page is too thin.

## The security note

`generateMetadata` runs on the server and is a real trust boundary. Never echo
unsanitized user input into a title/description, and never `fetch` from a URL
built out of raw `params` without validating the shape (that is request
forgery, not an SEO bug). For JSON-LD, if any field could be user-authored,
escape `<` in the stringified output so a value cannot break out of the
`</script>` tag.

## Validate before you call it done

The `<head>` can look perfect and still fail a validator over one wrong
`@type` or a relative image URL that never resolved. Run the page through
Google's Rich Results Test and a social-card debugger.

## Sources

- Next.js metadata docs: `metadata-and-og-images`, `generate-metadata`,
  `sitemap`, `robots` (under `node_modules/next/dist/docs/01-app/`).
- Handbook: `seo.mdx` (a full worked build of this layer).
