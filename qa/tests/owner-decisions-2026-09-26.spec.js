// Owner decisions of 2026-09-26 (UK copy pass + free first call): regressions we don't want back.
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { rawHtml, ukIndexPages } from '../site-map.js';

const decode = (s = '') => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const shell = (lang) => JSON.parse(fs.readFileSync(`content/pages/shell.${lang}.json`, 'utf8'));

// Free first call (owner, 2026-09-26): one line under the primary CTA buttons, shared from shell.<lang>.json → ctaNote.
for (const [p, lang] of [
  ['/', 'en'],
  ['/pages/service/custom-shopify-integrations/', 'en'],
  ['/de/pages/complex-solutions/', 'de'],
  ['/uk/', 'uk'],
]) {
  test(`free first call line under the CTA buttons on ${p}`, async ({ request }) => {
    const note = shell(lang).ctaNote;
    expect(note, `shell.${lang}.json ctaNote`).toBeTruthy();
    const { html } = await rawHtml(request, p);
    const notes = [...html.matchAll(/<p class="v2-cta-note">([^<]*)<\/p>/g)].map((m) => decode(m[1]));
    expect(notes.length, 'hero + closing CTA').toBeGreaterThanOrEqual(2);
    for (const n of notes) expect(n).toBe(note);
    expect(decode(html)).toContain(`<p class="v2-form__promise">${note}</p>`); // modal: merged with the reply-time line, not duplicated
  });
}

test('UK Complex: Vadym-Marko Hruden is the contact, no Alexander Karl partner block', async ({ request }) => {
  const { html } = await rawHtml(request, '/uk/pages/complex-solutions/');
  const partner = (html.match(/<section class="cx-section cx-partner[^"]*" id="local-expertise"[\s\S]*?<\/section>/) || [''])[0];
  expect(partner).toContain('<strong>Вадим-Марко Груден</strong>');
  expect(partner).toContain('CBDO, Base X Tech');
  expect(partner).not.toContain('Alexander Karl');
  expect(partner, 'text-only: no photo').not.toContain('<img');
  expect(partner, 'no in-person line').not.toContain('cx-partner__inperson');
  expect(html).not.toContain('Берлін');
  const team = (html.match(/<aside class="v2-team"[\s\S]*?<\/aside>/) || [''])[0];
  expect([...team.matchAll(/<strong>([^<]+)<\/strong>/g)].map((m) => m[1])).toEqual(['Софія Забродська', 'Вадим-Марко Груден']);
  expect(html).not.toContain('Alexander Karl');
});

test('EN and DE Complex keep Alexander Karl', async ({ request }) => {
  for (const p of ['/pages/complex-solutions/', '/de/pages/complex-solutions/']) {
    expect((await rawHtml(request, p)).html, p).toContain('<strong>Alexander Karl</strong>');
  }
});

test('UK pages: euro only (no "$"), Ukrainian team names in Cyrillic', async ({ request }) => {
  for (const p of ukIndexPages) {
    const { html } = await rawHtml(request, p.path);
    const body = (html.match(/<body[\s\S]*<\/body>/) || [''])[0].replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ');
    expect(body, p.path).not.toContain('$');
    for (const latin of ['Sofiia Zabrodska', 'Vadym-Marko Hruden', 'Oleksandr Rudenko']) expect(body, `${p.path}: ${latin}`).not.toContain(latin);
  }
  for (const p of ['/uk/pages/service/custom-shopify-integrations/', '/uk/pages/service/shopify-migration-service/', '/uk/pages/complex-solutions/']) {
    expect(decode((await rawHtml(request, p)).html), p).toContain('<p class="v2-offer__amount">Фіксована ціна: 1 999 €</p>');
  }
});

test('UK: CTA buttons read «Обговорити проєкт», header pill «Зв’язатися»', async ({ request }) => {
  const { html } = await rawHtml(request, '/uk/');
  const labels = [...html.matchAll(/<a href="#contact" class="v2-btn" data-form-trigger><span class="v2-btn__label">([^<]*)<\/span>/g)].map((m) => decode(m[1]));
  expect(labels.length).toBeGreaterThan(0);
  expect([...new Set(labels)]).toEqual(['Обговорити проєкт']);
  expect(decode(html)).toContain('class="v2-pill v2-pill--accent" data-form-trigger>Зв’язатися</a>');
});

test('no "award-winning" claim anywhere in dist (NAYA is a CES Innovation Awards honoree)', async () => {
  test.skip(!!process.env.QA_BASE_URL, 'reads the local build');
  const hits = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(html|txt|xml|json)$/.test(f.name) && /award[- ]winning|preisgekrönt|отримала CES Innovation Award/i.test(fs.readFileSync(p, 'utf8'))) hits.push(p);
    }
  };
  walk('dist');
  expect(hits).toEqual([]);
});
