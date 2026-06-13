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
  toPlainMarkdown,
  SECTION_ORDER,
} from "@/lib/docs/registry";
import { fitVerdict, relevantSlugs, type Answers } from "@/lib/docs/fit-check";

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

  it("toPlainMarkdown strips tutorial JSX so one-drop output is clean", () => {
    const mdx = [
      "<Steps>",
      '<Step title="Create">',
      "do the thing",
      "</Step>",
      "</Steps>",
      '<Rule type="dont">never X</Rule>',
      '<Callout type="security">keep secrets server-side</Callout>',
      '<NextStep href="/docs/next">Keep going</NextStep>',
    ].join("\n");
    const out = toPlainMarkdown(mdx);
    expect(out).not.toMatch(/<\/?(Steps|Step|Rule|Callout|NextStep)/);
    expect(out).toContain("### Create");
    expect(out).toContain("Don't: never X");
    expect(out).toContain("Security: keep secrets server-side");
    expect(out).toContain("[Keep going](/docs/next)");
  });

  it("INVARIANT: no shipped one-drop output leaks raw tutorial tags", () => {
    for (const slug of getAllSlugs()) {
      const md = getRawMarkdown(slug) ?? "";
      expect(
        /<\/?(Steps|Step|Prereqs|Outcome|Rule|Callout|Compare|Bad|Good|NextStep)\b/.test(
          md,
        ),
        `"${slug}" one-drop markdown leaks a tutorial tag`,
      ).toBe(false);
    }
  });
});

describe("project creator fit-check", () => {
  const base = {
    building: "x",
    needs: [] as string[],
    scale: "growing" as const,
  };

  it("calls a plain web app a great fit", () => {
    expect(fitVerdict({ ...base, centerOfGravity: "web" }).tone).toBe("great");
  });

  it("rejects the four wrong centers of gravity with a reach-for alternative", () => {
    for (const cog of ["sockets", "mobile", "compute", "static", "tiny"] as const) {
      const v = fitVerdict({ ...base, centerOfGravity: cog });
      expect(v.tone, `${cog} should be wrong`).toBe("wrong");
      expect(v.reach, `${cog} should name an alternative`).toBeTruthy();
    }
  });

  it("INVARIANT: every slug the creator selects is a real, loadable doc", () => {
    const known = new Set(getAllSlugs());
    const combos: Answers[] = [
      { ...base, centerOfGravity: "web", needs: ["database", "auth", "payments", "email", "seo"], scale: "serious" },
      { ...base, centerOfGravity: "web", needs: [], scale: "personal" },
    ];
    for (const a of combos) {
      for (const slug of relevantSlugs(a)) {
        expect(known.has(slug), `creator references missing doc "${slug}"`).toBe(true);
      }
    }
  });

  it("includes scaling/CI/monitoring only at serious scale", () => {
    const serious = relevantSlugs({ ...base, centerOfGravity: "web", scale: "serious" });
    const personal = relevantSlugs({ ...base, centerOfGravity: "web", scale: "personal" });
    expect(serious).toContain("ci-cd-pipelines");
    expect(personal).not.toContain("ci-cd-pipelines");
  });
});
