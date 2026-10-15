import { NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";
import { toPublicError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  const typeParam = req.nextUrl.searchParams.get("type");
  const periodParam = req.nextUrl.searchParams.get("period");
  const mediaType = typeParam === "movie" || typeParam === "tv" ? typeParam : "all";
  const timeWindow = periodParam === "week" ? "week" : "day";

  try {
    const data = await getTrending(mediaType, timeWindow);
    return NextResponse.json({ results: data });
  } catch (e: unknown) {
    const { message, status } = toPublicError(e, "api/trending");
    return NextResponse.json({ error: message }, { status });
  }
}
