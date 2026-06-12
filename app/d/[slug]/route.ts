import { getAllSlugs, getDoc } from "@/lib/docs/registry";
import { abs } from "@/lib/site";

/**
 * ONE-DROP endpoint. Serves a handbook section as clean plain markdown so a
 * user can hand the URL to their AI and have it applied to their own project.
 *
 *   GET /d/<slug>.md  ->  text/markdown
 *
 * Slug is validated against the registry (no path traversal: we never touch the
 * filesystem with user input, only look up a known doc). Prerendered at build.
 */

// Only known slugs; anything else 404s. Statically generated.
export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  // The route segment includes the ".md" suffix so the URL reads /d/security.md
  return getAllSlugs().map((slug) => ({ slug: `${slug}.md` }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: param } = await params;
  const slug = param.replace(/\.md$/, "");
  const doc = getDoc(slug);

  if (!doc) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Prepend a small context header so the receiving AI knows what this is.
  const status = doc.verified ? "verified" : "draft (under review)";
  const header = [
    `# ${doc.title}`,
    "",
    `> ${doc.summary}`,
    "",
    `Source: ${abs(`/docs/${doc.slug}`)} | Status: ${status}`,
    doc.sources?.length ? `References: ${doc.sources.join(", ")}` : null,
    "",
    "---",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return new Response(header + doc.body + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
