import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, getGuideSlugs } from "@/lib/docs/guides";

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
    title: `${guide.title} guide`,
    description: guide.blurb,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

/** A single guide's page: what it covers, and the PDF itself. */
export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span> All guides
      </Link>

      <header className="mt-6 flex items-start gap-5 border-b border-hairline pb-8">
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-xl font-bold text-accent-foreground shadow-soft-md ring-1 ring-white/10"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)",
          }}
        >
          {guide.mark}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {guide.kind.toUpperCase()} guide
          </p>
          <h1 className="display mt-1 text-4xl text-foreground sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-3 font-mono text-xs text-muted">
            {guide.verified ? (
              <span className="inline-flex items-center gap-1 text-accent">
                <span aria-hidden>✓</span> verified
              </span>
            ) : (
              <span className="text-subtle">draft, under review</span>
            )}
          </p>
        </div>
      </header>

      <p className="mt-8 text-lg leading-relaxed text-foreground">
        {guide.blurb}
      </p>

      <div className="mt-8">
        <a
          href={guide.pdf}
          download
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover"
        >
          <span aria-hidden>▸</span> Open PDF
        </a>
      </div>
    </div>
  );
}
