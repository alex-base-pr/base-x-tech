// Real-click audit: every visible link/button on every index page (EN/DE/UK, 1440 + 390) is clicked the way a person
// would (Playwright scrolls, hovers, clicks). The click is recorded and cancelled; it must land on the element itself.
// Catches decorative layers that swallow clicks (e.g. a hover transform lifting an arrow above a card's stretched link).
// Usage: npm run build && npm run preview & BASE=http://localhost:4173 npm run qa:clicks   (or BASE=https://dev.base-xtech.com)
import { chromium } from 'playwright';
import fs from 'node:fs';
const sm = JSON.parse(fs.readFileSync('json/site-map.json', 'utf8'));
const pages = [...new Set((sm.pages || sm).filter((p) => p.role === 'index').map((p) => p.path))];
// Without BASE, serve the local dist/ ourselves (the Apache-like qa/serve.mjs) so CI can run it in one step.
import { spawn } from 'node:child_process';
let server = null;
let base = process.env.BASE;
if (!base) {
  const port = process.env.CLICKS_PORT || '4179';
  server = spawn(process.execPath, ['qa/serve.mjs', 'dist'], { env: { ...process.env, PORT: port }, stdio: 'ignore' });
  base = `http://localhost:${port}`;
  for (let i = 0; i < 50; i++) { try { await fetch(base + '/'); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
}
const b = await chromium.launch(); const out = []; let checked = 0;
for (const w of [1440, 390]) for (const path of pages) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(base + path); await p.waitForTimeout(300);
  const n = await p.evaluate(() => {
    document.addEventListener('click', (e) => { window.__last = e.target; e.preventDefault(); e.stopImmediatePropagation(); }, true);
    const els = [...document.querySelectorAll('a[href], button, summary, [role="tab"]')].filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 3 && r.height > 3 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden], .v2-modal, .v2-mnav, .v2-services-menu, .v2-lang__menu, noscript, details:not([open]) > :not(summary)'); });
    els.forEach((el, i) => el.setAttribute('data-qa-i', i)); return els.length;
  });
  for (let i = 0; i < n; i++) {
    const loc = p.locator(`[data-qa-i="${i}"]`);
    const label = ((await loc.getAttribute('aria-label')) || (await loc.textContent()) || (await loc.getAttribute('href')) || '').trim().slice(0, 50);
    await p.evaluate(() => { window.__last = null; });
    checked++;
    try { await loc.click({ timeout: 4000 }); }
    catch (e) { out.push(`${w} ${path} | "${label}" → not clickable: ${(e.message.match(/<[^>]+> (?:from .*? )?intercepts pointer events|not visible|outside of the viewport|timeout/i) || ['error'])[0]}`); continue; }
    const res = await p.evaluate((i) => { const el = document.querySelector(`[data-qa-i="${i}"]`); const t = window.__last; if (!t) return 'no click event'; if (el.contains(t)) return true; const a = t.closest('a[href]'); if (a && el.tagName === 'A' && a.getAttribute('href') === el.getAttribute('href')) return true; return 'click went to ' + (t.className || t.tagName); }, i);
    if (res !== true) out.push(`${w} ${path} | "${label}" → ${res}`);
  }
  await p.close();
}
await b.close();
server?.kill();
console.log('checked', checked); console.log(out.join('\n') || 'no problems');
process.exitCode = out.length ? 1 : 0;
