"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { NormalizedTitle } from "@/lib/tmdb";
import PosterImage from "./PosterImage";
import PlatformBadge from "./PlatformBadge";

/** Same as NormalizedTitle but popularity optional for mock/favorites data */
type PosterCardTitle = Omit<NormalizedTitle, "popularity"> & { popularity?: number };

export default function PosterCard({
  title,
  rank,
  showPlatforms = true,
}: {
  title: PosterCardTitle;
  rank?: number;
  showPlatforms?: boolean;
}) {
  return (
    <Link
      href={`/title/${title.id}`}
      className="group block shrink-0 animate-fade-in-up"
    >
      <div className="relative w-[140px] sm:w-[160px] overflow-hidden rounded-xl bg-[var(--color-bg-secondary)] shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.03]">
        {rank !== undefined && rank > 0 && (
          <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <span className="font-[var(--font-display)] text-sm font-bold text-white">
              {rank}
            </span>
          </div>
        )}
        <div className="aspect-[2/3] w-full overflow-hidden">
          <PosterImage
            src={title.posterPath}
            alt={title.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-2.5">
          <h3 className="text-sm font-semibold leading-tight line-clamp-1 text-[var(--color-text-primary)]">
            {title.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={12} className="text-[var(--color-warning)] fill-[var(--color-warning)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {title.rating}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">·</span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {title.year}
            </span>
          </div>
          {showPlatforms && title.platforms && title.platforms.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {title.platforms.slice(0, 2).map((p) => (
                <PlatformBadge key={p.slug + p.type} platform={p} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
