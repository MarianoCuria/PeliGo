"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, Film, Tv, Loader2 } from "lucide-react";
import PosterImage from "@/components/PosterImage";
import PlatformBadge from "@/components/PlatformBadge";
import { fetchTrending, type NormalizedTitle } from "@/lib/api";

const PERIOD_TABS = [
  { label: "Hoy", value: "day" as const },
  { label: "Esta semana", value: "week" as const },
];
const TYPE_TABS = [
  { label: "Todo", value: "all" as const },
  { label: "Películas", value: "movie" as const },
  { label: "Series", value: "tv" as const },
];

export default function TrendingPage() {
  const [periodIdx, setPeriodIdx] = useState(0);
  const [typeIdx, setTypeIdx] = useState(0);
  const [results, setResults] = useState<NormalizedTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    fetchTrending(TYPE_TABS[typeIdx].value, PERIOD_TABS[periodIdx].value)
      .then((data) => setResults(data.results))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [periodIdx, typeIdx]);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-5">
        <Flame size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold">
          Tendencias
        </h1>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-3">
        {PERIOD_TABS.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setPeriodIdx(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              periodIdx === i
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-6">
        {TYPE_TABS.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setTypeIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              typeIdx === i
                ? "border-[var(--color-secondary)] text-[var(--color-secondary)] bg-[var(--color-secondary)]/10"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="space-y-3">
          {results.map((title, i) => (
            <Link
              key={title.id}
              href={`/title/${title.id}`}
              className="flex gap-3 items-center animate-fade-in-up group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-accent)] w-8 text-center shrink-0">
                {i + 1}
              </span>

              <div className="flex flex-1 gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/30 transition-all">
                <div className="w-[65px] h-[97px] rounded-lg overflow-hidden shrink-0">
                  <PosterImage
                    src={title.posterPath}
                    alt={title.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-1 text-sm">
                    {title.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {title.type === "movie" ? <Film size={12} /> : <Tv size={12} />}
                    <span>
                      {title.type === "movie" ? "Película" : "Serie"} · {title.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star
                      size={12}
                      className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                    />
                    <span className="text-xs font-medium">{title.rating}</span>
                  </div>
                  {title.platforms.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {title.platforms.slice(0, 2).map((p) => (
                        <PlatformBadge
                          key={p.slug + p.type}
                          platform={p}
                          size="sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
