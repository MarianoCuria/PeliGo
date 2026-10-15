import type { NormalizedPlatform } from "./tmdb";
import { resolveCatalogSlug } from "./platform-match";

/**
 * Where the "Ver" button sends the user. Platforms don't expose stable deep links
 * per title, so we open their search with the title when the URL is known to work,
 * or their home page otherwise. `{q}` is replaced with the encoded title.
 */
const CATALOG_WATCH_URLS: Record<string, string> = {
  netflix: "https://www.netflix.com/search?q={q}",
  amazon: "https://www.primevideo.com/search/?phrase={q}",
  disney: "https://www.disneyplus.com/",
  hbo: "https://www.hbomax.com/",
  paramount: "https://www.paramountplus.com/",
  apple: "https://tv.apple.com/ar/search?term={q}",
  movistar: "https://www.movistar.com.ar/",
  claro: "https://www.clarovideo.com/argentina/",
  directv: "https://www.directvgo.com/ar/",
  mercadoplay: "https://play.mercadolibre.com.ar/",
  universal: "https://www.primevideo.com/search/?phrase={q}",
  vix: "https://vix.com/",
  pluto: "https://pluto.tv/latam",
  mubi: "https://mubi.com/es/search/films?query={q}",
  crunchyroll: "https://www.crunchyroll.com/es/search?q={q}",
};

// Rent/buy stores that are not part of the selectable catalog.
const PROVIDER_WATCH_URLS: Record<number, string> = {
  2: "https://tv.apple.com/ar/search?term={q}", // Apple TV Store
  3: "https://play.google.com/store/search?q={q}&c=movies", // Google Play Movies
  10: "https://www.primevideo.com/search/?phrase={q}", // Amazon Video
};

export function watchUrlFor(platform: NormalizedPlatform, title: string): string | null {
  const slug = resolveCatalogSlug(platform);
  const template =
    (slug && CATALOG_WATCH_URLS[slug]) ||
    (platform.providerId != null ? PROVIDER_WATCH_URLS[platform.providerId] : undefined);
  if (!template) return null;
  return template.replace("{q}", encodeURIComponent(title));
}
