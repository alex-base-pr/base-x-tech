// T-001 status + console, T-003 SEO head, T-007 no horizontal scroll + screenshots.
import { test, expect } from '@playwright/test';
import { enPages, dePages, indexPages, expectedCanonical, rawHtml } from '../site-map.js';

const attr = (html, re) => (html.match(re) || [])[1];

for (const page of [...enPages, ...dePages]) {
  test.describe(`${page.path} @cross`, () => {
    test('T-001 200 and no console errors', async ({ page: p }) => {
      const errors = [];
      // CookieYes warns when the host is not the registered prod domain (localhost, dev) — expected off prod.
      const offProd = !(process.env.QA_BASE_URL || '').startsWith('https://base-xtech.com');
      // Third-party review widgets (GoodFirms, Sortlist) log their own frame/CSP errors — not ours to fix.
      const expected = (msg) => (offProd && /CookieYes|website URL has changed/i.test(msg)) || /goodfirms|sortlist/i.test(msg);
      p.on('console', (m) => {
        if (m.type() === 'error' && !expected(m.text())) errors.push(`${m.text()} ${m.location()?.url || ''}`.trim());
      });
      p.on('pageerror', (e) => { if (!expected(e.message)) errors.push(e.message); });
      const res = await p.goto(page.path);
      expect(res.status(), 'HTTP status').toBe(200);
      await p.waitForLoadState('networkidle');
      expect(errors, 'console errors').toEqual([]);
    });

    test('T-003 head: h1, title, description, canonical, robots', async ({ request }) => {
      const { html } = await rawHtml(request, page.path);
      const h1s = html.match(/<h1[\s>]/gi) || [];
      expect(h1s.length, 'exactly one <h1> in raw HTML').toBe(1);

      const title = attr(html, /<title>([^<]*)<\/title>/i)?.trim() || '';
      expect(title.length, `title "${title}"`).toBeGreaterThan(0);
      expect(title.length, `title ≤ 60: "${title}"`).toBeLessThanOrEqual(60);

      const desc = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i) || '';
      expect(desc.length, 'meta description present').toBeGreaterThan(0);
      if (page.role !== 'noindex') expect(desc.length, `description ≤ 160: "${desc}"`).toBeLessThanOrEqual(160);

      const canonical = attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
      expect(canonical, 'static canonical').toBe(expectedCanonical(page));

      const robots = attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '';
      if (page.role === 'noindex') expect(robots).toContain('noindex');
      else expect(robots, 'no noindex on indexable page').not.toContain('noindex');
    });

    for (const width of [375, 768, 1440]) {
      test(`T-007 no horizontal scroll @${width}`, async ({ page: p }) => {
        await p.setViewportSize({ width, height: 900 });
        await p.goto(page.path);
        await p.waitForLoadState('networkidle');
        await p.waitForTimeout(500); // sliders (Flickity) finish layout after load; measuring earlier is flaky under load
        // Off-canvas drawers widen scrollWidth but are clipped by body overflow-x; what matters is whether the user can scroll.
        const scrollX = await p.evaluate(() => { window.scrollTo(10000, 0); return window.scrollX; });
        expect(scrollX, 'page scrolls horizontally by px').toBe(0);
        if (page.role === 'index') {
          const name = page.path.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home';
          await p.screenshot({ path: `qa/screens/${name}-${width}.png`, fullPage: true });
        }
      });
    }
  });
}

test('T-003 titles and descriptions are unique across indexable pages', async ({ request }) => {
  const seen = { title: new Map(), desc: new Map() };
  for (const page of indexPages) {
    const { html } = await rawHtml(request, page.path);
    const t = attr(html, /<title>([^<]*)<\/title>/i)?.trim();
    const d = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
    for (const [k, v] of [['title', t], ['desc', d]]) {
      if (!v) continue;
      expect(seen[k].get(v), `duplicate ${k} on ${page.path}: "${v}"`).toBeUndefined();
      seen[k].set(v, page.path);
    }
  }
});
