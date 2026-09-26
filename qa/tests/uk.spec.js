// UK on design v2 (2026-09-26): /uk/ index pages use the v2 templates with lang "uk"; copy comes from
// content/pages/<page>.uk.json and falls back to EN while the copywriter's files are missing.
// Retired UK pages mirror their EN twins: absorbed → canonical to the UK parent, ppc/seo → noindex; not in sitemap.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { host, siteMap, ukPages, ukIndexPages, rawHtml, isDevTarget } from '../site-map.js';

const attr = (html, re) => (html.match(re) || [])[1];
const decode = (s = '') => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const alternates = (html) => Object.fromEntries([...html.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([^"]+)">/g)].map((m) => [m[2], m[1]]));

for (const page of ukIndexPages) {
  test(`UK v2 ${page.path}: lang="uk", v2 shell, EN twin in the cluster @cross`, async ({ request }) => {
    const { status, html } = await rawHtml(request, page.path);
    expect(status).toBe(200);
    expect(html).toMatch(/<html lang="uk"/);
    expect(html).toMatch(/<body class="v2[^"]*" lang="uk">/);
    expect(html, 'no legacy UA header').not.toContain('site-header');
    const alts = alternates(html);
    expect(alts.uk, 'self').toBe(host + page.path);
    expect(alts.en, 'EN twin').toBe(host + page.en);
    expect(alts['x-default'], 'x-default = EN').toBe(host + page.en);
    const en = await rawHtml(request, page.en);
    expect(alternates(en.html).uk, 'EN page links back to UK').toBe(host + page.path);
  });
}

test('UK v2 links stay in Ukrainian: header and footer point at the /uk/ twins', async ({ page }) => {
  await page.goto('/uk/pages/service/custom-shopify-integrations/');
  const services = await page.$$eval('#v2-services-menu a', (as) => as.map((a) => a.getAttribute('href')));
  expect(services.length).toBeGreaterThan(0);
  expect(services.filter((h) => !h.startsWith('/uk/')), 'services menu → UK pages').toEqual([]);
  await expect(page.locator('.v2-header__logo')).toHaveAttribute('href', '/uk/');
  const legal = await page.$$eval('.v2-footer__legal a', (as) => as.map((a) => a.getAttribute('href')));
  expect(legal.sort()).toEqual(['/uk/pages/privacy-policy/', '/uk/pages/terms-and-conditions/']);
  // Internal links use the canonical form (no .html, trailing slash)
  const hrefs = await page.$$eval('header a[href], nav a[href], footer a[href], main a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const bad = hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//') && (h.includes('.html') || (!h.endsWith('/') && !h.includes('#'))));
  expect(bad).toEqual([]);
});

test('UK legal pages: v2 shell, Ukrainian legal-entity block', async ({ request }) => {
  for (const path of ['/uk/pages/privacy-policy/', '/uk/pages/terms-and-conditions/']) {
    const { html } = await rawHtml(request, path);
    expect(html, path).toMatch(/<body class="v2[^"]*" lang="uk">/);
    expect(html, path).toContain('Base X Tech Ltd, зареєстрованій в Англії та Уельсі, номер компанії 16134538');
    expect(html, path).toContain('27 Old Gloucester Street, London WC1N 3AX, United Kingdom');
  }
  expect((await rawHtml(request, '/uk/pages/privacy-policy/')).html).toContain('контролером персональних даних');
});

