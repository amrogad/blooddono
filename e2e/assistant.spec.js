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

  test('drafts a request the user has to confirm before anything is written', async ({ page }) => {
    // Both calls are stubbed: the function call so CI never pays Groq, and the
    // insert so a test run never leaves a real request in the demo database.
    await page.route('**/functions/v1/ask-assistant', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          reply: 'Have a look and press Confirm when it looks right.',
          toolsUsed: ['draft_donation_request'],
          draft: {
            recipient_name: 'Mona Fahmy',
            blood_group: 'O-',
            hospital_name: 'Wadi El Nil Hospital',
            recipient_governorate: 'Cairo',
            recipient_city: 'Nasr City',
            full_address: '12 Abbas El Akkad St',
            donation_date: '2027-08-24',
            donation_time: '14:30',
            request_message: 'Two units needed before surgery.',
          },
        }),
      }),
    );

    let inserts = 0;
    await page.route('**/rest/v1/blood_donation_requests*', (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      inserts += 1;
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ id: 'req-e2e-1' }),
      });
    });

    await loginAsDemo(page, 'Donor');
    await page.getByRole('button', { name: 'Ask the assistant' }).click();

    const panel = page.getByRole('dialog', { name: 'Eligibility assistant' });
    await panel.getByPlaceholder('Ask a question...').fill('Post a request for my mother');
    await panel.getByRole('button', { name: 'Send message' }).click();

    await expect(panel.getByText('Mona Fahmy')).toBeVisible();
    await expect(panel.getByText('Check before posting')).toBeVisible();
    expect(inserts).toBe(0);

    await panel.getByRole('button', { name: 'Confirm and post' }).click();

    await expect(panel.getByText('Your request is live.')).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Confirm and post' })).toHaveCount(0);
    expect(inserts).toBe(1);
  });

  test('closes again without leaving the page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();
    await page.getByRole('button', { name: 'Close assistant' }).click();

    await expect(page.getByRole('dialog', { name: 'Eligibility assistant' })).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
