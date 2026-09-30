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

for (const [lang, path] of Object.entries(PAGES)) {
  test(`${lang}: "typical situations" with 5 cards is the 2nd section`, async ({ request }) => {
    const { html } = await rawHtml(request, path);
    const ids = [...main(html).matchAll(/<section class="[^"]*"(?: id="([^"]*)")?/g)].map((m) => m[1] || '(hero)');
    expect(ids.slice(0, 2)).toEqual(['(hero)', 'typical-situations']);
    const section = (html.match(/<section[^>]+id="typical-situations"[\s\S]*?<\/section>/) || [''])[0];
    const cards = [...section.matchAll(/<li class="cx-card">\s*<h3[^>]*>([^<]+)<\/h3>\s*<p>[^<]{20,}<\/p>/g)].map((m) => decode(m[1]));
    expect(cards).toEqual(copy(lang).useCases.cards.map((c) => c.title));
    expect(cards).toHaveLength(5);
    expect(html, 'old "When we can help" section is gone').not.toContain('id="when-we-can-help"');
  });
}

for (const [lang, path] of Object.entries(PAGES)) {
  test(`${lang}: generic system diagram (store → our middleware → ERP, CMS, PIM, POS, any system), no flow labels`, async ({ request }) => {
    const { html } = await rawHtml(request, path);
    const fig = decode((html.match(/<figure class="cx-diagram"[\s\S]*?<\/figure>/) || [''])[0]);
    const d = copy(lang).architecture.diagram;
    for (const t of [d.store, d.middleware, ...d.systems, d.any, d.desc]) expect(fig).toContain(t);
    expect(fig).toMatch(/role="img" aria-labelledby="cx-flow-desc"/);
    expect(fig, 'no case-specific labels').not.toMatch(/Mettler|Xentral|XML/);
  });
}

for (const [lang, path] of Object.entries(PAGES)) {
  test(`${lang}: process steps sit in one row at 1440 (same top, left → right) and stack at 375`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const boxes = async () => page.locator('.cx-process__card').evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), left: Math.round(r.left) }; }));
    const wide = await boxes();
    expect(wide).toHaveLength(4);
    expect(new Set(wide.map((b) => b.top)).size, 'same top offset').toBe(1);
    for (let i = 1; i < 4; i++) expect(wide[i].left).toBeGreaterThan(wide[i - 1].left);
    await page.setViewportSize({ width: 375, height: 800 });
    const narrow = await boxes();
    for (let i = 1; i < 4; i++) expect(narrow[i].top).toBeGreaterThan(narrow[i - 1].top);
  });
}

test('no fixed-price audit block on Complex (EN/DE/UK); still on Integrations and Migration in every language', async ({ request }) => {
  for (const path of Object.values(PAGES)) {
    const { html } = await rawHtml(request, path);
    expect(html, path).not.toContain('v2-offer');
    expect(html, path).not.toContain('id="fixed-price-audit"');
  }
  for (const pre of ['', '/de', '/uk']) {
    for (const p of ['/pages/service/custom-shopify-integrations/', '/pages/service/shopify-migration-service/']) {
      const { html } = await rawHtml(request, pre + p);
      expect(html, pre + p).toContain('<section class="v2-section v2-dark v2-offer" id="fixed-price-audit"');
    }
  }
});

// Team block (DACH review + owner 2026-09-30): before the FAQ, lead large + the others smaller, studio photos, no contacts.
const TEAM = {
  en: { people: ['Alexander Karl', 'Sofiia Zabrodska', 'Vadym-Marko Hruden', 'Oleksandr Rudenko'], roles: ['Country Manager DACH', 'Business Development Manager', 'CBDO', 'Founder & CEO'], title: 'The team behind' },
  de: { people: ['Alexander Karl', 'Sofiia Zabrodska', 'Vadym-Marko Hruden', 'Oleksandr Rudenko'], roles: ['Country Manager DACH', 'Business Development Manager', 'CBDO', 'Gründer & CEO'], title: 'Das Team hinter' },
  uk: { people: ['Вадим-Марко Груден', 'Софія Забродська', 'Олександр Руденко'], roles: ['CBDO', 'Менеджерка з розвитку бізнесу', 'Засновник і CEO'], title: 'Команда, яка стоїть' },
};
for (const [lang, path] of Object.entries(PAGES)) {
  test(`${lang}: team block before the FAQ, ${TEAM[lang].people.length} people, ${TEAM[lang].people[0]} leads`, async ({ request }) => {
    const { html } = await rawHtml(request, path);
    const m = main(html);
    const section = decode((m.match(/<section class="cx-section cx-team" id="team"[\s\S]*?<\/section>/) || [''])[0]);
    expect(section, 'team section').not.toBe('');
    expect(section).toContain(TEAM[lang].title);
    expect(m.indexOf('id="team"')).toBeLessThan(m.indexOf('id="faq"'));
    expect(m.indexOf('id="team"')).toBeGreaterThan(m.indexOf('id="process"'));
    const people = [...section.matchAll(/<h3 class="cx-team__name[^"]*">([^<]+)<\/h3>\s*<p class="cx-team__role">([^<]+)<\/p>/g)].map((x) => [x[1], x[2]]);
    expect(people.map((p) => p[0])).toEqual(TEAM[lang].people);
    expect(people.map((p) => p[1])).toEqual(TEAM[lang].roles);
    expect(section.match(/<article class="cx-team__lead">[\s\S]*?<\/article>/)[0]).toContain(TEAM[lang].people[0]);
    const alts = [...section.matchAll(/<img[^>]+src="\/images\/v2\/team\/[a-z]+\.webp" width="800" height="1000" alt="([^"]+)"/g)].map((x) => x[1]);
    expect(alts).toEqual(TEAM[lang].people.map((p, i) => `${p}, ${TEAM[lang].roles[i]}`)); // alt = "<Name>, <role>"
    expect(section, 'Sofiia = first contact, proposals').toMatch(/First contact, proposals|Erster Kontakt, Angebote|Перший контакт, комерційні пропозиції/);
    expect(section, 'no contact details').not.toMatch(/mailto:|tel:|calendly|@base-xtech/i);
    expect(section, 'location line').toMatch(/Kyiv|Kyjiw|Києва/);
    if (lang === 'uk') expect(html).not.toContain('Alexander Karl');
    const cta = (m.match(/<section class="cx-cta"[\s\S]*?<\/section>/) || [''])[0];
    expect(cta, 'no "Who you\'ll talk to" list in the closing CTA').not.toContain('v2-team');
  });
}

test('FAQ "who will we talk to": Country Manager DACH on EN/DE, Vadym-Marko on UK', async ({ request }) => {
  const faq = async (p) => decode(((await rawHtml(request, p)).html.match(/<p data-faq-a>([^<]*)<\/p>/) || [])[1]);
  expect(await faq(PAGES.en)).toContain('Alexander Karl, our Country Manager DACH');
  expect(await faq(PAGES.de)).toContain('Alexander Karl, unser Country Manager DACH');
  expect(await faq(PAGES.uk)).toContain('Вадим-Марко Груден');
});
