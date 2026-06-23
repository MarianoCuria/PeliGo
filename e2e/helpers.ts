import type { Page } from "@playwright/test";

/** localStorage keys used by the app (features 001 + 002). */
export const KEYS = {
  platforms: "peligo_user_platforms",
  alerts: "peligo_alerts",
  events: "peligo_alert_events",
} as const;

/** Catalog ids served by the mock TMDB server (see e2e/mocks/tmdb-server.mjs). */
export const TITLES = {
  netflix: { id: "m-1001", tmdbId: 1001, type: "movie", title: "Pelicula Netflix" },
  mubi: { id: "m-1002", tmdbId: 1002, type: "movie", title: "Pelicula Mubi" },
  disney: { id: "t-2001", tmdbId: 2001, type: "series", title: "Serie Disney" },
} as const;

export type SeedAlert = {
  id: string;
  titleId: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  posterPath?: string;
  status?: "active" | "triggered";
  lastHadMatchOnUserPlatforms?: boolean;
};

type SeedOptions = {
  platforms?: string[];
  alerts?: SeedAlert[];
};

/**
 * Seeds localStorage before any page script runs, so both SSR hydration and
 * client effects observe the same state. Must be called before `page.goto`.
 */
export async function seedStorage(page: Page, opts: SeedOptions): Promise<void> {
  const payload = {
    keys: KEYS,
    platforms: opts.platforms ?? null,
    alerts: (opts.alerts ?? null)?.map((a) => ({
      posterPath: "",
      status: "active" as const,
      lastHadMatchOnUserPlatforms: false,
      createdAt: Date.now(),
      ...a,
    })),
  };

  await page.addInitScript((data) => {
    if (data.platforms) {
      localStorage.setItem(data.keys.platforms, JSON.stringify(data.platforms));
    }
    if (data.alerts) {
      localStorage.setItem(data.keys.alerts, JSON.stringify(data.alerts));
    }
  }, payload);
}

export async function readStorage<T = unknown>(
  page: Page,
  key: string
): Promise<T | null> {
  return page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as unknown) : null;
  }, key);
}
