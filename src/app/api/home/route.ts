import { NextResponse } from "next/server";
import { getTrending, getNowPlaying } from "@/lib/tmdb";

export async function GET() {
  try {
    const [trending, nowPlaying] = await Promise.all([
      getTrending("all", "day"),
      getNowPlaying(),
    ]);
    return NextResponse.json({ trending, nowPlaying });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
