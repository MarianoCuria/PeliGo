"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import PosterCard from "@/components/PosterCard";
import { getList, subscribeLists, type ListName } from "@/lib/lists";
import type { NormalizedTitle } from "@/lib/api";

const TABS: { list: ListName; label: string; emptyHint: string }[] = [
  { list: "favorites", label: "Favoritos", emptyHint: "Tocá el corazón en una película o serie para guardarla acá" },
  { list: "watchlist", label: "Por ver", emptyHint: "Marcá \"Por ver\" en lo que quieras ver más adelante" },
  { list: "watched", label: "Vistos", emptyHint: "Marcá \"Ya la vi\" en lo que ya viste" },
];

type Lists = Record<ListName, NormalizedTitle[]>;

const EMPTY_LISTS: Lists = { favorites: [], watchlist: [], watched: [] };

function readLists(): Lists {
  return {
    favorites: getList("favorites"),
    watchlist: getList("watchlist"),
    watched: getList("watched"),
  };
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [lists, setLists] = useState<Lists>(EMPTY_LISTS);

  useEffect(() => {
    const sync = () => setLists(readLists());
    queueMicrotask(sync);
    return subscribeLists(sync);
  }, []);

  const tab = TABS[activeTab];
  const titles = lists[tab.list];

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
      <div className="flex gap-1 mb-5 bg-[var(--color-bg-secondary)] rounded-xl p-1" role="tablist">
        {TABS.map((t, i) => (
          <button
            key={t.list}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            data-testid={`list-tab-${t.list}`}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === i
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t.label}
            {lists[t.list].length > 0 && ` (${lists[t.list].length})`}
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
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">{tab.emptyHint}</p>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Search size={16} />
            Ir a buscar
          </Link>
        </div>
      )}
    </div>
  );
}
