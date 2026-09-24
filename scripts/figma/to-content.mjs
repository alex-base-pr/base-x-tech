// Dev tool: build content/pages/<slug>.en.json for the design-v2 service template.
// Copy = the live bridge pages (Marko's approved text); from Figma only: project categories, images, stats.
// Usage: node scripts/figma/to-content.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

// Copy source = the bridge pages on main (on design-v2 the page files are v2 wrappers).
const fromMain = (file) => execFileSync('git', ['show', `main:${file}`], { encoding: 'utf8' });

const PAGES = [
  { slug: 'shopify-development', file: 'pages/shopify-development.html', figma: 'shopify-development' },
  { slug: 'shopify-integrations', file: 'pages/service/custom-shopify-integrations.html', figma: 'shopify-integrations' },
  { slug: 'shopify-migration', file: 'pages/service/shopify-migration-service.html', figma: 'shopify-migration' },
  { slug: 'shopify-apps', file: 'pages/service/custom-shopify-app-development.html', figma: 'shopify-apps' },
  { slug: 'conversion-rate-optimization', file: 'pages/service/conversion-rate-optimization.html', figma: 'conversion-rate-optimization' },
];

// Project visuals and categories as placed in Figma. Owner approved the VT Advantec and Gunia images and the Prime EVA badge (2026-09-24).
const PROJECTS = {
  'Prime EVA': { category: 'Automotive', badge: '10M+ possible configurations', image: '/images/v2/shopify-development-capabilities-5-chatgpt-image-9-2026-16-02-01-1.webp' },
  'Innan Jewellery': { category: 'Jewellery', image: '/images/v2/shopify-development-projects-3-image-5925.webp', link: '/blog/innan-jewellery-shopify-case-study/', linkLabel: 'Read the Innan Jewellery case study' },
  'Gunia': { category: 'Homeware', image: '/images/v2/shopify-development-projects-4-link-acronym-gmbh.webp' },
  'UK gifting brand': { category: 'Gifting', image: '/images/v2/shopify-integrations-projects-1-image-5953.webp', link: '/blog/custom-shopify-integrations-gifting-brand/', linkLabel: 'Read the UK gifting brand case study' },
  'VT Advantec': { category: 'B2B', image: '/images/v2/shopify-integrations-projects-3-chatgpt-image-16-2026-07-57-51-1.webp' },
  'Nova Poshta Connect': { category: 'Logistics', image: '/images/v2/shopify-apps-projects-2-image-5939.webp', link: '/blog/nova-poshta-shopify-integration-connect-app/', linkLabel: 'Read how we built Nova Poshta Connect' },
  'Innan Jewellery ': {},
  'Mo': { category: 'Shopify App', image: '/images/v2/shopify-apps-projects-4-image-5955.webp' },
};
const project = (name) => PROJECTS[Object.keys(PROJECTS).find((k) => name.startsWith(k))] || {};

