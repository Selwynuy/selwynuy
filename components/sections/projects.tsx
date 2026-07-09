import Image from "next/image";
import { projects } from "@/lib/content/projects";
import { sectionIntros } from "@/lib/content/experience";
import type { Project } from "@/lib/content/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * Two shipped products, given equal weight. Stacked full-width rows rather
 * than a grid built for a count this site no longer has: a bento layout with
 * one wide tile and thin leftovers reads as unfinished at two items.
 */
export function Projects() {
  return (
    <section id="work" className="mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:py-28 lg:pl-20 lg:pr-6">
      <SectionHeading
        index="03"
        label="Selected Work"
        title="Projects"
        intro={sectionIntros.projects}
      />

      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <Reveal as="article" key={project.slug} delay={i * 100}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-raised p-8 shadow-soft-sm ring-1 ring-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg sm:p-10 lg:flex-row lg:items-center lg:gap-10">
      {/* Big ghost index watermark, editorial depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none text-[10rem] font-semibold leading-none text-foreground/[0.04] transition-transform duration-500 group-hover:scale-110"
      >
        {num}
      </span>

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow opacity-70" />

      {project.image && (
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-hairline lg:mb-0 lg:w-2/5 lg:shrink-0">
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <span className="font-mono text-xs text-subtle">{num}</span>

        <h3 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-3 max-w-xl flex-1 text-base leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-6 flex items-center gap-4 text-sm font-medium">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
              >
                Live
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Code ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
