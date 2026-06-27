import { test, expect } from '@playwright/test';

test.describe('Lazy-loaded route navigation', () => {
  test('navigates to the search page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Search', exact: true }).click();
    await expect(page).toHaveURL(/\/search$/);
  });

  test('navigates to the donation request page', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Donation Request', exact: true })
      .click();
    await expect(page).toHaveURL(/\/blood-donation-request$/);
  });

  test('navigates to the blogs page and loads thumbnails without errors', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Blogs', exact: true }).click();
    await expect(page).toHaveURL(/\/blogs$/);
    await page.waitForLoadState('networkidle');

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(brokenImages).toEqual([]);
  });

  test('navigates to the about us page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'About Us', exact: true }).click();
    await expect(page).toHaveURL(/\/about-us$/);
  });
});
