# Verified Next.js 16 facts

The API surface below is what commonly differs from older Next.js and from
training-data assumptions. It was verified against Next.js 16.2.6's own
bundled docs. Confirm against `node_modules/next/dist/docs/01-app/` in the
target repo before trusting any line here, since Next.js ships breaking
changes across minor versions, not just majors.

## Params and searchParams are Promises

In Next.js 15 and up, `params` and `searchParams` are Promises everywhere:
pages, layouts, `route.ts` handlers, `generateMetadata`, and
`generateSitemaps`. They were synchronous in Next.js 14 and earlier.

- Server Components: `async function Page({ params }) { const { slug } = await params }`
- Client Components: `const { slug } = use(params)`
- Do not write `params.slug` directly. It is a Promise, not the object.

## Route Handler GET is not cached by default

As of the v15 RC change, a `GET` handler in `route.ts` is dynamic by default.
If you need a static, cacheable endpoint, opt in explicitly:

```ts
export const dynamic = 'force-static'
```

`sitemap.ts` and `robots.ts` remain cached by default, unlike route handlers.

## middleware.ts is deprecated for proxy.ts

Newer Next.js prefers the `proxy.ts` file convention over `middleware.ts`.

- Write new interception logic in `proxy.ts`.
- Leave an existing `middleware.ts` in place unless you are asked to migrate it.
  Do not rip it out unprompted.

## One metadata source per segment

A single route segment cannot export both a static `metadata` object and a
`generateMetadata` function. Pick one per segment.

## Config deprecations

- `images.domains` is deprecated. Use `images.remotePatterns`.
- `next/legacy/image` is deprecated.
- The single-argument form of `revalidateTag` is deprecated.

## Bundler

Turbopack is the default dev bundler from Next.js 16. Use `--webpack` only to
work around a Turbopack bug or a webpack-only plugin. Confirm the production
build bundler choice against the docs for the installed version.

## When this file is wrong

If the repo's installed version is more than a couple of minor versions off
from 16.2, re-check the bundled docs and update this file rather than working
around a stale fact each time.
