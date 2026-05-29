import { profile } from "@/lib/content/profile";
import { Marquee } from "@/components/sections/marquee";
import { SectionHeading } from "@/components/sections/projects";

/** Compact About strip: bio as an editorial pull-paragraph + skills marquee. */
export function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 sm:py-24"
    >
      <SectionHeading index="01.5" label="About" title="Security-minded by default" />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {profile.bio.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl leading-relaxed text-foreground"
                  : "text-lg leading-relaxed text-muted"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="space-y-3 lg:border-l lg:border-hairline lg:pl-8">
          <Stat k="Role" v={profile.role} />
          <Stat k="Email" v={profile.email} href={`mailto:${profile.email}`} />
          <Stat k="GitHub" v="@Selwynuy" href={profile.social.github} />
          <Stat k="LinkedIn" v="selwyn-uy" href={profile.social.linkedin} />
        </ul>
      </div>

      <div className="mt-14">
        <Marquee />
      </div>
    </section>
  );
}

function Stat({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <li>
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
    </li>
  );
}
