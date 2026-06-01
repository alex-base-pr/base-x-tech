# Build & deploy

**OWNS:** Vite config, sitemap generation, CI deployment pipeline.

## Vite config ([vite.config.js](../../vite.config.js))
- **Plugins:**
  - `liveReload` — watches `./layout/**/*.ejs`, `./index.html`, `./404.html`, `./pages/**/*.html`, `./uk/**/*.html`. Editing an EJS partial triggers a reload in dev.
  - `ViteEjsPlugin(jsonData)` — inlines EJS partials, passes `json/data.json` as the template context.
  - `moveOutputPlugin` — currently a no-op (empty `generateBundle`), kept as a placeholder.
  - `ViteImageOptimizer` — PNG/JPEG/WebP at quality 90.
- **Inputs:** collected by `getInputFiles()` — root `index.html`, `404.html`, `uk/index.html`, `uk/404.html`, plus globs `pages/**/*.html` and `uk/**/*.html`. New HTML files in those dirs are picked up automatically.
- **Output paths:**
  - `assets/[ext]/[name]-[hash][extname]` for assets
  - `assets/js/[name]-[hash].js` for JS chunks and entries
- **Server (dev):** `open: 'index.html'`, `host: true` (LAN-accessible).
- **CSS:** Autoprefixer + dev sourcemaps.

## Postbuild — `generate-sitemap.js`
Runs after `vite build` (`postbuild` script). Generates `dist/sitemap.xml`. Read the script before adding new pages to confirm whether the URL list is glob-derived or hand-maintained.

## CI / Deploy ([.github/workflows/](../../.github/workflows/))
Two workflows, identical shape:
- `deploy-staging.yml` — trigger: push to `staging`. Deploys to `REMOTE_PATH` secret.
- `deploy-live.yml` — trigger: push to `live`. Deploys to `REMOTE_LIVE_PATH` secret.

Both:
1. Checkout
2. Setup Node 18 with npm cache
3. `npm ci`
4. `npm run build`
5. Load SSH key from `REMOTE_KEY` secret
6. `ssh-keyscan -H $REMOTE_HOST >> ~/.ssh/known_hosts`
7. `rsync -avz --delete ./dist/ $REMOTE_USER@$REMOTE_HOST:<path>`

Secrets required in GitHub: `REMOTE_KEY`, `REMOTE_HOST`, `REMOTE_USER`, `REMOTE_PATH` (staging), `REMOTE_LIVE_PATH` (live).

**INVARIANT:**
- `rsync --delete` means anything on the target NOT in `dist/` gets deleted. Don't drop manual files on the server expecting them to persist.
- Node 18 is pinned in CI. Local Node should match (use `nvm use 18`) to avoid lockfile drift on `package-lock.json`.
- The workflow file name (`name:` field) in `deploy-live.yml` says "Deploy to Staging" — copy-paste artifact. Trigger and rsync target are correct; only the display name is misleading.

**FLOW (deploy a change):**
1. Branch off `staging` (e.g. `feat/foo/cu-...`).
2. Open PR to `staging`. Once merged → auto-deploys to staging server.
3. Test on staging URL.
4. PR `staging` → `live` (or merge `staging` into `live`). On push → auto-deploys to live.
5. The recent log shows this pattern: `Merge branch 'live' into staging` to sync back, then forward via PRs.

**TENSION:**
- `live` deploys on push, not on tag. Force-pushing or accidentally pushing WIP commits to `live` will deploy them. Branch protection in GitHub is the safety net — confirm it's enabled before treating `live` as safe.
- No `lint`, `test`, or `typecheck` step in CI — the only check is "does `npm run build` succeed". Broken JS that doesn't fail the build (e.g. runtime errors) ships.

**DECIDED:** (none recorded yet)
