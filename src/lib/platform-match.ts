import type { NormalizedPlatform } from "./tmdb";

export interface PlatformCatalogEntry {
  name: string;
  slug: string;
  color: string;
}

export const PLATFORM_CATALOG: readonly PlatformCatalogEntry[] = [
  { name: "Netflix", slug: "netflix", color: "#E50914" },
  { name: "Prime Video", slug: "amazon", color: "#00A8E1" },
  { name: "Disney+", slug: "disney", color: "#113CCF" },
  { name: "HBO Max", slug: "hbo", color: "#B535F6" },
  { name: "Paramount+", slug: "paramount", color: "#0064FF" },
  { name: "Apple TV+", slug: "apple", color: "#555555" },
  { name: "Star+", slug: "star", color: "#C724B1" },
  { name: "Mubi", slug: "mubi", color: "#001489" },
  { name: "Crunchyroll", slug: "crunchyroll", color: "#F47521" },
] as const;

/** @deprecated Use PLATFORM_CATALOG */
export const PLATFORMS_CATALOG = PLATFORM_CATALOG;

const CATALOG_SLUGS = new Set(PLATFORM_CATALOG.map((p) => p.slug));

export const TMDB_PROVIDER_TO_SLUG: Record<number, string> = {
  8: "netflix",
  119: "amazon",
  337: "disney",
  384: "hbo",
  531: "paramount",
  350: "apple",
  619: "star",
  11: "mubi",
  283: "crunchyroll",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function catalogSlugFromTmdbProvider(
  providerId: number,
  providerName: string
): string | null {
  const fromId = TMDB_PROVIDER_TO_SLUG[providerId];
  if (fromId) return fromId;
  const fromName = slugify(providerName);
  if (CATALOG_SLUGS.has(fromName)) return fromName;
  return null;
}

export function resolveCatalogSlug(platform: NormalizedPlatform): string | null {
  if (platform.providerId != null) {
    const fromId = TMDB_PROVIDER_TO_SLUG[platform.providerId];
    if (fromId) return fromId;
  }
  if (CATALOG_SLUGS.has(platform.slug)) return platform.slug;
  return null;
}

export interface PartitionResult {
  mine: NormalizedPlatform[];
  other: NormalizedPlatform[];
  hasUserConfig: boolean;
}

export function partitionPlatforms(
  platforms: NormalizedPlatform[],
  userSlugs: string[]
): PartitionResult {
  const hasUserConfig = userSlugs.length > 0;
  if (!hasUserConfig) {
    return { mine: [], other: platforms, hasUserConfig: false };
  }

  const userSet = new Set(userSlugs);
  const mine: NormalizedPlatform[] = [];
  const other: NormalizedPlatform[] = [];

  for (const platform of platforms) {
    const catalogSlug = resolveCatalogSlug(platform);
    if (catalogSlug && userSet.has(catalogSlug)) {
      mine.push(platform);
    } else {
      other.push(platform);
    }
  }

  return { mine, other, hasUserConfig };
}

/** List/card UI: only the user's platforms when configured (never fill gaps with "other"). */
export function visiblePlatformsForUser(
  platforms: NormalizedPlatform[],
  userSlugs: string[],
  limit = 3
): NormalizedPlatform[] {
  const { mine, hasUserConfig } = partitionPlatforms(platforms, userSlugs);
  if (!hasUserConfig) return platforms.slice(0, limit);
  return mine.slice(0, limit);
}

/** @deprecated Use visiblePlatformsForUser */
export function orderPlatformsForUser(
  platforms: NormalizedPlatform[],
  userSlugs: string[],
  limit = 3
): NormalizedPlatform[] {
  return visiblePlatformsForUser(platforms, userSlugs, limit);
}

export function hasMatchOnUserPlatforms(
  platforms: NormalizedPlatform[],
  userSlugs: string[]
): boolean {
  return partitionPlatforms(platforms, userSlugs).mine.length > 0;
}

/** Feed rows (home, etc.): include title only if available on ≥1 user platform. */
export function filterTitlesForUserPlatforms<T extends { platforms: NormalizedPlatform[] }>(
  titles: T[],
  userSlugs: string[]
): T[] {
  if (userSlugs.length === 0) return titles;
  return titles.filter((t) => hasMatchOnUserPlatforms(t.platforms, userSlugs));
}

export function isCatalogSlug(slug: string): boolean {
  return CATALOG_SLUGS.has(slug);
}
