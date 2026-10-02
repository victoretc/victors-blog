import { Fixtures } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ContextPagesFixture } from './context-pages';

export type PlaywrightPagesFixture = {
  homePage: HomePage;
};

export const playwrightPagesFixture: Fixtures<PlaywrightPagesFixture, ContextPagesFixture> = {
  homePage: async ({ contextPage }, use) => {
    const homePage = new HomePage(contextPage);

    await use(homePage);
  },
};
