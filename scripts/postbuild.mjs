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

// German and Ukrainian index pages (design v2 since 2026-09-26): linked from llms.txt in their own sections
// ("Deutsch", "Українською"), not in llms-full.txt.
const langPages = (lang) => siteMap.pages.filter((p) => p.lang === lang && p.role === 'index').map((p) => {
  const html = fs.readFileSync(path.join(dist, p.file), 'utf8');
  return { ...p, url: host + p.path, description: meta(html, /<meta\s+name="description"\s+content="([^"]*)"/i) };
});
const dePages = langPages('de');
const ukPages = langPages('uk');
const list = (ps) => ps.map((p) => `- [${p.name}](${p.url}): ${p.description}`).join('\n');
const deSection = list(dePages);
const ukSection = list(ukPages);

// Blog posts from Ghost (public Content API key, the same one the blog pages expose): case studies and guides get
// their own llms.txt sections, since AI assistants cite concrete cases (owner 2026-10-01). Posts tagged #de / #uk
// go to the language sections. If the API is unreachable, the build continues with the single blog link.
const GHOST_API = 'https://base-xtech.com/blog/ghost/api/content';
const GHOST_KEY = '66da9a01055343153f4aa9cb5b';
let blogPosts = [];
try {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  const r = await fetch(`${GHOST_API}/posts/?key=${GHOST_KEY}&limit=all&include=tags&fields=title,url,custom_excerpt,excerpt,meta_description,published_at&filter=visibility:public`, { signal: ctrl.signal });
  clearTimeout(timer);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  blogPosts = (await r.json()).posts || [];
} catch (e) {
  console.warn(`postbuild: blog posts not added to llms.txt (${e.message})`);
}
const oneLine = (t) => (t || '').replace(/\s+/g, ' ').trim();
const shorten = (t, n = 200) => (t.length > n ? t.slice(0, t.lastIndexOf(' ', n)) + '…' : t);
const blogEntry = (p) => `- [${oneLine(p.title)}](${p.url.replace(/\?.*$/, '')}): ${shorten(oneLine(p.meta_description || p.custom_excerpt || p.excerpt))}`;
const hasTag = (p, name) => (p.tags || []).some((t) => t.name.toLowerCase() === name);
const blogLang = (p) => (hasTag(p, '#de') ? 'de' : hasTag(p, '#uk') ? 'uk' : 'en');
const isCase = (p) => hasTag(p, 'case study');
const blogList = (lang, cases) => blogPosts.filter((p) => blogLang(p) === lang && isCase(p) === cases).map(blogEntry).join('\n');
const enCases = blogList('en', true);
const enGuides = blogList('en', false);
const langBlog = (lang, title) => { const l = blogPosts.filter((p) => blogLang(p) === lang).map(blogEntry).join('\n'); return l ? `\n### ${title}\n\n${l}\n` : ''; };

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

${enCases ? `\n## Case studies\n\n${enCases}\n` : ''}${enGuides ? `\n## Guides and articles\n\n${enGuides}\n` : ''}
## Legal

${section('legal')}
${deSection ? `\n## Deutsch\n\n${deSection}\n${langBlog('de', 'Blog')}` : ''}${ukSection ? `\n## Українською\n\n${ukSection}\n${langBlog('uk', 'Блог')}` : ''}`;
fs.writeFileSync(path.join(dist, 'llms.txt'), llms);

// ARD (Agentic Resource Discovery) manifest, /.well-known/ai-catalog.json (2026-10-01): points agents at llms.txt,
// the full text, the sitemap and the contact form (the WebMCP tool "open_project_inquiry" lives on every page).
const domain = new URL(host).hostname;
const aiCatalog = {
  specVersion: '0.1',
  host: { name: 'Base X Tech', url: `${host}/`, description: home.description, contact: `${host}/#contact` },
  entries: [
    { id: `urn:air:${domain}:site:llms`, displayName: 'Base X Tech — site summary for AI (llms.txt)', type: 'text/plain', url: `${host}/llms.txt`,
      description: 'Services, case studies and guides with one-line descriptions, in English, German and Ukrainian.',
      representativeQueries: ['Shopify agency for ERP integration', 'Shopify migration from Magento or Shopware', 'custom Shopify app developer', 'Shopify development agency Europe'] },
    { id: `urn:air:${domain}:site:llms-full`, displayName: 'Base X Tech — full text of the main pages', type: 'text/plain', url: `${host}/llms-full.txt`,
      description: 'Full text of the service pages for citation.',
      representativeQueries: ['what does Base X Tech do', 'Base X Tech Shopify services and process'] },
    { id: `urn:air:${domain}:site:sitemap`, displayName: 'Sitemap (EN, DE, UK)', type: 'application/xml', url: `${host}/sitemap.xml`,
      representativeQueries: ['Base X Tech pages', 'Base X Tech German pages'] },
    { id: `urn:air:${domain}:blog:sitemap`, displayName: 'Blog sitemap: case studies and guides', type: 'application/xml', url: `${host}/blog/sitemap.xml`,
      representativeQueries: ['Shopify case study ERP integration', 'Magento to Shopify migration guide'] },
    { id: `urn:air:${domain}:action:project-inquiry`, displayName: 'Project inquiry (contact form, WebMCP tool open_project_inquiry)', type: 'text/html', url: `${host}/#contact`,
      description: 'Opens the contact form on any page. Browser agents can pre-fill it via the WebMCP tool open_project_inquiry; the visitor presses Send. Reply within 1 working day.',
      representativeQueries: ['contact a Shopify agency', 'get a quote for a Shopify integration', 'hire Shopify developers'] },
  ],
};
fs.mkdirSync(path.join(dist, '.well-known'), { recursive: true });
fs.writeFileSync(path.join(dist, '.well-known', 'ai-catalog.json'), JSON.stringify(aiCatalog, null, 2) + '\n');

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
  // Which commit this dev build is (CI waits for it before testing dev.base-xtech.com). Dev only — not shipped to prod.
  const sha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || '';
  fs.writeFileSync(path.join(dist, 'version.txt'), sha + '\n');
  // The blog lives only on prod (Cloudflare Worker route). On dev, send /blog/* there so article links don't 404.
  fs.writeFileSync(path.join(dist, '_redirects'), '/blog/* https://base-xtech.com/blog/:splat 302\n/blog https://base-xtech.com/blog/ 302\n');
}
console.log(`postbuild (${env}): llms.txt (+${dePages.length} DE, +${ukPages.length} UK, +${blogPosts.length} blog posts), llms-full.txt (${built.length} pages)${env === 'dev' ? ', dev robots + _headers + _redirects' : ''}`);
