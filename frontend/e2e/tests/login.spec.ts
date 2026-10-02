import { expect } from '@playwright/test';
import { loginTest as test } from './tests';

test.beforeEach(async ({ homePage }) => {
  await homePage.visit('/signin');
});

test('login with invalid password', async ({ homePage }) => {
  await homePage.loginForm.enterUsername('alex')
  await homePage.loginForm.enterPassword('None')
  await homePage.loginForm.clickOnSubmitButton()
  await homePage.loginForm.errorMessageShouldHaveText('Ты не пройдешь!')
  await expect(homePage.page.getByTestId('error-message')).toHaveText('Ты не пройдешь!')
});
