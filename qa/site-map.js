import fs from 'node:fs';

export const siteMap = JSON.parse(fs.readFileSync('json/site-map.json', 'utf8'));
export const host = siteMap.host;
export const enPages = siteMap.pages.filter((p) => p.lang === 'en');
export const indexPages = enPages.filter((p) => p.role === 'index');
export const servicePaths = indexPages.filter((p) => p.group === 'service').map((p) => p.path);

// Canonical URL the page must declare (spec REQ-005 / REQ-008).
export function expectedCanonical(page) {
  return host + (page.role === 'absorbed' ? page.canonical : page.path);
}

// Raw HTML as a non-JS crawler sees it.
export async function rawHtml(request, path) {
  const res = await request.get(path);
  return { status: res.status(), html: await res.text() };
}
export const dePages = siteMap.pages.filter((p) => p.lang === 'de');
// DE index pages: home + services on design v2 since 2026-09-26 (copy content/pages/<page>.de.json, EN fallback),
// plus Complex, Impressum and Datenschutz. All of them are role index.
export const deIndexPages = dePages.filter((p) => p.role === 'index');
// Dev/preview deploys are noindex + Disallow by design (REQ-022); SEO checks flip their expectation there.
export const isDevTarget = /dev\.base-xtech\.com|pages\.dev/.test(process.env.QA_BASE_URL || '');
// UK pages (design v2 since 2026-09-26): index pages get the same checks as EN; absorbed/noindex keep the old design.
export const ukPages = siteMap.pages.filter((p) => p.lang === 'uk');
export const ukIndexPages = ukPages.filter((p) => p.role === 'index');
