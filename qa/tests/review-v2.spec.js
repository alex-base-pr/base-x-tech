// Round-2 review fixes (docs/review/2026-09-24-v2-summary.md): contact form defaults, service pre-selection,
// lead attribution, Open Graph, hreflang clusters, /de/ shell strings, 404 status.
import { test, expect } from '@playwright/test';
import { host, siteMap, rawHtml, isDevTarget } from '../site-map.js';

const alternates = (html) => [...html.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([^"]+)">/g)].map((m) => ({ href: m[1], lang: m[2] }));
const langOf = (path) => (path.startsWith('/uk/') ? 'uk' : path.startsWith('/de/') ? 'de' : 'en');
const openModal = async (page) => {
  await page.locator('.v2-header [data-form-trigger]').last().click();
  await expect(page.locator('.v2-modal')).toHaveClass(/active/);
};

test('form: no budget is pre-checked @cross', async ({ page }) => {
  await page.goto('/pages/service/custom-shopify-integrations/');
  await expect(page.locator('#task-form input[name="budget"]')).toHaveCount(5);
  expect(await page.locator('#task-form input[name="budget"]:checked').count()).toBe(0);
  await expect(page.locator('#task-form input[name="company"]')).not.toHaveAttribute('required', /.*/);
});

const preselect = [
  ['/pages/service/custom-shopify-integrations/', 'Custom Shopify Integrations'],
  ['/pages/service/shopify-migration-service/', 'Shopify Migration'],
  ['/pages/complex-solutions/', 'Complex Solutions (ERP, POS, middleware)'],
  ['/de/pages/complex-solutions/', 'Complex Solutions (ERP, POS, middleware)'],
];
for (const [path, service] of preselect) {
  test(`form: service pre-selected on ${path} @cross`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    await openModal(page);
    await expect(page.locator('#task-form select[name="service"]')).toHaveValue(service);
    expect(new URL(page.url()).hash, 'CTA #contact fallback does not jump').toBe('');
  });
}

test('form: home keeps the first service option', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await openModal(page);
  await expect(page.locator('#task-form select[name="service"]')).toHaveValue('Shopify Development');
});

