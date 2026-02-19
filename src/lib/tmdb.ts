const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

function apiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "TU_API_KEY_ACA") {
    throw new Error("TMDB_API_KEY no configurada en .env.local");
  }
  return key;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "es-AR");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ---------- Types ----------

export interface TMDBTitle {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  credits?: {
    cast: { name: string; character: string; profile_path: string | null; order: number }[];
    crew: { name: string; job: string }[];
  };
  similar?: { results: TMDBTitle[] };
  ["watch/providers"]?: {
    results: Record<string, WatchProviderCountry>;
  };
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface NormalizedTitle {
  id: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  titleOriginal: string;
  year: string;
  rating: number;
  voteCount: number;
  popularity: number;
  overview: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime?: number;
  seasons?: number;
  director?: string;
  cast: string[];
  platforms: NormalizedPlatform[];
}

export interface NormalizedPlatform {
  name: string;
  slug: string;
  logo: string;
  type: "stream" | "rent" | "buy";
  quality: string;
  price?: string;
  link: string;
}

export interface TMDBPerson {
  id: number;
  media_type: "person";
  name: string;
  popularity: number;
  profile_path: string | null;
  known_for_department: string;
  known_for?: TMDBTitle[];
}

export interface PersonResult {
  id: number;
  name: string;
  profilePath: string;
  department: string;
}

export interface SearchResponse {
  results: NormalizedTitle[];
  totalResults: number;
  totalPages: number;
  person?: PersonResult;
}

// ---------- Image helpers ----------

export function posterUrl(path: string | null, size: "w185" | "w342" | "w500" | "w780" = "w500") {
  return path ? `${IMG_BASE}/${size}${path}` : "";
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280") {
  return path ? `${IMG_BASE}/${size}${path}` : "";
}

// ---------- Genre map ----------

const GENRE_MAP: Record<number, string> = {
  28: "Acción", 12: "Aventura", 16: "Animación", 35: "Comedia", 80: "Crimen",
  99: "Documental", 18: "Drama", 10751: "Familia", 14: "Fantasía", 36: "Historia",
  27: "Terror", 10402: "Música", 9648: "Misterio", 10749: "Romance",
  878: "Sci-Fi", 10770: "Película de TV", 53: "Thriller", 10752: "Bélica",
  37: "Western", 10759: "Acción y Aventura", 10762: "Kids", 10763: "Noticias",
  10764: "Reality", 10765: "Sci-Fi & Fantasía", 10766: "Telenovela",
  10767: "Talk Show", 10768: "Guerra y Política",
};

function genreNames(ids?: number[], genres?: { id: number; name: string }[]): string[] {
  if (genres && genres.length > 0) return genres.map((g) => g.name);
  if (ids) return ids.map((id) => GENRE_MAP[id] || "Otro").filter(Boolean);
  return [];
}

// ---------- Normalize ----------

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeProviders(data: TMDBTitle): NormalizedPlatform[] {
  const wp = data["watch/providers"]?.results?.AR;
  if (!wp) return [];

  const platforms: NormalizedPlatform[] = [];
  const link = wp.link || "#";

  if (wp.flatrate) {
    for (const p of wp.flatrate) {
      platforms.push({
        name: p.provider_name,
        slug: slugify(p.provider_name),
        logo: posterUrl(p.logo_path, "w185"),
        type: "stream",
        quality: "HD",
        link,
      });
    }
  }
  if (wp.rent) {
    for (const p of wp.rent) {
      if (platforms.some((x) => x.slug === slugify(p.provider_name))) continue;
      platforms.push({
        name: p.provider_name,
        slug: slugify(p.provider_name),
        logo: posterUrl(p.logo_path, "w185"),
        type: "rent",
        quality: "HD",
        link,
      });
    }
  }
  if (wp.buy) {
    for (const p of wp.buy) {
      if (platforms.some((x) => x.slug === slugify(p.provider_name))) continue;
      platforms.push({
        name: p.provider_name,
        slug: slugify(p.provider_name),
        logo: posterUrl(p.logo_path, "w185"),
        type: "buy",
        quality: "HD",
        link,
      });
    }
  }

  return platforms;
}

function extractYear(item: TMDBTitle): string {
  const date = item.release_date || item.first_air_date || "";
  return date.slice(0, 4);
}

function normalizeBasic(item: TMDBTitle, type: "movie" | "series"): NormalizedTitle {
  return {
    id: `${type === "movie" ? "m" : "t"}-${item.id}`,
    tmdbId: item.id,
    type,
    title: item.title || item.name || "",
    titleOriginal: item.original_title || item.original_name || "",
    year: extractYear(item),
    rating: Math.round(item.vote_average * 10) / 10,
    voteCount: item.vote_count,
    popularity: item.popularity || 0,
    overview: item.overview || "Sin descripción disponible.",
    posterPath: posterUrl(item.poster_path),
    backdropPath: backdropUrl(item.backdrop_path),
    genres: genreNames(item.genre_ids, item.genres),
    runtime: item.runtime,
    seasons: item.number_of_seasons,
    director: item.credits?.crew?.find((c) => c.job === "Director")?.name,
    cast: item.credits?.cast?.slice(0, 8).map((c) => c.name) || [],
    platforms: normalizeProviders(item),
  };
}

/**
 * Relevance scoring for search results.
 * Combines TMDB popularity, vote count, rating, and query match quality
 * to produce a single score that puts "the one you're looking for" at the top.
 */
function relevanceScore(item: TMDBTitle, query: string): number {
  const q = query.toLowerCase().trim();
  const title = (item.title || item.name || "").toLowerCase();
  const originalTitle = (item.original_title || item.original_name || "").toLowerCase();

  let score = 0;

  // Popularity is the strongest signal (TMDB calculates it from views, votes, watchlists, etc.)
  // Typically ranges from 0 to ~500, with blockbusters at 100+
  score += (item.popularity || 0) * 2;

  // Vote count is a strong proxy for "how many people know this"
  // Demon Slayer (the main series) has 5000+ votes vs a random special with 20
  score += Math.log10(Math.max(item.vote_count, 1)) * 30;

  // Rating matters but less — a 5-star niche title shouldn't beat a 8-star blockbuster
  score += item.vote_average * 5;

  // Exact title match is the strongest relevance signal
  if (title === q || originalTitle === q) {
    score += 500;
  }
  // Title starts with query
  else if (title.startsWith(q) || originalTitle.startsWith(q)) {
    score += 200;
  }
  // Title contains query as whole word(s)
  else if (
    title.includes(q) || originalTitle.includes(q)
  ) {
    score += 100;
  }

  // Bonus for having a poster (quality content)
  if (item.poster_path) score += 20;

  // Bonus for having a backdrop (usually major releases)
  if (item.backdrop_path) score += 10;

  // Slight penalty for very old content with no votes (likely junk data)
  if (item.vote_count < 5) score *= 0.3;

  return score;
}

// ---------- Public API ----------

export async function searchMulti(query: string, page = 1): Promise<SearchResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await tmdbFetch<{ results: any[]; total_results: number; total_pages: number }>(
    "/search/multi",
    { query, page: String(page), region: "AR" }
  );

