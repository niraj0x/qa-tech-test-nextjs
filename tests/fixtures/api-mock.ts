import { Page } from "@playwright/test";

export interface MockImage {
  id: string;
  title: string;
  image: string;
  keywords: string[];
  uploadDate: Date;
}

let mockIdCounter = 0;

export function buildMockImage(overrides: Partial<MockImage> = {}): MockImage {
  mockIdCounter += 1;
  return {
    id: `mock-id-${mockIdCounter}`,
    title: `Mock Image ${mockIdCounter}`,
    image: `https://example.test/mock-${mockIdCounter}.jpg`,
    keywords: ["mock"],
    uploadDate: new Date("2024-01-01"),
    ...overrides,
  };
}

export async function mockImagesGet(page: Page, images: MockImage[]): Promise<void> {
  await page.route('**/api/images', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(images),
    });
  });
}

export interface AddImageMockOptions {
  initialImages: MockImage[];
  postStatus?: number;
  refreshedImages?: MockImage[];
}

export async function mockAddImage(page: Page, options: AddImageMockOptions) {
  const postRequests: Record<string, unknown>[] = [];
  let imagesToServe = options.initialImages;

  await page.route('**/api/images', async (route) => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(imagesToServe),
      });
      return;
    }

    if (method === 'POST') {
      const body = route.request().postDataJSON();
      postRequests.push(body);
      if (options.refreshedImages) {
        imagesToServe = options.refreshedImages;
      }
      await route.fulfill({
        status: options.postStatus ?? 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mock-new-id', ...body }),
      });
      return;
    }

    await route.continue();
  });

  return { getPostRequests: () => postRequests };
}
