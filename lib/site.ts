/**
 * Canonical site config. One source of truth for the absolute base URL, used by
 * metadata, sitemap/robots, the one-drop CopyForAI prompts, and llms.txt.
 *
 * Resolution order: explicit NEXT_PUBLIC_SITE_URL (set this in Vercel prod) ->
 * the Vercel-provided deploy URL on previews -> the production domain default.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "https://selwynuy.dev";
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a path. `abs("/docs")` -> "https://.../docs". */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
