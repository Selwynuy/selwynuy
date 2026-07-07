# Next.js conventions, with the why

The defaults this skill scaffolds to. Each is a decision with a reason, not a
preference. The full, always-current set is at
https://selwynuy.dev/d/decisions.md.

## Structure

- **App Router.** Server Components by default; fetch on the server, ship the
  browser only what it needs. It is the single biggest lever for shipping less
  JavaScript.
- **`"use client"` only when needed.** Add it for interactivity or browser APIs,
  never as a default. Business logic stays out of client components.
- **`src/` layout.** Keeps app code separate from config at the repo root.
- **TypeScript, scaffolded with `--typescript`.** Types pay for themselves the
  first time a refactor would silently break a call site. Avoid `any` for
  non-trivial data.

## Data, auth, hosting

These are decided per project in the PRD, but the defaults:

- **Data:** the store and schema shape are a PRD decision; pick for the access
  pattern, not the hype.
- **Auth:** prefer a managed provider over rolling your own unless there is a
  concrete reason. Validate and authorize every mutation and sensitive read on
  the server.
- **Hosting:** the platform is a PRD decision; a runtime dependency used in a
  route must be a normal import, not a lazy dynamic one, or it may not bundle.

## Security by default

The point of the whole approach: the things most teams patch later are wired
from the first commit.

- Never expose secrets to the client.
- Secrets live in `.env.local` (gitignored) and the host's env, never in
  committed files.
- Set a Content Security Policy, rate-limit the public mutations, and handle
  error states as a first-class UI, not an afterthought.

Read: https://selwynuy.dev/d/security-by-design.md
