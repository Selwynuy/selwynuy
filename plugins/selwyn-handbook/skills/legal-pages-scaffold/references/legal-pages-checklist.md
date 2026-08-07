# The legal-page surface

Five pages cover almost every real app: Privacy, Terms, Disclaimer, Refunds,
and Data Deletion. Not every app needs all five; which ones apply is a
trigger, not a checklist to blindly complete. This is what to build, when,
and the pattern that keeps five pages from drifting apart. Sourced to the
handbook's `legal-pages` and `payments-billing` pages.

## Which pages apply

### Privacy
- **Trigger:** always, the moment the app collects any user data, runs
  analytics, or offers accounts.
- **Must say:** who you are, what you collect and why, who you share it with
  (sub-processors), how long you keep it, and how a user exercises their
  rights. If you offer Google sign-in, name the exact scopes read (openid,
  email, profile) and confirm Limited Use, since Google's verification
  review checks for this.

### Terms
- **Trigger:** users can register, pay, subscribe, or rely on the content.
- **Must say:** the agreement to use the app, payment and renewal terms,
  acceptable use, liability limits, governing law.

### Disclaimer
- **Trigger:** the content could be read as professional advice (financial,
  medical, legal, tax), or the product's name or content sits next to an
  official government agency, professional body, or well-known brand.
- **Must say:** what the app is not (not advice, not a substitute for a
  professional), and, when relevant, a plain no-affiliation or
  no-endorsement statement. State it here AND in the global footer: organic
  search traffic lands on content pages, not on `/legal`, so the moment of
  confusion happens where the disclaimer is not.

### Refunds
- **Trigger:** the app takes a one-time payment or runs a subscription. This
  is the page most legal-page checklists forget, because they are written
  against OAuth and AdSense gates, not payment gates. Payment processors
  (Stripe, PayMongo, Xendit, GCash, app stores) and card networks expect a
  stated policy, and a clear one reduces chargeback disputes.
- **Must say:** what is refundable and on what timeline, what happens to
  data and access when a subscription lapses or is cancelled (a lapsed
  account should usually keep read access rather than go dark, especially
  when the app is the only place a user's own records live), and how to
  request a refund.

### Data Deletion
- **Trigger:** required the moment you offer third-party sign-in (Google and
  the app stores check for a reachable deletion route). Still worth
  shipping in a local-first, no-account app: reframe it as "how to erase
  your local data" (which file to remove, what to back up first) instead of
  "delete my account". Same page, a different flavor of the same honest
  answer.
- **Must say:** what gets deleted or erased, how to request or perform it,
  and the timeline.

## The shared-layout pattern

Five pages that each hand-roll their own header, "last updated" line, and
back link drift the moment one gets edited and the other four do not. Build
one `LegalLayout` component (title, an update date, a back link, print-safe
styling if the app already prints other pages) and have every legal page
import it. Whether a page uses the shared layout is a checkable fact, not a
judgment call.

## The site-config pattern

Legal pages reference the brand name, legal entity, canonical URL, and
contact email more than any other page in the app, so they are the place a
hardcoded string costs the most. Pull all of it from one config module
(site-config, or whatever the project's own convention is named), so a
rename or a rebrand is one edit instead of a find-and-replace across five
pages.

## Wire the footer, not just the pages

Cross-linking the five legal pages to each other is not enough. Someone who
lands on a guide, a blog post, or the homepage from search may never click
through to `/legal`. Link all five from the global footer, and if a
no-affiliation or no-endorsement line applies, put a short version of it in
the footer text itself, not only inside the Disclaimer page.

## Build them as real, indexable routes

Give each page a real `metadata` export (a title, at minimum) so it does not
silently inherit the layout default. These pages are content-dense and
crawlable, which helps the rest of the site's credibility with Google, so
index them rather than hiding them behind `noindex`.

## The trust note

A privacy policy or disclaimer is a promise, and it goes stale the moment
the app changes: a new analytics tool, a new payment processor, a new OAuth
scope. Treat a change to data flow as a change that ships with a legal-page
edit, the same way a schema change ships with a migration. A stated "we do
not share your data with third parties" claim that is no longer true is
worse than no page at all, because it is a claim the user has no way to
catch. For anything with real liability (health, finance, regulated data),
have a professional review the actual wording; this pattern only covers the
engineering shape.

## Sources

- Handbook: `legal-pages.mdx` (the full trigger-by-trigger rule set this
  checklist implements) and `payments-billing.mdx` (refund and chargeback
  context).
