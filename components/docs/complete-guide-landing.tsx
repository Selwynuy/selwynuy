import Link from "next/link";
import { GUIDES_EDITION, partGuides, type Guide } from "@/lib/docs/guides";
import { Reveal } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { BookMockup } from "@/components/docs/book-mockup";
import {
  BreakdownExcerpt,
  type BreakdownRow,
} from "@/components/docs/breakdown-excerpt";
import { StickyBuyBar } from "@/components/docs/sticky-buy-bar";
import { ForceDarkTheme } from "@/components/docs/force-dark";
import {
  GUIDE_MARK_TILE,
  BuyButton,
  BuyCard,
} from "@/components/docs/guide-landing-shared";

const PART_NUMERALS = ["I", "II", "III", "IV", "V"];

// A real book cover carries a short line, not a paragraph. Names the five
// real parts (Stack and Client Kit shortened to fit one line).
const COVER_SUB = "SEO · AEO · GEO · Tools · Clients";

// Real excerpts, verbatim from content/guides/complete-parts/11-part.html
// (Part I, SEO) and 51-part.html (Part V, The Client Kit). Not invented copy.
const EEAT_ROWS: BreakdownRow[] = [
  {
    mark: "E",
    head: "Experience",
    desc: "First-hand proof you actually used or did the thing. Added in 2022; it matters most for reviews and how-to content.",
  },
  {
    mark: "E",
    head: "Expertise",
    desc: "Depth of knowledge on the topic, shown by who wrote it. A named author tied to a real bio page is the signal.",
  },
  {
    mark: "A",
    head: "Authoritativeness",
    desc: "Whether others in the field treat you as a go-to source. Off-site corroboration outweighs anything you claim yourself.",
  },
  {
    mark: "T",
    head: "Trustworthiness",
    desc: "The umbrella: accurate, transparent, safe. Visible dates, an editorial policy, and honest sourcing build it.",
  },
];

const ACCESS_ROWS: BreakdownRow[] = [
  {
    mark: "1",
    head: "Two-factor actually works",
    desc: "If you log in as the client, their 2FA code goes to their phone, so either they disable 2FA (dangerous) or you text them for a code every session (unworkable). Your own login keeps everyone's 2FA intact.",
  },
  {
    mark: "2",
    head: "The blast radius stays small",
    desc: "A shared password is one leak away from total compromise. Separate logins isolate the damage.",
  },
  {
    mark: "3",
    head: "There is an audit trail",
    desc: 'Platform logs show who did what. Under a shared login every action reads as "the owner," so nobody can tell your work from theirs.',
  },
];

function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, ""));
}

/** Mono uppercase kicker + huge display title, the section voice of this page. */
function DarkSectionHead({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative mb-12">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-2 -z-10 select-none font-semibold leading-none text-foreground/[0.04] [font-size:clamp(4rem,14vw,11rem)]"
      >
        {index}
      </span>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-hairline" />
        {label}
      </p>
      <h2 className="display mt-4 text-4xl leading-[0.95] text-foreground sm:text-6xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {intro}
        </p>
      )}
    </header>
  );
}

