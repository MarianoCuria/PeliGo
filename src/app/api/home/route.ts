import { NextResponse } from "next/server";
import { getTrending, getNowPlaying } from "@/lib/tmdb";

export async function GET() {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "TU_API_KEY_ACA") {
    const hint = process.env.VERCEL
      ? "En Vercel: Settings → Environment Variables → TMDB_API_KEY"
      : "En local: agregala en .env.local y reiniciá el servidor";
    return NextResponse.json(
      { error: `TMDB_API_KEY no configurada. ${hint}` },
      { status: 503 }
    );
  }
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
