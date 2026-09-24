// Language switcher shows a language only where this page has that version (hreflang), and links there.
import { test, expect } from '@playwright/test';

const cases = [
  { path: '/pages/complex-solutions/', visible: ['en', 'de'], active: 'en', go: { de: '/de/pages/complex-solutions/' } },
  { path: '/de/pages/complex-solutions/', visible: ['en', 'de'], active: 'de', go: { en: '/pages/complex-solutions/' } },
  { path: '/pages/service/custom-shopify-integrations/', visible: ['en', 'uk'], active: 'en', go: { uk: '/uk/pages/service/custom-shopify-integrations/' } },
  { path: '/', visible: ['en', 'uk'], active: 'en', go: { uk: '/uk/' } },
  { path: '/uk/', visible: ['en', 'uk'], active: 'uk', go: { en: '/' } },
];

for (const c of cases) {
  for (const [width, sel] of [[1440, '.language-switcher'], [375, '.language-switcher-mobile']]) {
    test(`switcher ${c.path} @${width} @cross`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(c.path);
      await page.waitForLoadState('domcontentloaded');
      // Design-v2 pages have one switcher behind the globe button at every width.
      const v2 = await page.locator('body.v2').count();
      const scope = v2 ? '.v2-lang .language-switcher' : sel;
      const links = page.locator(`${scope} [data-lang]`);
      await expect(links.first()).toBeAttached();
      if (v2) await page.click('[data-v2-lang]');
      else if (width === 375) await page.click('#mobileLangToggle'); // open the dropdown so visibility is real, not just the attribute
      const state = await links.evaluateAll((as) => as.map((a) => ({ lang: a.dataset.lang, hidden: a.hidden || getComputedStyle(a).display === 'none', active: a.classList.contains('is-active'), href: a.getAttribute('href') })));
      expect(state.filter((s) => !s.hidden).map((s) => s.lang).sort()).toEqual([...c.visible].sort());
      expect(state.find((s) => s.active)?.lang).toBe(c.active);
      for (const [lang, href] of Object.entries(c.go)) expect(state.find((s) => s.lang === lang).href).toBe(href);
      if (width === 375 && !v2) expect(state[0].lang, 'mobile dropdown: current language first (it overlays the toggle)').toBe(c.active);
    });
  }
}

test('saved UK preference does not redirect an EN-only page to a 404', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredLang', 'uk'));
  page.on('dialog', (d) => d.dismiss());
  await page.goto('/pages/complex-solutions/');
  await page.waitForTimeout(1000);
  expect(new URL(page.url()).pathname).toBe('/pages/complex-solutions/');
});

test('clicking DE switches to the German page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pages/complex-solutions/');
  await Promise.all([page.waitForURL('**/de/pages/complex-solutions/'), page.locator('.language-switcher [data-lang="de"]').click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
