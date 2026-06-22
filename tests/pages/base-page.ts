import { Locator, Page } from "@playwright/test";

export abstract class BasePage {

  constructor(protected readonly page: Page) {}

  abstract get pageUrl(): string;
  abstract get loadedIndicator(): Locator;

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.loadedIndicator.waitFor({ state: "visible" });
  }

}
