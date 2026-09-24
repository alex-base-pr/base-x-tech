// Postbuild: dist/sitemap.xml from json/site-map.json (spec REQ-009).
// EN: only role "index" pages. UA: every page under uk/ (untouched in the EN release).
// URLs use the prod canonical form with a trailing slash — the no-slash form 301s on the server.
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const siteMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/site-map.json'), 'utf8'));
const baseUrl = siteMap.host;

function getHtmlFiles(dir, prefix = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(getHtmlFiles(filePath, path.join(prefix, file)));
    } else if (file.endsWith('.html') && file !== '404.html') {
      results.push(path.join(prefix, file));
    }
  }
  return results;
}

const pages = [
  ...siteMap.pages
    .filter((p) => (p.lang === 'en' || p.lang === 'de') && p.role === 'index')
    .map((p) => ({ url: p.path, priority: p.path === '/' ? 1.0 : 0.8 })),
  { url: '/uk/', priority: 1.0 },
  ...getHtmlFiles(path.join(__dirname, 'uk/pages')).map((page) => ({
    url: '/uk/pages/' + page.replace(/\\/g, '/').replace(/\.html$/, '/'),
    priority: 0.8,
  })),
];

const sitemap = new SitemapStream({ hostname: baseUrl });
pages.forEach((page) => sitemap.write({ url: page.url, changefreq: 'weekly', priority: page.priority }));
sitemap.end();

streamToPromise(sitemap).then((data) => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), data.toString());
  console.log(`sitemap.xml: ${pages.length} URLs`);
});
