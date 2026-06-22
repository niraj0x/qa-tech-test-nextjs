import { expect, test } from "../fixtures/base.fixture";
import { buildMockImage, mockImagesGet } from "../fixtures/api-mock";

test('selecting one keyword narrows the image list correctly', { tag: ['@integration', '@filterImages'] }, async ({ page, imageGalleryPage }) => {
  const images = [
    buildMockImage({ title: 'Red Image', keywords: ['red'] }),
    buildMockImage({ title: 'Blue Image', keywords: ['blue'] }),
  ];
  await mockImagesGet(page, images);
  await imageGalleryPage.navigate();

  await imageGalleryPage.selectKeywordFilter('red');

  await expect(imageGalleryPage.imageCard('Red Image')).toBeVisible();
  await expect(imageGalleryPage.imageCard('Blue Image')).toBeHidden();
});

test('clearing a date field removes that bound', { tag: ['@integration', '@filterImages'] }, async ({ page, imageGalleryPage }) => {
  await mockImagesGet(page, [buildMockImage({ title: 'Old', uploadDate: new Date('2020-01-01') })]);
  await imageGalleryPage.navigate();

  await imageGalleryPage.setStartDate('01/01/2023');
  await expect(imageGalleryPage.imageCard('Old')).toBeHidden();

  await imageGalleryPage.clearStartDate();
  await expect(imageGalleryPage.imageCard('Old')).toBeVisible();
});
test('clearing the search box restores the list, respecting other active filters', { tag: ['@integration', '@filterImages'] }, async ({ page, imageGalleryPage }) => {
  const images = [
    buildMockImage({ title: 'Forest', keywords: ['green'] }),
    buildMockImage({ title: 'Desert', keywords: ['sand'] }),
  ];
  await mockImagesGet(page, images);
  await imageGalleryPage.navigate();

  await imageGalleryPage.selectKeywordFilter('green');
  await imageGalleryPage.searchFor('Desert');
  await expect(imageGalleryPage.imageCards).toHaveCount(0);

  await imageGalleryPage.searchFor('');
  await expect(imageGalleryPage.imageCard('Forest')).toBeVisible();
  await expect(imageGalleryPage.imageCard('Desert')).toBeHidden();
});