// Screenshot one element of a page from the local QA server: node qa/el-shot.mjs <path> <selector> <out.png> <width>
import { chromium } from '@playwright/test';
const [,, path, sel, out, w] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(w || 1440), height: 900 } });
await p.goto(`http://localhost:${process.env.PORT || 4173}` + path); await p.waitForLoadState('networkidle');
const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
await el.screenshot({ path: out }); await b.close();
