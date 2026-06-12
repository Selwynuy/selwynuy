import type { Project } from "./types";

/**
 * Projects. cseexamreview.com is real (Selwyn is the founder). The other two
 * are honest "coming soon" placeholders, not scaffolding. Replace them with
 * real work, then remove the allow-list entry for this file in
 * scripts/check-content.mjs so the guard protects this surface.
 */
export const projects: Project[] = [
  {
    slug: "cse-exam-review",
    name: "CSE Exam Review",
    description:
      "A web platform I founded to help people prepare for the Civil Service Exam. Built and shipped end to end on Next.js, from the database to deployment, with authentication and content delivery handled securely.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind", "Auth"],
    liveUrl: "https://cseexamreview.com",
    featured: true,
  },
  {
    slug: "project-two",
    name: "More coming soon",
    description:
      "Another build is being written up here. The description will lead with the outcome: what it does and the impact it had.",
    tech: ["Next.js", "React"],
  },
  {
    slug: "project-three",
    name: "More coming soon",
    description:
      "A security or tooling project to show range. The strongest work takes the featured tile above.",
    tech: ["Next.js", "Security"],
  },
];
