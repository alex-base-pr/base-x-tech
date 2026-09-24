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

export function seoPlugin({ deployEnv }) {
  const byPath = new Map(siteMap.pages.map((p) => [p.path, p]));
  return {
    name: 'base-xtech-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const path = urlPath(ctx.path);
        if (/\/404\/$/.test(path) || path.startsWith('/analytics-optout')) return html;
        const page = byPath.get(path) || { role: 'index', group: 'other' }; // /uk/** keeps self-canonical
        const tags = [];
        const canonical = host + (page.role === 'absorbed' ? page.canonical : path);
        tags.push(`<link rel="canonical" href="${canonical}">`);
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
