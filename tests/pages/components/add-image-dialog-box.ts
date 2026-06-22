import { Locator, Page } from "@playwright/test";

class AddImageDialogBox {

  constructor(private readonly page: Page) {}

  private get addImageDialogHeading(): Locator {
    return this.page.getByRole("heading", { name: 'Submit an Image' });
  }

  private get titleTextBox(): Locator {
    return this.page.getByRole('textbox', { name: 'Title' });
  }

  private get urlTextBox(): Locator {
    return this.page.getByRole('textbox', { name: 'Url' });
  }

  private get keywordsTextBox(): Locator {
    return this.page.getByRole('textbox', { name: 'Keywords' });
  }

  private get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  async isOpened(): Promise<void> {
    await this.addImageDialogHeading.waitFor({ state: 'visible' });
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleTextBox.fill(title);
  }

  async fillUrl(url: string): Promise<void> {
    await this.urlTextBox.fill(url);
  }

  async addKeyword(keyword: string): Promise<void> {
    await this.keywordsTextBox.fill(keyword);
    await this.keywordsTextBox.press('Enter');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

}

export { AddImageDialogBox }
