# Overview — base-xtech landing

**OWNS:** The base-xtech company marketing site. Two-language landing + service pages, deployed as static HTML/CSS/JS via SSH rsync to a self-hosted server.

**READS FROM:**
- `json/data.json` — site-wide data fed to EJS partials via `vite-plugin-ejs`. Currently sparse (`{ "jsonData": "Example Site" }`), but the plumbing exists; expand if richer template data is needed.
- Static assets in `public/` (favicon, fonts, images, robots.txt, sitemap.xml — though `sitemap.xml` is regenerated post-build).

**WRITES TO:**
- `dist/` — Vite build output. Pushed via `rsync --delete` to staging or live server by CI.

**FLOW (request → response):**
1. Server (self-hosted, behind SSH/rsync deploy) serves static files from a directory matching `dist/`.
2. URL resolves to one of the built HTML files: `index.html`, `404.html`, `pages/<n>.html`, `uk/index.html`, `uk/404.html`, `uk/pages/<n>.html`.
3. JS bundle and CSS load from `assets/js/` and `assets/css/` (hashed filenames, see `build-and-deploy.md`).
4. GTM + cookie consent + analytics fire from the page (see `analytics-and-tracking.md`).

**FLOW (build):**
1. `vite build` compiles HTML/EJS/SCSS/JS using inputs collected by `getInputFiles()` in [vite.config.js](../../vite.config.js) (globs `pages/**/*.html` and `uk/**/*.html`, plus root `index.html` / `404.html` / `uk/index.html` / `uk/404.html`).
2. EJS partials are inlined via `vite-plugin-ejs`, fed `json/data.json` as variables.
3. Images optimized via `vite-plugin-image-optimizer`.
4. Postbuild: `generate-sitemap.js` rewrites `dist/sitemap.xml`.

**FLOW (deploy):**
1. Developer pushes to `staging` or `live` branch.
2. GitHub Actions: checkout → `npm ci` → `npm run build` → SSH agent setup → `rsync -avz --delete ./dist/ <user>@<host>:<path>`.
3. Live server now serves the new `dist/` contents.

**TENSION:**
- The deploy is destructive (`rsync --delete`) — anything on the server NOT in `dist/` is wiped. Be careful with files dropped manually on the server.
- `vite.config.js` has a large commented-out block at the top — the active config is the SECOND `defineConfig` (around line 90+). Don't get confused by the commented version.
- The "Deploy to Staging" name appears in **both** workflow files (`deploy-live.yml` and `deploy-staging.yml` both have `name: Deploy to Staging`) — the live workflow has a copy-paste bug in its display name. Triggers are correct (`branches: [live]` vs `[staging]`), but the run name is misleading.

**DECIDED:** (none recorded yet)
