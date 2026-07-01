import type { Page, Locator } from "@playwright/test";

export class TitlePage {
  readonly page: Page;
  readonly mineHeading: Locator;
  readonly notInPlatforms: Locator;
  readonly createAlertButton: Locator;
  readonly alertActive: Locator;
  readonly alreadyAvailable: Locator;
  readonly configurePlatformsPrompt: Locator;
  readonly limitReached: Locator;
  readonly favoriteToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mineHeading = page.getByRole("heading", { name: "En tus plataformas" });
    this.notInPlatforms = page.getByText(/No está en tus plataformas/);
    this.createAlertButton = page.getByRole("button", {
      name: /Avisame cuando esté en mis plataformas/,
    });
    this.alertActive = page.getByText(/Alerta activa/);
    this.alreadyAvailable = page.getByText("Ya está en tus plataformas");
    this.configurePlatformsPrompt = page.getByText(/para crear alertas/);
    this.limitReached = page.getByText(/máximo de 3 alertas activas/);
    this.favoriteToggle = page.getByTestId("favorite-toggle");
  }

  async goto(titleId: string): Promise<void> {
    await this.page.goto(`/title/${titleId}`);
  }

  async createAlert(): Promise<void> {
    await this.createAlertButton.click();
  }

  async toggleFavorite(): Promise<void> {
    await this.favoriteToggle.click();
  }
}
