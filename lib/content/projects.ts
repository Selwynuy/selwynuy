import type { Project } from "./types";

/**
 * Selected work: three projects, all defensible. The featured tile is the
 * founder product; the other two are security-track builds framed honestly as
 * what they are (focused builds that apply the security mindset), not products
 * being oversold. Live URLs were checked before listing; a project whose deploy
 * is down is shown code-only (repo link, no dead link).
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
    slug: "penethodix",
    name: "Penethodix",
    description:
      "A tool I built for my own pentest workflow: a state-aware notebook that tracks engagements by phase, logs targets and ports, keeps findings in markdown, and suggests next steps from the services it detects. The security work I do, turned into software.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "Radix UI"],
    repoUrl: "https://github.com/Selwynuy/Penethodix",
  },
  {
    slug: "selvis",
    name: "SelVis",
    description:
      "A build to explore intrusion detection visually: it turns network traffic into a live dashboard of charted signals, alert states, and drill-downs. My security lens applied to data visualization.",
    tech: ["Next.js", "TypeScript", "Recharts", "Tailwind"],
    liveUrl: "https://selvis.vercel.app",
    repoUrl: "https://github.com/Selwynuy/SelVis",
  },
];
