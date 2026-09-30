// Contact-form review 2026-09-30 (docs/review/2026-09-30-contact-form.md): Figma sizes, website field, guiding
// placeholder, source question after sending, "what happens next" in the success state, location in the privacy policy.
import { test, expect } from '@playwright/test';
import { rawHtml } from '../site-map.js';

const open = async (page, path) => {
  await page.goto(path);
  await page.locator('[data-form-trigger]:visible').first().click();
  await expect(page.locator('.v2-modal')).toHaveClass(/active/);
};

test('desktop: the whole form fits a 1440×800 screen, sizes as in Figma 825:33', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await open(page, '/pages/service/custom-shopify-integrations/');
  const panel = page.locator('.v2-modal__panel');
  expect(await panel.evaluate((e) => e.scrollHeight <= e.clientHeight)).toBe(true);
  expect((await panel.boundingBox()).width).toBe(550);
  for (const sel of ['input[name="name"]', 'input[name="company"]', 'select[name="service"]']) expect((await page.locator(`#task-form ${sel}`).boundingBox()).height, sel).toBe(44);
  expect((await page.locator('#task-form textarea').boundingBox()).height).toBe(90);
  const tops = await page.locator('.v2-form__budget label').evaluateAll((ls) => ls.map((l) => Math.round(l.getBoundingClientRect().top)));
  expect(new Set(tops).size, 'EN budget chips in one row').toBe(1);
  expect(await page.locator('#task-form .v2-btn__label').evaluate((e) => [getComputedStyle(e).justifyContent, getComputedStyle(e).fontWeight])).toEqual(['flex-start', '500']);
});

test('mobile: card 12 px from the edges, budget 2 × 2 + "Not sure yet"', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 929 });
  await open(page, '/pages/service/custom-shopify-integrations/');
  const box = await page.locator('.v2-modal__panel').boundingBox();
  expect([box.x, box.width]).toEqual([12, 369]);
  const tops = await page.locator('.v2-form__budget label').evaluateAll((ls) => ls.map((l) => Math.round(l.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(3);
});

test('fields: website instead of company, guiding placeholder, no source select (EN/DE/UK)', async ({ request }) => {
  for (const [p, website, hint] of [
    ['/', 'Website or store URL', 'Your platform, the systems involved and any deadline'],
    ['/de/', 'Website oder Shop-URL', 'Ihre Plattform, die beteiligten Systeme und ein Termin'],
    ['/uk/', 'Сайт або посилання на магазин', 'Ваша платформа, системи, з якими треба працювати, і дедлайн'],
  ]) {
    const { html } = await rawHtml(request, p);
    const form = (html.match(/<form id="task-form"[\s\S]*?<\/form>/) || [''])[0];
    expect(form, p).toContain(`name="company" type="text" inputmode="url" autocomplete="url"`);
    expect(form, p).toContain(`placeholder="${website}"`);
    expect(form, p).toContain(hint);
    expect(form, p).not.toContain('name="source"');
    expect(form.match(/ required /g)?.length, `${p}: only name + email required`).toBe(2);
    const success = (html.match(/<div id="success-msg"[\s\S]*?<\/form>/) || [''])[0];
    expect(success, p).toContain('<form id="source-form"');
    expect(success, p).toMatch(/Sofiia|Софія/);
  }
});

test('privacy policies mention the approximate country and time zone sent with the form', async ({ request }) => {
  for (const [p, text] of [['/pages/privacy-policy/', 'approximate country (derived from your IP address)'], ['/de/datenschutz/', 'ungefähres Land (aus Ihrer IP-Adresse abgeleitet)'], ['/uk/pages/privacy-policy/', 'приблизна країна (визначається за IP-адресою)']]) {
    expect((await rawHtml(request, p)).html, p).toContain(text);
  }
});

test('GA4 funnel: form_open and form_start fire once', async ({ page }) => {
  // prod builds define gtag() (pushes to dataLayer); dev builds have no analytics, so stub one there
  await page.route(/googletagmanager\.com/, (r) => r.abort()); // keep dataLayer as raw arguments (gtag.js would consume it)
  await page.addInitScript(() => { window.dataLayer = window.dataLayer || []; if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments); }; });
  await open(page, '/pages/service/custom-shopify-integrations/');
  await page.locator('#task-form input[name="name"]').focus();
  await page.locator('#task-form input[name="email"]').focus();
  const events = await page.evaluate(() => (window.dataLayer || []).filter((a) => a && typeof a === 'object' && a[0] === 'event').map((a) => a[1]));
  expect(events.filter((e) => e === 'form_open' || e === 'form_start')).toEqual(['form_open', 'form_start']);
});
