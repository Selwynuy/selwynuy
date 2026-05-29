import type { Project } from "./types";

/**
 * PLACEHOLDER PROJECTS — replace with Selwyn's real work.
 * Keep 3–6 entries. Set `featured: true` on your strongest 1–2.
 */
export const projects: Project[] = [
  {
    slug: "placeholder-saas",
    name: "Project One — Replace Me",
    description:
      "A short, punchy description of what this product does and the impact it had. Lead with the outcome (e.g. faster, more secure, X users).",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/Selwynuy",
    featured: true,
  },
  {
    slug: "placeholder-dashboard",
    name: "Project Two — Replace Me",
    description:
      "Describe the problem you solved and the role you played. One or two sentences is plenty for a recruiter to get the gist.",
    tech: ["React", "Node.js", "Prisma"],
    repoUrl: "https://github.com/Selwynuy",
  },
  {
    slug: "placeholder-tool",
    name: "Project Three — Replace Me",
    description:
      "A security or tooling project that shows your range. Highlight anything unusual or technically impressive here.",
    tech: ["Next.js", "Auth", "Edge"],
    liveUrl: "https://example.com",
  },
];
