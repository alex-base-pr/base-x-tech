// Dev tool (not part of the build): pull design-v2 content and images from Figma.
// Token: ~/.figma_token (personal access token, file_content:read) — never committed.
// Usage: node scripts/figma/pull.mjs            → content/figma/*.json + public/images/v2/*.webp
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const FILE = 'ClAf6cxJhATDLiT5SEQosb'; // "base-xtech (Copy)" — Alex's drafts copy of Ira's file
const PAGES = {
  'shopify-development': '765:802',
  'shopify-integrations': '765:1194',
  'shopify-migration': '768:1585',
  'shopify-apps': '769:1972',
  'conversion-rate-optimization': '769:2344',
};
const token = fs.readFileSync(path.join(os.homedir(), '.figma_token'), 'utf8').trim();
const api = async (url) => {
  const res = await fetch(`https://api.figma.com/v1/${url}`, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

const texts = (n, out = []) => {
  if (n.visible === false) return out;
  if (n.type === 'TEXT') out.push({ text: n.characters.replace(/\s+\n|\n\s+/g, '\n').replace(/ {2,}/g, ' ').trim(), size: n.style?.fontSize, weight: n.style?.fontWeight, family: n.style?.fontFamily, color: n.fills?.[0]?.color, box: n.absoluteBoundingBox });
  (n.children || []).forEach((c) => texts(c, out));
  return out;
};
const images = (n, out = []) => {
  if (n.visible === false) return out;
  for (const f of n.fills || []) if (f.type === 'IMAGE' && f.imageRef) out.push({ ref: f.imageRef, node: n.name, box: n.absoluteBoundingBox });
  (n.children || []).forEach((c) => images(c, out));
  return out;
};
const byY = (a, b) => (a.box?.y ?? 0) - (b.box?.y ?? 0) || (a.box?.x ?? 0) - (b.box?.x ?? 0);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const data = await api(`files/${FILE}/nodes?ids=${Object.values(PAGES).join(',')}`);
const refs = await api(`files/${FILE}/images`); // imageRef → signed URL (original uploads)
fs.mkdirSync('content/figma', { recursive: true });
fs.mkdirSync('public/images/v2', { recursive: true });

const downloaded = new Map();
async function fetchImage(ref, name) {
  if (downloaded.has(ref)) return downloaded.get(ref);
  const url = refs.meta.images[ref];
  if (!url) return null;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const file = `/images/v2/${name}.webp`;
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public${file}`);
  downloaded.set(ref, file);
  return file;
}

for (const [page, id] of Object.entries(PAGES)) {
  const frame = data.nodes[id].document;
  const sections = {};
  const names = ['hero', 'capabilities', 'projects', 'help', 'stories', 'process', 'stats', 'faq', 'cta'];
  for (const [i, s] of frame.children.entries()) {
    const key = names[i] || `extra${i}`;
    const imgs = images(s).sort(byY);
    const files = [];
    for (const [j, im] of imgs.entries()) files.push({ node: im.node, file: await fetchImage(im.ref, `${page}-${key}-${j + 1}-${slug(im.node)}`) });
    // Project rows: one horizontal frame per project holding its category, name (32px), image and badge.
    let rows;
    if (key === 'projects') {
      rows = [];
      const walkRows = (n) => {
        const t = texts(n);
        const name = t.find((x) => x.size === 32);
        if (name && n.type === 'FRAME' && (n.children || []).length <= 3 && images(n).length) {
          rows.push({ name: name.text, category: t.find((x) => x.size > 15 && x.size < 16)?.text || '', badge: t.find((x) => x.size === 12)?.text || '', imageRef: images(n)[0].ref });
          return;
        }
        (n.children || []).forEach(walkRows);
      };
      walkRows(s);
      for (const r of rows) { r.image = await fetchImage(r.imageRef, `${page}-project-${slug(r.name)}`); delete r.imageRef; }
    }
    sections[key] = { rows, texts: texts(s).sort(byY).map(({ text, size, weight, family }) => ({ text, size, weight, family })), images: files };
  }
  fs.writeFileSync(`content/figma/${page}.json`, JSON.stringify(sections, null, 2));
  console.log(page, Object.keys(sections).length, 'sections,', downloaded.size, 'images so far');
}
