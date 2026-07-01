import { test, expect, STORAGE } from "./fixtures/test";
import { KEYS, TITLES, readStorage } from "./helpers";

test.describe("Feature 001 — My platforms", () => {
  test("saves the platform selection and persists across reloads", async ({
    profile,
    page,
  }) => {
    await profile.goto();
    await profile.togglePlatform(/Netflix/);

    await expect
      .poll(() => readStorage<string[]>(page, KEYS.platforms))
      .toContain("netflix");

    await page.reload();

    expect(await readStorage<string[]>(page, KEYS.platforms)).toContain(
      "netflix"
    );
  });

  test.describe("with a user who picked Netflix", () => {
    test.use({ storageState: STORAGE.netflixUser });

    test("home shows the personalized section", async ({ home }) => {
      await home.goto();
      await expect(home.trendingTitle).toHaveText("Para vos en tus plataformas");
    });

    test("home filters out titles outside my platforms", async ({ home }) => {
      await home.goto();
      await expect(home.trendingItem(TITLES.netflix.title)).toBeVisible();
      await expect(home.trendingItem(TITLES.mubi.title)).toHaveCount(0);
      await expect(home.trendingItem(TITLES.disney.title)).toHaveCount(0);
    });

    test("the detail page groups availability under 'En tus plataformas'", async ({
      title,
    }) => {
      await title.goto(TITLES.netflix.id);
      await expect(title.mineHeading).toBeVisible();
    });

    test("the detail page warns when the title is not on my platforms", async ({
      title,
    }) => {
      await title.goto(TITLES.mubi.id);
      await expect(title.notInPlatforms).toBeVisible();
    });
  });
});
