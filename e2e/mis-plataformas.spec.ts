import { test, expect } from "@playwright/test";
import { KEYS, TITLES, seedStorage, readStorage } from "./helpers";

test.describe("Feature 001 — Mis plataformas", () => {
  test("guarda la selección de plataformas y persiste tras recargar", async ({
    page,
  }) => {
    await page.goto("/profile");

    await page.getByRole("button", { name: /Netflix/ }).click();

    await expect
      .poll(() => readStorage<string[]>(page, KEYS.platforms))
      .toContain("netflix");

    await page.reload();

    expect(await readStorage<string[]>(page, KEYS.platforms)).toContain(
      "netflix"
    );
  });

  test("home muestra la sección personalizada cuando hay plataformas", async ({
    page,
  }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto("/");

    await expect(page.getByTestId("home-trending-title")).toHaveText(
      "Para vos en tus plataformas"
    );
  });

  test("home filtra títulos fuera de mis plataformas", async ({ page }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto("/");

    const trending = page.getByTestId("home-trending-list");
    await expect(trending.getByText(TITLES.netflix.title)).toBeVisible();
    await expect(trending.getByText(TITLES.mubi.title)).toHaveCount(0);
    await expect(trending.getByText(TITLES.disney.title)).toHaveCount(0);
  });

  test("la ficha agrupa la disponibilidad en 'En tus plataformas'", async ({
    page,
  }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto(`/title/${TITLES.netflix.id}`);

    await expect(
      page.getByRole("heading", { name: "En tus plataformas" })
    ).toBeVisible();
  });

  test("la ficha avisa cuando el título no está en mis plataformas", async ({
    page,
  }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto(`/title/${TITLES.mubi.id}`);

    await expect(
      page.getByText(/No está en tus plataformas/)
    ).toBeVisible();
  });
});
