/**
 * Canonical site config. One source of truth for the absolute base URL, used by
 * metadata, sitemap/robots, the one-drop CopyForAI prompts, and llms.txt.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourdomain.com). Falls
 * back to the Vercel-provided URL on previews, then the dev placeholder.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  // TODO(domain): replace once the real domain is live (tracked in dev backlog).
  return "https://selwynuy.dev";
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a path. `abs("/docs")` -> "https://.../docs". */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
