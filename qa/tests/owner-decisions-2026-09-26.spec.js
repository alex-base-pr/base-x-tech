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
