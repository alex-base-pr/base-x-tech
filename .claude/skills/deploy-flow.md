# Skill: Deploy to staging / live

Use when: changes are ready to verify on staging, or staging is verified and ready to ship to live.

## To staging
1. Be on a feature branch off `staging`.
2. Open PR → `staging`. Merge.
3. GitHub Actions: `Deploy to Staging` runs (`deploy-staging.yml`). Watch the run.
4. On success: visit the staging URL (ask the user if you don't know it) and verify the change.

## To live
1. Staging is verified.
2. Open PR `staging` → `live` (or merge directly if convention allows — recent log shows `Merge branch 'live' into staging` happens, so the workflow is bidirectional sync).
3. Merge / push to `live`. Workflow `deploy-live.yml` runs.
4. **The workflow's `name:` field says "Deploy to Staging" — this is a copy-paste bug.** The actual target is the live server (`REMOTE_LIVE_PATH`). Don't be confused by the GitHub Actions UI label.
5. Verify on production URL.

## Anti-patterns
- Pushing WIP commits directly to `live` — they deploy immediately.
- Skipping staging.
- Force-pushing to `live` to "undo" a bad deploy — the destructive `rsync --delete` already happened; better to push a fix-forward commit.

## Local smoke test before pushing
```
npm ci
npm run build
npm run preview   # serves dist/ locally on Vite's preview server
```
The preview catches build-time errors. Runtime JS bugs need `npm run dev` or actual browser testing.
