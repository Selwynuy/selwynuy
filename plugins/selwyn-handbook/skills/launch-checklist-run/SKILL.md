---
name: launch-checklist-run
description: "Run a project through the launch checklist before shipping: the line between code that compiles and a site that reads as finished. Use before a launch or a first public deploy to walk the required, recommended, and optional items by category (foundation, brand, design, security, performance and SEO, pre-launch), filtered to the project type, and report what is done, what is missing, and what blocks the ship. A green build is not a finished product."
---

# Launch Checklist Run

A green build is not a finished product. You can ship code that compiles, passes every test, and deploys clean, and still hand someone a site that reads as half-done: the default favicon, the nav link that 404s, the blank social card, the layout that breaks at a phone width. This run is the last mile, written down so you stop rediscovering it the hard way on every project.

## How to run it

1. **Scope to the project type.** Pick `marketing`, `app`, or `ecommerce`. The checklist in `references/launch-checklist.md` marks which project types each item applies to; skip the ones that do not include your type or `all`. This is the difference between a marketing site and a full app getting the right list instead of the same one.
2. **Walk it category by category**, checking each item against the **real rendered site**, not the build:
   - **Foundation:** typecheck/lint/build clean, secrets server-only, rendered output verified.
   - **Brand and identity:** real favicon, social card, intentional titles, consistent mark.
   - **Design and polish:** no dead links, consistent spacing, empty/loading/error states, responsive at a real phone width, dark and light both intentional, accessibility basics.
   - **Security:** headers set, inputs validated server-side, forms rate limited, auth at the data layer, legal pages if you collect data or charge.
   - **Performance and SEO:** images optimized, Core Web Vitals green, sitemap/robots/canonical, structured data, analytics wired.
   - **Pre-launch:** custom domain on HTTPS, error tracking live, CI gating deploys, a final walkthrough on a fresh device.
3. **Report what blocks the ship.** List what passed, what is missing, and specifically which **required** items are still open. Do not call the site shippable while any required item for its project type is unchecked.

## Required is the floor, not the goal

Each item is tagged **required** (the floor to ship at all), **recommended** (what makes it good), or **optional** (the finishing touch). Required items block launch. Recommended and optional items make the site good and polished but do not stop the ship. Work required first.

## The branding tells, ranked

If you only fix a handful of things before showing someone, fix these first, because they are the loudest signals a site is unfinished: the favicon (the number-one tell), the social share card, the page title, dead links and placeholders, and inconsistent layout. Each is minutes of work and a disproportionate amount of credibility.

## Verify rendered, not built

The single most expensive habit is trusting the build. Open the live page, click every button, check both themes, resize to a phone width, share the URL to yourself and look at the preview card, and load it on a device you did not build on. Each of those catches a class of bug the build never will.

Read the handbook page this draws from: https://selwynuy.dev/d/launch-checklist.md

## Bundled files

- `references/launch-checklist.md` (reference): the full checklist by category, each item tagged required, recommended, or optional, with the project types it applies to and the handbook page that covers it. Generated from the handbook's own checklist data, so it never diverges.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/launch-checklist-run
