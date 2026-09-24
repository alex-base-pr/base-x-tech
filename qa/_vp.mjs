import { chromium } from '@playwright/test';
const [,, path, out, w, h, y] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(w), height: Number(h) } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(`http://localhost:${process.env.PORT}` + path); await p.waitForLoadState('networkidle');
for (const [i, yy] of y.split(',').map(Number).entries()) { await p.evaluate(v => window.scrollTo(0, v), yy); await p.waitForTimeout(400); await p.screenshot({ path: out.replace('.png', `-${i}.png`) }); }
console.log('errors:', errs.filter(e => !/CookieYes|website URL|goodfirms|sortlist/i.test(e)));
await b.close();
