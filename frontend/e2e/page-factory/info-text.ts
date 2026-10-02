import test from '@playwright/test';
import { LocatorProps } from '../types/page-factory/component';
import { Component } from './component';

export class InfoText extends Component {
  get typeOf(): string {
    return 'info text';
  }

  async getText(locatorProps: LocatorProps = {}): Promise<string> {
    let text: string;
    await test.step(`Getting text from ${this.typeOf} with name "${this.componentName}"`, async () => {
      const locator = this.getLocator(locatorProps);
      text = await locator.innerText();
    });
    return text;
  }
}