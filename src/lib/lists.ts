import type { NormalizedTitle } from "./tmdb";

export type ListName = "favorites" | "watchlist" | "watched";

export const LIST_STORAGE_KEYS: Record<ListName, string> = {
  favorites: "peligo_favorites",
  watchlist: "peligo_watchlist",
  watched: "peligo_watched",
};

export const LISTS_CHANGED_EVENT = "peligo:lists-changed";

function read(list: ListName): NormalizedTitle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIST_STORAGE_KEYS[list]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as NormalizedTitle[]) : [];
  } catch {
    return [];
  }
}

function write(list: ListName, titles: NormalizedTitle[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LIST_STORAGE_KEYS[list], JSON.stringify(titles));
  } catch {
    // quota or disabled
  }
}

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LISTS_CHANGED_EVENT));
}

export function getList(list: ListName): NormalizedTitle[] {
  return read(list);
}

export function isInList(list: ListName, id: string): boolean {
  return read(list).some((t) => t.id === id);
}

export function addToList(list: ListName, title: NormalizedTitle): void {
  const titles = read(list);
  if (!titles.some((t) => t.id === title.id)) {
    write(list, [title, ...titles]);
  }
  // Something you already watched is no longer "to watch".
  if (list === "watched") {
    write("watchlist", read("watchlist").filter((t) => t.id !== title.id));
  }
  notifyChange();
}

export function removeFromList(list: ListName, id: string): void {
  write(list, read(list).filter((t) => t.id !== id));
  notifyChange();
}

export function subscribeLists(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const keys = new Set(Object.values(LIST_STORAGE_KEYS));
  const onCustom = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key && keys.has(e.key)) listener();
  };

  window.addEventListener(LISTS_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(LISTS_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
