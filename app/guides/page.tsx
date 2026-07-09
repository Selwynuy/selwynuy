import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, guideKinds } from "@/lib/docs/guides";
import { GuidesGallery } from "@/components/docs/guides-gallery";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Foundational reference guides, SEO, AEO, GEO, and more, as downloadable PDFs. The knowledge underneath the handbook and the skills, not a process, the material itself.",
};

/**
 * The Guides shelf: foundational PDFs, distinct from the handbook (how Selwyn
 * builds) and the skills marketplace (installable process). Static data, no
 * backend; each guide links straight to a PDF checked into the repo.
 */
export default function GuidesPage() {
  const guides = GUIDES;
  const kinds = guideKinds();

  return (
    // lg:pl-20 clears the floating world-switcher rail (fixed at left-4,
    // visible from lg: up); without it the H1 sits flush under the rail.
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:pl-20 lg:pr-6">
      <header className="mb-12 border-b border-hairline pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
          The Foundations
        </p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          Guides worth <span className="text-accent">keeping</span>
        </h1>
        <p className="measure mt-5 text-lg leading-relaxed text-muted">
          The handbook is how I build. The skills package that into something
          an agent can run. These are the foundational material underneath
          both, SEO, AEO, GEO, and whatever else earns a place here, as
          PDFs you can read or hand to an AI directly.
        </p>
      </header>

      {guides.length === 0 ? (
        <p className="measure rounded-xl bg-surface p-6 text-sm leading-relaxed text-muted ring-1 ring-hairline">
          Nothing here yet. The first guides are in progress, check back soon,
          or read the{" "}
          <Link
            href="/docs"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            handbook
          </Link>{" "}
          or browse the{" "}
          <Link
            href="/skills"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            skills marketplace
          </Link>{" "}
          in the meantime.
        </p>
      ) : (
        <GuidesGallery guides={guides} kinds={kinds} />
      )}
    </div>
  );
}
