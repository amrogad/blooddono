import { test, expect } from '@playwright/test';

test.describe('Redux auth flow', () => {
  test('demo user is logged in by default and can access the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('BloodDono Dashboard')).toBeVisible();
  });

  test('logging out clears the Redux user and updates the navbar', async ({ page }) => {
    await page.goto('/');

    const profileTrigger = page.locator('.dropdown.dropdown-end [role="button"]').first();
    await expect(profileTrigger).toBeVisible();

    await profileTrigger.click();
    await page.getByText('Logout', { exact: true }).click({ force: true });

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(profileTrigger).not.toBeVisible();
  });
});
