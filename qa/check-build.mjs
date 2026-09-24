// T-032: build config free of injected code. T-022: prod build is indexable and has no dev leftovers.
// Usage: node qa/check-build.mjs [--env=dev]
import fs from 'node:fs';
import path from 'node:path';

const env = (process.argv.find((a) => a.startsWith('--env=')) || '--env=prod').split('=')[1];
const siteMap = JSON.parse(fs.readFileSync('json/site-map.json', 'utf8'));
const failures = [];
const fail = (m) => failures.push(m);

// T-032 — the 2026 incident appended an obfuscated `global['!']=…` payload to vite.config.js.
for (const file of ['vite.config.js', 'generate-sitemap.js', 'package.json', ...fs.readdirSync('scripts', { withFileTypes: true })
  .filter((d) => d.isFile()).map((d) => path.join('scripts', d.name))].filter((f) => fs.existsSync(f))) {
  const src = fs.readFileSync(file, 'utf8');
  src.split('\n').forEach((line, i) => {
    if (line.length > 300) fail(`${file}:${i + 1} line is ${line.length} chars (possible injected code)`);
  });
  if (/global\[['"]|\beval\(|new Function\(|String\.fromCharCode\(127\)|child_process/.test(src)) {
    fail(`${file}: suspicious construct (global[..], eval, new Function, child_process)`);
  }
}

// T-022 / REQ-022..024 — robots and noindex by environment.
const dist = 'dist';
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
const disallowAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robots);
if (env === 'prod' && disallowAll) fail('prod robots.txt disallows everything');
if (env === 'dev' && !disallowAll) fail('dev robots.txt must disallow everything');

const noindexAllowed = new Set(siteMap.pages.filter((p) => p.role === 'noindex').map((p) => p.file));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
for (const file of walk(dist)) {
  const rel = path.relative(dist, file);
  const html = fs.readFileSync(file, 'utf8');
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  if (env === 'prod' && noindex && !noindexAllowed.has(rel) && rel !== '404.html' && !rel.endsWith('/404.html') && !rel.startsWith('analytics-optout/')) {
    fail(`prod: ${rel} has noindex`);
  }
  if (env === 'prod' && /data-env="dev"/.test(html)) fail(`prod: ${rel} was built with dev flags`);
}

if (failures.length) {
  console.error(`check-build (${env}): ${failures.length} problem(s)\n - ` + failures.join('\n - '));
  process.exit(1);
}
console.log(`check-build (${env}): ok`);
