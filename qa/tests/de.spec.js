// DE on design v2 (2026-09-26): /de/ home + service pages use the v2 templates with lang "de"; copy comes from
// content/pages/<page>.de.json and falls back to EN while the copywriter's files are missing (German fallback meta
// in the wrapper). Complex, Impressum and Datenschutz existed before. No German terms page: the DE footer links the EN terms.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { host, siteMap, deIndexPages, rawHtml } from '../site-map.js';

const attr = (html, re) => (html.match(re) || [])[1];
const decode = (s = '') => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const alternates = (html) => Object.fromEntries([...html.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([^"]+)">/g)].map((m) => [m[2], m[1]]));
const deV2 = deIndexPages.filter((p) => p.en); // pages with an EN twin (Impressum is DE-only)
const deTwin = new Set(deIndexPages.map((p) => p.path));
const shellDe = JSON.parse(fs.readFileSync('content/pages/shell.de.json', 'utf8'));

for (const page of deV2) {
  test(`DE v2 ${page.path}: lang="de", v2 shell, EN/UK twins in the cluster @cross`, async ({ request }) => {
    const { status, html } = await rawHtml(request, page.path);
    expect(status).toBe(200);
    expect(html).toMatch(/<html lang="de"/);
    expect(html).toMatch(/<body class="v2[^"]*" lang="de">/);
    expect(html, 'no legacy header').not.toContain('site-header');
    const alts = alternates(html);
    expect(alts.de, 'self').toBe(host + page.path);
    expect(alts.en, 'EN twin').toBe(host + page.en);
    expect(alts['x-default'], 'x-default = EN').toBe(host + page.en);
    const en = await rawHtml(request, page.en);
    expect(alternates(en.html).de, 'EN page links back to DE').toBe(host + page.path);
    const uk = siteMap.pages.find((p) => p.lang === 'uk' && p.role === 'index' && p.en === page.en);
    if (uk) {
      expect(alts.uk, 'UK twin').toBe(host + uk.path);
      expect(alternates((await rawHtml(request, uk.path)).html).de, 'UK page links to DE').toBe(host + page.path);
    }
  });
}

for (const path of ['/de/', '/de/pages/service/custom-shopify-integrations/', '/de/pages/complex-solutions/']) {
  test(`DE v2 links stay in German on ${path}: header, menus, footer, related links → /de/ twins`, async ({ page }) => {
    await page.goto(path);
    const services = await page.$$eval('#v2-services-menu a', (as) => as.map((a) => a.getAttribute('href')));
    expect(services.length).toBeGreaterThan(0);
    expect(services.filter((h) => !h.startsWith('/de/')), 'services menu → DE pages').toEqual([]);
    const mobile = await page.$$eval('#v2-mnav-services a', (as) => as.map((a) => a.getAttribute('href')));
    expect(mobile.filter((h) => !h.startsWith('/de/')), 'mobile services → DE pages').toEqual([]);
    expect(services).toContain('/de/pages/complex-solutions/');
    await expect(page.locator('.v2-header__logo')).toHaveAttribute('href', '/de/');
    const legal = await page.$$eval('.v2-footer__legal a', (as) => as.map((a) => a.getAttribute('href')));
    expect(legal.sort()).toEqual(['/de/datenschutz/', '/de/impressum/', '/pages/terms-and-conditions/']);
    // The language switcher's EN/UK links are meant to leave German; everything else must stay.
    const hrefs = await page.$$eval('header a[href], nav a[href], footer a[href], main a[href]', (as) =>
      as.filter((a) => !a.hasAttribute('data-lang')).map((a) => a.getAttribute('href')));
    const internal = hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//'));
    // Internal links use the canonical form (no .html, trailing slash)
    expect(internal.filter((h) => h.includes('.html') || (!h.endsWith('/') && !h.includes('#')))).toEqual([]);
    // No link to an EN page that has a German twin
    const leaks = internal.filter((h) => !h.startsWith('/de/') && deTwin.has('/de' + h.split('#')[0]));
    expect(leaks, 'EN links where a /de/ twin exists').toEqual([]);
  });
}

test('DE terms: no German terms page; English terms stay the only terms (no duplicate under /de/)', async ({ request }) => {
  expect(siteMap.pages.find((p) => p.path === '/de/pages/terms-and-conditions/')).toBeUndefined();
  const { html } = await rawHtml(request, '/pages/terms-and-conditions/');
  expect(alternates(html).de, 'EN terms has no DE alternate').toBeUndefined();
});

test('DE form: EUR bands in German, "Bis 5.000 €" on service pages but not on Complex', async ({ request }) => {
  const band = '<input type="radio" name="budget" value="Up to €5k"><span>Bis 5.000 €</span>';
  for (const p of deV2.filter((x) => x.group === 'service' || x.group === 'home')) {
    const html = decode((await rawHtml(request, p.path)).html);
    expect(html, p.path).toContain(band);
    expect(html, p.path).toContain(`<legend>${shellDe.form.budgetLegend}</legend>`);
    expect(html, p.path).toContain(shellDe.form.submit);
    expect(html, `${p.path}: no USD`).not.toMatch(/value="[^"]*\$/);
  }
  expect(decode((await rawHtml(request, '/de/pages/complex-solutions/')).html)).not.toContain('Bis 5.000 €');
});

