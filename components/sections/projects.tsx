import { projects } from "@/lib/content/projects";
import type { Project } from "@/lib/content/types";

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
      <SectionHeading index="02" label="Selected Work" title="Projects" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured && <ProjectCard project={featured} index={0} featured />}
        {rest.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i + 1} />
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
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-surface-raised p-6 shadow-soft-sm ring-1 ring-hairline transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${
        featured ? "sm:col-span-2 sm:row-span-1 sm:p-8" : ""
      }`}
    >
      {/* subtle dot-grid corner texture on featured */}
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 bg-dot-grid opacity-60 [mask-image:radial-gradient(100%_100%_at_100%_0%,#000,transparent)]"
        />
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        {featured && (
          <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
            Featured
          </span>
        )}
      </div>

      <h3
        className={`mt-4 font-semibold text-foreground ${
          featured ? "text-2xl" : "text-h3"
        }`}
      >
        {project.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
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
              className="text-foreground underline-offset-4 hover:underline"
            >
              Live ↗
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
    </article>
  );
}

/** Shared numbered editorial section heading. */
export function SectionHeading({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <header className="mb-10">
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle">
        <span className="text-foreground">{index}</span>
        <span className="h-px w-8 bg-hairline" />
        {label}
      </p>
      <h2 className="mt-4 text-h2 font-semibold text-foreground">{title}</h2>
    </header>
  );
}
