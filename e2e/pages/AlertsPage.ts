import type { Page, Locator } from "@playwright/test";

export class AlertsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyState: Locator;
  readonly recentEvents: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Mis alertas", level: 1 });
    this.emptyState = page.getByText("No tenés alertas activas");
    this.recentEvents = page.getByText("Avisos recientes");
    this.deleteButton = page.getByRole("button", { name: "Eliminar alerta" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/alerts");
  }

  alertCard(title: string): Locator {
    return this.page.getByText(title);
  }

  status(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  async deleteFirst(): Promise<void> {
    await this.deleteButton.first().click();
  }
}
