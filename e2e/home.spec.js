import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero section', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Where Every Connection is a Lifesaver/i })
    ).toBeVisible();

    await expect(page.locator('img[src="/images/blood-hero.png"]')).toBeVisible();
  });

  test('has no broken images on the landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src)
    );

    expect(brokenImages).toEqual([]);
  });
});