const plain = (s = '') => s.replace(/<br[^>]*>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const lines = (s = '') => s.split(/<br[^>]*>/).map(plain).filter(Boolean);
// "One store, and everything<br> it has to <span class='accent'>agree with.</span>" → main + muted part
const splitAccent = (s = '') => {
  const m = s.match(/^(.*)<span class=['"]accent['"]>(.*)<\/span>(.*)$/s);
  return m ? { title: plain(m[1]), titleMuted: plain(m[2] + m[3]) } : { title: plain(s), titleMuted: '' };
};

function includes(src) {
  const out = [];
  const re = /include\('layout\/section\/([\w-]+)\.ejs'(?:,\s*)?/g;
  let m;
  while ((m = re.exec(src))) {
    let i = re.lastIndex;
    if (src[i] !== '{') { out.push({ name: m[1], data: {} }); continue; }
    let depth = 0, j = i, q = null;
    for (; j < src.length; j++) {
      const ch = src[j];
      if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') q = ch;
      else if (ch === '{' || ch === '[') depth++;
      else if (ch === '}' || ch === ']') { depth--; if (!depth) break; }
    }
    out.push({ name: m[1], data: vm.runInNewContext(`(${src.slice(i, j + 1)})`) });
  }
  return out;
}

for (const p of PAGES) {
  const src = fromMain(p.file);
  const head = src.match(/title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/);
  const inc = includes(src);
  const get = (name, pred = () => true) => inc.find((x) => x.name === name && pred(x.data))?.data;
  const hero = get('hero-type-two');
  const caps = get('split', (d) => d.cards);
  const works = get('works');
  const help = get('split', (d) => d.content_cards);
  const reviews = get('info', (d) => d.reviews);
  const process = get('faq', (d) => !d.schema);
  const faq = get('faq', (d) => d.schema);
  const cta = get('cta')?.cta;
  const fig = JSON.parse(fs.readFileSync(`content/figma/${p.figma}.json`, 'utf8'));

  // Figma projects: category (≈15px) precedes the project name (32px); images are in the same order.
  const pt = fig.projects.texts;
  const cats = {};
  pt.forEach((t, i) => { if (t.size === 32) { const c = [...pt.slice(0, i)].reverse().find((x) => x.size > 15 && x.size < 16); if (c) cats[t.text] = c.text; } });
  const rowsBy = Object.fromEntries((fig.projects.rows || []).map((r) => [r.name, r]));
  const capImgs = fig.capabilities.images.map((x) => x.file).filter(Boolean);
  const stats = [];
  const st = fig.stats.texts;
  const vals = st.filter((t) => t.size === 40), labels = st.filter((t) => t.size === 16);
  vals.forEach((v, i) => stats.push({ value: v.text, label: labels[i]?.text || '' }));

  const c = {
    meta: { title: head[1], description: head[2] },
    hero: { tag: plain(hero.subtitle), title: lines(hero.title), lead: plain(hero.description), button: hero.button_text || 'Discuss Your Project' },
    capabilities: { layout: 'cards', label: caps.title, ...splitAccent(caps.subtitle),
      items: caps.cards.map((x, i) => ({ title: plain(x.title), description: plain(x.description), image: capImgs[i] || null })) },
    projects: { label: works.title, items: works.items.map((x, i) => ({
      category: project(plain(x.title)).category || '', title: plain(x.title), text: plain(x.text),
      tags: (x.tags || '').split('/').map((t) => t.trim()).filter(Boolean),
      badge: project(plain(x.title)).badge, link: x.link || project(plain(x.title)).link || null, linkLabel: project(plain(x.title)).linkLabel, image: project(plain(x.title)).image || x.background_image || null })) },
    help: { label: help.title, ...splitAccent(help.subtitle), items: help.content_cards.map((x) => ({ title: plain(x.title), description: plain(x.description || '') || undefined })) },
    stories: { label: 'Client Stories', title: 'What it’s like<br> to work with us.',
      items: (reviews?.reviews || []).map((r) => ({ client: r.name, context: r.post, quote: r.text })) },
    process: { label: process.title, title: plain(process.subtitle), steps: process.faq.map((s) => ({ title: plain(s.title), description: s.description })) },
    stats: { title: 'Numbers that matter', items: stats.length ? stats : [{ value: '4.8*', label: 'Upwork Reviews' }, { value: '60+', label: 'Happy Clients' }, { value: '100+', label: 'Projects Delivered' }],
      footnote: stats.some((s) => s.value.includes('*')) || !stats.length ? '* Average client rating on our Upwork agency profile.' : '', closing: 'What happens after launch matters more.' },
    faq: { label: 'FAQ', title: 'Questions<br> we get asked', items: faq.faq.map((f) => ({ q: plain(f.title), a: f.description })) },
    cta: { title: lines(cta.title), body: cta.body, button: cta.button || 'Let’s Talk',
      images: fig.cta.images.map((x) => x.file).filter(Boolean) },
  };
  fs.writeFileSync(`content/pages/${p.slug}.en.json`, JSON.stringify(c, null, 2) + '\n');
  console.log(p.slug, `caps ${c.capabilities.items.length} (${capImgs.length} img)`, `projects ${c.projects.items.length}`, `faq ${c.faq.items.length}`, `stories ${c.stories.items.length}`, 'cats', JSON.stringify(cats));
}
