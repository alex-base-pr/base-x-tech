// T-004 nav links, T-005 sitemap.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { siteMap, host, indexPages, servicePaths, ukIndexPages } from '../site-map.js';

test('T-004 header/drawer/footer links use canonical form (no .html, trailing slash)', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('header a[href], .drawer a[href], nav a[href], footer a[href]', (as) =>
    as.map((a) => a.getAttribute('href')));
  const internal = hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//') && !h.startsWith('/#'));
  const bad = internal.filter((h) => h.includes('.html') || (!h.endsWith('/') && !h.includes('#')));
  expect(bad, 'non-canonical internal links').toEqual([]);
});

test('T-004 services menu lists exactly the six service pages (REQ-007)', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('header a[href], .drawer a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const services = [...new Set(hrefs.filter((h) => /^\/pages\/(service\/|shopify-development\/)/.test(h)))].sort();
  expect(services).toEqual([...servicePaths].sort());
});

test('T-005 sitemap.xml = indexable EN set + indexable UK set, canonical form', async () => {
  const xml = fs.readFileSync('dist/sitemap.xml', 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const en = locs.filter((u) => !u.startsWith(host + '/uk/') && !u.startsWith(host + '/de/')).sort();
  expect(en).toEqual(indexPages.map((p) => host + p.path).sort());
  const nonIndex = siteMap.pages.filter((p) => p.role !== 'index').map((p) => host + p.path);
  expect(locs.filter((u) => nonIndex.includes(u)), 'absorbed/noindex pages must not be in sitemap').toEqual([]);
  expect(locs.filter((u) => !u.endsWith('/')), 'every sitemap URL ends with /').toEqual([]);
  const uk = locs.filter((u) => u.startsWith(host + '/uk/')).sort();
  expect(uk, 'UK = the indexable UK pages of the site map').toEqual(ukIndexPages.map((p) => host + p.path).sort());
});
