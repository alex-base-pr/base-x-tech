# Status — quick EN site

Spec: [discovery/2026-09-24-quick-en-site.md](discovery/2026-09-24-quick-en-site.md). Update this file in every PR.

States: `todo` · `in progress` · `review` (on dev, waiting for Alex) · `done` (Alex approved on dev) · `blocked: <what>`

## Pages

| # | Page | URL | Copy source | State | PR / notes |
|---|------|-----|-------------|-------|------------|
| 1 | Home | `/` | Marko Home (pending) | blocked: copy | title/meta fix first (REQ-010) |
| 2 | Shopify Development | `/pages/shopify-development` | 02 final copy + FAQ | todo | |
| 3 | Shopify Integrations | `/pages/service/custom-shopify-integrations` | 03 final copy | todo | |
| 4 | Shopify Migration | `/pages/service/shopify-migration-service` | 04 final copy | todo | |
| 5 | Custom Shopify Apps | `/pages/service/custom-shopify-app-development` | 05 v2 | todo | |
| 6 | Web Design | `/pages/service/custom-web-design-services` | 01 + FAQ | todo | |
| 7 | CRO | `/pages/service/conversion-rate-optimization` | 06 v2 | todo | |
| 8 | About | `/pages/about` | Marko (pending) | blocked: copy | photos: placeholder only |
| 9 | DACH (Alexander Karl) | `/pages/shopify-erp-integration-dach` (working) | brief in review with Marko | blocked: copy, photo, calendar | [brief PDF](briefs/Base-X-Tech_DACH-page-brief_2026-09-24.pdf) |
| 10 | Privacy / Terms | unchanged | — | done | canonical only |

## Site-wide

| Item | REQ | State | Notes |
|------|-----|-------|-------|
| Repo bootstrap (live → main) | CON-003 | done | 2026-09-24 |
| QA harness + baseline | REQ-030/031 | done | 115/117 pass; 2 = FAQPage waits for copy |
| Dev env switch (robots, analytics, form stub) | REQ-022…025 | done | `npm run build:dev` |
| Cloudflare Pages → dev.base-xtech.com | REQ-020/021 | blocked: Alex (CF access) | guide in docs/CLOUDFLARE-PAGES.md |
| Canonical, clean nav links, services menu | REQ-003…009 | done | canonical at build (scripts/seo-plugin.js), menu = 6, sitemap trailing slash |
| Absorbed pages: canonical / noindex | REQ-008 | done | |
| GEO: robots, llms.txt, llms-full.txt, JSON-LD | REQ-040…046 | done (base) | FAQPage per page with copy |
| GPTBot 403 at Cloudflare | REQ-041 | blocked: Alex | CF → AI Crawl Control → allow |
| Accessibility: names/alt on icon controls, Sortlist badge | NFR-002 | done | contrast + dot size = design-owned, reported only |
| Bug: preload of missing bg-mob.jpg on every page | — | done | removed |
