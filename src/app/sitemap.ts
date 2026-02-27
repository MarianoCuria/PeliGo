import type { MetadataRoute } from "next";
import { getTrending } from "@/lib/tmdb";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://peligo.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/favorites`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  let titlePages: MetadataRoute.Sitemap = [];
  try {
    const trending = await getTrending("all", "day");
    titlePages = trending.slice(0, 100).map((t) => ({
      url: `${baseUrl}/title/${t.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Si TMDB no está configurado en build, solo usamos páginas estáticas
  }

  return [...staticPages, ...titlePages];
}
