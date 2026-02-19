import { NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const mediaType = (req.nextUrl.searchParams.get("type") || "all") as "all" | "movie" | "tv";
  const timeWindow = (req.nextUrl.searchParams.get("period") || "day") as "day" | "week";

  try {
    const data = await getTrending(mediaType, timeWindow);
    return NextResponse.json({ results: data });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
