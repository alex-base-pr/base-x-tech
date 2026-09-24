// Postbuild: llms.txt + llms-full.txt from the built pages (REQ-042/043), and dev-only robots/_headers (REQ-022/046).
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const env = process.env.DEPLOY_ENV === 'dev' ? 'dev' : 'prod';
const siteMap = JSON.parse(fs.readFileSync('json/site-map.json', 'utf8'));
const host = siteMap.host;
const pages = siteMap.pages.filter((p) => p.lang === 'en' && p.role === 'index');

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–');
const meta = (html, re) => decode((html.match(re) || [])[1] || '').trim();

// Readable text of the page body: headings become markdown headings, everything else paragraphs.
function pageText(html) {
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [''])[0]
    .replace(/<(script|style|svg|noscript|header|footer|nav|form)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ');
  const lines = [];
  for (const m of body.matchAll(/<(h[1-4]|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = decode(m[2].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!t || lines[lines.length - 1]?.endsWith(t)) continue;
    const level = /^h(\d)$/i.exec(m[1]);
    lines.push(level ? `${'#'.repeat(Number(level[1]) + 1)} ${t}` : m[1].toLowerCase() === 'li' ? `- ${t}` : t);
  }
  return lines.join('\n\n');
}

const built = pages.map((p) => {
  const html = fs.readFileSync(path.join(dist, p.file), 'utf8');
  return {
    ...p,
    url: host + p.path,
    title: meta(html, /<title>([^<]*)<\/title>/i),
    description: meta(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    text: pageText(html),
  };
});

const section = (group) => built.filter((p) => p.group === group || p.group === group + '-extra').map((p) => `- [${p.name}](${p.url}): ${p.description}`).join('\n');
const home = built.find((p) => p.group === 'home');

const llms = `# Base X Tech

> ${home.description}

Base X Tech is a web design and development agency building Shopify stores, custom Shopify apps and integrations.
Full text of every page: ${host}/llms-full.txt

## Services

${section('service')}

## Company

- [Home](${home.url}): ${home.title}
- [Blog and case studies](${host}/blog/): articles on Shopify development, migration and integrations
- Contact: the contact form on any page of ${host}/

## Legal

${section('legal')}
`;
fs.writeFileSync(path.join(dist, 'llms.txt'), llms);

const full = [`# Base X Tech — full site text\n\nSource: ${host}/ · generated at build · English pages only.`]
  .concat(built.map((p) => `\n---\n\n# ${p.name}\n\nURL: ${p.url}\n\n${p.text}`)).join('\n');
fs.writeFileSync(path.join(dist, 'llms-full.txt'), full + '\n');

if (env === 'dev') {
  fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  // Cloudflare Pages headers; ignored by the Apache prod host.
  fs.writeFileSync(path.join(dist, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
}
console.log(`postbuild (${env}): llms.txt, llms-full.txt (${built.length} pages)${env === 'dev' ? ', dev robots + _headers' : ''}`);
