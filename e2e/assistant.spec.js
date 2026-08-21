import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
};

// No message is actually sent here: that would call Groq on every CI run, which
// is slow, costs money and is not deterministic. Answer quality is covered by
// the eval suite in the mobile repo (npm run eval), and the send/reply wiring
// by the component tests.
test.describe('AI assistant', () => {
  test('is not reachable without signing in', async ({ page }) => {
    await page.goto('/assistant');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signed-in donor gets the nav link and the chat page', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/');

    const navLink = page.getByRole('banner').getByRole('link', { name: 'Assistant' });
    await expect(navLink).toBeVisible();
    await navLink.click();

    await expect(page).toHaveURL(/\/assistant/);
    await expect(page.getByRole('heading', { name: 'Eligibility assistant' })).toBeVisible();
    await expect(page.getByText('Informational only — not medical advice')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'What should I eat before donating?' }),
    ).toBeVisible();
  });

  test('the assistant link stays hidden from signed-out visitors', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Assistant' })).toHaveCount(0);
  });
});
