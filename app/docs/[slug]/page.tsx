import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getDoc, getToc, getAdjacentDocs } from "@/lib/docs/registry";
import { abs } from "@/lib/site";
import { Toc } from "@/components/docs/toc";
import { CopyForAI } from "@/components/docs/copy-for-ai";
import { DocPager } from "@/components/docs/doc-pager";
import { VerifiedBadge, SourceList } from "@/components/docs/verified-badge";

// Only prerender known slugs; unknown ones 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/docs/${slug}` },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const toc = getToc(doc.body);
  const { prev, next } = getAdjacentDocs(slug);
  // Import the compiled MDX for this slug. Extension is required.
  const { default: Body } = await import(`@/content/docs/${slug}.mdx`);

  return (
    <div className="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-subtle">
            <li>
              <Link href="/docs" className="transition-colors hover:text-foreground">
                Handbook
              </Link>
            </li>
            <li aria-hidden className="text-accent">/</li>
            <li className="text-muted">{doc.section}</li>
          </ol>
        </nav>

        <header className="mb-8 border-b border-hairline pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <VerifiedBadge doc={doc} />
              {doc.updated && (
                <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                  Updated {doc.updated}
                </span>
              )}
            </div>
            <CopyForAI title={doc.title} mdUrl={abs(`/d/${doc.slug}.md`)} />
          </div>
        </header>

        <div className="measure">
          <Body />
          <SourceList doc={doc} />
          <DocPager prev={prev} next={next} />
        </div>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <Toc entries={toc} />
        </div>
      </aside>
    </div>
  );
}
