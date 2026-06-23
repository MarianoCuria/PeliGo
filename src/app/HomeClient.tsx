"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles, Bell } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PosterCard from "@/components/PosterCard";
import SectionHeader from "@/components/SectionHeader";
import type { NormalizedTitle } from "@/lib/api";
import { filterTitlesForUserPlatforms } from "@/lib/platform-match";
import { useUserPlatforms } from "@/lib/user-platforms";
import { useAlerts } from "@/lib/use-alerts";

const RECENT_SEARCHES_KEY = "peligo_recent";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

type HomeClientProps = {
  initialTrending: NormalizedTitle[];
  initialNowPlaying: NormalizedTitle[];
  initialError?: string;
};

export default function HomeClient({
  initialTrending,
  initialNowPlaying,
  initialError = "",
}: HomeClientProps) {
  const [trending] = useState<NormalizedTitle[]>(initialTrending);
  const [nowPlaying] = useState<NormalizedTitle[]>(initialNowPlaying);
  const [error] = useState(initialError);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { slugs, hasSelection } = useUserPlatforms();
  const { unreadCount } = useAlerts();

  const trendingForYou = useMemo(
    () => filterTitlesForUserPlatforms(trending, slugs),
    [trending, slugs]
  );

  const nowPlayingForYou = useMemo(
    () => filterTitlesForUserPlatforms(nowPlaying, slugs),
    [nowPlaying, slugs]
  );

  useEffect(() => {
    queueMicrotask(() => setRecentSearches(getRecentSearches()));
  }, []);

  return (
    <div className="px-4 pt-6" data-testid="home-page">
      <div className="flex items-center justify-between mb-6" data-testid="home-header">
        <div data-testid="home-brand">
          <h1 className="font-[var(--font-display)] text-2xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            PeliGo
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Encontrá dónde verlo
          </p>
        </div>
        <Link
          href="/alerts"
          className="relative w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-bg-tertiary)] transition-colors"
          data-testid="home-notifications-button"
        >
          <Bell size={20} className="text-[var(--color-text-primary)]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
          )}
        </Link>
      </div>

      <div className="mb-6" data-testid="home-search">
        <SearchBar />
      </div>

      {recentSearches.length > 0 && (
        <div className="mb-6" data-testid="home-recent-searches">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            Búsquedas recientes
          </p>
          <div className="flex gap-2 flex-wrap" data-testid="home-recent-searches-list">
            {recentSearches.slice(0, 5).map((s, index) => (
              <a
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border)]"
                data-testid={`home-recent-search-${index}`}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-6 p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm"
          data-testid="home-error-banner"
        >
          <p className="text-[var(--color-error)] font-medium mb-1">Error al cargar datos</p>
          <p className="text-[var(--color-text-secondary)] text-xs">{error}</p>
          <p className="text-[var(--color-text-secondary)] text-xs mt-2">
            Local: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">.env.local</code>. Vercel: Settings → Environment Variables.
          </p>
        </div>
      )}

      <section className="mb-8" data-testid="home-trending-section">
        <SectionHeader
          icon={<Flame size={20} className="text-[var(--color-accent)]" />}
          title={hasSelection ? "Para vos en tus plataformas" : "Tendencias en Argentina"}
          href="/trending"
          testIdPrefix="home-trending"
        />
        {hasSelection && trendingForYou.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)] px-1">
            No hay tendencias en tus plataformas hoy.{" "}
            <Link href="/trending" className="text-[var(--color-accent)] font-medium">
              Ver todas
            </Link>
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2" data-testid="home-trending-list">
            {(hasSelection ? trendingForYou : trending).slice(0, 15).map((t, i) => (
              <div key={t.id} data-testid={`home-trending-item-${i}`}>
                <PosterCard title={t} rank={i + 1} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8" data-testid="home-now-playing-section">
        <SectionHeader
          icon={<Sparkles size={20} className="text-[var(--color-secondary)]" />}
          title={hasSelection ? "Nuevo en tus plataformas" : "En cines / Recién llegados"}
          testIdPrefix="home-now-playing"
        />
        {hasSelection && nowPlayingForYou.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)] px-1">
            Nada nuevo en streaming en tus plataformas por ahora.
          </p>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            data-testid="home-now-playing-list"
          >
            {(hasSelection ? nowPlayingForYou : nowPlaying).slice(0, 10).map((t, i) => (
              <div key={t.id} className="flex justify-center" data-testid={`home-now-playing-item-${i}`}>
                <PosterCard title={t} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div
        className="text-center text-xs text-[var(--color-text-secondary)] pt-8 pb-4 space-y-1"
        data-testid="home-footer"
      >
        <p>Hecho con ❤️ en Argentina</p>
        <p>All rights reserved © MarianoCuria</p>
      </div>
    </div>
  );
}
