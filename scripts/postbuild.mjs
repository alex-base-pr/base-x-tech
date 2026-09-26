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
// UI boilerplate is dropped: the contact modal (title + sent/failed states), anything aria-hidden (slider clones,
// "[ Scroll to Explore ]", decorative counters), and the "0 - 1" / "/01" counters inside cards.
// Lines repeated on a page are kept once; a testimonial quoted on several pages is kept at its first page only.
const seenQuotes = new Set();
function pageText(html) {
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [''])[0]
    .replace(/<(script|style|svg|noscript|header|footer|nav|form)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<h2[^>]*class="v2-modal__title"[^>]*>[\s\S]*?<\/h2>/gi, ' ')
    .replace(/<div[^>]*class="v2-modal__state"[^>]*>[\s\S]*?<\/div>/gi, ' ')
    .replace(/<(span|p|ul|div)\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<span class="cx-sr">[^<]*<\/span>/gi, ' ')
    .replace(/<span[^>]*class="[^"]*(?:__num|__icon)\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi, ' ');
  const lines = [];
  const seen = new Set();
  for (const m of body.matchAll(/<(h[1-4]|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = decode(m[2].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!t || lines[lines.length - 1]?.endsWith(t)) continue;
    const tag = m[1].toLowerCase();
    const quote = tag === 'blockquote' ? m[2] : (m[2].match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i) || [])[1];
    if (quote) {
      const key = decode(quote.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
      if (seenQuotes.has(key)) continue;
      seenQuotes.add(key);
    }
    const level = /^h(\d)$/i.exec(tag);
    const line = level ? `${'#'.repeat(Number(level[1]) + 1)} ${t}` : tag === 'li' ? `- ${t}` : t;
    if (tag !== 'li') { // list items (card tags) legitimately repeat between cards
      if (seen.has(line)) continue;
      seen.add(line);
    }
    lines.push(line);
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

// Ukrainian index pages (design v2 since 2026-09-26): linked from llms.txt in their own section, not in llms-full.txt.
const ukPages = siteMap.pages.filter((p) => p.lang === 'uk' && p.role === 'index').map((p) => {
  const html = fs.readFileSync(path.join(dist, p.file), 'utf8');
  return { ...p, url: host + p.path, description: meta(html, /<meta\s+name="description"\s+content="([^"]*)"/i) };
});
const ukSection = ukPages.map((p) => `- [${p.name}](${p.url}): ${p.description}`).join('\n');

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
${ukSection ? `\n## Українською\n\n${ukSection}\n` : ''}`;
fs.writeFileSync(path.join(dist, 'llms.txt'), llms);

const full = [`# Base X Tech — full site text\n\nSource: ${host}/ · generated at build · English pages only.`]
  .concat(built.map((p) => `\n---\n\n# ${p.name}\n\nURL: ${p.url}\n\n${p.text}`)).join('\n');
fs.writeFileSync(path.join(dist, 'llms-full.txt'), full + '\n');

if (env === 'dev') {
  // Cloudflare Pages serves x.html at /x and redirects /x/ → /x; prod (Apache) uses /x/. Lay pages out as
  // x/index.html so dev keeps the same trailing-slash URLs, canonicals and hreflang targets as prod.
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
  for (const file of walk(dist)) {
    const base = path.basename(file);
    if (base === 'index.html' || base === '404.html') continue;
    const dir = file.slice(0, -'.html'.length);
    fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(file, path.join(dir, 'index.html'));
  }
  fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  // Cloudflare Pages headers; ignored by the Apache prod host.
  fs.writeFileSync(path.join(dist, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
}
console.log(`postbuild (${env}): llms.txt (+${ukPages.length} UK), llms-full.txt (${built.length} pages)${env === 'dev' ? ', dev robots + _headers' : ''}`);
