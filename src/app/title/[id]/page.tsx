import type { Metadata } from "next";
import { getTitleDetail, getSimilar } from "@/lib/tmdb";
import TitleDetailClient from "./TitleDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://peligo.app";

function parseId(id: string): { tmdbId: number; type: "movie" | "series" } | null {
  const isMovie = id.startsWith("m-");
  const tmdbId = Number(id.replace(/^[mt]-/, ""));
  if (isNaN(tmdbId)) return null;
  return { tmdbId, type: isMovie ? "movie" : "series" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const parsed = parseId(id);
  if (!parsed) {
    return { title: "Título no encontrado" };
  }

  try {
    const title = await getTitleDetail(parsed.tmdbId, parsed.type);
    const typeLabel = title.type === "movie" ? "Película" : "Serie";
    const description =
      title.overview?.slice(0, 160) ||
      `Dónde ver ${title.title} en Argentina. ${typeLabel} ${title.year}. Encontrá en qué plataforma verla con PeliGo.`;

    return {
      title: `Dónde ver ${title.title} en Argentina`,
      description,
      openGraph: {
        title: `Dónde ver ${title.title} en Argentina | PeliGo`,
        description,
        type: "website",
        url: `${siteUrl}/title/${id}`,
        images: title.posterPath?.startsWith("http")
          ? [{ url: title.posterPath, width: 500, height: 750, alt: title.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `Dónde ver ${title.title} en Argentina`,
        description,
      },
    };
  } catch {
    return { title: "Título no encontrado" };
  }
}

export default async function TitleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseId(id);

  if (!parsed) {
    return (
      <TitleDetailClient
        id={id}
        initialTitle={null}
        initialSimilar={[]}
        initialError="ID inválido"
      />
    );
  }

  let title = null;
  let similar: Awaited<ReturnType<typeof getSimilar>> = [];
  let error = "";

  try {
    const [titleData, similarData] = await Promise.all([
      getTitleDetail(parsed.tmdbId, parsed.type),
      getSimilar(parsed.tmdbId, parsed.type),
    ]);
    title = titleData;
    similar = similarData;
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar";
  }

  const jsonLd =
    title && !error
      ? {
          "@context": "https://schema.org",
          "@type": title.type === "movie" ? "Movie" : "TVSeries",
          name: title.title,
          description: title.overview || undefined,
          image: title.posterPath?.startsWith("http") ? title.posterPath : undefined,
          datePublished: title.year || undefined,
          aggregateRating:
            title.voteCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: title.rating,
                  bestRating: 10,
                  worstRating: 0,
                  ratingCount: title.voteCount,
                }
              : undefined,
        }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TitleDetailClient
        id={id}
        initialTitle={title}
        initialSimilar={similar}
        initialError={error || undefined}
      />
    </>
  );
}
