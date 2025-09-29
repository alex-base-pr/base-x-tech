const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const baseUrl = 'https://base-xtech.com';

function getHtmlFiles(dir, prefix = '') {
  let results = [];
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

const sitemap = new SitemapStream({ hostname: baseUrl });

// Додаємо англійські сторінки
if (fs.existsSync(path.join(__dirname, 'pages'))) {
  getHtmlFiles(path.join(__dirname, 'pages')).forEach(page => {
    sitemap.write({ url: '/' + page.replace(/\\/g, '/'), changefreq: 'weekly', priority: 0.8 });
  });
}

// Додаємо українські сторінки
if (fs.existsSync(path.join(__dirname, 'uk/pages'))) {
  getHtmlFiles(path.join(__dirname, 'uk/pages')).forEach(page => {
    sitemap.write({ url: '/uk/' + page.replace(/\\/g, '/'), changefreq: 'weekly', priority: 0.8 });
  });
}

sitemap.end();

streamToPromise(sitemap).then(data => {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)){
    fs.mkdirSync(distPath);
  }
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), data.toString());
  console.log('sitemap.xml generated in dist!');
});
