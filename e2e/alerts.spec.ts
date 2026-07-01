import { test, expect, STORAGE } from "./fixtures/test";
import { KEYS, TITLES, seedStorage, readStorage, type SeedAlert } from "./helpers";

test.describe("Feature 002 — PWA alerts", () => {
  test("without platforms, the detail page invites you to set them up", async ({
    title,
  }) => {
    await title.goto(TITLES.mubi.id);
    await expect(title.configurePlatformsPrompt).toBeVisible();
  });

  test("the home bell navigates to /alerts", async ({ home, alerts, page }) => {
    await home.goto();
    await home.openAlerts();
    await expect(page).toHaveURL(/\/alerts$/);
    await expect(alerts.heading).toBeVisible();
  });

  test.describe("with a user who picked Netflix", () => {
    test.use({ storageState: STORAGE.netflixUser });

    test("cannot create an alert when it is already on your platforms", async ({
      title,
    }) => {
      await title.goto(TITLES.netflix.id);
      await expect(title.alreadyAvailable).toBeVisible();
    });

    test("creates an alert from the detail page and lists it in /alerts", async ({
      title,
      alerts,
      page,
    }) => {
      await title.goto(TITLES.mubi.id);
      await title.createAlert();
      await expect(title.alertActive).toBeVisible();

      await expect
        .poll(async () => {
          const stored = await readStorage<SeedAlert[]>(page, KEYS.alerts);
          return stored?.length ?? 0;
        })
        .toBe(1);

      await alerts.goto();
      await expect(alerts.alertCard(TITLES.mubi.title)).toBeVisible();
      await expect(alerts.status("Esperando")).toBeVisible();
    });

    test("deletes an alert from /alerts", async ({ alerts, page }) => {
      await seedStorage(page, {
        alerts: [
          {
            id: "alert-m-1002",
            titleId: TITLES.mubi.id,
            tmdbId: TITLES.mubi.tmdbId,
            type: "movie",
            title: TITLES.mubi.title,
          },
        ],
      });

      await alerts.goto();
      await expect(alerts.alertCard(TITLES.mubi.title)).toBeVisible();

      await alerts.deleteFirst();

      await expect(alerts.emptyState).toBeVisible();
    });

    test("enforces the cap of 3 active alerts", async ({ title, page }) => {
      const seeded: SeedAlert[] = [1, 2, 3].map((n) => ({
        id: `alert-m-900${n}`,
        titleId: `m-900${n}`,
        tmdbId: 9000 + n,
        type: "movie",
        title: `Alert ${n}`,
      }));

      await seedStorage(page, { alerts: seeded });
      await title.goto(TITLES.mubi.id);

      await expect(title.limitReached).toBeVisible();
    });

    test("triggers the alert when the title reaches my platforms", async ({
      alerts,
      page,
    }) => {
      // Alert created while the title was NOT on the user's platforms.
      // On load, the checker re-fetches and detects it's now on Netflix.
      await seedStorage(page, {
        alerts: [
          {
            id: "alert-m-1001",
            titleId: TITLES.netflix.id,
            tmdbId: TITLES.netflix.tmdbId,
            type: "movie",
            title: TITLES.netflix.title,
            status: "active",
            lastHadMatchOnUserPlatforms: false,
          },
        ],
      });

      await alerts.goto();

      await expect(alerts.recentEvents).toBeVisible();
      await expect(alerts.status(/Ya está en Netflix/)).toBeVisible();
    });
  });
});
