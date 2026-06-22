import { test as base } from '@playwright/test';
import { ImageGalleryPage } from '../pages/image-gallery-page';
import { AddImageDialogBox } from '../pages/components/add-image-dialog-box';

type PageFixtures = {
    imageGalleryPage : ImageGalleryPage;
    addImageDialogBox : AddImageDialogBox;
};

export const test = base.extend<PageFixtures>({

    imageGalleryPage: async ({page}, use) => {
        const imageGalleryPage = new ImageGalleryPage(page);
        await use(imageGalleryPage)
    },

    addImageDialogBox: async ({page}, use) => {
        const addImageDialogBox = new AddImageDialogBox(page);
        await use(addImageDialogBox)
    },

});

export {expect} from '@playwright/test';