  // Separate person results from title results
  const personResults = data.results.filter(
    (r) => r.media_type === "person"
  ) as TMDBPerson[];

  const titleResults = data.results
    .filter((r): r is TMDBTitle => r.media_type === "movie" || r.media_type === "tv")
    .filter((r) => r.poster_path);

  // Pick the most popular person match (if any)
  const topPerson = personResults
    .filter((p) => p.popularity > 5)
    .sort((a, b) => b.popularity - a.popularity)[0];

  let personInfo: PersonResult | undefined;
  let personCredits: TMDBTitle[] = [];

  if (topPerson) {
    personInfo = {
      id: topPerson.id,
      name: topPerson.name,
      profilePath: posterUrl(topPerson.profile_path, "w185"),
      department: topPerson.known_for_department,
    };

    // Fetch their full filmography
    try {
      const credits = await tmdbFetch<{
        cast: TMDBTitle[];
        crew: TMDBTitle[];
      }>(`/person/${topPerson.id}/combined_credits`);

      personCredits = credits.cast
        .filter((c) => c.poster_path && (c.media_type === "movie" || c.media_type === "tv"))
        .filter((c) => c.vote_count > 10);
    } catch {
      // If credits fetch fails, continue with just title results
    }
  }

  // Merge: direct title results + person filmography (deduplicated)
  const seenIds = new Set<number>();
  const allTitles: TMDBTitle[] = [];

  for (const t of titleResults) {
    if (!seenIds.has(t.id)) {
      seenIds.add(t.id);
      allTitles.push(t);
    }
  }

  for (const t of personCredits) {
    if (!seenIds.has(t.id)) {
      seenIds.add(t.id);
      allTitles.push(t);
    }
  }

  // Sort all by relevance
  const scored = allTitles
    .map((r) => ({ item: r, score: relevanceScore(r, query) }))
    .sort((a, b) => b.score - a.score);

  const results = scored.map(({ item }) =>
    normalizeBasic(item, item.media_type === "movie" ? "movie" : "series")
  );

  return {
    results,
    totalResults: Math.max(data.total_results, results.length),
    totalPages: data.total_pages,
    person: personInfo,
  };
}

