import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.waitForURL('/');
};

test.describe('Supabase auth flow', () => {
  test('demo user login redirects and can access the dashboard', async ({ page }) => {
    await loginAsDemo(page, 'User');

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('logging out clears the user and updates the navbar', async ({ page }) => {
    await loginAsDemo(page, 'User');
    await page.goto('/');

    const profileTrigger = page.locator('.dropdown.dropdown-end [role="button"]').first();
    await expect(profileTrigger).toBeVisible();

    await profileTrigger.click();
    await page.getByText('Log out', { exact: true }).click({ force: true });

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Become a donor' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(profileTrigger).not.toBeVisible();
  });
});
