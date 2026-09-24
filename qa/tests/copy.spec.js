// T-002: rendered page carries Marko's approved copy (fixtures in content/expect/*.json).
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { rawHtml } from '../site-map.js';

const clean = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ').trim().toLowerCase();

for (const file of fs.readdirSync('content/expect').filter((f) => f.endsWith('.json'))) {
  const exp = JSON.parse(fs.readFileSync(`content/expect/${file}`, 'utf8'));
  test(`T-002 ${exp.path} matches approved copy`, async ({ request }) => {
    const { html } = await rawHtml(request, exp.path);
    expect(clean((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '')).toBe(clean(exp.title));
    expect(clean((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '')).toBe(clean(exp.description));
    expect(clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '')).toBe(clean(exp.h1));
    const h3 = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => clean(m[1]));
    for (const t of exp.h3 || []) expect(h3, `H3 "${t}"`).toContain(clean(t));
    if (exp.faq_count) expect((html.match(/data-faq-q/g) || []).length, 'FAQ questions').toBe(exp.faq_count);
  });
}
