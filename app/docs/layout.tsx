import { getDocsBySection } from "@/lib/docs/registry";
import { Sidebar } from "@/components/docs/sidebar";
import { CodeCopyEnhancer } from "@/components/docs/code-copy";

/**
 * Handbook shell: persistent left sidebar + content well.
 * The sidebar's presence is the signal that you've moved from the portfolio
 * surface into the handbook. The per-page right-rail TOC lives in the page.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = getDocsBySection().map((g) => ({
    section: g.section,
    items: g.docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      verified: d.verified,
    })),
  }));

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:py-16">
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-12">
            <Sidebar groups={groups} />
          </div>
        </aside>
        {children}
      </div>
      <CodeCopyEnhancer />
    </div>
  );
}
