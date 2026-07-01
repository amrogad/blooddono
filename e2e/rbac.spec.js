import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
};

const openProfileDropdown = async (page) => {
  const trigger = page.locator('.dropdown.dropdown-end [role="button"]').first();
  await expect(trigger).toBeVisible();
  await trigger.click();
};

test.describe('Role-based access control', () => {
  test('donor sees donor sidebar and not admin links', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/dashboard');

    await expect(page.getByRole('link', { name: 'My Donation Requests' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'All Users' })).not.toBeVisible();
  });

  test('role switcher updates the sidebar instantly', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/dashboard');

    await openProfileDropdown(page);
    await page.getByRole('button', { name: 'admin' }).click({ force: true });

    await expect(page.getByRole('link', { name: 'All Users' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Donation Requests' })).not.toBeVisible();
  });

  test('donor is redirected to /forbidden on admin routes', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/dashboard/all-users');

    await expect(page).toHaveURL(/\/forbidden/);
  });

  test('admin sees admin links and can open the All Users page', async ({ page }) => {
    await loginAsDemo(page, 'Admin');
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: 'All Users' })).toBeVisible();

    await page.goto('/dashboard/all-users');
    await expect(page).toHaveURL(/\/dashboard\/all-users/);
    await expect(page.getByRole('heading', { name: 'All Users' })).toBeVisible();
  });

  test('volunteer gets the scoped volunteer dashboard', async ({ page }) => {
    await loginAsDemo(page, 'Volunteer');
    await page.goto('/dashboard');

    await expect(page.getByText(/As a volunteer you can review/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'All Users' })).not.toBeVisible();
  });

  test('unauthenticated visitor is redirected to login from a private route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
