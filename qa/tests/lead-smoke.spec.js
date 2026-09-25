// Staging lead smoke test: sends ONE real test lead through the contact modal to ClickUp and checks it arrived.
// Skipped unless LEAD_SMOKE=1. Never part of the normal QA run. See docs/RELEASE-2026-09-25.md.
//
//   LEAD_SMOKE=1 QA_BASE_URL=https://staging.base-xtech.com STAGING_USER=… STAGING_PASS=… \
//     npx playwright test qa/tests/lead-smoke.spec.js --project=chromium
//
// Refuses to run against the production domain unless LEAD_SMOKE_PROD=1 is set as well.
// Needs a prod-type build (staging or live): DEPLOY_ENV=dev builds stub the form and never call ClickUp.
import { test, expect } from '@playwright/test';

const base = process.env.QA_BASE_URL || '';
const enabled = process.env.LEAD_SMOKE === '1';
const isProd = (() => {
  try { return /^(www\.)?base-xtech\.com$/i.test(new URL(base).hostname); } catch { return false; }
})();

if (process.env.STAGING_USER && process.env.STAGING_PASS) {
  test.use({ httpCredentials: { username: process.env.STAGING_USER, password: process.env.STAGING_PASS } });
}

test('Lead smoke: modal on Integrations sends a test lead to ClickUp', async ({ page }) => {
  test.skip(!enabled, 'set LEAD_SMOKE=1 to send a real test lead');
  if (!base) throw new Error('LEAD_SMOKE needs QA_BASE_URL (e.g. https://staging.base-xtech.com); refusing to guess a target.');
  if (isProd && process.env.LEAD_SMOKE_PROD !== '1') {
    throw new Error(`Refusing to send a test lead to production (${base}). Set LEAD_SMOKE_PROD=1 to do it on purpose.`);
  }
  test.setTimeout(60_000);

  await page.goto('/pages/service/custom-shopify-integrations/');
  await page.locator('.v2-header [data-form-trigger]').click();
  const modal = page.locator('.v2-modal');
  await expect(modal).toHaveClass(/active/);

  await modal.locator('input[name="name"]').fill('QA Test — ignore');
  await modal.locator('input[name="email"]').fill('qa+leadsmoke@base-xtech.com');
  await modal.locator('input[name="company"]').fill('QA');
  await modal.locator('textarea[name="tell_us_more"]').fill(`Automated staging smoke test ${new Date().toISOString()}`);

  const clickup = page.waitForResponse((r) => r.url().startsWith('https://clickup.base-xtech.com') && r.request().method() === 'POST', { timeout: 30_000 });
  await modal.locator('#task-form button[type="submit"]').click();
  const res = await clickup;
  expect(res.status(), `ClickUp answered ${res.status()}`).toBeGreaterThanOrEqual(200);
  expect(res.status()).toBeLessThan(300);
  await expect(page.locator('#success-msg.success')).toBeVisible({ timeout: 15_000 });
});
