import test, { Page, expect} from '@playwright/test';
import { PageScreenshotOptions } from '@playwright/test';
import { LoginForm } from '../components/login-form';

export class BasePage {
  readonly loginForm: LoginForm

  constructor(public page: Page) {
    this.loginForm = new LoginForm(page)
  }

  async visit(url: string): Promise<void> {
    await test.step(`Opening the url "${url}"`, async () => {
      await this.page.goto(url, { waitUntil: 'networkidle' });
    });
  }

  async reload(): Promise<void> {
    const currentUrl = this.page.url();

    await test.step(`Reloading page with url "${currentUrl}"`, async () => {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    });
  }

  async toHaveScreenshot(name: string, options?: PageScreenshotOptions): Promise<void> {
    await test.step(`Checking screenshot match for "${name}"`, async () => {
      await expect(this.page).toHaveScreenshot(name, options);
    });
  }
}

