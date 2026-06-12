import { getAllDocs } from "@/lib/docs/registry";
import { SearchPalette } from "./search-palette";

/**
 * Server wrapper: builds the static search index from the registry at build
 * time and hands it to the client palette. Keeps the registry server-only.
 */
export function Search() {
  const docs = getAllDocs().map((d) => ({
    slug: d.slug,
    title: d.title,
    summary: d.summary,
    section: d.section,
  }));
  return <SearchPalette docs={docs} />;
}
