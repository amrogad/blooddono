import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
};

test.describe('Supabase auth flow', () => {
  test('demo donor login redirects and can access the dashboard', async ({ page }) => {
    await loginAsDemo(page, 'Donor');

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('BloodDono Dashboard')).toBeVisible();
  });

  test('logging out clears the user and updates the navbar', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
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
