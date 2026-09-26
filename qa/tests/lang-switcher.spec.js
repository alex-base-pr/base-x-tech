// Language switcher shows a language only where this page has that version (hreflang), and links there.
// Owner 2026-09-25 (reverses A10): switcher = EN | DE | UK, each language only where the page has that version.
// Single-language pages (Impressum, 404) show no globe. Since 2026-09-26 the /uk/ index pages are design v2 too
// (globe with EN, plus DE on Complex and Privacy).
import { test, expect } from '@playwright/test';

const cases = [
  { path: '/pages/complex-solutions/', visible: ['en', 'de', 'uk'], active: 'en', go: { de: '/de/pages/complex-solutions/', uk: '/uk/pages/complex-solutions/' } },
  { path: '/de/pages/complex-solutions/', visible: ['en', 'de', 'uk'], active: 'de', go: { en: '/pages/complex-solutions/', uk: '/uk/pages/complex-solutions/' } },
  { path: '/uk/pages/complex-solutions/', visible: ['en', 'de', 'uk'], active: 'uk', go: { en: '/pages/complex-solutions/', de: '/de/pages/complex-solutions/' } },
  { path: '/pages/privacy-policy/', visible: ['en', 'de', 'uk'], active: 'en', go: { de: '/de/datenschutz/', uk: '/uk/pages/privacy-policy/' } },
  { path: '/de/datenschutz/', visible: ['en', 'de', 'uk'], active: 'de', go: { en: '/pages/privacy-policy/', uk: '/uk/pages/privacy-policy/' } },
  { path: '/uk/pages/privacy-policy/', visible: ['en', 'de', 'uk'], active: 'uk', go: { en: '/pages/privacy-policy/', de: '/de/datenschutz/' } },
  { path: '/uk/pages/terms-and-conditions/', visible: ['en', 'uk'], active: 'uk', go: { en: '/pages/terms-and-conditions/' } },
  { path: '/uk/pages/service/custom-shopify-integrations/', visible: ['en', 'uk'], active: 'uk', go: { en: '/pages/service/custom-shopify-integrations/' } },
  { path: '/uk/', visible: ['en', 'uk'], active: 'uk', go: { en: '/' } },
  { path: '/', visible: ['en', 'uk'], active: 'en', go: { uk: '/uk/' } },
  { path: '/pages/service/custom-shopify-integrations/', visible: ['en', 'uk'], active: 'en', go: { uk: '/uk/pages/service/custom-shopify-integrations/' } },
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

// Single-language pages: no globe / no switcher at all (desktop and mobile).
const noSwitcher = ['/de/impressum/', '/pages/service/ppc-advertising/', '/no-such-page/', '/uk/no-such-page/'];
for (const path of noSwitcher) {
  for (const width of [1440, 375]) {
    test(`no language switcher on ${path} @${width} @cross`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.waitForLoadState('load');
      await expect(page.locator('[data-v2-lang]')).toHaveCount(await page.locator('body.v2').count() ? 1 : 0);
      await expect(page.locator('[data-v2-lang]')).toBeHidden();
      await expect(page.locator('.language-switcher [data-lang], .language-switcher-mobile [data-lang]').filter({ visible: true })).toHaveCount(0);
    });
  }
}

test('Complex offers EN | DE | UK (UK version since 2026-09-26) @cross', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pages/complex-solutions/');
  await page.click('[data-v2-lang]');
  await expect(page.locator('.v2-lang .language-switcher [data-lang="uk"]')).toBeVisible();
  await expect(page.locator('.v2-lang .language-switcher [data-lang="de"]')).toBeVisible();
});

test('saved UK preference does not redirect a page without a UK version to a 404', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredLang', 'uk'));
  page.on('dialog', (d) => d.dismiss());
  await page.goto('/de/impressum/');
  await page.waitForTimeout(1000);
  expect(new URL(page.url()).pathname).toBe('/de/impressum/');
});

test('saved UK preference redirects to the UK version where one exists', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredLang', 'uk'));
  page.on('dialog', (d) => d.dismiss());
  await page.goto('/pages/complex-solutions/');
  await page.waitForURL('**/uk/pages/complex-solutions/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
});

test('saved EN preference on a UK page asks, then switches to the EN version', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredLang', 'en'));
  page.on('dialog', (d) => d.accept());
  await page.goto('/uk/pages/service/custom-shopify-integrations/');
  await page.waitForURL((u) => u.pathname === '/pages/service/custom-shopify-integrations/');
});

test('clicking EN on a UK page switches to the English page and remembers it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/uk/');
  await page.click('[data-v2-lang]');
  await Promise.all([page.waitForURL((u) => u.pathname === '/'), page.locator('.language-switcher [data-lang="en"]').click()]);
  expect(await page.evaluate(() => localStorage.getItem('preferredLang'))).toBe('en');
});

test('clicking DE switches to the German page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pages/complex-solutions/');
  await Promise.all([page.waitForURL('**/de/pages/complex-solutions/'), page.locator('.language-switcher [data-lang="de"]').click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