/** A single-column benefit list, bigger than the shared CheckList. */
function BigCheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-3">
      {items.map((it) => (
        <li
          key={it}
          className="flex gap-3 rounded-xl bg-surface p-4 leading-relaxed ring-1 ring-hairline"
        >
          <span aria-hidden className="mt-0.5 shrink-0 font-mono text-accent">
            ✓
          </span>
          <span className="text-muted">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Bespoke, always-dark, parallax landing page for the-complete-guide ("The
 * Ultimate Guide"), the flagship product on the /guides shelf. The `.theme-dark`
 * wrapper forces the dark token set on the whole subtree so the page reads
 * like a product photo in either site theme; every theme-aware component
 * inside (BuyCard, excerpts, sticky bar) just inherits it. The other five
 * guides keep the plain shared template in app/guides/[slug]/page.tsx.
 *
 * Motion: scroll-linked Parallax layers (ghost type, glow blobs, the book),
 * a marquee ticker, a sticky card-deck for the five parts, and staggered
 * Reveals. The deck section must NOT sit inside a Reveal: Reveal leaves a
 * `translate` on its element, which turns it into the containing block for
 * position:sticky descendants and kills the stacking.
 */
export function CompleteGuideLanding({ guide }: { guide: Guide }) {
  const { landing } = guide;
  const parts = partGuides();
  const bundlePrice = parsePrice(landing.price);
  const separateTotal = parts.reduce(
    (sum, g) => sum + parsePrice(g.landing.price),
    0,
  );
  const savings = separateTotal - bundlePrice;

  const ticker = [
    `${landing.pages} pages`,
    `${parts.length} parts`,
    `${landing.price} complete`,
    `Edition ${GUIDES_EDITION}`,
    "Cited throughout",
    "Heavily illustrated",
    ...parts.map((p) => p.title),
  ];

  const bookProps = {
    kicker: "The Foundations · Complete Edition",
    title: "The Ultimate Guide",
    accentWord: "Ultimate",
    sub: COVER_SUB,
    footer: {
      left: (
        <>
          <strong>Selwyn Uy</strong> · selwynuy.dev
        </>
      ),
      right: `Ed. ${GUIDES_EDITION}`,
    },
  };

  return (
    <div className="theme-dark bg-background text-foreground">
      <ForceDarkTheme />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30 bg-dot-grid [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_25%,transparent_100%)]"
        />
        {/* Ghost word, deepest parallax layer. */}
        <Parallax
          speed={0.3}
          className="pointer-events-none absolute inset-x-0 top-24 -z-20 select-none"
        >
          <p
            aria-hidden
            className="display whitespace-nowrap text-center leading-none text-foreground/[0.03] [font-size:clamp(6rem,21vw,22rem)]"
          >
            Ultimate
          </p>
        </Parallax>
        {/* Drifting red glows at two depths. */}
        <Parallax
          speed={0.2}
          className="pointer-events-none absolute -top-40 -right-40 -z-20 h-[36rem] w-[36rem]"
        >
          <div
            aria-hidden
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--color-red-600) 16%, transparent), transparent 70%)",
            }}
          />
        </Parallax>
        <Parallax
          speed={0.1}
          className="pointer-events-none absolute -bottom-64 -left-56 -z-20 h-[42rem] w-[42rem]"
        >
          <div
            aria-hidden
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--color-red-600) 10%, transparent), transparent 70%)",
            }}
          />
        </Parallax>

        <div className="mx-auto grid max-w-[1680px] gap-14 px-6 pt-20 pb-24 sm:px-10 sm:pt-24 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:pt-28 lg:pb-32 xl:px-16">
          <div className="min-w-0">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
            >
              <span aria-hidden>←</span> All guides
            </Link>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              The Foundations · Complete Edition
            </p>
            <h1 className="display mt-4 text-5xl leading-[0.92] text-foreground sm:text-7xl xl:text-8xl">
              {guide.title}
            </h1>
            <p className="measure mt-6 text-xl leading-relaxed text-foreground sm:text-2xl">
              {landing.tagline}
            </p>
            <p className="measure mt-4 text-lg leading-relaxed text-muted">
              {landing.pitch}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <BuyButton guide={guide} />
              <span className="font-mono text-sm text-subtle">
                {landing.price} · {landing.pages} pages · {parts.length} parts
              </span>
            </div>
          </div>

          {/* The book: pointer-tilt 3D mockup, lagging slightly on scroll. */}
          <Parallax speed={-0.06} className="hidden lg:block lg:justify-self-center">
            <BookMockup size={440} {...bookProps} />
          </Parallax>
          <div className="mx-auto lg:hidden">
            <BookMockup size={230} {...bookProps} />
          </div>
        </div>

        <p
          aria-hidden
          className="pb-8 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-subtle"
        >
          Scroll <span className="inline-block animate-bounce">▾</span>
        </p>
        <div id="hero-end" aria-hidden className="h-px" />
      </section>

      {/* ── Ticker ───────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-hairline py-4">
        <ul
          aria-hidden
          className="flex w-max items-center animate-marquee"
        >
          {[...ticker, ...ticker].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-8 whitespace-nowrap pr-8 font-mono text-xs uppercase tracking-[0.3em] text-muted"
            >
              {item}
              <span className="text-accent">·</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <Reveal
        as="section"
        className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-24 text-center sm:grid-cols-3 sm:gap-6 sm:py-28"
      >
        {[
          { value: String(parts.length), label: "parts, one method" },
          { value: String(landing.pages), label: "pages, cited throughout" },
          { value: `$${savings}`, label: `saved vs $${separateTotal} separately` },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="display text-7xl leading-none text-foreground sm:text-8xl">
              {stat.value}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-subtle">
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>

      {/* ── Five parts: sticky card deck ─────────────────────── */}
      {/* NOT inside a Reveal (sticky would break, see component comment). */}
      <section id="parts" className="mx-auto max-w-5xl px-6 pb-24 sm:pb-32">
        <Reveal>
          <DarkSectionHead
            index="01"
            label="What's inside"
            title="One system, five parts"
            intro="Each part stands on its own, and reads as one connected method when read together. Scroll the deck."
          />
        </Reveal>
        <ul>
          {parts.map((part, i) => (
            <li
              key={part.slug}
              className="sticky"
              style={{ top: `${92 + i * 18}px` }}
            >
              <Link
                href={`/guides/${part.slug}`}
                className="group relative mb-6 flex min-h-[420px] flex-col justify-between overflow-hidden rounded-3xl bg-surface p-7 shadow-soft-lg ring-1 ring-hairline transition-colors hover:ring-accent/40 sm:min-h-[480px] sm:p-12"
              >
                <span
                  aria-hidden
                  className="display pointer-events-none absolute -right-4 -bottom-10 select-none leading-none text-foreground/[0.04] [font-size:clamp(8rem,24vw,20rem)]"
                >
                  {PART_NUMERALS[i]}
                </span>
                <span className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                    Part {PART_NUMERALS[i]}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-subtle transition-colors group-hover:text-accent">
                    Read more →
                  </span>
                </span>
                <span className="relative mt-10">
                  <span className="display block text-4xl leading-[0.95] text-foreground transition-colors group-hover:text-accent sm:text-6xl">
                    {part.title}
                  </span>
                  <span className="mt-4 block max-w-xl text-lg leading-relaxed text-muted">
                    {part.landing.tagline}
                  </span>
                </span>
                <span className="relative mt-10 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-bold text-accent-foreground"
                    style={{ backgroundImage: GUIDE_MARK_TILE }}
                  >
                    {part.mark}
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    {part.landing.price} alone · {part.landing.pages} pages ·
                    included in the bundle
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Mid-page CTA ─────────────────────────────────────── */}
      <Reveal as="section" className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-accent px-6 py-6 text-center sm:flex-row sm:text-left">
          <p className="display text-xl leading-tight text-accent-foreground sm:text-2xl">
            All five parts. One book. {landing.price}.
          </p>
          <BuyButton
            guide={guide}
            className="shrink-0 !bg-accent-foreground !text-accent hover:!bg-white"
          />
        </div>
      </Reveal>

      {/* ── Inside the book: real excerpts ───────────────────── */}
      <section id="inside" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <DarkSectionHead
            index="02"
            label="Inside the book"
            title="Two real pages"
            intro="Not a summary of what's in it, an actual excerpt from Part I and Part V."
          />
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <BreakdownExcerpt
              title="The E-E-A-T breakdown"
              source="Part I · SEO"
              rows={EEAT_ROWS}
            />
          </Reveal>
          <Reveal delay={100}>
            <BreakdownExcerpt
              title="Why your own login, never theirs"
              source="Part V · The Client Kit"
              rows={ACCESS_ROWS}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Statement interlude (real cover copy) ────────────── */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <Parallax
          speed={0.25}
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none"
        >
          <p
            aria-hidden
            className="display whitespace-nowrap text-center leading-none text-foreground/[0.03] [font-size:clamp(5rem,18vw,18rem)]"
          >
            One method
          </p>
        </Parallax>
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            From the cover
          </p>
          <p className="display mt-6 text-3xl leading-[1.02] text-foreground sm:text-5xl">
            Built to be read by a{" "}
            <span className="text-accent">human</span> or handed to an{" "}
            <span className="text-accent">AI</span> whole.
          </p>
        </Reveal>
      </section>

      {/* ── Outcomes + who it's for ──────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 sm:pb-32 lg:grid-cols-2">
        <Reveal>
          <DarkSectionHead
            index="03"
            label="Outcomes"
            title="What you walk away with"
          />
          <BigCheckList items={landing.outcomes} />
        </Reveal>
        <Reveal delay={100}>
          <DarkSectionHead index="04" label="Who it's for" title="Built for" />
          <BigCheckList items={landing.forWho} />
        </Reveal>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section
        id="pricing"
        className="relative isolate overflow-hidden border-y border-hairline py-24 sm:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-80"
        />
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <DarkSectionHead
              index="05"
              label="Get it"
              title="Everything, in one book"
              intro={`The five parts separately run $${separateTotal}. This bundle is $${bundlePrice}, a $${savings} saving, and it's one purchase instead of five.`}
            />
          </Reveal>
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
            <Reveal className="hidden sm:block">
              <BookMockup
                size={230}
                kicker="Complete Edition"
                title="The Ultimate Guide"
                accentWord="Ultimate"
                sub={COVER_SUB}
              />
            </Reveal>
            <Reveal delay={100} className="w-full max-w-md">
              <BuyCard guide={guide} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Closing (real back-cover copy) ───────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Parallax
          speed={0.15}
          className="pointer-events-none absolute -top-32 right-0 -z-10 h-[30rem] w-[30rem]"
        >
          <div
            aria-hidden
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--color-red-600) 18%, transparent), transparent 70%)",
            }}
          />
        </Parallax>
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            The Foundations · Complete Edition
          </p>
          <h2 className="display mt-5 text-6xl leading-[0.92] text-foreground sm:text-8xl">
            Now go <span className="text-accent">build.</span>
          </h2>
          <p className="mt-7 max-w-xl leading-relaxed text-muted sm:text-lg">
            The guides are the map; the work is repetition. Pick one page or
            one client, run the loop, keep a change log, and let the
            compounding do the rest.
          </p>
          <div className="mt-10">
            <BuyButton guide={guide} />
          </div>
        </Reveal>
      </section>

      <StickyBuyBar guide={guide} />
    </div>
  );
}
