import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.waitForURL('/');
};

const openProfileDropdown = async (page) => {
  const trigger = page.locator('.dropdown.dropdown-end [role="button"]').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
};

test.describe('Role-based access control', () => {
  test('user sees their sidebar and not admin links', async ({ page }) => {
    await loginAsDemo(page, 'User');
    await page.goto('/dashboard');

    await expect(page.getByRole('link', { name: 'My requests', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users', exact: true })).not.toBeVisible();
  });

  test('switching demo account re-authenticates and swaps the sidebar', async ({ page }) => {
    await loginAsDemo(page, 'User');
    await page.goto('/dashboard');

    await openProfileDropdown(page);
    await page.getByRole('button', { name: 'Admin', exact: true }).click({ force: true });

    await expect(page.getByRole('link', { name: 'Users', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My requests', exact: true })).not.toBeVisible();
  });

  test('donor is redirected to /forbidden on admin routes', async ({ page }) => {
    await loginAsDemo(page, 'User');
    await page.goto('/dashboard/all-users');

    await expect(page).toHaveURL(/\/forbidden/);
  });

  test('admin sees admin links and can open the All Users page', async ({ page }) => {
    await loginAsDemo(page, 'Admin');
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: 'Users', exact: true })).toBeVisible();

    await page.goto('/dashboard/all-users');
    await expect(page).toHaveURL(/\/dashboard\/all-users/);
    await expect(page.getByRole('heading', { name: 'Users', exact: true })).toBeVisible();
  });


  test('unauthenticated visitor is redirected to login from a private route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
