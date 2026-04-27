const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const baseUrl = 'https://base-xtech.com';


function getHtmlFiles(dir, prefix = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath, path.join(prefix, file)));
    } else if (file.endsWith('.html')) {
      results.push(path.join(prefix, file));
    }
  });
  return results;
}


const pages = [
  { url: '/', priority: 1.0 },
  { url: '/uk/', priority: 1.0 },

  ...getHtmlFiles(path.join(__dirname, 'pages')).map(page => ({
    url: '/pages/' + page.replace(/\\/g, '/').replace(/\.html$/, ''),
    priority: 0.8
  })),

  ...getHtmlFiles(path.join(__dirname, 'uk/pages')).map(page => ({
    url: '/uk/pages/' + page.replace(/\\/g, '/').replace(/\.html$/, ''),
    priority: 0.8
  }))
];


const sitemap = new SitemapStream({ hostname: baseUrl });

pages.forEach(page => {
  sitemap.write({
    url: page.url,
    changefreq: 'weekly',
    priority: page.priority
  });
});

sitemap.end();

streamToPromise(sitemap).then(data => {
  fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), data.toString());
  console.log('sitemap.xml generated with main pages!');
});
