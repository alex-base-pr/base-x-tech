# base-xtech

The **base-xtech company landing site** — not a Shopify theme. Vite-built static site with EJS templating + SCSS. Bilingual (English at `/`, Ukrainian at `/uk/`). Repo: `alex-2020-git/base-xtech`.

> The defaults in [`~/.claude/CLAUDE.md`](../../.claude/CLAUDE.md) assume Shopify themes. **They DO NOT apply here.** This repo has its own conventions documented below.

## Read-before-edit gate
Before editing, consult the relevant file in [`.claude/knowledge/`](.claude/knowledge/):

- [overview.md](.claude/knowledge/overview.md) — system map, build pipeline, deploy flow
- [pages-and-layouts.md](.claude/knowledge/pages-and-layouts.md) — page structure, EJS partials, bilingual EN/UK split
- [build-and-deploy.md](.claude/knowledge/build-and-deploy.md) — Vite config, sitemap gen, CI deploy via rsync
- [styles-and-assets.md](.claude/knowledge/styles-and-assets.md) — SCSS architecture, image pipeline
- [analytics-and-tracking.md](.claude/knowledge/analytics-and-tracking.md) — GTM, cookie consent, lead events

Editing rules: [`.claude/instructions/editing-rules.md`](.claude/instructions/editing-rules.md).

## Write-back gate
When you discover a non-obvious fact, append it to the relevant knowledge file under the matching tag (`OWNS / INVARIANT / FLOW / TENSION / DECIDED`). Cite the file/line you learned it from.

## Quick facts
- Stack: **Vite 6** + **vite-plugin-ejs** (EJS partials) + **SCSS** + plain ES modules.
- Two locales in one repo: `index.html` + `pages/` (EN), `uk/index.html` + `uk/pages/` (UK). Each has its own header/footer EJS variants (`header-alt-ua.ejs`, `footer-ua.ejs`, etc.).
- Build: `npm run build` → outputs to `dist/`. Postbuild runs `generate-sitemap.js`.
- Dev: `npm run dev` (Vite dev server with live reload watching EJS/HTML).
- **Two-stage deploy via GitHub Actions:**
  - Push to `staging` → `.github/workflows/deploy-staging.yml` → rsync to `REMOTE_PATH`.
  - Push to `live` → `.github/workflows/deploy-live.yml` → rsync to `REMOTE_LIVE_PATH`.
  - Both build, then `rsync --delete` the entire `dist/` over SSH.
- Pages: 11 service pages under `pages/service/` (SEO landing pages — Shopify dev services, PPC, SEO, MVP, etc.) + privacy/terms.
- No Liquid, no Shopify CLI, no `.shopify/` dir. Standard Node tooling applies (`npm ci`, `npm run build`).
