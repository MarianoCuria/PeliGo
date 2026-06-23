"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, Film, Tv, Loader2 } from "lucide-react";
import PosterImage from "@/components/PosterImage";
import PlatformBadge from "@/components/PlatformBadge";
import { fetchTrending, type NormalizedTitle } from "@/lib/api";
import { visiblePlatformsForUser } from "@/lib/platform-match";
import { useUserPlatforms } from "@/lib/user-platforms";

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
  const { slugs, hasSelection } = useUserPlatforms();
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
    <div className="px-4 pt-6" data-testid="trending-page">
      <div className="flex items-center gap-2 mb-5" data-testid="trending-header">
        <Flame size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold" data-testid="trending-title">
          Tendencias
        </h1>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-3" data-testid="trending-period-tabs">
        {PERIOD_TABS.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setPeriodIdx(i)}
            data-testid={`trending-period-tab-${tab.value}`}
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
      <div className="flex gap-2 mb-6" data-testid="trending-type-tabs">
        {TYPE_TABS.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setTypeIdx(i)}
            data-testid={`trending-type-tab-${tab.value}`}
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
        <div className="flex items-center justify-center py-20" data-testid="trending-loading">
          <Loader2 size={32} className="animate-spin text-[var(--color-accent)]" />
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="space-y-3" data-testid="trending-list">
          {results.map((title, i) => (
            <Link
              key={title.id}
              href={`/title/${title.id}`}
              className="flex gap-3 items-center animate-fade-in-up group"
              style={{ animationDelay: `${i * 40}ms` }}
              data-testid={`trending-item-${i}`}
            >
              <span
                className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-accent)] w-8 text-center shrink-0"
                data-testid={`trending-item-rank-${i}`}
              >
                {i + 1}
              </span>

              <div
                className="flex flex-1 gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/30 transition-all"
                data-testid={`trending-item-card-${i}`}
              >
                <div className="w-[65px] h-[97px] rounded-lg overflow-hidden shrink-0" data-testid={`trending-item-poster-${i}`}>
                  <PosterImage
                    src={title.posterPath}
                    alt={title.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 py-0.5" data-testid={`trending-item-meta-${i}`}>
                  <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-1 text-sm" data-testid={`trending-item-title-${i}`}>
                    {title.title}
                  </h3>
                  <div
                    className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-secondary)]"
                    data-testid={`trending-item-type-year-${i}`}
                  >
                    {title.type === "movie" ? <Film size={12} /> : <Tv size={12} />}
                    <span>
                      {title.type === "movie" ? "Película" : "Serie"} · {title.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1" data-testid={`trending-item-rating-${i}`}>
                    <Star
                      size={12}
                      className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                    />
                    <span className="text-xs font-medium">{title.rating}</span>
                  </div>
                  {(() => {
                    const visible = visiblePlatformsForUser(title.platforms, slugs, 2);
                    const toShow = hasSelection ? visible : title.platforms.slice(0, 2);
                    if (toShow.length === 0) return null;
                    return (
                      <div
                        className="flex items-center gap-1 mt-1.5 flex-wrap"
                        data-testid={`trending-item-platforms-${i}`}
                      >
                        {toShow.map((p) => (
                          <PlatformBadge
                            key={p.slug + p.type}
                            platform={p}
                            size="sm"
                            highlight={hasSelection}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
