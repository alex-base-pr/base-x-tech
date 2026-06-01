# Styles & assets

**OWNS:** SCSS architecture, JS modules, static asset pipeline.

## SCSS structure ([src/styles/](../../src/styles/))
Follows a 7-1-ish pattern:
- `abstracts/` — variables, mixins, functions (no output CSS)
- `base/` — resets, typography, base elements
- `components/` — reusable component styles
- `layouts/` — header/footer/grid
- `mod/` — modifier classes
- `pages/` — page-specific styles
- `sections/` — section-specific styles
- `main.scss` — single entry that imports the rest

JS imports `main.scss`, Vite compiles it via the bundled `sass` package + Autoprefixer.

## JavaScript ([src/](../../src/))
- `main.js` — entry point.
- `component-accordion.js`, `language-switcher.js`, `page-service.js`, `shopify-development.js` — feature modules.
- `utils/timezone.js` — utility.

Plain ES modules; no framework. Loaded as Vite entries (see `entryFileNames` in `vite.config.js`).

## Static assets
- `public/` — copied verbatim into `dist/` root by Vite (favicon, fonts, images, `robots.txt`, `sitemap.xml`).
- Images referenced from HTML/CSS go through `ViteImageOptimizer` (quality 90 for PNG/JPEG/WebP).
- `vite-plugin-webp-generator` is in deps — verify whether it's wired into the active config (the current `vite.config.js` doesn't import it).

**INVARIANT:**
- `public/sitemap.xml` is overwritten by `generate-sitemap.js` post-build. The source-tree copy may be stale — don't trust it as authoritative.
- BEM-ish naming exists in the SCSS but there's no Stylelint config in this repo (unlike the Shopify themes). No automated lint enforcement.

**FLOW (add a new component style):**
1. Create `src/styles/components/_<name>.scss`.
2. Import it from `main.scss` (or from a parent partial in the same directory if such convention exists — open `main.scss` to confirm).
3. Use the variables/mixins from `abstracts/`.

**TENSION:**
- No lint/format CI step. CSS drift is silent.
- The `vite-plugin-webp-generator` and `sharp` deps suggest WebP generation may have been intended but isn't currently wired in the live `vite.config.js`. Verify before adding image-related code that relies on auto-WebP.

**DECIDED:** (none recorded yet)
