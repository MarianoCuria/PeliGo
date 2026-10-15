import { getTrending, getNowPlaying } from "@/lib/tmdb";
import HomeClient from "./HomeClient";
import { toPublicError } from "@/lib/errors";

export default async function HomePage() {
  let trending: Awaited<ReturnType<typeof getTrending>> = [];
  let nowPlaying: Awaited<ReturnType<typeof getNowPlaying>> = [];
  let error = "";

  try {
    const [trendingData, nowPlayingData] = await Promise.all([
      getTrending("all", "day"),
      getNowPlaying(),
    ]);
    trending = trendingData;
    nowPlaying = nowPlayingData;
  } catch (e) {
    // At runtime, rethrow so ISR keeps serving the last good page instead of
    // caching an error for an hour (falls back to app/error.tsx if there is none).
    // At build time, render the error banner so a TMDB hiccup can't break a deploy.
    if (process.env.NEXT_PHASE !== "phase-production-build") throw e;
    error = toPublicError(e, "home").message;
  }

  return (
    <HomeClient
      initialTrending={trending}
      initialNowPlaying={nowPlaying}
      initialError={error || undefined}
    />
  );
}
