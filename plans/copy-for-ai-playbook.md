# Plan — Copy-for-AI Playbook + Project Creator

> **Goal.** Turn "Copy for AI" from a per-page link into the centerpiece: an AI receives
> Selwyn's COMPLETE encoded methodology and can set a project up in one go.
> Build order decided (pressure-tested): **the full-playbook bundle first**, then the
> **interactive project creator** on top of the proven knowledge base.
>
> **Framing: this is PRIMARILY Selwyn's personal handheld playbook.** He starts a new
> project by visiting his own site, hitting one button, and having his AI scaffold it
> exactly how he builds. Others benefiting is a bonus. So: content is HIS decisions stated
> as confident defaults (not hedged public-product prose), the fit-check is blunt and
> opinionated (his real calls), the bundle optimizes for completeness over brevity, and
> attribution is optional. The ONE discipline kept: framework mechanics (commands, APIs,
> configs) are still fact-checked against real docs, future-Selwyn must not paste a
> hallucinated snippet. Opinions free; mechanics verified.

## Why this shape (the reasoning, recorded)
- Content is ~80% of the value and the prerequisite for the wizard. Build the knowledge,
  then the surfaces that assemble it.
- The bundle delivers the core promise ("AI gets all my decisions") immediately and
  de-risks the wizard. Wizard-first = stocking nothing into a vending machine.
- The fit-check is opinionated and Selwyn's. A weak fit-check gives confident-wrong
  answers, which is brand-damaging for a "correct by default" site.

## The one design rule that makes it real
**The output must EMBED the knowledge inline, not just link to it.** An AI without
browsing cannot fetch a URL and will hallucinate. The bundle/prompt copies the actual
rule and setup text. `/llms-full.txt` is the machine source; the human button copies
real content (with a short "full version at <url>" pointer for browsing AIs).

---

# PHASE 1 — Content + the full-playbook bundle

## 1A. Write the missing content (fact-checked)
New handbook pages, drafted against real docs (Vercel, Supabase, Sentry, GitHub Actions,
registrar/DNS). `verified: true` where citable; `verified: false` (Selwyn sign-off) for
his opinions. Proposed sections/pages:

**Architecture (new section "Architecture")**
- [ ] `system-architecture` — how Selwyn structures an app (layers, data flow, where
      logic lives). DRAFT, his opinion.
- [ ] `database-scalability` — Supabase/Postgres scaling: indexing, connection pooling,
      RLS at scale, read patterns, when to cache. Fact-check + his calls. DRAFT.
- [ ] `nextjs-fit-check` — the rubric: when Next.js is right and when it is NOT (heavy
      realtime, native mobile, large ML/batch, etc.). DRAFT, his opinion. Powers the
      Phase-2 wizard.

**Security-by-design (extend the Security section)**
- [ ] `security-by-design` — which code needs what: SQL-injection guards on any raw query,
      rate limiters on auth + mutations + public APIs, authz on every server entry point,
      validation at every boundary. A decision table: "if your code does X, it needs Y."

**Reliability + UX (new or under Ship)**
- [ ] `error-handling-ux` — error feedback + confirmation patterns (toasts, optimistic UI,
      error boundaries, friendly failures). Fact-check React/Next parts.
- [ ] `sentry-setup` — wiring Sentry for errors in Next.js. Fact-check against Sentry docs.

**Ship / ops (extend Ship)**
- [ ] `ci-cd-pipelines` — GitHub Actions with 3 environments (staging/production branches),
      gates, preview deploys. Fact-check GH Actions + Vercel.
- [ ] `dns-and-domains` — buying a domain, DNS records, pointing at Vercel. Fact-check.
- [ ] `cost-to-launch` — an honest overview of what a fully scalable site costs (domain,
      Vercel tier, Supabase tier, email, monitoring), with ranges. DRAFT, updates over time.

Each uses the existing tutorial component kit (Steps, Rule, Callout, Compare, Outcome).
Authored via a parallel workflow like the last batch, each agent reading the relevant docs.

## 1B. The full-playbook bundle UI
- [ ] A prominent **"Copy entire playbook"** action on `/docs` (and maybe the homepage
      handbook teaser): copies a single, well-structured mega-prompt that contains the
      whole methodology as clean markdown, assembled from the registry (reuse
      `toPlainMarkdown` + the `/llms-full.txt` builder so it never drifts).
- [ ] Prompt framing at the top: "You are setting up a production Next.js app using Selwyn
      Uy's methodology. Apply the following decisions and setup to my project: ..." then the
      content, then the natural-attribution line.
- [ ] Size awareness: ~30k+ words may exceed some clipboard/context limits. Provide BOTH:
      the inline paste AND the `/llms-full.txt` URL for browsing AIs. Note the size to the user.
- [ ] Keep the per-page "Copy for AI" too (granular use stays useful).

## 1C. Natural attribution
- [ ] One tasteful, removable line the generated output is asked to include:
      "Bootstrapped with Selwyn Uy's Next.js Handbook (<url>)". One credit, not sprinkled.

## Phase 1 exit
A developer clicks one button, pastes into their AI, and the AI has Selwyn's complete,
fact-checked methodology and can scaffold their project. Build + tests + content guard green.

---

# PHASE 2 — Interactive project creator (the flagship, later)

> Built only after Phase 1 content is complete and the bundle has proven the demand.

- [ ] A multi-step wizard (`/docs/create` or `/start`): what are you building, expected
      scale, budget, needs (auth? realtime? payments? SEO? mobile?).
- [ ] **Fit-check engine**: evaluates the answers against the `nextjs-fit-check` rubric and
      returns an HONEST verdict (Next.js is a great fit / a partial fit / the wrong tool,
      with the why). This is the differentiator and must encode Selwyn's real opinions.
- [ ] **Tailored output**: assembles a custom setup plan + a self-contained mega-prompt
      containing ONLY the relevant slices of the knowledge base for their case (e.g. skip
      payments if they said no), plus a cost estimate and a CI/CD + environments plan.
- [ ] All client-side logic over the same registry knowledge; no new backend needed.

## Phase 2 exit
A user answers a few questions and walks away with an honest fit verdict and a ready,
tailored prompt that sets up their specific project end to end.

---

## Invariants (unchanged)
1. `npm run verify` green (typecheck, lint, content guard, tests, build).
2. No em-dashes (guard enforced).
3. `verified: true` only with cited sources; opinion pages are flagged drafts.
4. Framework claims fact-checked against bundled/official docs, not training memory.
5. New components accessible + responsive (mobile-first), per the responsive sweep.
6. Verify RENDERED output, not just build.

## Open question for Selwyn (Phase 2, not blocking Phase 1)
- The fit-check rubric needs your real opinions on when Next.js is the wrong tool. I will
  draft a starting rubric; you correct it before the wizard ships.