// Stub the ClickUp endpoint so a prod build can be submitted safely (never a real lead); a dev build sends nothing.
async function stubClickUp(page) {
  const bodies = [];
  await page.route(/clickup\.base-xtech\.com/, async (route) => {
    bodies.push(JSON.parse(route.request().postData() || '{}'));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  return bodies;
}

test('form: the lead records page, first touch, UTM, summary; source is a second task after sending', async ({ page }) => {
  test.skip(isDevTarget, 'dev build: the form never sends');
  await page.setViewportSize({ width: 1440, height: 900 });
  const bodies = await stubClickUp(page);
  await page.goto('/?utm_source=newsletter&utm_campaign=autumn&gclid=abc123');
  await page.goto('/de/pages/service/shopify-migration-service/');
  await openModal(page);
  await page.fill('#task-form input[name="name"]', 'QA Test');
  await page.fill('#task-form input[name="email"]', 'qa@example.com');
  await page.fill('#task-form input[name="company"]', 'acme.de');
  await expect(page.locator('#task-form select[name="source"]'), 'source question is not in the form').toHaveCount(0);
  await page.locator('#task-form button[type="submit"]').click();
  await expect(page.locator('#success-msg')).toHaveClass(/success/);
  await expect.poll(() => bodies.length).toBe(1);
  const lead = bodies[0];
  expect(lead.name).toMatch(/ - qa@example\.com - QA Test · DE · Shopify Migration · acme\.de · .*utm: newsletter\/autumn$/);
  expect(lead.description.split('\n')[0]).toMatch(/^DE · Shopify Migration · acme\.de/);
  for (const line of ['Service required: Shopify Migration', 'Website / company: acme.de', 'Site language: DE', 'Location (approx.): ',
    'Page: /de/pages/service/shopify-migration-service/', 'First landing page: /?utm_source=newsletter&utm_campaign=autumn&gclid=abc123',
    'First-touch UTM: utm_source=newsletter, utm_campaign=autumn, gclid=abc123']) expect(lead.description).toContain(line);
  expect(lead.description).not.toContain('Budget:');
  expect(lead.description).not.toContain('Source:');
  // the follow-up: one click in the success state sends a second task tied to the lead by email and time
  await page.locator('#source-form button[value="Clutch"]').click();
  await expect(page.locator('.v2-source__thanks')).toBeVisible();
  await expect.poll(() => bodies.length).toBe(2);
  expect(bodies[1].name).toMatch(/ - qa@example\.com - Source: Clutch$/);
  expect(bodies[1].description).toContain('Lead UTM: utm_source=newsletter, utm_campaign=autumn, gclid=abc123');
  await expect(page.locator('#source-form button[value="Google"]')).toBeDisabled();
});

test('form: campaign history — UTMs survive new tabs, a later campaign is the latest, both are in the lead', async ({ browser, baseURL }) => {
  test.skip(isDevTarget, 'dev build: the form never sends');
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } });
  for (const url of [
    '/pages/service/custom-shopify-integrations/?utm_source=google&utm_medium=cpc&utm_campaign=xentral',
    '/pages/service/shopify-migration-service/?utm_source=linkedin&utm_medium=social&utm_campaign=shopware', // comes back later from another campaign
    '/pages/service/custom-shopify-integrations/?utm_content=nav', // internal utm_content only: not a campaign
  ]) { const tab = await context.newPage(); await tab.goto(url); await tab.close(); }
  const page = await context.newPage(); // new tab: sessionStorage is empty, the campaigns come from localStorage
  const bodies = await stubClickUp(page);
  await page.goto('/pages/complex-solutions/?utm_content=hero');
  await openModal(page);
  await page.fill('#task-form input[name="name"]', 'QA Test');
  await page.fill('#task-form input[name="email"]', 'qa@example.com');
  await page.locator('#task-form button[type="submit"]').click();
  await expect.poll(() => bodies.length).toBe(1);
  const d = bodies[0].description;
  expect(d).toContain('First-touch UTM: utm_content=hero');
  expect(d).toContain('Last campaign UTM: utm_source=linkedin, utm_medium=social, utm_campaign=shopware');
  expect(d).toMatch(/Campaign history \(oldest first\):\n- \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC · utm_source=google, utm_medium=cpc, utm_campaign=xentral · landed \/pages\/service\/custom-shopify-integrations\/\?utm_source=google[^\n]*\n- [^\n]*utm_source=linkedin, utm_medium=social, utm_campaign=shopware · landed \/pages\/service\/shopify-migration-service\//);
  expect(d).not.toMatch(/Campaign history[\s\S]*utm_content=nav/);
  expect(d).toContain('URL Parameters:\nutm_content: hero');
  expect(bodies[0].name).toContain('utm: linkedin/shopware');
  await context.close();
});

for (const path of ['/', '/pages/service/custom-shopify-integrations/', '/de/pages/complex-solutions/', '/uk/']) {
  test(`Open Graph + Twitter tags on ${path}`, async ({ request }) => {
    const { html } = await rawHtml(request, path);
    const og = (p) => (html.match(new RegExp(`<meta property="og:${p}" content="([^"]*)">`)) || [])[1];
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
    expect(og('title')).toBeTruthy();
    expect(og('description')).toBeTruthy();
    expect(og('type')).toBe('website');
    expect(og('url')).toBe(canonical);
    expect(og('image')).toBe(`${isDevTarget ? 'https://dev.base-xtech.com' : 'https://base-xtech.com'}/images/og/base-x-tech-og.png?v=2`); // 1200×630 share card (2026-09-25)
    expect(og('image:width')).toBe('1200');
    expect(og('image:height')).toBe('630');
    expect(og('locale')).toBe({ en: 'en_US', de: 'de_DE', uk: 'uk_UA' }[langOf(path)]);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(html).toContain(`<meta name="twitter:image" content="${isDevTarget ? 'https://dev.base-xtech.com' : 'https://base-xtech.com'}/images/og/base-x-tech-og.png?v=2">`);
  });
}

