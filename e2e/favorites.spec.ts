import { test, expect } from "./fixtures/test";
import { TITLES } from "./helpers";

test.describe("Favorites", () => {
  test("shows the empty state with no favorites", async ({ favorites }) => {
    await favorites.goto();
    await expect(favorites.emptyState).toBeVisible();
  });

  test("adds a favorite from the detail page and it shows up in /favorites", async ({
    title,
    favorites,
  }) => {
    await title.goto(TITLES.netflix.id);
    await title.toggleFavorite();
    await expect(title.favoriteToggle).toHaveAttribute("aria-pressed", "true");

    await favorites.goto();
    await expect(favorites.item(TITLES.netflix.title)).toBeVisible();
  });

  test("removes a favorite and returns to the empty state", async ({
    title,
    favorites,
  }) => {
    await title.goto(TITLES.netflix.id);
    await title.toggleFavorite();
    await expect(title.favoriteToggle).toHaveAttribute("aria-pressed", "true");

    await title.toggleFavorite();
    await expect(title.favoriteToggle).toHaveAttribute("aria-pressed", "false");

    await favorites.goto();
    await expect(favorites.emptyState).toBeVisible();
  });
});
