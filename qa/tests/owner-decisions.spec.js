// Owner decisions, round 3 (2026-09-25): legal entity, accent colour, Complex partner/case, paid audit, OG image, Mo link.
import { test, expect } from '@playwright/test';
import { rawHtml, indexPages, dePages, isDevTarget } from '../site-map.js';

test('Legal: footer stays simple — no address block; entity details live on the legal pages', async ({ request }) => {
  for (const path of ['/', '/pages/service/custom-shopify-integrations/', '/pages/complex-solutions/']) {
    const { html } = await rawHtml(request, path);
    const footer = html.slice(html.indexOf('<footer class="v2-footer"'));
    expect(footer, path).toContain('Base X Tech Ltd.');
    expect(footer, path).not.toContain('Old Gloucester');
    expect(footer, `${path}: no DE legal links in EN footer`).not.toContain('href="/de/impressum/"');
  }
  for (const path of ['/pages/privacy-policy/', '/pages/terms-and-conditions/']) {
    const { html } = await rawHtml(request, path);
    for (const s of ['Base X Tech Ltd', '16134538', '27 Old Gloucester Street']) expect(html, path).toContain(s);
  }
});

test('Legal: DE footer links Impressum and Datenschutz', async ({ request }) => {
  for (const path of ['/de/pages/complex-solutions/', '/de/impressum/', '/de/datenschutz/']) {
    const { html } = await rawHtml(request, path);
    const footer = html.slice(html.indexOf('<footer class="v2-footer"'));
    expect(footer, path).toContain('href="/de/impressum/"');
    expect(footer, path).toContain('href="/de/datenschutz/"');
  }
});

test('Legal: /de/impressum/ answers 200 with the § 5 DDG data', async ({ request }) => {
  const { status, html } = await rawHtml(request, '/de/impressum/');
  expect(status).toBe(200);
  for (const s of ['Base X Tech Ltd', '16134538', '27 Old Gloucester Street', 'WC1N 3AX', 'Oleksandr Rudenko',
    'Companies House', '§ 18 Abs. 2 MStV', 'Verbraucherschlichtungsstelle']) expect(html).toContain(s);
  expect(html).toMatch(/hello@base-xtech\.com|cdn-cgi\/l\/email-protection/); // Cloudflare Email Obfuscation on proxied hosts
  expect(html).not.toMatch(/USt-IdNr|VAT/);
});

test('Legal: privacy policy (EN + DE) names the controller with registered address and company number', async ({ request }) => {
  for (const path of ['/pages/privacy-policy/', '/de/datenschutz/']) {
    const { status, html } = await rawHtml(request, path);
    expect(status).toBe(200);
    for (const s of ['Base X Tech Ltd', '27 Old Gloucester Street', 'WC1N 3AX', '16134538']) expect(html, path).toContain(s);
    // Cloudflare Email Obfuscation rewrites mailto links on proxied hosts (dev, prod) to /cdn-cgi/l/email-protection.
    expect(html, path).toMatch(/mailto:hello@base-xtech\.com|cdn-cgi\/l\/email-protection/);
  }
});

// Accent = brand #B5DC4A; anything on the accent fill is dark #1D1E20 (white on #B5DC4A ≈ 1.6:1).
const ACCENT = 'rgb(181, 220, 74)';
const ON_ACCENT = 'rgb(29, 30, 32)';
test('Accent: tokens and on-accent colour @cross', async ({ page }) => {
  await page.goto('/pages/service/custom-shopify-integrations/');
  const t = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    const pick = (sel) => { const el = document.querySelector(sel); if (!el) return null; const s = getComputedStyle(el); return { bg: s.backgroundColor, color: s.color }; };
    return {
      accent: cs.getPropertyValue('--v2-accent').trim().toLowerCase(),
      on: cs.getPropertyValue('--v2-on-accent').trim().toLowerCase(),
      pill: pick('.v2-pill--accent'),
      arrow: pick('.v2-btn__arrow'),
    };
  });
  expect(t.accent).toBe('#b5dc4a');
  expect(t.on).toBe('#1d1e20');
  for (const k of ['pill', 'arrow']) expect(t[k], k).toEqual({ bg: ACCENT, color: ON_ACCENT });
  // v2 rules only: the legacy main.scss $primary (#81A13F) still serves the untouched /uk/ and legacy pages.
  const css = await page.evaluate(() => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules].map((r) => r.cssText); } catch { return []; } })
    .filter((r) => /body\.v2|--v2-/.test(r)).join('\n'));
  expect(css.toLowerCase(), 'old accent gone from v2 styles').not.toMatch(/#81a13f|rgb\(129, 161, 63\)/);
});

