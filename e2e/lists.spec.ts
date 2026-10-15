import { test, expect } from "./fixtures/test";
import { TITLES } from "./helpers";

test.describe("Mi lista — Por ver / Vistos", () => {
  test("adds a title to 'Por ver' and lists it under that tab", async ({ title, favorites }) => {
    await title.goto(TITLES.netflix.id);
    await title.watchlistToggle.click();
    await expect(title.watchlistToggle).toHaveAttribute("aria-pressed", "true");

    await favorites.goto();
    await favorites.tab("watchlist").click();
    await expect(favorites.item(TITLES.netflix.title)).toBeVisible();

    await favorites.tab("favorites").click();
    await expect(favorites.emptyState).toBeVisible();
  });

  test("marking as watched moves the title out of 'Por ver'", async ({ title, favorites }) => {
    await title.goto(TITLES.netflix.id);
    await title.watchlistToggle.click();
    await title.watchedToggle.click();

    await expect(title.watchedToggle).toHaveAttribute("aria-pressed", "true");
    await expect(title.watchlistToggle).toHaveAttribute("aria-pressed", "false");

    await favorites.goto();
    await favorites.tab("watched").click();
    await expect(favorites.item(TITLES.netflix.title)).toBeVisible();

    await favorites.tab("watchlist").click();
    await expect(favorites.emptyState).toBeVisible();
  });
});
