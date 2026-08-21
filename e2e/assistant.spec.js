import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.waitForURL('/');
};

// No message is actually sent here: that would call Groq on every CI run, which
// is slow, costs money and is not deterministic. Answer quality is covered by
// the eval suite in the mobile repo (npm run eval), and the send/reply wiring
// by the component tests.
test.describe('AI assistant', () => {
  test('signed-out visitors can open the chat', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();

    const panel = page.getByRole('dialog', { name: 'Eligibility assistant' });
    await expect(panel).toBeVisible();
    await expect(panel.getByText('Informational only — not medical advice')).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'What should I eat before donating?' }),
    ).toBeVisible();
  });

  test('the chat is reachable from a dashboard page too', async ({ page }) => {
    await loginAsDemo(page, 'Donor');
    await page.goto('/dashboard');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();
    await expect(page.getByRole('dialog', { name: 'Eligibility assistant' })).toBeVisible();
  });

  test('closes again without leaving the page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();
    await page.getByRole('button', { name: 'Close assistant' }).click();

    await expect(page.getByRole('dialog', { name: 'Eligibility assistant' })).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