export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "day"
): Promise<NormalizedTitle[]> {
  // Use discover endpoint filtered by watch_region=AR so we ONLY get
  // titles available on at least one platform in Argentina.
  const discoverParams = {
    sort_by: "popularity.desc",
    watch_region: "AR",
    with_watch_monetization_types: "flatrate|rent|buy",
    "vote_count.gte": "50",
  };

  if (timeWindow === "day") {
    // "Hoy" = most popular right now
    // No date filter, just popularity sort — TMDB's popularity already reflects recency
  } else {
    // "Esta semana" = released or updated recently
    const weekAgo = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    Object.assign(discoverParams, { "primary_release_date.gte": weekAgo });
  }

  const types: ("movie" | "tv")[] =
    mediaType === "all" ? ["movie", "tv"] : [mediaType];

  const allResults: NormalizedTitle[] = [];

  for (const type of types) {
    const data = await tmdbFetch<{ results: TMDBTitle[] }>(
      `/discover/${type}`,
      discoverParams
    );

    const normalized = data.results
      .filter((r) => r.poster_path)
      .map((r) => {
        r.media_type = type;
        return normalizeBasic(r, type === "movie" ? "movie" : "series");
      });

    allResults.push(...normalized);
  }

  // Sort combined results by popularity
  allResults.sort((a, b) => b.popularity - a.popularity);

  // Now enrich the top results with actual platform data from AR
  const top = allResults.slice(0, 20);
  await enrichWithProviders(top);

  // Final filter: only keep titles that actually have providers after enrichment
  return top.filter((t) => t.platforms.length > 0);
}

/**
 * Batch-fetches watch/providers for a list of titles and attaches them.
 * Runs in parallel for speed.
 */
async function enrichWithProviders(titles: NormalizedTitle[]): Promise<void> {
  const promises = titles.map(async (title) => {
    try {
      const endpoint = title.type === "movie" ? "movie" : "tv";
      const data = await tmdbFetch<TMDBTitle>(`/${endpoint}/${title.tmdbId}/watch/providers`);

      // The response for /watch/providers has { results: { AR: { flatrate: [...], ... } } }
      // but the shape is slightly different — the whole response IS the results
      const wpData = data as unknown as { results: Record<string, WatchProviderCountry> };
      const ar = wpData.results?.AR;
      if (ar) {
        const fakeTmdb: TMDBTitle = {
          id: title.tmdbId,
          overview: "",
          poster_path: null,
          backdrop_path: null,
          vote_average: 0,
          vote_count: 0,
          "watch/providers": { results: { AR: ar } },
        };
        title.platforms = normalizeProviders(fakeTmdb);
      }
    } catch {
      // If provider fetch fails for one title, skip it silently
    }
  });

  await Promise.all(promises);
}

export async function getTitleDetail(
  tmdbId: number,
  type: "movie" | "series"
): Promise<NormalizedTitle> {
  const endpoint = type === "movie" ? "movie" : "tv";
  const data = await tmdbFetch<TMDBTitle>(`/${endpoint}/${tmdbId}`, {
    append_to_response: "credits,watch/providers,similar",
  });
  data.media_type = type === "movie" ? "movie" : "tv";

  const normalized = normalizeBasic(data, type);
  normalized.platforms = normalizeProviders(data);

  if (data.similar?.results) {
    // similar is handled separately via the endpoint
  }

  return normalized;
}

export async function getSimilar(
  tmdbId: number,
  type: "movie" | "series"
): Promise<NormalizedTitle[]> {
  const endpoint = type === "movie" ? "movie" : "tv";
  const data = await tmdbFetch<{ results: TMDBTitle[] }>(
    `/${endpoint}/${tmdbId}/similar`
  );

  return data.results
    .filter((r) => r.poster_path)
    .slice(0, 10)
    .map((r) => normalizeBasic(r, type));
}

export async function getPopular(type: "movie" | "tv" = "movie"): Promise<NormalizedTitle[]> {
  const data = await tmdbFetch<{ results: TMDBTitle[] }>(`/${type}/popular`, {
    region: "AR",
  });

  return data.results
    .filter((r) => r.poster_path)
    .map((r) => normalizeBasic(r, type === "movie" ? "movie" : "series"));
}

export async function getNowPlaying(): Promise<NormalizedTitle[]> {
  // Get recently released/popular titles available on streaming in AR
  const threeMonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);

  const [movies, series] = await Promise.all([
    tmdbFetch<{ results: TMDBTitle[] }>("/discover/movie", {
      sort_by: "popularity.desc",
      watch_region: "AR",
      with_watch_monetization_types: "flatrate",
      "primary_release_date.gte": threeMonthsAgo,
      "vote_count.gte": "20",
    }),
    tmdbFetch<{ results: TMDBTitle[] }>("/discover/tv", {
      sort_by: "popularity.desc",
      watch_region: "AR",
      with_watch_monetization_types: "flatrate",
      "first_air_date.gte": threeMonthsAgo,
      "vote_count.gte": "20",
    }),
  ]);

  const all = [
    ...movies.results.filter((r) => r.poster_path).map((r) => ({ ...r, media_type: "movie" as const })),
    ...series.results.filter((r) => r.poster_path).map((r) => ({ ...r, media_type: "tv" as const })),
  ]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 15);

  const normalized = all.map((r) =>
    normalizeBasic(r, r.media_type === "movie" ? "movie" : "series")
  );

  await enrichWithProviders(normalized);

  return normalized.filter((t) => t.platforms.length > 0);
}
