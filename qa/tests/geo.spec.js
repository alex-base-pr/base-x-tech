// GEO: T-040 robots, T-041 content without JS, T-042 JSON-LD, T-043 llms.txt.
import { test, expect } from '@playwright/test';
import { host, indexPages, deIndexPages, ukIndexPages, rawHtml, isDevTarget } from '../site-map.js';

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Amazonbot', 'meta-externalagent'];

// Minimal robots.txt evaluation: the group naming the bot (or *) must not disallow "/".
function allowedRoot(robots, bot) {
  const groups = [];
  let cur = null;
  for (const raw of robots.split('\n')) {
    const line = raw.split('#')[0].trim();
    const [k, ...rest] = line.split(':');
    const v = rest.join(':').trim();
    if (/^user-agent$/i.test(k)) {
      if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(v.toLowerCase());
    } else if (cur && /^(allow|disallow)$/i.test(k)) cur.rules.push([k.toLowerCase(), v]);
  }
  const g = groups.find((x) => x.agents.includes(bot.toLowerCase())) || groups.find((x) => x.agents.includes('*'));
  return !g || !g.rules.some(([k, v]) => k === 'disallow' && v === '/');
}

test('T-040 robots.txt allows every AI crawler, ai-train=yes, both sitemaps', async ({ request }) => {
  test.skip(isDevTarget, 'dev robots.txt is Disallow: / by design (REQ-022)');
  const robots = await (await request.get('/robots.txt')).text();
  for (const bot of AI_BOTS) expect(allowedRoot(robots, bot), `${bot} allowed`).toBe(true);
  expect(robots).toMatch(/Content-Signal:.*ai-train=yes/i);
  expect(robots).toContain(`Sitemap: ${host}/sitemap.xml`);
  expect(robots).toContain(`Sitemap: ${host}/blog/sitemap.xml`);
});

for (const page of [...indexPages, ...deIndexPages, ...ukIndexPages]) {
  test(`T-041 ${page.path}: copy in raw HTML inside <main>`, async ({ request }) => {
    // The Impressum is a short statutory notice (DE-only, § 5 DDG), not a content page: h1 in <main> is enough.
    const minWords = page.path === '/de/impressum/' ? 50 : 150;
    const { html } = await rawHtml(request, page.path);
    const main = (html.match(/<main[\s>][\s\S]*<\/main>/i) || [''])[0];
    expect(main.length, '<main> present').toBeGreaterThan(0);
    expect(main, 'h1 inside <main>').toMatch(/<h1[\s>]/i);
    const words = main.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean);
    expect(words.length, 'words of copy in <main> without JS').toBeGreaterThan(minWords);
  });

  test(`T-042 ${page.path}: valid JSON-LD with required types`, async ({ request }) => {
    const { html } = await rawHtml(request, page.path);
    const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
    const types = new Set();
    for (const b of blocks) {
      const data = JSON.parse(b); // throws on invalid JSON
      const nodes = data['@graph'] || (Array.isArray(data) ? data : [data]);
      nodes.forEach((n) => [].concat(n['@type']).forEach((t) => types.add(t)));
    }
    const required = page.group === 'home' ? ['Organization', 'WebSite']
      : page.group === 'service' ? ['Service', 'BreadcrumbList'] : ['BreadcrumbList'];
    for (const t of required) expect([...types], `JSON-LD @type ${t}`).toContain(t);
    if (page.faq) expect([...types], 'FAQPage where the page has an FAQ').toContain('FAQPage');
  });
}

test('T-043 llms.txt lists exactly the indexable pages; llms-full.txt has every H1', async ({ request }) => {
  const llms = await (await request.get('/llms.txt')).text();
  const urls = [...llms.matchAll(/\((https:\/\/base-xtech\.com[^)\s]*)\)/g)].map((m) => m[1]);
  const pages = urls.filter((u) => !u.includes('/blog'));
  expect([...new Set(pages)].sort()).toEqual([...indexPages, ...deIndexPages, ...ukIndexPages].map((p) => host + p.path).sort());
  // DE and UK pages only in their own sections (2026-09-26), never mixed into the English ones.
  const [enPart, rest = ''] = llms.split('## Deutsch');
  const [dePart, ukPart = ''] = rest.split('## Українською');
  for (const [pages, part, name] of [[deIndexPages, dePart, 'DE'], [ukIndexPages, ukPart, 'UK']]) {
    for (const p of pages) {
      expect(part, `${name} section lists ${p.path}`).toContain(`(${host + p.path})`);
      expect(enPart, `${p.path} only in the ${name} section`).not.toContain(`(${host + p.path})`);
    }
  }
  for (const p of ukIndexPages) expect(dePart, `${p.path} not in the DE section`).not.toContain(`(${host + p.path})`);

  const full = await request.get('/llms-full.txt');
  expect(full.status()).toBe(200);
  const text = await full.text();
  for (const p of indexPages) expect(text, `llms-full contains ${p.path}`).toContain(host + p.path);
});
