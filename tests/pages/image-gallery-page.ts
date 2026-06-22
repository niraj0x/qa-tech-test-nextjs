import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";
import { envConfig } from "../config/config";

class ImageGalleryPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get pageUrl(): string {
    return envConfig.baseUrl;
  }

  get loadedIndicator(): Locator {
    return this.imageGalleryHeading;
  }

  get imageGalleryHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Image Gallery' });
  }

  get addImageButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Image' });
  }

  get searchTextBox(): Locator {
    return this.page.getByPlaceholder('Search');
  }

  get startDate(): Locator {
    return this.page.getByLabel('Start Date', { exact: true });
  }

  get endDate(): Locator {
    return this.page.getByLabel('End Date', { exact: true });
  }

  private dateFieldContainer(field: Locator): Locator {
    return this.page.locator('.MuiFormControl-root').filter({ has: field });
  }

  get chooseCalendarStartDate(): Locator {
    return this.dateFieldContainer(this.startDate).getByRole('button')
      .filter({ has: this.page.getByTestId('CalendarIcon') });
  }

  get chooseCalendarEndDate(): Locator {
    return this.dateFieldContainer(this.endDate).getByRole('button')
      .filter({ has: this.page.getByTestId('CalendarIcon') });
  }

  get filterComboBox(): Locator {
    return this.page.getByRole('combobox');
  }

  get filterComboList(): Locator {
    return this.page.getByRole('listbox');
  }

  keywordOption(keyword: string): Locator {
    return this.page.getByRole('option', { name: keyword, exact: true });
  }

  get imageGrid(): Locator {
    return this.page.getByRole('list');
  }

  get imageCards(): Locator {
    return this.imageGrid.getByRole('listitem');
  }

  imageCard(title: string): Locator {
    return this.imageCards
      .filter({ has: this.page.getByText(title, { exact: true }) });
  }

  async openAddImageDialog(): Promise<void> {
    await this.addImageButton.click();
  }

  async searchFor(text: string): Promise<void> {
    await this.searchTextBox.fill(text);
  }

  async setStartDate(date: string): Promise<void> {
    await this.startDate.fill(date);
  }

  async setEndDate(date: string): Promise<void> {
    await this.endDate.fill(date);
  }

  async selectKeywordFilter(keyword: string): Promise<void> {
    await this.filterComboBox.click();
    await this.filterComboList.waitFor({ state: 'visible' });
    await this.keywordOption(keyword).click();
    await this.page.keyboard.press('Escape');
  }

  async clearStartDate(): Promise<void> {
    await this.startDate.click();
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.press('Backspace');
  }

}

export { ImageGalleryPage }
