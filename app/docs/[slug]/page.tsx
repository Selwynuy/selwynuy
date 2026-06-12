import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getDoc, getToc } from "@/lib/docs/registry";
import { abs } from "@/lib/site";
import { Toc } from "@/components/docs/toc";
import { CopyForAI } from "@/components/docs/copy-for-ai";
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
  // Import the compiled MDX for this slug. Extension is required.
  const { default: Body } = await import(`@/content/docs/${slug}.mdx`);

  return (
    <div className="min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
      <article className="min-w-0">
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
