"use client";

import { useState } from "react";
import { Heart, Search } from "lucide-react";
import PosterCard from "@/components/PosterCard";
import { MOCK_TITLES } from "@/lib/mock-data";

const TABS = ["Favoritos", "Por ver", "Vistos"];

const mockFavorites = MOCK_TITLES.slice(0, 4);
const mockWatchlist = MOCK_TITLES.slice(4, 7);
const mockWatched = MOCK_TITLES.slice(7, 10);

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const titles = activeTab === 0 ? mockFavorites : activeTab === 1 ? mockWatchlist : mockWatched;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Heart size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold">
          Mi lista
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[var(--color-bg-secondary)] rounded-xl p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === i
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {titles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {titles.map((t) => (
            <div key={t.id} className="flex justify-center">
              <PosterCard title={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-4">
            <Heart size={32} className="text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Todavía no agregaste nada</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Buscá algo que te guste y agregalo a tu lista
          </p>
          <a
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Search size={16} />
            Ir a buscar
          </a>
        </div>
      )}
    </div>
  );
}
