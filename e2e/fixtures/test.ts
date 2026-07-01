import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { TitlePage } from "../pages/TitlePage";
import { AlertsPage } from "../pages/AlertsPage";
import { SearchPage } from "../pages/SearchPage";
import { FavoritesPage } from "../pages/FavoritesPage";

type Fixtures = {
  home: HomePage;
  profile: ProfilePage;
  title: TitlePage;
  alerts: AlertsPage;
  search: SearchPage;
  favorites: FavoritesPage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  profile: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  title: async ({ page }, use) => {
    await use(new TitlePage(page));
  },
  alerts: async ({ page }, use) => {
    await use(new AlertsPage(page));
  },
  search: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  favorites: async ({ page }, use) => {
    await use(new FavoritesPage(page));
  },
});

export { expect };
export { STORAGE } from "../setup/global-setup";
