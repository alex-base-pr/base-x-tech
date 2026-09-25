// REQ-019: German pages — lang, reciprocal hreflang, own title/meta, JSON-LD, in sitemap.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { host, dePages, rawHtml } from '../site-map.js';

for (const de of dePages) {
  test(`REQ-019 ${de.path}: German page wired to its English original`, async ({ request }) => {
    const { status, html } = await rawHtml(request, de.path);
    expect(status).toBe(200);
    expect(html).toMatch(/<html lang="de"/);
    const alt = (h) => Object.fromEntries([...h.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([^"]+)">/g)].map((m) => [m[2], m[1]]));
    const deAlt = alt(html);
    expect(fs.readFileSync('dist/sitemap.xml', 'utf8')).toContain(`<loc>${host + de.path}</loc>`);
    expect(html).toContain(`<link rel="canonical" href="${host + de.path}">`);
    if (!de.en) { // DE-only page (Impressum): no language cluster at all
      expect(deAlt, 'DE-only page has no hreflang').toEqual({});
      return;
    }
    expect(deAlt.de).toBe(host + de.path);
    expect(deAlt.en).toBe(host + de.en);
    expect(deAlt['x-default']).toBe(host + de.en);
    const en = await rawHtml(request, de.en);
    expect(alt(en.html).de, 'English page links back to German').toBe(host + de.path);
    const t = (h) => (h.match(/<title>([^<]*)<\/title>/) || [])[1];
    expect(t(html)).not.toBe(t(en.html));
    if (de.group.startsWith('service')) expect(html).toContain('"@type":"Service"');
  });
}

// A10: Ukrainian is hidden from the switcher UI only; /uk/ pages and their hreflang in <head> stay as they are.
test('A10: EN pages keep hreflang="uk" and /uk/ pages still render', async ({ request }) => {
  for (const [en, uk] of [['/', '/uk/'], ['/pages/service/custom-shopify-integrations/', '/uk/pages/service/custom-shopify-integrations/']]) {
    const { html } = await rawHtml(request, en);
    expect(html, `${en} hreflang uk`).toContain(`<link rel="alternate" href="${host + uk}" hreflang="uk">`);
    expect((await rawHtml(request, uk)).status).toBe(200);
  }
});
