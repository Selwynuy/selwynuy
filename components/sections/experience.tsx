import { experience } from "@/lib/content/experience";
import { profile } from "@/lib/content/profile";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/projects";

/** Editorial timeline with a continuous spine and node markers. */
export function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 sm:py-28"
    >
      <SectionHeading index="03" label="Background" title="Experience" />

      <ol className="relative space-y-12 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-hairline">
        {experience.map((role, i) => (
          <li key={i} className="relative pl-8">
            <span
              aria-hidden
              className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full bg-background ring-2 ring-foreground/40"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-h3 font-semibold text-foreground">
                {role.title}
              </h3>
              <span className="font-mono text-xs text-subtle">{role.period}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{role.company}</p>
            <ul className="mt-3 space-y-2">
              {role.highlights.map((h, j) => (
                <li
                  key={j}
                  className="text-sm leading-relaxed text-muted before:mr-2 before:text-subtle before:content-['—']"
                >
                  {h}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {profile.resumeUrl && (
        <ButtonLink
          href={profile.resumeUrl}
          variant="ghost"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 px-0"
        >
          Download résumé ↓
        </ButtonLink>
      )}
    </section>
  );
}
