/** Shared content types. All site content is sourced from typed files in this folder. */

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** Role / title, also used in SEO metadata. */
  role: string;
  /**
   * The hero HOOK, one sharp positioning claim, not a bio.
   * This is the spine of the whole storyline.
   */
  hook: string;
  /** One supporting line under the hook. Keep it doing a *different* job than the hook. */
  subhook: string;
  /** The single word in the hook to render in brand red. Defaults to "secure". */
  accentWord?: string;
  /** Short tagline used only for SEO metadata (not rendered as body copy). */
  tagline: string;
  /** Primary contact email (mailto + contact form fallback). */
  email: string;
  /** Optional location string, e.g. "Manila, PH · Remote". */
  location?: string;
  social: {
    github: string;
    linkedin: string;
  };
  /** Path to resume PDF in /public, or null if not yet provided. */
  resumeUrl: string | null;
}

/** A single beat in the About origin → approach narrative. */
export interface StoryBeat {
  /** Short label for the beat, e.g. "The origin". */
  label: string;
  /** Heading for the beat. */
  heading: string;
  /** 1–2 sentences advancing the story. */
  body: string;
}

export interface Project {
  /** Stable identifier, also used as the React key. */
  slug: string;
  name: string;
  description: string;
  /** Short tech tags rendered as monospace chips. */
  tech: string[];
  /** Live deployment, if any. */
  liveUrl?: string;
  /** Source repository, if public. */
  repoUrl?: string;
  /** Mark true to surface in a "featured" position. */
  featured?: boolean;
}

export interface Role {
  company: string;
  title: string;
  /** Human-readable period, e.g. "2023, Present". */
  period: string;
  /** 1–3 achievement bullets. */
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** Year obtained, e.g. "2024". */
  year: string;
  /** Optional verification/credential link. */
  url?: string;
}
