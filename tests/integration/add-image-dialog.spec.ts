import { expect, test } from "../fixtures/base.fixture";
import { buildMockImage, mockAddImage } from "../fixtures/api-mock";

test.describe('Submit an images', () => {

  test('Single image created when user submit the new image', { tag: ['@integration', '@addImageDialogBox'] }, async ({ page, imageGalleryPage, addImageDialogBox }) => {
    const mock = await mockAddImage(page, { initialImages: [] });
    await imageGalleryPage.navigate();
    await imageGalleryPage.openAddImageDialog();
    await addImageDialogBox.isOpened();

    await addImageDialogBox.fillTitle('New Image');
    await addImageDialogBox.fillUrl('https://example.test/new.jpg');
    await addImageDialogBox.addKeyword('mock');
    await addImageDialogBox.submit();

    await expect.poll(() => mock.getPostRequests().length).toBe(1);
    const [request] = mock.getPostRequests();
    expect(request.title).toBe('New Image');
    expect(request.image).toBe('https://example.test/new.jpg');
    expect(request.keywords).toEqual(['mock']);
  });

  test('a newly added image appears in the gallery with its keywords', { tag: ['@integration', '@addImageDialogBox'] }, async ({ page, imageGalleryPage, addImageDialogBox }) => {
    const existing = buildMockImage({ title: 'Existing' });
    const created = buildMockImage({ title: 'Brand New', keywords: ['fresh'] });
    await mockAddImage(page, {
      initialImages: [existing],
      refreshedImages: [existing, created],
    });
    await imageGalleryPage.navigate();
    await imageGalleryPage.openAddImageDialog();
    await addImageDialogBox.isOpened();

    await addImageDialogBox.fillTitle(created.title);
    await addImageDialogBox.fillUrl(created.image);
    await addImageDialogBox.addKeyword('fresh');
    await addImageDialogBox.submit();

    await imageGalleryPage.waitForPageLoad();
    await expect(imageGalleryPage.imageCard('Brand New')).toBeVisible();
    await expect(imageGalleryPage.imageCard('Brand New')).toContainText('keywords: fresh');
  });

  test('user is shown an error when the server rejects a submitted image', { tag: ['@integration', '@addImageDialogBox'] }, async ({ page, imageGalleryPage, addImageDialogBox }) => {
    const existing = buildMockImage({ title: 'Existing' });
    await mockAddImage(page, { initialImages: [existing], postStatus: 400 });
    await imageGalleryPage.navigate();
    await imageGalleryPage.openAddImageDialog();
    await addImageDialogBox.isOpened();

    await addImageDialogBox.fillTitle('Rejected Image');
    await addImageDialogBox.fillUrl('https://example.test/rejected.jpg');
    await addImageDialogBox.addKeyword('mock');
    await addImageDialogBox.submit();

    await imageGalleryPage.waitForPageLoad();
    await expect(page.getByText(/error/i)).toBeVisible();
    await expect(imageGalleryPage.imageCard('Rejected Image')).not.toBeVisible();
    await expect(imageGalleryPage.imageCard('Existing')).toBeVisible();
  });

});
