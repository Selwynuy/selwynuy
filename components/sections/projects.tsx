import { projects } from "@/lib/content/projects";
import { sectionIntros } from "@/lib/content/experience";
import type { Project } from "@/lib/content/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * Bento project grid. The first featured project spans a wide tile;
 * the rest fill varied cells. Depth via shadow, no hard borders,
 * hover lift + link reveal.
 */
export function Projects() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <section id="work" className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 sm:py-28">
      <SectionHeading
        index="03"
        label="Selected Work"
        title="Projects"
        intro={sectionIntros.projects}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured && (
          <Reveal as="article" className="sm:col-span-2">
            <ProjectCard project={featured} index={0} featured />
          </Reveal>
        )}
        {rest.map((project, i) => (
          <Reveal as="article" key={project.slug} delay={(i + 1) * 80}>
            <ProjectCard project={project} index={i + 1} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised shadow-soft-sm ring-1 ring-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${
        featured ? "p-8 sm:p-10" : "p-6"
      }`}
    >
      {/* Big ghost index watermark, editorial depth */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-2 -top-6 select-none font-semibold leading-none text-foreground/[0.04] transition-transform duration-500 group-hover:scale-110 ${
          featured ? "text-[10rem]" : "text-[6rem]"
        }`}
      >
        {num}
      </span>

      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-glow opacity-70"
        />
      )}

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-subtle">{num}</span>
        {featured && (
          <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            Featured
          </span>
        )}
      </div>

      <h3
        className={`relative mt-4 font-semibold text-foreground ${
          featured ? "text-3xl sm:text-4xl" : "text-h3"
        }`}
      >
        {project.name}
      </h3>
      <p
        className={`relative mt-3 flex-1 leading-relaxed text-muted ${
          featured ? "max-w-xl text-base" : "text-sm"
        }`}
      >
        {project.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
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
        <div className="relative mt-6 flex items-center gap-4 text-sm font-medium">
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
  );
}
