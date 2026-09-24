# Cloudflare Pages → dev.base-xtech.com (≈ 10 min, Alex)

Spec REQ-020/021/022. The repo is ready: `npm run build:dev` builds the dev variant (noindex, `Disallow: /`,
`X-Robots-Tag` via `_headers`, no analytics, contact form does not send).

## 1. Create the project

1. dash.cloudflare.com → the account that holds **base-xtech.com** → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorise GitHub for **alex-base-pr** and pick the repo **base-x-tech** (you approve the GitHub permission yourself).
3. Build settings:

   | Field | Value |
   |---|---|
   | Project name | `base-x-tech-dev` |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build:dev` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `20` |

4. **Save and Deploy**. The first build takes ~2 min → `https://base-x-tech-dev.pages.dev`.

Preview deployments for every other branch are on by default (Settings → Builds → Branch control): each branch gets
`https://<branch>.base-x-tech-dev.pages.dev`.

## 2. Subdomain

Project → **Custom domains** → **Set up a custom domain** → `dev.base-xtech.com` → Cloudflare adds the DNS record
itself (the zone is already on Cloudflare). Nothing changes for `base-xtech.com`, `www` or `/blog/`.

## 3. Optional: password on dev

Zero Trust → Access → Applications → **Add** → Self-hosted → domain `dev.base-xtech.com` (and `*.base-x-tech-dev.pages.dev`)
→ policy "Allow" → emails of the reviewers. Not required: dev is already noindex.

## 4. Check (Claude can run these once the URL exists)

```bash
curl -sI https://dev.base-xtech.com/ | grep -i x-robots-tag
```

```bash
curl -s https://dev.base-xtech.com/robots.txt
```

```bash
QA_BASE_URL=https://dev.base-xtech.com npx playwright test --project=chromium
```

## 5. While you are in the dashboard: GPTBot (REQ-041)

Today GPTBot gets **403** on base-xtech.com. Security → Bots / **AI Crawl Control** → set GPTBot (and any other AI
crawler shown as blocked) to **Allow**. `robots.txt` in the next release already allows all AI crawlers with
`ai-train=yes`; the Cloudflare setting must match or it overrides robots.txt.
