import { isCatalogSlug } from "./platform-match";

export {
  PLATFORM_CATALOG,
  PLATFORMS_CATALOG,
  TMDB_PROVIDER_TO_SLUG,
  catalogSlugFromTmdbProvider,
  resolveCatalogSlug,
  partitionPlatforms,
  orderPlatformsForUser,
  visiblePlatformsForUser,
  hasMatchOnUserPlatforms,
  filterTitlesForUserPlatforms,
  type PartitionResult,
  type PlatformCatalogEntry,
} from "./platform-match";

export { useUserPlatforms } from "./use-user-platforms";

export const STORAGE_KEY = "peligo_user_platforms";
export const USER_PLATFORMS_CHANGED_EVENT = "peligo:user-platforms-changed";

function filterValidSlugs(slugs: string[]): string[] {
  return [...new Set(slugs.filter((s) => isCatalogSlug(s)))];
}

export function getUserPlatformSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return filterValidSlugs(parsed.filter((s): s is string => typeof s === "string"));
  } catch {
    return [];
  }
}

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(USER_PLATFORMS_CHANGED_EVENT));
}

export function setUserPlatformSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filterValidSlugs(slugs)));
    notifyChange();
  } catch {
    // quota or disabled
  }
}

export function toggleUserPlatform(slug: string): string[] {
  if (!isCatalogSlug(slug)) return getUserPlatformSlugs();
  const current = getUserPlatformSlugs();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  setUserPlatformSlugs(next);
  return next;
}

export function subscribeUserPlatforms(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };

  window.addEventListener(USER_PLATFORMS_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(USER_PLATFORMS_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
