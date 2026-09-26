// Postbuild: dist/sitemap.xml from json/site-map.json (spec REQ-009).
// Only role "index" pages (EN, DE, UK); absorbed/noindex pages are live but not listed.
// URLs use the prod canonical form with a trailing slash — the no-slash form 301s on the server.
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const siteMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/site-map.json'), 'utf8'));
const baseUrl = siteMap.host;

// Every role "index" page of json/site-map.json (EN, DE and — since the UK v2 move, 2026-09-26 — UK).
// Absorbed/noindex pages (EN and UK) stay live but are left out. Home pages ('/', '/uk/') get priority 1.0.
const pages = siteMap.pages
  .filter((p) => p.role === 'index')
  .map((p) => ({ url: p.path, priority: p.group === 'home' ? 1.0 : 0.8 }));

// Guard: every UK page on disk must be declared in the site map (else it would silently fall out of the sitemap).
const declared = new Set(siteMap.pages.map((p) => p.file));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.html') && e.name !== '404.html' ? [path.join(dir, e.name)] : []);
const undeclared = walk(path.join(__dirname, 'uk')).map((f) => path.relative(__dirname, f).replace(/\\/g, '/')).filter((f) => !declared.has(f));
if (undeclared.length) console.warn(`sitemap: UK pages missing from json/site-map.json: ${undeclared.join(', ')}`);

const sitemap = new SitemapStream({ hostname: baseUrl });
pages.forEach((page) => sitemap.write({ url: page.url, changefreq: 'weekly', priority: page.priority }));
sitemap.end();

streamToPromise(sitemap).then((data) => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), data.toString());
  console.log(`sitemap.xml: ${pages.length} URLs`);
});
