# The pre-commit review checklist

The standards a diff is held to before it goes in, with what a violation
looks like so it is recognizable in a real diff. Read the diff itself
(`git diff`), rule by rule. A rule that does not apply to this change is
simply skipped; do not invent problems to report.

## Scope

**Smallest edit that works.** The change touches only what it needs to.

- Violation: a two-line fix that also reformats the whole file, reorders
  imports, or renames unrelated variables. The real change is now buried in
  noise and harder to review and revert.

**No unjustified dependency.** New packages earn their place.

- Violation: adding a date library for one format call, or a utility package
  for something the repo already has a helper for. Reuse what exists first.

**No parallel pattern.** One way to do a thing per codebase.

- Violation: introducing a second data-fetching approach, a second state
  pattern, or a new folder convention when the repo already has one. Match
  the existing pattern unless there is a clear, stated reason not to.

## Correctness and hygiene

**No dead code.** Nothing left behind.

- Violation: commented-out blocks "in case", an unused helper, a function
  that nothing calls, a leftover `console.log` or `debugger`.

**No unused imports or variables.**

- Violation: an import kept after the code that used it was removed, or a
  destructured value never read.

**Edge cases handled.** The change does not create a new unhandled path.

- Violation: a new branch that assumes data is always present, a fetch with
  no error path, an empty state that renders nothing or crashes.

## Types

**No `any` on non-trivial data.**

- Violation: `any` or an implicit `any` on a request body, an API response,
  or a domain object. Give it a real type so a wrong shape fails at compile
  time, not in production.

**Honest signatures.**

- Violation: a function typed to return a broad type (`object`, `unknown`
  passed straight through) when it returns something specific, so callers
  lose the safety.

## Architecture

**Logic on the right side of the boundary.**

- Violation: business logic, a database call, or a secret read moved into a
  client component (or a component marked `"use client"`) where it should
  have stayed on the server.

**Separated concerns.**

- Violation: data access, validation, and UI tangled in one component when
  the repo separates them. Push logic into the reusable module, keep the
  component thin.

**Secure-by-default kept intact.**

- Violation: an auth check removed or weakened "to make it work", an env
  secret exposed to the client, a validation step dropped. If a change
  loosens a security boundary, that must be called out explicitly, never
  slipped in.

## The verdict

End with two short lists:

1. **Must fix before commit** (real violations above).
2. **Optional** (smaller suggestions that are not blockers).

Do not stage or commit the change yourself. The review informs the decision;
the human makes it.
