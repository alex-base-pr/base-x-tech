// Complex Solutions restructure after the DACH partner's review (2026-09-30), EN / DE / UK.
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { rawHtml } from '../site-map.js';

const PAGES = { en: '/pages/complex-solutions/', de: '/de/pages/complex-solutions/', uk: '/uk/pages/complex-solutions/' };
const copy = (lang) => JSON.parse(fs.readFileSync(`content/pages/complex-solutions.${lang}.json`, 'utf8'));
const decode = (s = '') => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const main = (html) => (html.match(/<main[\s\S]*<\/main>/) || [''])[0];

for (const [lang, path] of Object.entries(PAGES)) {
  test(`${lang}: hero = eyebrow, H1, exactly one paragraph, CTA, free-call note`, async ({ request }) => {
    const { html } = await rawHtml(request, path);
    const body = (html.match(/<div class="cx-hero__body">([\s\S]*?)<div class="cx-strip">/) || [])[1] || '';
    const beforeCta = body.split('class="cx-btn')[0];
    const afterH1 = beforeCta.split('</h1>')[1] || '';
    expect((afterH1.match(/<p[\s>]/g) || []).length, 'paragraphs between H1 and CTA').toBe(1);
    expect(decode(afterH1)).toContain(copy(lang).hero.lead);
    expect(beforeCta).toMatch(/<p class="cx-label[^"]*">[\s\S]*<h1/); // eyebrow before the title
    expect(body.split('class="cx-btn')[1] || '').toContain('class="v2-cta-note"');
  });
}
