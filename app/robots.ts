import type { MetadataRoute } from "next";

// Served at /robots.txt; points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://lochana-dahanayake.me/sitemap.xml",
  };
}
