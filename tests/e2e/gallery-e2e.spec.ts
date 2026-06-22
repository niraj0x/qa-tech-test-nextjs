import { expect, test } from "../fixtures/base.fixture";
import { envConfig } from "../config/config";

test.describe('Gallery e2e workflows', () => {

  test.beforeEach('Visit home page', async ({ imageGalleryPage }) => {
    await imageGalleryPage.navigate();
  }); 

  test.afterAll('Test data teardown', async ({ request }) => {
    const response = await request.get(`${envConfig.baseUrl}api/images`);
    const images: { id: string; title: string }[] = await response.json();

    const created = images.filter((image) => image.title === envConfig.newImage.title);
    for (const image of created) {
      await request.delete(`${envConfig.baseUrl}api/images?id=${image.id}`);
    }
  });

  test('image gallery loads list of the images', { tag: '@e2e' }, async ({ imageGalleryPage }) => {
    await expect(imageGalleryPage.imageCards).not.toHaveCount(0);
    const card = imageGalleryPage.imageCard(envConfig.title);
    await expect(card).toContainText(`keywords: ${envConfig.keywords}`);
  });

  test('add new image to the gallery', { tag: '@e2e' }, async ({ imageGalleryPage, addImageDialogBox }) => {
    await imageGalleryPage.openAddImageDialog();
    await addImageDialogBox.isOpened();

    await addImageDialogBox.fillTitle(envConfig.newImage.title);
    await addImageDialogBox.fillUrl(envConfig.newImage.url);
    await addImageDialogBox.addKeyword(envConfig.newImage.keyword);
    await addImageDialogBox.submit();

    await imageGalleryPage.waitForPageLoad();
    await expect(imageGalleryPage.imageCard(envConfig.newImage.title)).toBeVisible();
    await expect(imageGalleryPage.imageCard(envConfig.newImage.title))
      .toContainText(`keywords: ${envConfig.newImage.keyword}`);
  });

  test('filters images by combination of filters upload date, title, keywords', { tag: '@e2e' }, async ({ imageGalleryPage }) => {

    await imageGalleryPage.searchFor(envConfig.title);
    await imageGalleryPage.setStartDate(envConfig.filterStartDate);
    await imageGalleryPage.setEndDate(envConfig.filterEndDate);
    await imageGalleryPage.selectKeywordFilter(envConfig.keyword);

    await expect(imageGalleryPage.imageCards).toHaveCount(1);
    await expect(imageGalleryPage.imageCard(envConfig.title)).toBeVisible();
  });

});
