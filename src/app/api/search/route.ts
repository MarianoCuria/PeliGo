import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const page = req.nextUrl.searchParams.get("page") || "1";

  if (!q.trim()) {
    return NextResponse.json({ results: [], totalResults: 0, totalPages: 0 });
  }

  try {
    const data = await searchMulti(q, Number(page));
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
