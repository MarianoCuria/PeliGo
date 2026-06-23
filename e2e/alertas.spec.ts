import { test, expect } from "@playwright/test";
import { KEYS, TITLES, seedStorage, readStorage, type SeedAlert } from "./helpers";

test.describe("Feature 002 — Alertas PWA", () => {
  test("sin plataformas, la ficha invita a configurarlas", async ({ page }) => {
    await page.goto(`/title/${TITLES.mubi.id}`);

    await expect(page.getByText(/para crear alertas/)).toBeVisible();
  });

  test("si ya está en tus plataformas no se puede crear alerta", async ({
    page,
  }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto(`/title/${TITLES.netflix.id}`);

    await expect(
      page.getByText("Ya está en tus plataformas")
    ).toBeVisible();
  });

  test("crea una alerta desde la ficha y la lista en /alerts", async ({
    page,
  }) => {
    await seedStorage(page, { platforms: ["netflix"] });
    await page.goto(`/title/${TITLES.mubi.id}`);

    await page
      .getByRole("button", { name: /Avisame cuando esté en mis plataformas/ })
      .click();

    await expect(page.getByText(/Alerta activa/)).toBeVisible();

    await expect
      .poll(async () => {
        const alerts = await readStorage<SeedAlert[]>(page, KEYS.alerts);
        return alerts?.length ?? 0;
      })
      .toBe(1);

    await page.goto("/alerts");
    await expect(page.getByText(TITLES.mubi.title)).toBeVisible();
    await expect(page.getByText("Esperando")).toBeVisible();
  });

  test("elimina una alerta desde /alerts", async ({ page }) => {
    await seedStorage(page, {
      platforms: ["netflix"],
      alerts: [
        {
          id: "alert-m-1002",
          titleId: TITLES.mubi.id,
          tmdbId: TITLES.mubi.tmdbId,
          type: "movie",
          title: TITLES.mubi.title,
        },
      ],
    });

    await page.goto("/alerts");
    await expect(page.getByText(TITLES.mubi.title)).toBeVisible();

    await page.getByRole("button", { name: "Eliminar alerta" }).click();

    await expect(page.getByText("No tenés alertas activas")).toBeVisible();
  });

  test("respeta el máximo de 3 alertas activas", async ({ page }) => {
    const alerts: SeedAlert[] = [1, 2, 3].map((n) => ({
      id: `alert-m-900${n}`,
      titleId: `m-900${n}`,
      tmdbId: 9000 + n,
      type: "movie",
      title: `Alerta ${n}`,
    }));

    await seedStorage(page, { platforms: ["netflix"], alerts });
    await page.goto(`/title/${TITLES.mubi.id}`);

    await expect(
      page.getByText(/máximo de 3 alertas activas/)
    ).toBeVisible();
  });

  test("dispara la alerta cuando el título llega a mis plataformas", async ({
    page,
  }) => {
    // Alert created while the title was NOT on the user's platforms.
    // On load, the checker re-fetches and detects it's now on Netflix.
    await seedStorage(page, {
      platforms: ["netflix"],
      alerts: [
        {
          id: "alert-m-1001",
          titleId: TITLES.netflix.id,
          tmdbId: TITLES.netflix.tmdbId,
          type: "movie",
          title: TITLES.netflix.title,
          status: "active",
          lastHadMatchOnUserPlatforms: false,
        },
      ],
    });

    await page.goto("/alerts");

    await expect(page.getByText("Avisos recientes")).toBeVisible();
    await expect(page.getByText(/Ya está en Netflix/)).toBeVisible();
  });

  test("la campana del home lleva a /alerts", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-notifications-button").click();
    await expect(page).toHaveURL(/\/alerts$/);
    await expect(
      page.getByRole("heading", { name: "Mis alertas", level: 1 })
    ).toBeVisible();
  });
});
