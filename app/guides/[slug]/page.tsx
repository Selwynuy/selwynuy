import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuide,
  getGuideSlugs,
  completeGuide,
  GUIDES_EDITION,
  type Guide,
} from "@/lib/docs/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title}, an ebook`,
    description: guide.landing.pitch,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

const TILE =
  "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)";

/** Price + call to action. A real buy button once buyUrl is set, otherwise a
 *  free-preview CTA while the guide is still in draft. */
function BuyCard({ guide }: { guide: Guide }) {
  const { landing, pdf } = guide;
  const hasCheckout = Boolean(landing.buyUrl);
  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="display text-4xl leading-none text-foreground">
            {landing.price}
          </p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
            {hasCheckout ? "one-time" : "launch price"}
          </p>
        </div>
        <p className="text-right font-mono text-[11px] leading-relaxed text-subtle">
          PDF · {landing.pages} pages
          <br />
          Edition {GUIDES_EDITION}
        </p>
      </div>

      <a
        href={hasCheckout ? landing.buyUrl : pdf}
        {...(hasCheckout
          ? { target: "_blank", rel: "noopener noreferrer" }
          : { download: true })}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover"
      >
        <span aria-hidden>▸</span> {hasCheckout ? "Get it now" : "Read the PDF"}
      </a>

      {hasCheckout ? (
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center font-mono text-[11px] text-muted underline decoration-hairline underline-offset-2 hover:text-foreground"
        >
          Preview the PDF first
        </a>
      ) : (
        <p className="mt-3 text-center font-mono text-[11px] text-subtle">
          Free to read while in preview. Checkout coming soon.
        </p>
      )}
    </div>
  );
}

/** A benefit list with accent check markers. */
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span
            aria-hidden
            className="mt-1 shrink-0 font-mono text-xs text-accent"
          >
            ✓
          </span>
          <span className="leading-relaxed text-muted">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
      {children}
    </h2>
  );
}

/** A guide's landing / sales page: hook, pitch, price, who it is for, what is
 *  inside, outcomes, and a cross-sell between the bundle and the single parts. */
export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const { landing } = guide;
  const isComplete = guide.kind === "complete";
  const complete = completeGuide();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> All guides
      </Link>

      {/* Hero */}
      <header className="mt-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold text-accent-foreground shadow-soft-md ring-1 ring-white/10"
            style={{ backgroundImage: TILE }}
          >
            {guide.mark}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {guide.kind.toUpperCase()} guide
          </span>
          {!guide.verified && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
              draft
            </span>
          )}
        </div>
        <h1 className="display mt-5 text-4xl leading-[1.05] text-foreground sm:text-5xl">
          {guide.title}
        </h1>
        <p className="measure mt-4 text-xl leading-relaxed text-foreground">
          {landing.tagline}
        </p>
      </header>

      {/* Pitch + buy */}
      <p className="measure mt-7 text-lg leading-relaxed text-muted">
        {landing.pitch}
      </p>
      <div className="mt-8 max-w-md">
        <BuyCard guide={guide} />
      </div>

      {/* Who it is for */}
      <section className="mt-14">
        <SectionHead>Who it is for</SectionHead>
        <CheckList items={landing.forWho} />
      </section>

      {/* What is inside */}
      <section className="mt-12">
        <SectionHead>What is inside</SectionHead>
        <CheckList items={landing.inside} />
      </section>

      {/* Outcomes */}
      <section className="mt-12">
        <SectionHead>What you walk away with</SectionHead>
        <CheckList items={landing.outcomes} />
      </section>

      {/* Cross-sell */}
      <section className="mt-14">
        {isComplete ? (
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
              Prefer one topic
            </p>
            <p className="mt-2 leading-relaxed text-muted">
              You can also grab any single part on its own, SEO, AEO, GEO, The
              Stack, or The Client Kit.{" "}
              <Link
                href="/guides"
                className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
              >
                Browse the five guides
              </Link>
              .
            </p>
          </div>
        ) : (
          complete && (
            <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                Get the whole system
              </p>
              <p className="mt-2 leading-relaxed text-muted">
                This is one part of{" "}
                <Link
                  href={`/guides/${complete.slug}`}
                  className="font-semibold text-foreground underline decoration-accent/40 underline-offset-2 hover:text-accent"
                >
                  The Foundations
                </Link>
                , the complete edition that bundles all five guides into one{" "}
                {complete.landing.pages}-page book for {complete.landing.price}.
                If you want more than one topic, it is the better buy.
              </p>
              <Link
                href={`/guides/${complete.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent hover:text-accent-hover"
              >
                See the complete edition <span aria-hidden>→</span>
              </Link>
            </div>
          )
        )}
      </section>

      {/* Closing CTA */}
      <div className="mt-14 max-w-md">
        <BuyCard guide={guide} />
      </div>
    </div>
  );
}
