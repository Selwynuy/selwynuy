import type { MetadataRoute } from "next";

// TODO: update to the production URL once deployed.
const siteUrl = "https://selwynuy.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
