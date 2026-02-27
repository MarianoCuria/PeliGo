"use client";

import { useEffect, useState } from "react";
import { Flame, Sparkles, Bell } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PosterCard from "@/components/PosterCard";
import SectionHeader from "@/components/SectionHeader";
import type { NormalizedTitle } from "@/lib/api";

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

  useEffect(() => {
    queueMicrotask(() => setRecentSearches(getRecentSearches()));
  }, []);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            PeliGo
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Encontrá dónde verlo
          </p>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-bg-tertiary)] transition-colors">
          <Bell size={20} className="text-[var(--color-text-primary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
        </button>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      {recentSearches.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">
            Búsquedas recientes
          </p>
          <div className="flex gap-2 flex-wrap">
            {recentSearches.slice(0, 5).map((s) => (
              <a
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border)]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm">
          <p className="text-[var(--color-error)] font-medium mb-1">Error al cargar datos</p>
          <p className="text-[var(--color-text-secondary)] text-xs">{error}</p>
          <p className="text-[var(--color-text-secondary)] text-xs mt-2">
            Local: <code className="bg-[var(--color-bg-tertiary)] px-1 rounded">.env.local</code>. Vercel: Settings → Environment Variables.
          </p>
        </div>
      )}

      <section className="mb-8">
        <SectionHeader
          icon={<Flame size={20} className="text-[var(--color-accent)]" />}
          title="Tendencias en Argentina"
          href="/trending"
        />
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {trending.slice(0, 15).map((t, i) => (
            <PosterCard key={t.id} title={t} rank={i + 1} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader
          icon={<Sparkles size={20} className="text-[var(--color-secondary)]" />}
          title="En cines / Recién llegados"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {nowPlaying.slice(0, 10).map((t) => (
            <div key={t.id} className="flex justify-center">
              <PosterCard title={t} />
            </div>
          ))}
        </div>
      </section>

      <div className="text-center text-xs text-[var(--color-text-secondary)] pt-8 pb-4 space-y-1">
        <p>Hecho con ❤️ en Argentina</p>
        <p>All rights reserved © MarianoCuria</p>
      </div>
    </div>
  );
}
