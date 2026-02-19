import { NextRequest, NextResponse } from "next/server";
import { getTitleDetail, getSimilar } from "@/lib/tmdb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const mediaType = type === "movie" ? "movie" : "series";
  const tmdbId = Number(id);

  if (isNaN(tmdbId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const [title, similar] = await Promise.all([
      getTitleDetail(tmdbId, mediaType),
      getSimilar(tmdbId, mediaType),
    ]);
    return NextResponse.json({ title, similar });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
