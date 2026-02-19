import type { NormalizedTitle, NormalizedPlatform, PersonResult } from "./tmdb";

export type { NormalizedTitle, NormalizedPlatform, PersonResult };

const BASE = "";

export async function fetchHome(): Promise<{
  trending: NormalizedTitle[];
  nowPlaying: NormalizedTitle[];
}> {
  const res = await fetch(`${BASE}/api/home`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || "Error al cargar home");
  }
  return res.json();
}

export async function fetchSearch(
  query: string,
  page = 1
): Promise<{
  results: NormalizedTitle[];
  totalResults: number;
  totalPages: number;
  person?: PersonResult;
}> {
  const res = await fetch(
    `${BASE}/api/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error("Error al buscar");
  return res.json();
}

export async function fetchTrending(
  type: "all" | "movie" | "tv" = "all",
  period: "day" | "week" = "day"
): Promise<{ results: NormalizedTitle[] }> {
  const res = await fetch(`${BASE}/api/trending?type=${type}&period=${period}`);
  if (!res.ok) throw new Error("Error al cargar tendencias");
  return res.json();
}

export async function fetchTitle(
  tmdbId: number,
  type: "movie" | "series"
): Promise<{
  title: NormalizedTitle;
  similar: NormalizedTitle[];
}> {
  const mediaType = type === "movie" ? "movie" : "tv";
  const res = await fetch(`${BASE}/api/title/${mediaType}/${tmdbId}`);
  if (!res.ok) throw new Error("Error al cargar título");
  return res.json();
}
