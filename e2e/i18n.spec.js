import { test, expect } from '@playwright/test';

test.describe('Arabic + RTL', () => {
  test('defaults to English, left to right', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('switching to Arabic flips direction and translates the chrome', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to Arabic' }).click();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');

    // nav "Requests" is now Arabic
    await expect(page.getByRole('link', { name: 'الطلبات' }).first()).toBeVisible();
  });

  test('remembers the language across a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to Arabic' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });
});
