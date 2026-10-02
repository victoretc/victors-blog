import { Page } from '@playwright/test';
import { Button } from '../page-factory/button';
import { Input } from '../page-factory/input';
import { InfoText } from '../page-factory/info-text';
import { expect } from '@playwright/test';

export class LoginForm {
  private readonly usernameInput: Input;
  private readonly passwordInput: Input;
  private readonly submitButton: Button;
  private readonly errorMessage: InfoText

  constructor(public page: Page) {
    this.usernameInput = new Input({ 
      page, 
      locator: '[data-testid="username-input"]', 
      name: 'Username Input' 
    });
    
    this.passwordInput = new Input({ 
      page, 
      locator: '[data-testid="password-input"]', 
      name: 'PasswordInput' 
    });
    
    this.submitButton = new Button({ 
      page, 
      locator: '[data-testid="submit-button"]', 
      name: 'Submit Button' 
    });

    this.errorMessage = new InfoText({
        page, 
        locator: '[data-testid="error-message"]', 
        name: 'Error Message'
    })
  }

  async navigateTo() {
    await this.page.goto('/signin');
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username, { validateValue: true });
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password)
  }

  async clickOnSubmitButton() {
    await this.submitButton.click()
  }

  async errorMessageShouldHaveText(text: string) {
    const actualText = await this.errorMessage.getText();
    await expect(actualText).toBe(text);
}
}
