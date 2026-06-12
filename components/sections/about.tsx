import { profile, story } from "@/lib/content/profile";
import { Marquee } from "@/components/sections/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * About = the origin → approach narrative. Three beats that move the story
 * forward (security past → how I build → what you get) rather than restating
 * the hook. This is the section that earns the recruiter's next scroll.
 */
export function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        index="02"
        ghost="02"
        label="The story"
        title="Why secure by default"
      />

      <ol className="relative space-y-12 before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-px before:bg-hairline sm:space-y-14">
        {story.map((beat, i) => (
          <Reveal as="li" key={i} delay={i * 90} className="relative pl-10">
            <span
              aria-hidden
              className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-foreground/30"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
              {beat.label}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
              {beat.heading}
            </h3>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
              {beat.body}
            </p>
          </Reveal>
        ))}
      </ol>

      {/* Quiet identity row, links, not another retelling. */}
      <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 rule-y pt-8">
        <Fact k="Email" v={profile.email} href={`mailto:${profile.email}`} />
        <Fact k="GitHub" v="@Selwynuy" href={profile.social.github} />
        <Fact k="LinkedIn" v="selwyn-uy" href={profile.social.linkedin} />
      </div>

      <div className="mt-12">
        <Marquee />
      </div>
    </section>
  );
}

function Fact({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-subtle">{k}</p>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {v}
        </a>
      ) : (
        <p className="text-foreground">{v}</p>
      )}
    </div>
  );
}
