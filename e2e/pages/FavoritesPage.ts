import type { Page, Locator } from "@playwright/test";

export class FavoritesPage {
  readonly page: Page;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyState = page.getByText("Todavía no agregaste nada");
  }

  async goto(): Promise<void> {
    await this.page.goto("/favorites");
  }

  item(title: string): Locator {
    return this.page.getByText(title);
  }
}
