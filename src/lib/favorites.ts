import type { NormalizedTitle } from "./tmdb";

const STORAGE_KEY = "peligo_favorites";

function getRaw(): NormalizedTitle[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    const parsed = JSON.parse(s) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getFavorites(): NormalizedTitle[] {
  return getRaw();
}

export function addFavorite(title: NormalizedTitle): void {
  const list = getRaw();
  if (list.some((t) => t.id === title.id)) return;
  list.unshift(title);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // quota or disabled
  }
}

export function removeFavorite(id: string): void {
  const list = getRaw().filter((t) => t.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // quota or disabled
  }
}

export function isFavorite(id: string): boolean {
  return getRaw().some((t) => t.id === id);
}
