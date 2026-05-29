import { profile } from "@/lib/content/profile";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";

// JSON-LD Person schema for richer search results.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: "https://selwynuy.dev",
  sameAs: [profile.social.github, profile.social.linkedin],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Full Stack Web Development",
    "Web Security",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
    </>
  );
}