test('DE form preselects the page service (lead value stays English)', async ({ page }) => {
  await page.goto('/de/pages/service/shopify-migration-service/');
  await page.locator('.v2-hero [data-form-trigger]').first().click();
  await expect(page.locator('.v2-modal')).toHaveClass(/active/);
  await expect(page.locator('.v2-modal select[name="service"]')).toHaveValue('Shopify Migration');
});

test('DE shell UI strings inside the bodies come from shell.de.json → ui', async ({ request }) => {
  const home = decode((await rawHtml(request, '/de/')).html);
  expect(home).toContain(`aria-label="${shellDe.ui.focusLabel}"`);
  const svc = decode((await rawHtml(request, '/de/pages/service/custom-shopify-integrations/')).html);
  expect(svc).toContain(shellDe.ui.scrollHint);
  expect(svc).not.toContain('Scroll to Explore');
});

test('DE JSON-LD breadcrumb starts at /de/', async ({ request }) => {
  const { html } = await rawHtml(request, '/de/pages/shopify-development/');
  expect(html).toContain(`{"@type":"ListItem","position":1,"name":"Startseite","item":"${host}/de/"}`);
});

test('DE 404 (dist/de/404.html): v2 shell in German, links to DE service pages', async () => {
  test.skip(!!process.env.QA_BASE_URL, 'reads the local build');
  const file = fs.existsSync('dist/de/404.html') ? 'dist/de/404.html' : 'dist/de/404/index.html';
  const html = fs.readFileSync(file, 'utf8');
  expect(html).toMatch(/<html lang="de"/);
  expect(html).toMatch(/<body class="v2[^"]*" lang="de">/);
  expect(html).toContain('Seite nicht gefunden');
  expect(html).toMatch(/<meta name="robots" content="noindex/);
  expect(alternates(html)).toEqual({});
  for (const p of deIndexPages.filter((x) => x.group.startsWith('service'))) expect(html).toContain(`href="${p.path}"`);
});

// German copy: only once the copywriter's files exist (until then the DE pages render the EN copy).
const deCopy = fs.existsSync('content/pages/home.de.json');
test.describe('German copy (content/pages/*.de.json)', () => {
  test.skip(!deCopy, 'content/pages/home.de.json not there yet: DE pages render the EN fallback copy');

  test('/de/ renders home.de.json, not the EN copy', async ({ request }) => {
    const de = JSON.parse(fs.readFileSync('content/pages/home.de.json', 'utf8'));
    const en = JSON.parse(fs.readFileSync('content/pages/home.en.json', 'utf8'));
    const { html } = await rawHtml(request, '/de/');
    const h1 = decode(attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(h1).toContain(de.hero.title[0]);
    if (de.hero.title[0] !== en.hero.title[0]) expect(h1).not.toContain(en.hero.title[0]);
  });

  for (const page of deV2) {
    test(`${page.path}: meta from the de JSON when it has one`, async ({ request }) => {
      const key = (fs.readFileSync(page.file, 'utf8').match(/content\['([^']+)'\]\.de/) || [])[1];
      test.skip(!key || !fs.existsSync(`content/pages/${key}.de.json`), 'legal page or no de JSON for this page yet');
      const c = JSON.parse(fs.readFileSync(`content/pages/${key}.de.json`, 'utf8'));
      test.skip(!c.meta, 'de JSON has no meta: the wrapper fallback meta stays');
      const { html } = await rawHtml(request, page.path);
      expect(decode(attr(html, /<title>([^<]*)<\/title>/)).trim()).toBe(c.meta.title.trim());
    });
  }
});
