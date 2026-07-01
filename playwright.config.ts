import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config for the PeliGo PWA.
 *
 * The app fetches TMDB data server-side, so we can't intercept those requests
 * from the browser. Instead we boot a local mock TMDB server and point the
 * app at it via TMDB_BASE_URL. This keeps the suite deterministic and
 * runnable in CI without a real TMDB_API_KEY or the real TMDB rate limits.
 */

const APP_PORT = Number(process.env.E2E_APP_PORT || 3100);
const MOCK_PORT = Number(process.env.E2E_MOCK_PORT || 8790);
const APP_URL = `http://127.0.0.1:${APP_PORT}`;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/setup/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: APP_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node e2e/mocks/tmdb-server.mjs",
      url: `${MOCK_URL}/health`,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        E2E_MOCK_PORT: String(MOCK_PORT),
      },
    },
    {
      command: `npm run dev -- --port ${APP_PORT}`,
      url: APP_URL,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        TMDB_API_KEY: "e2e-test-key",
        TMDB_BASE_URL: `${MOCK_URL}/3`,
        NEXT_PUBLIC_SITE_URL: APP_URL,
      },
    },
  ],
});
