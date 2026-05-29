import type { Profile } from "./types";

/**
 * Real profile data for Selwyn Uy.
 * Tagline + bio are written for SEO around "Next.js full stack developer"
 * with a security angle (Selwyn's cybersecurity background is a differentiator).
 */
export const profile: Profile = {
  name: "Selwyn Uy",
  role: "Full Stack Next.js Web Developer",
  tagline:
    "I build fast, secure, production-grade web apps with Next.js, React, and TypeScript.",
  bio: [
    "I'm a full stack web developer specializing in Next.js, React, and TypeScript, building performant, accessible products from the database to the pixel.",
    "With a background in cybersecurity, I treat security as a first-class concern — shipping applications that are not just fast and well-designed, but hardened against real-world threats.",
    "I care about clean architecture, measurable performance, and interfaces that feel effortless to use.",
  ],
  email: "selwyn.cybersec@gmail.com",
  location: undefined, // TODO: add location if desired, e.g. "Manila, PH · Remote"
  social: {
    github: "https://github.com/Selwynuy",
    linkedin: "https://www.linkedin.com/in/selwyn-uy/",
  },
  // TODO: drop a resume PDF in /public (e.g. /resume.pdf) and set the path here.
  resumeUrl: null,
};
