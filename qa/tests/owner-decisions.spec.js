// Owner decisions, round 3 (2026-09-25): legal entity, accent colour, Complex partner/case, paid audit, OG image, Mo link.
import { test, expect } from '@playwright/test';
import { rawHtml } from '../site-map.js';

const LEGAL_EN = 'Base X Tech Ltd · Company no. 16134538 · 27 Old Gloucester Street, London WC1N 3AX, UK';

test('Legal: EN footer carries the company line next to the team line', async ({ request }) => {
  for (const path of ['/', '/pages/service/custom-shopify-integrations/', '/pages/complex-solutions/', '/pages/privacy-policy/']) {
    const { html } = await rawHtml(request, path);
    expect(html, path).toContain(`<p class="v2-footer__entity">${LEGAL_EN}</p>`);
    expect(html, path).toContain('v2-footer__company');
    expect(html, `${path}: no DE legal links in EN footer`).not.toContain('href="/de/impressum/"');
  }
});

test('Legal: DE footer links Impressum and Datenschutz and carries the company number', async ({ request }) => {
  for (const path of ['/de/pages/complex-solutions/', '/de/impressum/', '/de/datenschutz/']) {
    const { html } = await rawHtml(request, path);
    const footer = html.slice(html.indexOf('<footer class="v2-footer"'));
    expect(footer, path).toContain('href="/de/impressum/"');
    expect(footer, path).toContain('href="/de/datenschutz/"');
    expect(footer, path).toContain('16134538');
  }
});

test('Legal: /de/impressum/ answers 200 with the § 5 DDG data', async ({ request }) => {
  const { status, html } = await rawHtml(request, '/de/impressum/');
  expect(status).toBe(200);
  for (const s of ['Base X Tech Ltd', '16134538', '27 Old Gloucester Street', 'WC1N 3AX', 'Oleksandr Rudenko', 'hello@base-xtech.com',
    'Companies House', '§ 18 Abs. 2 MStV', 'Verbraucherschlichtungsstelle']) expect(html).toContain(s);
  expect(html).not.toMatch(/USt-IdNr|VAT/);
});

test('Legal: privacy policy (EN + DE) names the controller with registered address and company number', async ({ request }) => {
  for (const path of ['/pages/privacy-policy/', '/de/datenschutz/']) {
    const { status, html } = await rawHtml(request, path);
    expect(status).toBe(200);
    for (const s of ['Base X Tech Ltd', '27 Old Gloucester Street', 'WC1N 3AX', '16134538', 'mailto:hello@base-xtech.com']) expect(html, path).toContain(s);
  }
});
