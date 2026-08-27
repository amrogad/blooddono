import { test, expect } from '@playwright/test';

const loginAsDemo = async (page, roleLabel) => {
  await page.goto('/login');
  await page.getByRole('button', { name: roleLabel, exact: true }).click();
  await page.waitForURL('/');
};

const DRAFT = {
  recipient_name: 'Mona Fahmy',
  blood_group: 'O-',
  hospital_name: 'Wadi El Nil Hospital',
  recipient_governorate: 'Cairo',
  recipient_city: 'Nasr City',
  full_address: '12 Abbas El Akkad St',
  donation_date: '2027-08-24',
  donation_time: '14:30',
  request_message: 'Two units needed before surgery.',
};

// Stubbed so CI never pays Groq for a draft, and so a run never leaves a real
// request behind in the demo database.
const stubAssistantDraft = (page) =>
  page.route('**/functions/v1/ask-assistant', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        reply: 'Have a look and press Confirm when it looks right.',
        toolsUsed: ['draft_donation_request'],
        draft: DRAFT,
      }),
    }),
  );

const stubRequestInsert = async (page) => {
  let count = 0;
  await page.route('**/rest/v1/blood_donation_requests*', (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    count += 1;
    return route.fulfill({
      status: 201,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ id: 'req-e2e-1' }),
    });
  });
  return { count: () => count };
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
    await loginAsDemo(page, 'User');
    await page.goto('/dashboard');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();
    await expect(page.getByRole('dialog', { name: 'Eligibility assistant' })).toBeVisible();
  });

  test('drafts a request the user has to confirm before anything is written', async ({ page }) => {
    await stubAssistantDraft(page);
    const insert = await stubRequestInsert(page);

    await loginAsDemo(page, 'User');
    await page.getByRole('button', { name: 'Ask the assistant' }).click();

    const panel = page.getByRole('dialog', { name: 'Eligibility assistant' });
    await panel.getByPlaceholder('Ask a question or create a request.').fill('Post a request for my mother');
    await panel.getByRole('button', { name: 'Send message' }).click();

    await expect(panel.getByText('Mona Fahmy')).toBeVisible();
    await expect(panel.getByText('Check before posting')).toBeVisible();
    expect(insert.count()).toBe(0);

    await panel.getByRole('button', { name: 'Confirm and post' }).click();

    await expect(panel.getByText('Your request is live.')).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Confirm and post' })).toHaveCount(0);
    expect(insert.count()).toBe(1);
  });

  // Regression for a race that first showed up as a one-off failure of the test
  // above. Signing in navigates before the profile fetch that fills in redux
  // auth.user has returned, and confirming in that window read uid off null and
  // reported a failed post that never left the browser. Holding the profile
  // response back makes the window wide enough to hit every run.
  test('confirm waits for the session instead of failing right after login', async ({ page }) => {
    await page.route('**/rest/v1/profiles*', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.continue();
    });
    await stubAssistantDraft(page);
    const insert = await stubRequestInsert(page);

    await loginAsDemo(page, 'User');
    await page.getByRole('button', { name: 'Ask the assistant' }).click();

    const panel = page.getByRole('dialog', { name: 'Eligibility assistant' });
    await panel.getByPlaceholder('Ask a question or create a request.').fill('Post a request for my mother');
    await panel.getByRole('button', { name: 'Send message' }).click();
    await expect(panel.getByText('Mona Fahmy')).toBeVisible();

    // Playwright waits for the button to become enabled, which is the fix: the
    // card disables Confirm until there is a user to stamp on the row.
    await panel.getByRole('button', { name: 'Confirm and post' }).click();

    await expect(panel.getByText('Your request is live.')).toBeVisible();
    expect(insert.count()).toBe(1);
  });

  test('closes again without leaving the page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Ask the assistant' }).click();
    await page.getByRole('button', { name: 'Close assistant' }).click();

    await expect(page.getByRole('dialog', { name: 'Eligibility assistant' })).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
