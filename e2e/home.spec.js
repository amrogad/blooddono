import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero section', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Someone near you\s*needs blood today/i }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: /I can give blood/i })).toBeVisible();
  });

  test('has no broken images on the landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src),
    );

    expect(brokenImages).toEqual([]);
  });
});
