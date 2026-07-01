import type { Page, Locator } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly alertsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertsLink = page.getByRole("link", { name: "Alertas" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/profile");
  }

  platformButton(name: string | RegExp): Locator {
    return this.page.getByRole("button", { name });
  }

  async togglePlatform(name: string | RegExp): Promise<void> {
    await this.platformButton(name).click();
  }
}
