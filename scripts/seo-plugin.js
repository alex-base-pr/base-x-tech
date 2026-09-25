// Build-time SEO/GEO head: canonical, robots, JSON-LD — from json/site-map.json (spec REQ-005, REQ-008, REQ-022, REQ-044).
// Runs after EJS so it sees the final HTML of each page.
import { readFileSync } from 'node:fs';

const siteMap = JSON.parse(readFileSync('./json/site-map.json', 'utf8'));
const host = siteMap.host;
const org = {
  '@type': 'Organization',
  '@id': `${host}/#organization`,
  name: 'Base X Tech',
  url: `${host}/`,
  logo: `${host}/favicon/android-chrome-512x512.png`,
  sameAs: [
    'https://www.linkedin.com/company/base-x-tech/',
    'https://www.behance.net/base-xtech',
    'https://www.upwork.com/agencies/base/',
  ],
};

// '/pages/service/x.html' → '/pages/service/x/', '/index.html' → '/', '/uk/index.html' → '/uk/'
export function urlPath(file) {
  const p = file.replace(/\\/g, '/').replace(/^\/?/, '/');
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p.replace(/\.html$/, '/');
}

const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const metaDescription = (html) => (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '';

function faqEntities(html) {
  const qs = [...html.matchAll(/<[^>]+data-faq-q[^>]*>([\s\S]*?)<\/(h3|p|span|div)>/gi)].map((m) => text(m[1]));
  const as = [...html.matchAll(/<[^>]+data-faq-a[^>]*>([\s\S]*?)<\/(p|div)>/gi)].map((m) => text(m[1]));
  return qs.map((q, i) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: as[i] || '' } }))
    .filter((e) => e.name && e.acceptedAnswer.text);
}

function jsonLd(page, path, html) {
  const url = host + path;
  const graph = [];
  if (page.group === 'home') {
    graph.push(org, { '@type': 'WebSite', '@id': `${host}/#website`, url: `${host}/`, name: 'Base X Tech', publisher: { '@id': org['@id'] } });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: page.lang === 'de' ? 'Startseite' : 'Home', item: `${host}/` },
        { '@type': 'ListItem', position: 2, name: page.name, item: url },
      ],
    });
  }
  if (page.group === 'service' || page.group === 'service-extra') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: page.name,
      serviceType: page.name,
      description: metaDescription(html),
      url,
      provider: { '@id': org['@id'] },
    });
    if (!graph.some((n) => n['@type'] === 'Organization')) graph.push(org);
  }
  const faq = faqEntities(html);
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faq });
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

// ---- hreflang: templates declare their counterparts; here every cluster is normalised so that each page lists
// itself, every counterpart has a trailing slash, and there is exactly one x-default = the English URL.
const ALT_RE = /[ \t]*<link rel="alternate" href="([^"]*)" hreflang="([^"]*)">[ \t]*\n?/g;
const LANG_ORDER = ['en', 'de', 'uk'];
const OG_LOCALE = { en: 'en_US', de: 'de_DE', uk: 'uk_UA' };
export const langOf = (path) => (/^\/uk(\/|$)/.test(path) ? 'uk' : /^\/de(\/|$)/.test(path) ? 'de' : 'en');
const withSlash = (href) => (href.startsWith(host) && !/(\/|\.[a-z0-9]+)$/i.test(href) && !/[?#]/.test(href) ? href + '/' : href);

export function hreflangCluster(html, path) {
  const alts = {};
  for (const m of html.matchAll(ALT_RE)) if (m[2] !== 'x-default') alts[m[2]] = withSlash(m[1]);
  if (!Object.keys(alts).length) return null;
  alts[langOf(path)] = host + path;
  const langs = Object.keys(alts).sort((a, b) => LANG_ORDER.indexOf(a) - LANG_ORDER.indexOf(b));
  return { alts, langs, xDefault: alts.en || host + path };
}

const attr = (s) => s.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/"/g, '&quot;');
const pageTitle = (html) => ((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();

function socialTags({ html, lang, canonical, cluster }) {
  const title = attr(pageTitle(html));
  const description = attr(metaDescription(html));
  const image = `${host}/images/og/base-x-tech-og.png`; // 1200×630 share card (public/images/og/)
  const tags = [
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Base X Tech">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
  ];
  if (cluster) cluster.langs.filter((l) => l !== lang).forEach((l) => tags.push(`<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`));
  tags.push(
    `<meta property="og:image" content="${image}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:alt" content="Base X Tech: Shopify development, custom apps and integrations">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  );
  return tags;
}

export function seoPlugin({ deployEnv }) {
  const byPath = new Map(siteMap.pages.map((p) => [p.path, p]));
  return {
    name: 'base-xtech-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const path = urlPath(ctx.path);
        if (path.startsWith('/analytics-optout')) return html;
        if (/\/404\/$/.test(path)) {
          // Error pages: never indexed, not part of any language cluster.
          const robots = deployEnv === 'dev' ? 'noindex, nofollow' : 'noindex';
          let out = html.replace(ALT_RE, '').replace('</head>', `  <meta name="robots" content="${robots}">\n</head>`);
          if (deployEnv === 'dev') out = out.replace(/<html([^>]*)>/i, '<html$1 data-env="dev">');
          return out;
        }
        const page = byPath.get(path) || { role: 'index', group: 'other' }; // /uk/** keeps self-canonical
        const tags = [];
        const canonical = host + (page.role === 'absorbed' ? page.canonical : path);
        const cluster = hreflangCluster(html, path);
        html = html.replace(ALT_RE, '');
        tags.push(`<link rel="canonical" href="${canonical}">`);
        if (cluster) {
          cluster.langs.forEach((l) => tags.push(`<link rel="alternate" href="${cluster.alts[l]}" hreflang="${l}">`));
          tags.push(`<link rel="alternate" href="${cluster.xDefault}" hreflang="x-default">`);
        }
        tags.push(...socialTags({ html, lang: langOf(path), canonical, cluster }));
        if (deployEnv === 'dev') tags.push('<meta name="robots" content="noindex, nofollow">');
        else if (page.role === 'noindex') tags.push('<meta name="robots" content="noindex, follow">');
        if (page.role === 'index' && (page.lang === 'en' || page.lang === 'de')) tags.push(jsonLd(page, path, html));
        let out = html.replace('</head>', `  ${tags.join('\n  ')}\n</head>`);
        if (deployEnv === 'dev') out = out.replace(/<html([^>]*)>/i, '<html$1 data-env="dev">');
        return out;
      },
    },
  };
}
