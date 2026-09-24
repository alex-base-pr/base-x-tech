// Static server for dist/ that mimics the prod .htaccess URL rules, so QA sees the same
// URL behaviour as base-xtech.com: /x.html → 301 /x/, /x → 301 /x/, /x/ serves x.html, 404 → 404.html.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4',
};

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

function send(res, status, file) {
  res.writeHead(status, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);
  const redirect = (to) => { res.writeHead(301, { location: to + url.search }); res.end(); };

  if (/^\/404(\.html|\/)?$/.test(p)) return send(res, 404, path.join(root, '404.html')); // .htaccess: /404/ is not a page
  if (p === '/index.html') return redirect('/');
  if (p.endsWith('.html')) return redirect(p.replace(/\.html$/, '/'));

  const direct = path.join(root, p);
  if (!p.endsWith('/') && isFile(direct)) return send(res, 200, direct);
  if (p === '/') return send(res, 200, path.join(root, 'index.html'));

  const bare = p.replace(/\/$/, '');
  const html = path.join(root, bare + '.html');
  const dirIndex = path.join(root, bare, 'index.html');
  if (isFile(html) || isFile(dirIndex)) {
    if (!p.endsWith('/')) return redirect(bare + '/');
    return send(res, 200, isFile(html) ? html : dirIndex);
  }
  send(res, 404, path.join(root, '404.html'));
}).listen(port, () => console.log(`qa server: ${root} on http://localhost:${port}`));
