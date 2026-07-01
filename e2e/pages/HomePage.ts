import type { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly trendingTitle: Locator;
  readonly trendingList: Locator;
  readonly nowPlayingList: Locator;
  readonly bell: Locator;
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.trendingTitle = page.getByTestId("home-trending-title");
    this.trendingList = page.getByTestId("home-trending-list");
    this.nowPlayingList = page.getByTestId("home-now-playing-list");
    this.bell = page.getByTestId("home-notifications-button");
    this.searchInput = page.getByPlaceholder(/Qué querés ver/);
    this.searchSubmit = page.getByRole("button", { name: "Buscar" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  trendingItem(title: string): Locator {
    return this.trendingList.getByText(title);
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
  }

  async openAlerts(): Promise<void> {
    await this.bell.click();
  }
}
