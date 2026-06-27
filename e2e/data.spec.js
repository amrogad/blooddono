import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForURL('/');
};

test.describe('Supabase-backed data', () => {
  test('profile loads the logged-in user real data', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/dashboard/profile');

    await expect(page.locator('form input[type="text"]').first()).toHaveValue('Demo Donor');
  });

  test('donor search returns a searchable donor from the database', async ({ page }) => {
    await page.goto('/search');

    await page.locator('select[name="bloodGroup"]').selectOption('O+');
    await page.locator('select[name="governorate"]').selectOption('Cairo');
    await page.locator('select[name="city"]').selectOption('Nasr City');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('Demo Donor')).toBeVisible();
  });

  test('search matches by blood-type compatibility, not exact equality', async ({ page }) => {
    // Demo Donor is O+; an A+ patient can receive from O+, so a compatible
    // search surfaces them even though the groups are not equal.
    await page.goto('/search');

    await page.locator('select[name="bloodGroup"]').selectOption('A+');
    await page.locator('select[name="governorate"]').selectOption('Cairo');
    await page.locator('select[name="city"]').selectOption('Nasr City');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('Demo Donor')).toBeVisible();
  });
});
