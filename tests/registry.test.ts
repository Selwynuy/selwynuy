import { describe, it, expect, vi } from "vitest";

// The registry imports "server-only", which throws outside a server bundle.
// Stub it so the pure logic can be unit-tested.
vi.mock("server-only", () => ({}));

import {
  getAllDocs,
  getDoc,
  getRawMarkdown,
  getAllSlugs,
  getDocsBySection,
  getAdjacentDocs,
  getToc,
  SECTION_ORDER,
} from "@/lib/docs/registry";

describe("docs registry", () => {
  it("loads docs and sorts by section order then in-section order", () => {
    const docs = getAllDocs();
    expect(docs.length).toBeGreaterThan(0);
    for (let i = 1; i < docs.length; i++) {
      const a = docs[i - 1];
      const b = docs[i];
      const sa = SECTION_ORDER.indexOf(a.section);
      const sb = SECTION_ORDER.indexOf(b.section);
      expect(sa).toBeLessThanOrEqual(sb);
      if (sa === sb) expect(a.order).toBeLessThanOrEqual(b.order);
    }
  });

  it("getDoc returns a known doc and undefined for unknown", () => {
    const slug = getAllSlugs()[0];
    expect(getDoc(slug)?.slug).toBe(slug);
    expect(getDoc("does-not-exist")).toBeUndefined();
  });

  it("getRawMarkdown returns the body without frontmatter", () => {
    const slug = getAllSlugs()[0];
    const md = getRawMarkdown(slug);
    expect(md).toBeTruthy();
    // Body must not contain the YAML frontmatter fence at the very start.
    expect(md?.startsWith("---")).toBe(false);
  });

  it("getDocsBySection groups under known sections only, no empty groups", () => {
    for (const g of getDocsBySection()) {
      expect(SECTION_ORDER).toContain(g.section);
      expect(g.docs.length).toBeGreaterThan(0);
    }
  });

  it("getAdjacentDocs links neighbors and bounds the ends", () => {
    const all = getAllDocs();
    const first = getAdjacentDocs(all[0].slug);
    expect(first.prev).toBeUndefined();
    expect(first.next?.slug).toBe(all[1].slug);

    const last = getAdjacentDocs(all[all.length - 1].slug);
    expect(last.next).toBeUndefined();
  });

  it("getToc extracts H2/H3 headings and ignores fenced code", () => {
    const body = [
      "## First",
      "text",
      "```ts",
      "## not a heading",
      "```",
      "### Sub",
    ].join("\n");
    const toc = getToc(body);
    expect(toc.map((t) => t.text)).toEqual(["First", "Sub"]);
    expect(toc[0]).toMatchObject({ depth: 2, id: "first" });
    expect(toc[1]).toMatchObject({ depth: 3, id: "sub" });
  });

  it("INVARIANT: every verified doc cites at least one source", () => {
    for (const doc of getAllDocs()) {
      if (doc.verified) {
        expect(
          doc.sources && doc.sources.length > 0,
          `"${doc.slug}" is verified but has no sources`,
        ).toBe(true);
      }
    }
  });
});
