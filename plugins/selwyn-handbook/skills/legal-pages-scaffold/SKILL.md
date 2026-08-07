---
name: legal-pages-scaffold
description: "Scaffold or audit the legal-page surface a real app needs: Privacy, Terms, Disclaimer, Refunds, and Data Deletion, as proper indexable Next.js App Router routes wired to one site-config source of truth. Use when starting a new project with no legal pages yet, when adding paid subscriptions (Refunds is the page most checklists forget), or when the product sits next to a regulated or official-sounding domain (tax, medical, legal, government forms) and needs a no-affiliation disclaimer in both the page and the global footer. Complements the handbook's legal-pages gating rules with the actual build pattern: one shared layout component, one config module driving every brand string, and a scan that treats page and footer wiring as checkable facts."
---

# Legal Pages Scaffold

Which of the five legal pages an app needs is a set of triggers, not a
template to paste blind. Whether they are wired correctly, though, is
checkable: does the route exist, do all five share one layout instead of
five hand-copied headers, does the footer link to them, does a payment
integration exist without a matching Refunds page. This skill finds those
gaps and builds what is missing.

## How to run it

1. **Scan the project.** Run the bundled script over the project root:
   `node ${CLAUDE_SKILL_DIR}/scripts/scan-legal.mjs .`
   It checks for the five legal routes under `legal/`, a shared layout
   component, footer links, payment-provider evidence without a matching
   Refunds page, an update date on each page, and whether each page exports
   metadata. It flags gaps for review; it does not judge the wording.
2. **Scaffold what is missing** against `references/legal-pages-checklist.md`:
   which of Privacy, Terms, Disclaimer, Refunds, and Data Deletion actually
   applies, built from one shared `LegalLayout` component and one
   site-config module so the brand name, legal entity, canonical URL, and
   contact email are never hardcoded into a page body.
3. **Wire it in.** Link all five pages from the global footer, not just from
   each other, and add a `/legal` hub page. If the product sits next to a
   regulated or official-sounding name (a tax authority, a medical board, a
   well-known brand), state the no-affiliation line in the footer itself,
   since organic search traffic lands on content pages, not on `/legal`.

## The gaps this catches

- A Refunds page missing while `package.json` or the codebase shows real
  payment or billing evidence (Stripe, PayMongo, Xendit, a `billing/` or
  `entitlement` module). Payment processors and app stores expect a stated
  refund policy, and it is the page most OAuth-and-AdSense-focused
  checklists forget to mention.
- Five legal pages with no shared layout component, each hand-rolling its
  own header and "last updated" line, so an edit to one silently leaves the
  other four stale.
- A Disclaimer page that states a no-affiliation line the footer never
  repeats, so the only place a confused visitor could read it is a page they
  never land on.
- A legal page with no `metadata` export, so it ships the layout's default
  title instead of an intentional, indexable one.
- No `/legal` hub page linking all five, so a visitor who finds one has to
  guess at the URLs for the rest.
- No visible "last updated" date on a page, so there is no way to show a
  policy was current when a given user read it.

## The trust note that rides along

A privacy policy or disclaimer is a promise, and it goes stale the moment
the product changes: a new analytics tool, a new payment processor, a new
OAuth scope. Treat a data-flow change as a change that ships with a
legal-page edit, the same discipline a schema change gets with a migration.
None of this is legal advice, and a scan finding the right pages exist says
nothing about whether the wording is correct; for anything with real
liability (health, finance, regulated data), have a professional review the
actual text.

Read the handbook page this draws from: https://selwynuy.dev/d/legal-pages.md

## Bundled files

- `scripts/scan-legal.mjs` (script): scans the project for the five legal
  routes, a shared layout component, footer wiring, payment evidence without
  a Refunds page, and per-page metadata and update dates, flagging gaps for
  review.
- `references/legal-pages-checklist.md` (reference): which of the five
  pages applies and when, the shared-layout and site-config pattern, the
  no-affiliation placement, and the trust note on keeping claims true as the
  product changes.

---

Part of the Selwyn Handbook plugin. Full page: https://selwynuy.dev/skills/legal-pages-scaffold