test('Accent: selected budget chip is dark on accent', async ({ page }) => {
  await page.goto('/pages/service/custom-shopify-integrations/');
  await page.locator('[data-form-trigger]').first().click();
  const chip = page.locator('.v2-form__budget label').nth(1);
  await chip.click();
  const s = await chip.locator('span').evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }));
  expect(s).toEqual({ bg: ACCENT, color: ON_ACCENT });
});

test('Complex partner: in-person line, approved photo, Alexander named, no placeholder', async ({ request }) => {
  const cases = {
    '/pages/complex-solutions/': ['In person in Berlin on request, elsewhere by arrangement.', 'Alexander Karl, DACH Partner at Base X Tech'],
    '/de/pages/complex-solutions/': ['Auf Wunsch auch persönlich vor Ort – in Berlin, in anderen Ländern nach Absprache.', 'Alexander Karl, DACH-Partner von Base X Tech'],
  };
  for (const [path, [line, alt]] of Object.entries(cases)) {
    const { html } = await rawHtml(request, path);
    const partner = (html.match(/<section class="cx-section cx-partner[\s\S]*?<\/section>/) || [''])[0];
    expect(partner, path).toContain(`<p class="cx-partner__inperson">${line}</p>`);
    expect(partner, path).toContain('<strong>Alexander Karl</strong>');
    expect(partner, path).toMatch(new RegExp(`<img loading="lazy" src="/images/v2/alexander-karl\\.webp" width="1335" height="1257" alt="${alt}">`));
    expect(partner, path).not.toMatch(/placeholder|Platzhalter/i);
    expect(html, path).not.toMatch(/Expertise vor Ort|on-site/i);
  }
  const img = await request.get('/images/v2/alexander-karl.webp');
  expect(img.status()).toBe(200);
  expect((await img.body()).length).toBeLessThan(200 * 1024);
});

test('Paid entry offer: before the FAQ, fixed price, CTA opens the modal with the service preselected', async ({ page, request }) => {
  const cases = [
    ['/pages/service/custom-shopify-integrations/', 'Fixed price: $1,999', 'We map your systems', 'Custom Shopify Integrations'],
    ['/pages/service/shopify-migration-service/', 'Fixed price: $1,999', 'Migration scoping:', 'Shopify Migration'],
    ['/pages/complex-solutions/', 'Fixed price: €1,999', 'We map your systems', 'Complex Solutions (ERP, POS, middleware)'],
    ['/de/pages/complex-solutions/', 'Festpreis: 1.999 €', 'Wir erfassen Ihre Systeme', 'Complex Solutions (ERP, POS, middleware)'],
  ];
  for (const [path, price, text, service] of cases) {
    const { html } = await rawHtml(request, path);
    const offer = html.indexOf('class="v2-section v2-dark v2-offer"');
    const faq = html.search(/class="(v2-section v2-light v2-faq|cx-section cx-faq)"/);
    expect(offer, `${path}: offer present`).toBeGreaterThan(0);
    expect(offer, `${path}: offer before FAQ`).toBeLessThan(faq);
    const block = html.slice(offer, faq);
    expect(block).toContain(`<p class="v2-offer__amount">${price}</p>`);
    expect(block).toContain(text);
    expect(block).toMatch(/Scope confirmed after a short call\.|Der Umfang wird nach einem kurzen Gespräch abgestimmt\./);
    expect(block).toContain('data-form-trigger');
    expect(block, 'no hourly rate').not.toMatch(/\/\s?h(ou)?r|per hour|Stunde/i);
    await page.goto(path);
    await page.locator('.v2-offer [data-form-trigger]').click();
    await expect(page.locator('.v2-modal')).toHaveClass(/active/);
    await expect(page.locator('.v2-modal select[name="service"]')).toHaveValue(service);
  }
  for (const path of ['/pages/shopify-development/', '/pages/service/custom-web-design-services/']) {
    expect((await rawHtml(request, path)).html, `${path}: no offer`).not.toContain('v2-offer');
  }
});

test('Prices: the fixed-price offer is the only price on the site, no hourly rates', async ({ request }) => {
  for (const p of [...indexPages, ...dePages]) {
    const { html } = await rawHtml(request, p.path);
    const body = (html.match(/<body[\s\S]*<\/body>/) || [''])[0]
      .replace(/<section class="v2-section v2-dark v2-offer"[\s\S]*?<\/section>/, ' ') // the offer itself
      .replace(/<(script|style|form|svg)[\s\S]*?<\/\1>/g, ' ') // form = budget bands, not prices
      .replace(/<[^>]+>/g, ' ');
    const prices = (body.match(/(\$|€) ?\d[\d,.]*(?![\d,.]*\s?[MB]\+?)|\d[\d.,]* ?€|per hour|hourly|Stundensatz/gi) || []);
    expect(prices, p.path).toEqual([]);
  }
});

test('Apps: Mo: Story Slider links to its App Store listing like Nova Poshta Connect', async ({ request }) => {
  const { html } = await rawHtml(request, '/pages/service/custom-shopify-app-development/');
  const card = (title) => (html.match(new RegExp(`<article class="v2-project">(?:(?!</article>)[\\s\\S])*?${title}[\\s\\S]*?</article>`)) || [''])[0];
  for (const [title, href] of [['Mo: Story Slider Navigation', 'https://apps.shopify.com/mo-story-slider-navigation'], ['Nova Poshta Connect', 'https://apps.shopify.com/nova-poshta-connect']]) {
    expect(card(title), title).toContain(`<a class="v2-round-link" href="${href}" target="_blank" rel="noopener" aria-label="View on the Shopify App Store">`);
  }
});

test('Complex buttons use the service-page system (white label + accent arrow square)', async ({ page }) => {
  await page.goto('/pages/complex-solutions/');
  const btns = await page.locator('.cx-btn .v2-btn').evaluateAll((els) => els.map((el) => {
    const label = getComputedStyle(el.querySelector('.v2-btn__label'));
    const arrow = getComputedStyle(el.querySelector('.v2-btn__arrow'));
    return { labelBg: label.backgroundColor, radius: label.borderRadius, arrowShown: arrow.display !== 'none', arrowBg: arrow.backgroundColor };
  }));
  expect(btns.length).toBeGreaterThanOrEqual(4);
  for (const b of btns) expect(b).toEqual({ labelBg: 'rgb(255, 255, 255)', radius: '4px', arrowShown: true, arrowBg: ACCENT });
});

test('OG image: absolute URL on every indexable page, served as a 1200×630 PNG under 300 KB', async ({ request }) => {
  // Dev builds point previews at the dev host (the file is not on prod before release).
  const url = `${isDevTarget ? 'https://dev.base-xtech.com' : 'https://base-xtech.com'}/images/og/base-x-tech-og.png?v=2`;
  for (const p of [...indexPages, ...dePages]) {
    const { html } = await rawHtml(request, p.path);
    expect(html, p.path).toContain(`<meta property="og:image" content="${url}">`);
    expect(html, p.path).toContain('<meta property="og:image:width" content="1200">');
    expect(html, p.path).toContain('<meta property="og:image:height" content="630">');
    expect(html, p.path).toContain(`<meta name="twitter:image" content="${url}">`);
    expect(html, p.path).toContain('<meta name="twitter:card" content="summary_large_image">');
  }
  const res = await request.get('/images/og/base-x-tech-og.png');
  expect(res.status()).toBe(200);
  const png = await res.body();
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  expect(png.length).toBeLessThan(300 * 1024);
});

test('Complex case: end client named with descriptor', async ({ request }) => {
  for (const [path, descriptor] of [['/pages/complex-solutions/', 'German specialty food retailer'], ['/de/pages/complex-solutions/', 'Deutscher Feinkost-Fachhändler']]) {
    const { html } = await rawHtml(request, path);
    expect(html, path).toMatch(new RegExp(`<h2 class="cx-case__client">Vom Einfachen das Gute</h2>\\s*<p class="cx-case__descriptor">${descriptor}</p>`));
    expect(html, path).toContain('Mettler');
  }
});
