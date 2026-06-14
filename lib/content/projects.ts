import type { Project } from "./types";

/**
 * Selected work, real and verified. Live URLs were checked before listing;
 * projects whose deploy is down are shown code-only (repo link, no dead link).
 * The featured tile leads with the founder product; the rest balance the two
 * tracks the site is about: full-stack Next.js and security tooling.
 */
export const projects: Project[] = [
  {
    slug: "cse-exam-review",
    name: "CSE Exam Review",
    description:
      "A platform I founded to help people prepare for the Civil Service Exam. Built and shipped end to end on Next.js, from the database to deployment, with authentication and content delivery handled securely.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind", "Auth"],
    liveUrl: "https://cseexamreview.com",
    featured: true,
  },
  {
    slug: "selvis",
    name: "SelVis",
    description:
      "A network intrusion detection dashboard that turns raw traffic into a live security picture: charted signals, alert states, and drill-downs. The security mindset applied to data visualization.",
    tech: ["Next.js", "TypeScript", "Recharts", "Tailwind"],
    liveUrl: "https://selvis.vercel.app",
    repoUrl: "https://github.com/Selwynuy/SelVis",
  },
  {
    slug: "penethodix",
    name: "Penethodix",
    description:
      "A state-aware notebook for penetration testers: track engagements by phase, log targets and ports, write findings in markdown, and get context-aware next-step suggestions based on detected services. Built from my own VAPT workflow.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "Radix UI"],
    repoUrl: "https://github.com/Selwynuy/Penethodix",
  },
  {
    slug: "puhon",
    name: "Puhon",
    description:
      "An AI career-guidance platform for students: a multi-module assessment matches traits to career paths, then Gemini generates personalized explanations alongside salary, scholarship, and college data.",
    tech: ["Next.js 16", "React 19", "NextAuth", "Supabase", "Gemini"],
    liveUrl: "https://puhon.vercel.app",
    repoUrl: "https://github.com/Selwynuy/Puhon",
  },
  {
    slug: "slidestudio",
    name: "SlideStudio",
    description:
      "An AI slide generator for short-form video: paste content, pick a tone, and it produces vertical TikTok-ready slides you can restyle, reorder, and export to PNG or JSON.",
    tech: ["Next.js", "TypeScript", "Gemini", "Tailwind"],
    repoUrl: "https://github.com/Selwynuy/SlideStudio",
  },
  {
    slug: "kopikuys",
    name: "Kopikuys",
    description:
      "A responsive brand site for a Philippine coffee franchise: an interactive drink showcase, a 20-branch location finder, franchise packages, and a touch-friendly animated menu carousel.",
    tech: ["Next.js 15", "React 19", "Framer Motion", "Tailwind"],
    liveUrl: "https://kopikuys.vercel.app",
    repoUrl: "https://github.com/Selwynuy/Kopikuys",
  },
];
