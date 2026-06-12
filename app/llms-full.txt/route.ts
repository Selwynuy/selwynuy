import { getAllDocs } from "@/lib/docs/registry";
import { abs } from "@/lib/site";
import { profile } from "@/lib/content/profile";

/**
 * /llms-full.txt — the entire handbook concatenated as one markdown document,
 * for agents that want the whole context in a single fetch. Generated from the
 * registry. Drafts are included but clearly labelled.
 */
export const dynamic = "force-static";

export function GET() {
  const docs = getAllDocs();

  const parts: string[] = [
    `# ${profile.name} — Next.js Handbook (full)`,
    "",
    `> Complete handbook in one document. Author: ${profile.name}, ${profile.role}. Site: ${abs("/")}.`,
    "",
    "Sections marked (draft) are still under review and not yet fact-checked.",
    "",
  ];

  for (const doc of docs) {
    const tag = doc.verified ? "" : " (draft)";
    parts.push(
      "",
      "---",
      "",
      `## ${doc.title}${tag}`,
      "",
      `${doc.summary}`,
      doc.sources?.length ? `\nReferences: ${doc.sources.join(", ")}` : "",
      "",
      doc.body,
      "",
    );
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
