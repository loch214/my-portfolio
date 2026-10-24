import type { MetadataRoute } from "next";

const SITE = "https://lochana-dahanayake.me";

// Served at /sitemap.xml. Home page only: the case studies and gallery are
// marked noindex, because a name search should land on the home page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE, priority: 1 }];
}
