import { test, expect } from "./fixtures/test";
import { TITLES } from "./helpers";

test.describe("Search", () => {
  test("navigates from home to results and opens a detail page", async ({
    home,
    search,
    page,
  }) => {
    await home.goto();
    await home.search("movie");

    await expect(page).toHaveURL(/\/search\?q=/);
    await expect(search.results.first()).toBeVisible();

    const card = search.resultByTitle(TITLES.netflix.title);
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(new RegExp(`/title/${TITLES.netflix.id}$`));
  });

  test("filters results by the searched text", async ({ search }) => {
    await search.goto("mubi");

    await expect(search.resultByTitle(TITLES.mubi.title)).toBeVisible();
    await expect(search.resultByTitle(TITLES.netflix.title)).toHaveCount(0);
  });

  test("shows the no-results state", async ({ search }) => {
    await search.goto("zzznoresults");
    await expect(search.noResults).toBeVisible();
  });
});
