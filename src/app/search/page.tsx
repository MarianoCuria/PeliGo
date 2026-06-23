"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { ArrowLeft, Star, Film, Tv, Loader2, ArrowUpDown, Users, UserRound } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import PosterImage from "@/components/PosterImage";
import PlatformBadge from "@/components/PlatformBadge";
import { fetchSearch, type NormalizedTitle, type PersonResult } from "@/lib/api";

const RECENT_SEARCHES_KEY = "peligo_recent";

function saveRecentSearch(query: string) {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]") as string[];
    const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

type SortOption = "relevancia" | "rating" | "recientes" | "votos";
type FilterType = "all" | "movie" | "series";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "votos", label: "Más vistos" },
  { value: "rating", label: "Mejor rating" },
  { value: "recientes", label: "Más recientes" },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [rawResults, setRawResults] = useState<NormalizedTitle[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [person, setPerson] = useState<PersonResult | undefined>();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setPerson(undefined);
    try {
      const data = await fetchSearch(q);
      setRawResults(data.results);
      setTotalResults(data.totalResults);
      setPerson(data.person);
      saveRecentSearch(q);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSortBy("relevancia");
    setFilterType("all");
    doSearch(query);
  }, [query, doSearch]);

  const results = useMemo(() => {
    let filtered = [...rawResults];

    if (filterType === "movie") {
      filtered = filtered.filter((t) => t.type === "movie");
    } else if (filterType === "series") {
      filtered = filtered.filter((t) => t.type === "series");
    }

    switch (sortBy) {
      case "relevancia":
        break;
      case "votos":
        filtered.sort((a, b) => b.voteCount - a.voteCount);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating || b.voteCount - a.voteCount);
        break;
      case "recientes":
        filtered.sort((a, b) => (b.year || "0").localeCompare(a.year || "0"));
        break;
    }

    return filtered;
  }, [rawResults, sortBy, filterType]);

  const movieCount = rawResults.filter((t) => t.type === "movie").length;
  const seriesCount = rawResults.filter((t) => t.type === "series").length;

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-bg-tertiary)] transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <SearchBar initialQuery={query} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm">
          <p className="text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        </div>
      )}

      {/* Person banner */}
      {!loading && person && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/25 animate-fade-in-up">
          {person.profilePath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.profilePath}
              alt={person.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
              <UserRound size={24} className="text-[var(--color-text-secondary)]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {person.name}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {person.department === "Acting" ? "Actor/Actriz" : person.department}
              {" · "}Mostrando su filmografía
            </p>
          </div>
        </div>
      )}

      {/* Filters & Sort */}
      {!loading && rawResults.length > 0 && (
        <>
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            {totalResults} resultado{totalResults !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filterType === "all"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Todas ({rawResults.length})
            </button>
            <button
              onClick={() => setFilterType("movie")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                filterType === "movie"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Film size={14} />
              Películas ({movieCount})
            </button>
            <button
              onClick={() => setFilterType("series")}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                filterType === "series"
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Tv size={14} />
              Series ({seriesCount})
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            <ArrowUpDown size={14} className="text-[var(--color-text-secondary)] shrink-0" />
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                  sortBy === opt.value
                    ? "border-[var(--color-secondary)] text-[var(--color-secondary)] bg-[var(--color-secondary)]/10"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Count */}
      {!loading && query && results.length > 0 && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          {results.length} resultado{results.length !== 1 ? "s" : ""}
          {filterType !== "all"
            ? ` (${filterType === "movie" ? "películas" : "series"})`
            : ""}
          {person ? ` incluyendo filmografía de ${person.name}` : ""}
        </p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((title, i) => (
            <Link
              key={title.id}
              href={`/title/${title.id}`}
              className="flex gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            >
              <div className="w-[80px] h-[120px] rounded-lg overflow-hidden shrink-0">
                <PosterImage
                  src={title.posterPath}
                  alt={title.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-1">
                  {title.title}
                </h3>
                {title.titleOriginal !== title.title && (
                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 italic">
                    {title.titleOriginal}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-secondary)]">
                  {title.type === "movie" ? <Film size={14} /> : <Tv size={14} />}
                  <span>
                    {title.type === "movie" ? "Película" : "Serie"} · {title.year}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                    />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {title.rating}
                    </span>
                  </span>
                  {title.voteCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                      <Users size={12} />
                      {title.voteCount > 1000
                        ? `${(title.voteCount / 1000).toFixed(1)}k`
                        : title.voteCount}{" "}
                      votos
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {title.platforms.slice(0, 3).map((p) => (
                    <PlatformBadge
                      key={p.slug + p.type}
                      platform={p}
                      size="sm"
                    />
                  ))}
                  {title.platforms.length === 0 && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Plataformas: ver detalle
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && query && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-4">
            <Film size={32} className="text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No encontramos eso</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {filterType !== "all"
              ? "Probá cambiando el filtro de tipo"
              : "Probá con otro nombre o revisá la ortografía"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