// Every page in a language cluster lists itself, all counterparts (with trailing slash) and one x-default = EN.
const clusterPaths = [
  ...siteMap.pages.map((p) => p.path), // EN, DE and UK (index, absorbed, noindex)
];
for (const path of clusterPaths) {
  test(`hreflang: ${path} self-references and has exactly one x-default = EN`, async ({ request }) => {
    const { status, html } = await rawHtml(request, path);
    expect(status).toBe(200);
    const alts = alternates(html);
    if (!alts.length) return; // page without language versions
    const self = alts.filter((a) => a.lang === langOf(path));
    expect(self.map((a) => a.href), 'self reference').toEqual([host + path]);
    const xd = alts.filter((a) => a.lang === 'x-default');
    expect(xd.length, 'exactly one x-default').toBe(1);
    const en = alts.find((a) => a.lang === 'en');
    expect(en, 'EN version listed').toBeTruthy();
    expect(xd[0].href).toBe(en.href);
    for (const a of alts) expect(a.href, `${a.lang} target has a trailing slash`).toMatch(/\/$/);
    expect(new Set(alts.map((a) => a.lang)).size, 'no duplicate languages').toBe(alts.length);
  });
}

test('hreflang: /404/ has no language cluster and is noindex', async ({ request }) => {
  const res = await request.get('/this-page-does-not-exist');
  expect(res.status()).toBe(404);
  const html = await res.text();
  expect(alternates(html)).toEqual([]);
  expect(html).toMatch(/<meta name="robots" content="noindex[^"]*">/);
  // Cloudflare Pages (dev) 308-redirects /404/ to /404; the prod Apache rule answers 404 directly.
  if (!isDevTarget) expect((await request.get('/404/', { maxRedirects: 0 })).status()).toBe(404);
});

test('404 page links to Complex Solutions', async ({ request }) => {
  const html = await (await request.get('/nope/')).text();
  expect(html).toContain('href="/pages/complex-solutions/"');
});

test('/de/ shell is German: header, mobile menu, footer and modal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/de/pages/complex-solutions/');
  await expect(page.locator('.v2-header [data-v2-services]')).toHaveText('Leistungen');
  await expect(page.locator('.v2-footer')).toContainText('Alle Rechte vorbehalten.');
  await expect(page.locator('#v2-mnav')).toContainText('Über uns');
  await expect(page.locator('#v2-modal-title')).toContainText('über Ihr Projekt');
  await expect(page.locator('#task-form button[type="submit"]')).toContainText('Projektangaben senden');
  await expect(page.locator('.v2-form__budget')).toContainText('Noch unklar');
  await expect(page.locator('.cx-hero [data-form-trigger]')).toContainText('Projekt besprechen');
  // EN stays the default
  await page.goto('/pages/complex-solutions/');
  await expect(page.locator('.v2-header [data-v2-services]')).toHaveText('Services');
  await expect(page.locator('.cx-hero [data-form-trigger]')).toContainText('Discuss your project');
});

test('service pages link to related services; CTAs fall back to #contact', async ({ request }) => {
  for (const path of ['/pages/shopify-development/', '/pages/complex-solutions/']) {
    const { html } = await rawHtml(request, path);
    const related = (html.match(/<nav class="v2-related[\s\S]*?<\/nav>/) || [''])[0];
    expect([...related.matchAll(/<a href="(\/pages\/[^"]+)"/g)].length, `${path} related links`).toBeGreaterThanOrEqual(2);
    expect(html).not.toMatch(/<a href="#" class="v2-btn"/);
  }
});

test('project cards: no round link where there is no link; no external Prime EVA link', async ({ request }) => {
  for (const p of siteMap.pages.filter((x) => x.lang === 'en' && x.role === 'index')) {
    const { html } = await rawHtml(request, p.path);
    expect(html, p.path).not.toContain('primeeva.com');
    expect(html, p.path).not.toMatch(/class="v2-round-link" href="(null|undefined)?"/);
  }
});
