import { chromium, type FullConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { KEYS } from "../helpers";

const APP_PORT = Number(process.env.E2E_APP_PORT || 3100);
const APP_URL = `http://127.0.0.1:${APP_PORT}`;

/** storageState files produced by this setup, relative to the repo root. */
export const STORAGE = {
  netflixUser: "e2e/storage/netflix-user.json",
} as const;

/**
 * Seeds a reusable signed-in-like state: a user that picked Netflix as their
 * platform. Playwright restores this `localStorage` at context creation, so
 * specs can opt in with `test.use({ storageState: STORAGE.netflixUser })`
 * instead of seeding platforms by hand.
 *
 * Runs after the webServers (app + mock TMDB) are already up.
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  fs.mkdirSync(path.dirname(STORAGE.netflixUser), { recursive: true });

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(APP_URL);
    await page.evaluate(
      ({ platformsKey }) => {
        localStorage.setItem(platformsKey, JSON.stringify(["netflix"]));
      },
      { platformsKey: KEYS.platforms }
    );
    await context.storageState({ path: STORAGE.netflixUser });
  } finally {
    await browser.close();
  }
}
