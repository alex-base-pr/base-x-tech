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

## Quick EN release (2026-09, alex-base-pr/base-x-tech)

This checkout is `alex-base-pr/base-x-tech`: `main` here = `base-xtech/base-xtech@live` + the quick EN release.
Remote `upstream` = base-xtech/base-xtech. Changes go back later as a PR into upstream `staging` → `live`.

Read first:
1. `docs/discovery/2026-09-24-quick-en-site.md` — the spec (REQ-IDs, site map §8, decisions §5). Binding.
2. `docs/STATUS.md` — what is done / next. Update it in every PR.
3. `docs/OPEN-QUESTIONS.md` — build the stated default, don't block on these.

Rules for this release:
- **Languages (DECIDED 2026-09-26):** EN, DE and UK on all index pages (DE also has Impressum/Datenschutz; terms stay EN). UK index pages are on design v2 with copy in `content/pages/<page>.uk.json` (glossary: `docs/review/2026-09-26-uk-glossary.md`); copy changes in EN must be mirrored to UK and DE (glossaries: docs/review/2026-09-26-{uk,de}-glossary.md). Language 404s: public/{uk,de}/.htaccess. Retired UK pages stay old-design, canonicalised/noindex like EN.
- **Keep existing URLs, no redirects.** Absorbed pages stay live with canonical/noindex (spec §8B).
- **Copy is Marko's** (fixtures in `content/`). Don't invent facts, clients, numbers or quotes.
- **No team photos** — placeholders only until Alex says otherwise.
- `main` here auto-deploys to dev (Cloudflare Pages, noindex). Never push to upstream `live`/`staging`.
- `npm run qa` must pass before merging; commits reference REQ-IDs.
