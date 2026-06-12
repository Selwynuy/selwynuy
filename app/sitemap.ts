import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllDocs } from "@/lib/docs/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/docs`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docs.map((doc) => ({
      url: `${SITE_URL}/docs/${doc.slug}`,
      lastModified: doc.updated ? new Date(doc.updated) : undefined,
      changeFrequency: "monthly" as const,
      priority: doc.verified ? 0.8 : 0.5,
    })),
  ];
}
