# Status — quick EN site

Spec: [discovery/2026-09-24-quick-en-site.md](discovery/2026-09-24-quick-en-site.md). Update this file in every PR.

States: `todo` · `in progress` · `review` (on dev, waiting for Alex) · `done` (Alex approved on dev) · `blocked: <what>`

## Pages

| # | Page | URL | Copy source | State | PR / notes |
|---|------|-----|-------------|-------|------------|
| 1 | Home | `/` | Marko Home (pending) | blocked: copy | interim title without "Marketing" done (Q-14) |
| 2 | Shopify Development | `/pages/shopify-development` | 02 final copy + FAQ | review | pricing kept (Q-13); cards Prime EVA, Innan, Gunia per 02 |
| 3 | Shopify Integrations | `/pages/service/custom-shopify-integrations` | 03 final copy | review | reference page for the template; Marko open: named ERPs in FAQ, Prime EVA sector tag |
| 4 | Shopify Migration | `/pages/service/shopify-migration-service` | 04 final copy | review | cards per 04 (Q-16); main id leftover (Q-18) |
| 5 | Custom Shopify Apps | `/pages/service/custom-shopify-app-development` | 05 v2 | review | cards per v2 (Q-16); Morpheus anonymous (Q-17) |
| 6 | Web Design | `/pages/service/custom-web-design-services` | 01 + FAQ | review | cards per 01 (Q-16); Lili Mager wording (Q-15) |
| 7 | CRO | `/pages/service/conversion-rate-optimization` | 06 v2 | review | +43%/+65% hero widgets removed (not in copy); 50-200 range needs source on file |
| 8 | About | `/pages/about` | Marko (pending) | blocked: copy | photos: placeholder only |
| 9 | DACH (Alexander Karl) | `/pages/shopify-erp-integration-dach` (working) | brief in review with Marko | blocked: copy, photo, calendar | [brief PDF](briefs/Base-X-Tech_DACH-page-brief_2026-09-24.pdf) |
| 10 | Privacy / Terms | unchanged | — | done | canonical only |

## Site-wide

| Item | REQ | State | Notes |
|------|-----|-------|-------|
| Repo bootstrap (live → main) | CON-003 | done | 2026-09-24 |
| QA harness + baseline | REQ-030/031 | done | 198/198 chromium + webkit 75/75, 0 broken links |
| Dev env switch (robots, analytics, form stub) | REQ-022…025 | done | `npm run build:dev` |
| Cloudflare Pages → dev.base-xtech.com | REQ-020/021 | blocked: Alex (CF access) | guide in docs/CLOUDFLARE-PAGES.md |
| Canonical, clean nav links, services menu | REQ-003…009 | done | canonical at build (scripts/seo-plugin.js), menu = 6, sitemap trailing slash |
| Absorbed pages: canonical / noindex | REQ-008 | done | |
| GEO: robots, llms.txt, llms-full.txt, JSON-LD | REQ-040…046 | done (base) | FAQPage per page with copy |
| GPTBot 403 at Cloudflare | REQ-041 | blocked: Alex | CF → AI Crawl Control → allow |
| Accessibility: names/alt on icon controls, Sortlist badge | NFR-002 | done | contrast + dot size = design-owned, reported only |
| Bug: preload of missing bg-mob.jpg on every page | — | done | removed |
