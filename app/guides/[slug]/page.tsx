import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getGuideSlugs, completeGuide } from "@/lib/docs/guides";
import {
  GUIDE_MARK_TILE as TILE,
  BuyCard,
  CheckList,
  SectionHead,
} from "@/components/docs/guide-landing-shared";
import { CompleteGuideLanding } from "@/components/docs/complete-guide-landing";

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
  if (guide.kind === "complete") return <CompleteGuideLanding guide={guide} />;

  const { landing } = guide;
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
      {complete && (
        <section className="mt-14">
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
                {complete.title}
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
        </section>
      )}

      {/* Closing CTA */}
      <div className="mt-14 max-w-md">
        <BuyCard guide={guide} />
      </div>
    </div>
  );
}
