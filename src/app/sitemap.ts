import type { MetadataRoute } from "next";
import { getTrending } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  let titlePages: MetadataRoute.Sitemap = [];
  try {
    const trending = await getTrending("all", "day");
    titlePages = trending.slice(0, 100).map((t) => ({
      url: `${SITE_URL}/title/${t.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Si TMDB no está configurado en build, solo usamos páginas estáticas
  }

  return [...staticPages, ...titlePages];
}
