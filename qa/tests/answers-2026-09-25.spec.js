// Team answers to the open questions (docs/review/2026-09-25-answers.md): regressions we don't want back.
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { rawHtml } from '../site-map.js';

const openModal = async (page) => {
  await page.locator('.v2-header [data-form-trigger]').last().click();
  await expect(page.locator('.v2-modal')).toHaveClass(/active/);
};
const budgets = (page) => page.locator('#task-form input[name="budget"]').evaluateAll((els) => els.map((e) => e.value));

test('A3: EUR budget bands on service pages; values stay English @cross', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pages/service/custom-shopify-integrations/');
  expect(await budgets(page)).toEqual(['Up to €5k', '€5–15k', '€15–40k', '€40k+', 'Not sure yet']);
  await openModal(page);
  await expect(page.locator('.v2-form__budget')).not.toContainText('$');
  await expect(page.locator('.v2-form__promise')).toHaveText('We reply within 1 working day.');
});

for (const [p, labels] of [
  ['/pages/complex-solutions/', ['€5–15k', '€15–40k', '€40k+', 'Not sure yet']],
  ['/de/pages/complex-solutions/', ['5.000–15.000 €', '15.000–40.000 €', 'Über 40.000 €', 'Noch unklar']],
]) {
  test(`A3: no "Up to €5k" band on ${p} @cross`, async ({ page }) => {
    await page.goto(p);
    expect(await budgets(page)).toEqual(['€5–15k', '€15–40k', '€40k+', 'Not sure yet']);
    expect(await page.locator('.v2-form__budget label span').allTextContents()).toEqual(labels);
  });
}

test('A4: success text promises a reply within 1 working day (EN, DE)', async ({ request }) => {
  expect((await rawHtml(request, '/')).html).toContain('We reply within 1 working day.');
  const de = (await rawHtml(request, '/de/pages/complex-solutions/')).html;
  expect(de).toContain('Vielen Dank — Ihre Projektdetails sind bei uns.');
  expect(de).toContain('Wir antworten innerhalb eines Werktages.');
});

test('A1: company line in the footer; controller named in the privacy policy', async ({ request }) => {
  expect((await rawHtml(request, '/')).html).toContain('Base X Tech Ltd, registered in London, UK. Our team works across Kyiv, Lviv, Kraków and Spain, on CET hours.');
  expect((await rawHtml(request, '/de/pages/complex-solutions/')).html).toContain('Base X Tech Ltd, eingetragen in London, UK.');
  expect((await rawHtml(request, '/pages/privacy-policy/')).html).toContain('Base X Tech Ltd (London, UK)');
});

test('A2: "Who you\'ll talk to" names the team; Alexander Karl first on Complex', async ({ request }) => {
  const names = (html) => [...(html.match(/<aside class="v2-team"[\s\S]*?<\/aside>/) || [''])[0].matchAll(/<strong>([^<]+)<\/strong>/g)].map((m) => m[1]);
  expect(names((await rawHtml(request, '/pages/shopify-development/')).html)).toEqual(['Sofiia Zabrodska', 'Vadym Hula', 'Vadym-Marko Hruden']);
  for (const p of ['/pages/complex-solutions/', '/de/pages/complex-solutions/']) {
    expect(names((await rawHtml(request, p)).html)[0], p).toBe('Alexander Karl');
  }
});

test('A5: no uplift claim on CRO', async ({ request }) => {
  const { html } = await rawHtml(request, '/pages/service/conversion-rate-optimization/');
  expect(html).not.toMatch(/50\s*[-–]\s*200/);
  expect(html).not.toMatch(/uplift/i);
  expect(html).toContain('We find the leaks, rank them by what they cost you, and fix the biggest first.');
});

for (const p of ['/pages/complex-solutions/', '/de/pages/complex-solutions/']) {
  test(`M2: ${p} has FAQPage JSON-LD with its 6 own questions`, async ({ request }) => {
    const { html } = await rawHtml(request, p);
    const nodes = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap((m) => { const d = JSON.parse(m[1]); return d['@graph'] || [d]; });
    const faq = nodes.find((n) => n['@type'] === 'FAQPage');
    expect(faq, 'FAQPage node').toBeTruthy();
    expect(faq.mainEntity).toHaveLength(6);
    for (const q of faq.mainEntity) expect(q.acceptedAnswer.text.length).toBeGreaterThan(20);
    expect((html.match(/data-faq-q/g) || []).length).toBe(6);
  });
}

test('Complex: partner block is text only, no quote; K1 one systems strip; A49 case', async ({ request }) => {
  const en = (await rawHtml(request, '/pages/complex-solutions/')).html;
  const de = (await rawHtml(request, '/de/pages/complex-solutions/')).html;
  const partner = (h) => (h.match(/<section class="cx-section cx-partner[\s\S]*?<\/section>/) || [''])[0];
  for (const h of [en, de]) {
    expect(partner(h)).not.toContain('<blockquote');
    expect(partner(h)).not.toContain('cx-partner__placeholder');
    expect(h).not.toMatch(/seamlessly|reibungslos zusammenarbeiten/);
    expect(h).not.toMatch(/no delivered project|kein abgeschlossenes Projekt/);
    expect(h).toContain('Mettler Toledo');
    expect(h).not.toMatch(/Private App|private App/);
  }
  expect(en).toContain('Systems we connect');
  expect(de).toContain('Systeme, die wir anbinden');
  expect(de).not.toContain('Expertise vor Ort');
  expect(de).toContain('Persönlicher Ansprechpartner im DACH-Raum');
  expect(en).toContain('German specialty food retailer');
  expect(en).toContain('What’s included');
  expect(de).toContain('Leistungsumfang');
  expect(en).toContain('Custom Shopify integrations with the ERP, POS and systems behind your operations.');
});

test('Home: sub-line with Shopify under the H1', async ({ request }) => {
  const { html } = await rawHtml(request, '/');
  expect(html).toMatch(/<\/h1>\s*<p class="h-hero__sub">Shopify development, custom apps and integrations for brands that have outgrown standard setups\.<\/p>/);
});

test('A49: no "Fresh Market" anywhere in dist', () => {
  const hits = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(html|txt|xml|js|json)$/.test(f.name) && fs.readFileSync(p, 'utf8').includes('Fresh Market')) hits.push(p);
    }
  };
  walk('dist');
  expect(hits).toEqual([]);
});
