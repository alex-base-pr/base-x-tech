# Editing rules — base-xtech

Always-loaded constraints when editing this repo.

**Not a Shopify theme.** Most defaults in [`~/.claude/CLAUDE.md`](../../../.claude/CLAUDE.md) (Liquid, JSON templates, `.shopify/`, theme editor) DO NOT apply here. Read [CLAUDE.md](../../CLAUDE.md) for the actual stack (Vite + EJS + SCSS).

## Before editing
1. Read the matching file in `.claude/knowledge/`.
2. If a request contradicts a `DECIDED:` entry, cite it and ask before proceeding.

## Don't touch without explicit ask
- `dist/` — generated output; will be overwritten on next build.
- `package-lock.json` — touched only via `npm install`/`npm ci`. Don't hand-edit.
- `node_modules/` — generated.
- `public/sitemap.xml` — overwritten by `generate-sitemap.js` postbuild.

## Don't run without explicit ask
- `git push origin live` — triggers immediate production deploy (`.github/workflows/deploy-live.yml`).
- `git push origin staging` — triggers staging deploy (less risky, but still a real environment).
- Direct rsync/ssh to the production server.

## Before pushing
- `npm run build` locally — there's no lint or typecheck in CI; a successful build is the only gate. Catch obvious errors before they reach `staging`.
- Test in `npm run dev` for runtime behavior (the build step won't catch JS runtime issues).

## Bilingual pages
- Changes to EN content under `pages/` should usually be mirrored under `uk/pages/` with Ukrainian translation. Don't silently let the locales drift unless the user explicitly says EN-only.
- Header/footer EJS variants differ per locale — `header-alt-ua.ejs` and `footer-ua.ejs` are UK-only.

## Deploy hygiene
- `rsync --delete` is destructive on the server side. Anything outside `dist/` that lived on the server gets wiped.
- The deploy-live workflow's `name:` field says "Deploy to Staging" (copy-paste bug). The trigger and target are still correct — don't be misled when reading Action run logs.

## After editing, write back
When you discovered a non-obvious fact, append to the relevant `.claude/knowledge/*.md` under `INVARIANT:` / `TENSION:` / `DECIDED:`. Cite the file/line you learned it from.
