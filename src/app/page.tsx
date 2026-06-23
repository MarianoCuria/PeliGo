import { getTrending, getNowPlaying } from "@/lib/tmdb";
import HomeClient from "./HomeClient";

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
    error = e instanceof Error ? e.message : "Error al cargar datos";
  }

  return (
    <HomeClient
      initialTrending={trending}
      initialNowPlaying={nowPlaying}
      initialError={error || undefined}
    />
  );
}
