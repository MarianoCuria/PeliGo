import type { Page, Locator } from "@playwright/test";

export class SearchPage {
  readonly page: Page;
  readonly results: Locator;
  readonly noResults: Locator;
  readonly loadMore: Locator;

  constructor(page: Page) {
    this.page = page;
    this.results = page.getByTestId("search-result-card");
    this.noResults = page.getByText("No encontramos eso");
    this.loadMore = page.getByTestId("search-load-more");
  }

  async goto(query: string): Promise<void> {
    await this.page.goto(`/search?q=${encodeURIComponent(query)}`);
  }

  resultByTitle(title: string): Locator {
    return this.results.filter({ hasText: title });
  }
}
