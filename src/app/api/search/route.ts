import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";
import { toPublicError } from "@/lib/errors";

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
    const { message, status } = toPublicError(e, "api/search");
    return NextResponse.json({ error: message }, { status });
  }
}
