# Pages, layouts & EJS partials

**OWNS:** HTML page composition. EJS partials in `layout/`, page entry HTMLs in `pages/`, root, and `uk/`.

## Bilingual structure
- EN: `index.html` (home), `404.html`, `pages/<name>.html` (top-level), `pages/service/<service>.html` (service detail pages).
- UK: `uk/index.html`, `uk/404.html`, `uk/pages/<name>.html`, `uk/pages/service/*.html`.
- Each locale has its own header/footer EJS variants:
  - EN: `layout/header.ejs`, `layout/header-alt.ejs`, `layout/footer.ejs`, `layout/footer-alt.ejs`, `layout/head.ejs`, `layout/head-alt.ejs`
  - UK: `layout/header-alt-ua.ejs`, `layout/footer-ua.ejs`
- Language switcher partials: `layout/component/lang-switcher.ejs`, `lang-switcher-mobile.ejs`, `lang-switcher-mobile-uk.ejs`.

## Section partials (`layout/section/`)
Reusable section blocks included in pages via EJS:
- `hero.ejs`, `hero-image.ejs`, `hero-type-two.ejs` — hero variants
- `cta.ejs`, `cta-uk.ejs` — CTA blocks (per-locale variants)
- `faq.ejs`, `info.ejs`, `split.ejs`, `default.ejs`
- `approach-ua.ejs` — Ukrainian-specific section

## Service pages
[`pages/service/`](../../pages/service/) — 11 SEO landing pages, each for one service:
conversion-rate-optimization, custom-shopify-app-development, custom-shopify-integrations, custom-web-design-services, mvp-design-services, ppc-advertising, seo-promotion, shopify-app-design-services, shopify-headless-development, shopify-migration-service, shopify-theme-customization-and-development.

**INVARIANT:**
- Adding a new HTML page anywhere under `pages/` or `uk/` will be auto-picked up by `getInputFiles()` in [vite.config.js](../../vite.config.js) (via glob). No config change needed — but the file MUST be `.html` and live under one of the globbed directories.
- A new page MUST be referenced from a sitemap-generating source (see `generate-sitemap.js`) and linked from somewhere, or it'll exist but be orphaned.
- The two languages do not share page files. Adding a service page on EN does NOT create the UK variant — duplicate it under `uk/pages/service/` and translate.
- EJS partials are included with `<%- include('relative/path.ejs') %>`. Mistyped paths fail the build.

**FLOW (add a new service page):**
1. Create `pages/service/<slug>.html` based on an existing service page.
2. Update copy / meta tags / canonical URL / OG tags.
3. Duplicate to `uk/pages/service/<slug>.html` and translate (or skip if EN-only is intended — see DECIDED below if such a decision exists).
4. Add the URL to whatever drives the sitemap (check `generate-sitemap.js`).
5. Add internal links from index / nav / footer as appropriate.
6. `npm run dev` to verify, then push to `staging` for staging deploy.

**TENSION:**
- The `header-alt` / `footer-alt` variants exist alongside the primary variants — purpose isn't obvious from filenames. Open both to see which one a given page includes before assuming.
- Two CTA partials (`cta.ejs` / `cta-uk.ejs`) — the UK page uses the `-uk` variant. Watch for drift.

**DECIDED:**
- 2026-09-24 (Alex): quick EN release is EN-only; `/uk/**` is not mirrored. See docs/discovery/2026-09-24-quick-en-site.md.
- 2026-09-24 (Alex): existing URLs kept, no redirects; absorbed service pages stay live, out of nav/sitemap, with canonical → parent (theme, headless, app-design, mvp) or noindex (ppc, seo).
