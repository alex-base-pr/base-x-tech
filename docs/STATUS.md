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
| 9 | Complex Service / DACH (Alexander Karl) | `/pages/complex-solutions/` + DE `/de/pages/complex-solutions/` | Figma "Complex Service" (agreed 2026-09-24) → content/source/08 | review | built in legacy style; linked from header "Complex Solutions"; DE: copywriter agent + independent proofread (content/source/08-*-de-*.md), must-fix applied; prod blocked by photo and systems-list check (Q-23) |
| 10 | Privacy / Terms | unchanged | — | done | canonical only |

## Site-wide

| Item | REQ | State | Notes |
|------|-----|-------|-------|
| Repo bootstrap (live → main) | CON-003 | done | 2026-09-24 |
| QA harness + baseline | REQ-030/031 | done | 198/198 chromium + webkit 75/75, 0 broken links |
| Dev env switch (robots, analytics, form stub) | REQ-022…025 | done | `npm run build:dev` |
| Cloudflare Pages → dev.base-xtech.com | REQ-020/021 | done | project base-x-tech-dev, CNAME dev → base-x-tech-dev.pages.dev (wildcard *.base-xtech.com kept); GitHub app limited to this repo |
| Canonical, clean nav links, services menu | REQ-003…009 | done | canonical at build (scripts/seo-plugin.js), menu = 6, sitemap trailing slash |
| Absorbed pages: canonical / noindex | REQ-008 | done | |
| GEO: robots, llms.txt, llms-full.txt, JSON-LD | REQ-040…046 | done (base) | FAQPage per page with copy |
| GPTBot at Cloudflare | REQ-041 | done — not blocked | the 403 seen earlier was CF rejecting a spoofed GPTBot UA; real GPTBot is allowed (AI Crawl Control, all toggles off) |
| Accessibility: names/alt on icon controls, Sortlist badge | NFR-002 | done | contrast + dot size = design-owned, reported only |
| Bug: preload of missing bg-mob.jpg on every page | — | done | removed |
| Round-2 review, no-input fixes (form, /de/ shell, testimonials, cards, related links, visual bugs, hreflang/OG/404, llms-full) | REQ-019/044 | review | [summary](review/2026-09-24-v2-summary.md) "Today, no input"; open: EUR bands, Mo App Store URL, 1200×630 OG card, UK-side hreflang is head-only |
| Team answers 2026-09-25 (A1–A5, A10, A49–A56, M1–M8, M12, K1, K2, D3) | REQ-019 | review | [answers](review/2026-09-25-answers.md); DE strings for Alexander: [de-for-alexander](review/2026-09-25-de-for-alexander.md) (K3); still open: Alexander's photo + LinkedIn, Impressum data (A9), Mo App Store URL, M4 descriptions |
| Owner decisions 2026-09-25 (round 3): legal entity + /de/impressum/ + /de/datenschutz/, accent #B5DC4A (dark on accent), Complex in-person line + named case client, fixed-price audit block, Mo App Store link, Complex buttons = service system, 1200×630 OG card, staging lead smoke test | REQ-019/044 | review | qa/tests/owner-decisions.spec.js, qa/tests/lead-smoke.spec.js; EU OS platform discontinued 2025-07-20, so the Impressum states that instead of linking it; color-contrast stays design-owned (muted greys, see a11y.spec.js); Alexander photo live (owner-approved); still open: Alexander LinkedIn, M4 descriptions, Alexander to approve DE incl. legal pages (K3) |
