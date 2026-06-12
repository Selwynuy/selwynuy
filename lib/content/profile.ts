import type { Profile, StoryBeat } from "./types";

/**
 * Profile + narrative copy for Selwyn Uy.
 * Storyline spine: "a full-stack developer who builds secure by default."
 * Each piece of copy does a DIFFERENT job — the hero hooks, About tells the
 * origin story, sections prove it. We deliberately avoid repeating the same
 * "full stack + security-minded" sentence across the page.
 */
export const profile: Profile = {
  name: "Selwyn Uy",
  role: "Full Stack Next.js Web Developer",

  // The hook: a claim, not a bio. Recruiters should remember this one line.
  hook: "I build web apps that are secure before they're anything else.",
  accentWord: "secure",
  subhook:
    "Full-stack Next.js engineering with a security background — so the things most teams patch later, I get right from the first commit.",

  // SEO only (used in <title>/description), never rendered as on-page copy.
  tagline:
    "Full Stack Next.js Web Developer building secure, production-grade web applications.",

  email: "selwyn.cybersec@gmail.com",
  location: undefined, // TODO: e.g. "Manila, PH · Remote"
  social: {
    github: "https://github.com/Selwynuy",
    linkedin: "https://www.linkedin.com/in/selwyn-uy/",
  },
  // TODO: drop a resume PDF in /public (e.g. /resume.pdf) and set the path here.
  resumeUrl: null,
};

/**
 * About = origin → approach narrative. Three beats that move the story forward
 * instead of restating the hook. Edit the specifics to match Selwyn's real path.
 */
export const story: StoryBeat[] = [
  {
    label: "The origin",
    heading: "I came to development from security.",
    body: "Before I was shipping features, I was thinking about how systems break — how data leaks, how auth gets bypassed, how an innocent input becomes an exploit. That lens never switched off when I started building products.",
  },
  {
    label: "The approach",
    heading: "So I build the opposite way most teams do.",
    body: "Security usually gets bolted on at the end, under deadline pressure. I start there: validated inputs, least-privilege access, and secrets that never touch the client — baked in from the first commit, not retrofitted after an audit.",
  },
  {
    label: "What it means for you",
    heading: "You get full-stack speed without the security debt.",
    body: "I deliver complete Next.js products — database to deployed — that are fast and well-built, and that don't hand your team a backlog of vulnerabilities to clean up later.",
  },
];
