import type { MetadataRoute } from "next";
import { projectsData } from "@/data/personalData";

const SITE = "https://lochana-dahanayake.me";

// Lists every page for search engines; served at /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, priority: 1 },
    { url: `${SITE}/gallery`, priority: 0.5 },
    ...projectsData.map((project) => ({ url: `${SITE}/projects/${project.id}`, priority: 0.7 })),
  ];
}