test('UK 404 (dist/uk/404.html): v2 shell in Ukrainian, links to UK service pages', async () => {
  test.skip(!!process.env.QA_BASE_URL, 'reads the local build');
  const html = fs.readFileSync('dist/uk/404.html', 'utf8');
  expect(html).toMatch(/<html lang="uk"/);
  expect(html).toMatch(/<body class="v2[^"]*" lang="uk">/);
  expect(html).toContain('Сторінку не знайдено');
  expect(html).toMatch(/<meta name="robots" content="noindex/);
  for (const p of ukIndexPages.filter((x) => x.group.startsWith('service'))) expect(html).toContain(`href="${p.path}"`);
});

for (const page of ukPages.filter((p) => p.role !== 'index')) {
  test(`retired UK ${page.path}: ${page.role === 'absorbed' ? 'canonical → ' + page.canonical : 'noindex'}, not in sitemap`, async ({ request }) => {
    const { status, html } = await rawHtml(request, page.path);
    expect(status, 'still live').toBe(200);
    const canonical = attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
    const robots = attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '';
    if (page.role === 'absorbed') {
      expect(canonical).toBe(host + page.canonical);
      const parent = siteMap.pages.find((p) => p.path === page.canonical);
      expect(parent?.role, 'canonical target is an indexable UK page').toBe('index');
      expect(parent?.lang).toBe('uk');
      // Same treatment as the EN twin: its canonical target is the EN version of ours.
      const enTwin = siteMap.pages.find((p) => p.path === page.path.replace(/^\/uk/, ''));
      expect(enTwin?.canonical, 'EN twin is absorbed into the EN version of our target').toBe(parent.en);
      if (!isDevTarget) expect(robots).not.toContain('noindex');
    } else {
      expect(canonical).toBe(host + page.path);
      expect(robots).toContain('noindex');
    }
    if (!process.env.QA_BASE_URL) expect(fs.readFileSync('dist/sitemap.xml', 'utf8')).not.toContain(`<loc>${host + page.path}</loc>`);
  });
}

// Ukrainian copy: only once the copywriter's files exist (until then the UK pages render the EN copy).
const ukCopy = fs.existsSync('content/pages/home.uk.json');
test.describe('Ukrainian copy (content/pages/*.uk.json)', () => {
  test.skip(!ukCopy, 'content/pages/home.uk.json not there yet: UK pages render the EN fallback copy');

  test('/uk/ renders home.uk.json, not the EN copy', async ({ request }) => {
    const uk = JSON.parse(fs.readFileSync('content/pages/home.uk.json', 'utf8'));
    const en = JSON.parse(fs.readFileSync('content/pages/home.en.json', 'utf8'));
    const { html } = await rawHtml(request, '/uk/');
    const h1 = decode(attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(h1).toContain(uk.hero.title[0]);
    if (uk.hero.title[0] !== en.hero.title[0]) expect(h1).not.toContain(en.hero.title[0]);
    expect(html, 'Cyrillic in the body').toMatch(/<main[\s\S]*[А-Яа-яІіЇїЄєҐґ][\s\S]*<\/main>/);
  });

  for (const page of ukIndexPages) {
    test(`${page.path}: meta from the uk JSON when it has one`, async ({ request }) => {
      const key = (fs.readFileSync(page.file, 'utf8').match(/content\['([^']+)'\]\.uk/) || [])[1];
      test.skip(!key || !fs.existsSync(`content/pages/${key}.uk.json`), 'legal/404 page or no uk JSON for this page yet');
      const c = JSON.parse(fs.readFileSync(`content/pages/${key}.uk.json`, 'utf8'));
      test.skip(!c.meta, 'uk JSON has no meta: pre-v2 UK title/description stay');
      const { html } = await rawHtml(request, page.path);
      expect(decode(attr(html, /<title>([^<]*)<\/title>/)).trim()).toBe(c.meta.title.trim());
    });
  }

  test('UK shell strings come from shell.uk.json when it exists', async ({ page }) => {
    test.skip(!fs.existsSync('content/pages/shell.uk.json'), 'no shell.uk.json yet');
    const sh = JSON.parse(fs.readFileSync('content/pages/shell.uk.json', 'utf8'));
    await page.goto('/uk/');
    await expect(page.locator('.v2-header [data-v2-services]')).toHaveText(sh.nav.services);
    await expect(page.locator('#task-form button[type="submit"]')).toContainText(sh.form.submit);
  });
});
