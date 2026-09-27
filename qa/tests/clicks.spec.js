// Regressions for click targets (2026-09-27): decorative arrows must not swallow clicks, inline copy links stay in the page language.
import { test, expect } from '@playwright/test';

for (const path of ['/', '/de/', '/uk/']) {
  test(`article card arrow opens the article on ${path} (hovered, real click)`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const card = page.locator('.h-article').first();
    const href = await card.locator('.h-article__title a').getAttribute('href');
    const arrow = card.locator('.h-article__arrow');
    await arrow.scrollIntoViewIfNeeded();
    await arrow.hover();
    const box = await arrow.boundingBox();
    const target = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'), [box.x + box.width / 2, box.y + box.height / 2]);
    expect(target).toBe(href);
  });
}

for (const [path, want] of [['/de/pages/service/custom-web-design-services/', '/de/pages/shopify-development/'], ['/uk/pages/service/custom-web-design-services/', '/uk/pages/shopify-development/']]) {
  test(`inline links in FAQ copy stay in the page language on ${path}`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    expect(html).toContain(`href='${want}'`);
    expect(html).not.toMatch(/data-faq-a>[^<]*<a href='\/pages\//);
  });
}
