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
