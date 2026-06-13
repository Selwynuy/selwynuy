import type { Metadata } from "next";
import { getKnowledgeMap } from "@/lib/docs/registry";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/lib/content/profile";
import { ProjectCreator } from "@/components/docs/project-creator";

export const metadata: Metadata = {
  title: "Project Creator",
  description:
    "Answer a few questions, get an honest verdict on whether Next.js fits, and copy a setup prompt tailored to your project, assembled from the handbook.",
  alternates: { canonical: "/docs/create" },
};

/**
 * The interactive project creator. Server-renders the knowledge map from the
 * registry and hands it to the client wizard, which runs the Next.js fit-check
 * and assembles a tailored AI prompt from the relevant playbook sections.
 */
export default function CreatePage() {
  const knowledge = getKnowledgeMap();

  return (
    <div className="min-w-0">
      <header className="mb-8 border-b border-hairline pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
          Project Creator
        </p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          Start a project <span className="text-accent">the right way</span>
        </h1>
        <p className="measure mt-5 text-lg leading-relaxed text-muted">
          Answer four quick questions. You get an honest verdict on whether
          Next.js is even the right tool, and a setup prompt tailored to your
          project that you can paste straight into your AI.
        </p>
      </header>

      <ProjectCreator
        knowledge={knowledge}
        siteUrl={SITE_URL}
        authorName={profile.name}
      />
    </div>
  );
}
