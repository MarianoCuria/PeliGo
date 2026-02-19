"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Bell,
  ExternalLink,
  Film,
  Tv,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import PosterImage from "@/components/PosterImage";
import PosterCard from "@/components/PosterCard";
import { fetchTitle, type NormalizedTitle } from "@/lib/api";

export default function TitleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [title, setTitle] = useState<NormalizedTitle | null>(null);
  const [similar, setSimilar] = useState<NormalizedTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    if (!id) return;

    // id format: "m-12345" or "t-67890"
    const isMovie = id.startsWith("m-");
    const tmdbId = Number(id.replace(/^[mt]-/, ""));
    const type = isMovie ? "movie" : "series";

    if (isNaN(tmdbId)) {
      queueMicrotask(() => {
        setError("ID inválido");
        setLoading(false);
      });
      return;
    }

    setLoading(true);
    fetchTitle(tmdbId, type as "movie" | "series")
      .then((data) => {
        setTitle(data.title);
        setSimilar(data.similar);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Film size={48} className="text-[var(--color-text-secondary)] mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {error || "Título no encontrado"}
        </h2>
        <Link href="/" className="text-[var(--color-accent)]">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const typeLabel = title.type === "movie" ? "Película" : "Serie";

  return (
    <div className="animate-fade-in-up">
      {/* Backdrop */}
      <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
        <PosterImage
          src={title.backdropPath || title.posterPath}
          alt={title.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/60 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                isFavorite
                  ? "bg-[var(--color-accent)] scale-110"
                  : "bg-black/50 hover:bg-black/70"
              }`}
            >
              <Heart size={20} className={isFavorite ? "fill-white" : ""} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold leading-tight mb-2">
            {title.title}
          </h1>
          {title.titleOriginal && title.titleOriginal !== title.title && (
            <p className="text-sm text-[var(--color-text-secondary)] italic mb-1">
              {title.titleOriginal}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] flex-wrap">
            <span className="flex items-center gap-1">
              <Star
                size={16}
                className="text-[var(--color-warning)] fill-[var(--color-warning)]"
              />
              <span className="text-[var(--color-text-primary)] font-semibold">
                {title.rating}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {title.year}
            </span>
            <span className="flex items-center gap-1">
              {title.type === "movie" ? <Film size={14} /> : <Tv size={14} />}
              {typeLabel}
            </span>
            {title.runtime && title.runtime > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {Math.floor(title.runtime / 60)}h {title.runtime % 60}min
              </span>
            )}
            {title.seasons && (
              <span>
                {title.seasons} temporada{title.seasons > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-1">
        {/* Genres */}
        {title.genres.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {title.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-md text-xs font-medium bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Where to watch */}
        <section className="mb-6">
          <h2 className="font-[var(--font-display)] text-lg font-bold mb-3 flex items-center gap-2">
            <Tv size={20} className="text-[var(--color-accent)]" />
            Dónde verlo en Argentina
          </h2>
          {title.platforms.length > 0 ? (
            <div className="space-y-2.5">
              {title.platforms.map((platform) => (
                <div
                  key={platform.slug + platform.type}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    {platform.logo && platform.logo.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className="w-10 h-10 rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center font-bold text-sm">
                        {platform.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {platform.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            platform.type === "stream"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : platform.type === "rent"
                              ? "bg-blue-500/15 text-blue-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {platform.type === "stream"
                            ? "Incluido"
                            : platform.type === "rent"
                            ? "Alquiler"
                            : "Compra"}
                        </span>
                        {platform.price && (
                          <span className="font-medium">{platform.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Oculto por ahora; quitar "hidden" cuando enlacemos a cada plataforma */}
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors shadow-[0_4px_20px_rgba(230,57,70,0.25)]"
                  >
                    Ver
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-center">
              <Tv size={32} className="mx-auto text-[var(--color-text-secondary)] mb-2" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                No encontramos disponibilidad en plataformas de Argentina para este título.
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Puede estar disponible para alquiler o compra digital.
              </p>
            </div>
          )}
        </section>

        {/* Alert CTA */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--color-secondary)]/40 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors mb-6">
          <Bell size={18} />
          <span className="text-sm font-semibold">
            Avisame cuando esté en otra plataforma
          </span>
        </button>

        {/* Synopsis */}
        {title.overview && (
          <section className="mb-6">
            <h2 className="font-[var(--font-display)] text-lg font-bold mb-2">
              Sinopsis
            </h2>
            <p
              className={`text-sm text-[var(--color-text-secondary)] leading-relaxed ${
                !showFullOverview ? "line-clamp-3" : ""
              }`}
            >
              {title.overview}
            </p>
            {title.overview.length > 200 && (
              <button
                onClick={() => setShowFullOverview(!showFullOverview)}
                className="flex items-center gap-1 text-sm text-[var(--color-accent)] mt-1 font-medium"
              >
                {showFullOverview ? "Ver menos" : "Leer más"}
                {showFullOverview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </section>
        )}

        {/* Info */}
        {(title.director || title.cast.length > 0) && (
          <section className="mb-6">
            <h2 className="font-[var(--font-display)] text-lg font-bold mb-2">
              Info
            </h2>
            <div className="space-y-2 text-sm">
              {title.director && (
                <div className="flex gap-2">
                  <span className="text-[var(--color-text-secondary)] w-20 shrink-0">
                    Director
                  </span>
                  <span className="text-[var(--color-text-primary)]">
                    {title.director}
                  </span>
                </div>
              )}
              {title.cast.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-[var(--color-text-secondary)] w-20 shrink-0">
                    Reparto
                  </span>
                  <span className="text-[var(--color-text-primary)]">
                    {title.cast.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mb-8">
            <h2 className="font-[var(--font-display)] text-lg font-bold mb-3">
              Similares
            </h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {similar.map((t) => (
                <PosterCard key={t.id} title={t} showPlatforms={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
