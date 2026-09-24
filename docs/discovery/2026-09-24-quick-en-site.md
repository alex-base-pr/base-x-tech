# Base X Tech — quick EN site on the existing codebase

Status: draft
Date: 2026-09-24
Owner: Alex (accepts the work) · Content: Marko · Design (future Sanity site): Ira
Profile: P + marketing site (public, indexed) · Tier: 0

## 1. Problem

The approved content rework (Marko, 27 Aug 2026 — 6 consolidated service pages, new copy with SEO titles/meta,
FAQ sets) is ready, but the new design + Sanity build will take weeks. Meanwhile Google keeps indexing old copy
("Design | Development | Marketing", non-topical H2s, no canonical tags, every page reachable as `/x`, `/x/` and
`/x.html`). Goal: ship the new English copy in the **existing** visual style on the **existing** codebase and URLs,
so indexing of the new positioning starts now. A throwaway-but-production-quality bridge until the Sanity site.

## 2. Goals / Non-goals

- Goal: new copy on 6 service pages + Home + About + partnership page, EN only, existing style.
- Goal: dev environment (not indexed) for review and bug fixing, then prod via the main repo's existing pipeline.
- Goal: GEO — the site is easy for AI assistants (ChatGPT, Claude, Gemini, Perplexity) to crawl, read and cite; all AI crawlers allowed, including training.
- Goal: automated QA (Playwright + a11y + links + SEO checks) and a simple status-tracking workflow in the repo.
- Non-goal: new design, Sanity, Shopify, any CMS.
- Non-goal: German anywhere except the DACH page (REQ-019).
- Non-goal: Ukrainian version (`/uk/…` stays byte-identical to today).
- Non-goal: blog (`/blog/`, Ghost 6.43) — untouched.
- Non-goal: redirects of any kind; URL changes (owner decision: keep existing URLs).
- Non-goal: contact form redesign (old 8-field form and its endpoint stay).
- Non-goal: prod deployment mechanics beyond "merge into base-xtech/base-xtech" — decided after dev sign-off.

## 3. Requirements (EARS)

### Sitemap & URLs
| ID | Requirement | Verified by |
|----|-------------|-------------|
| REQ-001 | The site shall serve every URL in the approved site map (§8) with HTTP 200. | T-001 |
| REQ-002 | The six service pages shall carry Marko's copy (§8 source file) in the existing section components: title, meta description, H1, capabilities, projects, "when we can help", FAQ where provided, CTA. | T-002, T-010 |
| REQ-003 | Each EN page shall contain exactly one `<h1>`. | T-003 |
| REQ-004 | Each EN page shall have a `<title>` ≤ 60 chars and a meta description ≤ 160 chars, unique across the site. | T-003 |
| REQ-005 | Each page shall have `<link rel="canonical">` **in the static HTML** (today it is injected by JS) pointing to its prod URL in the server's canonical form: `https://base-xtech.com/pages/<path>/` (trailing slash, no `.html`; home = `/`). | T-003 |
| REQ-006 | Header, drawer nav and footer links shall use the canonical form (trailing slash, no `.html`) — already true on `live`, keep it. | T-004 |
| REQ-007 | The services menu shall list exactly the six service pages (§8 rows 2–7). | T-004 |
| REQ-008 | The six absorbed pages (§8 table B) shall stay reachable, be removed from nav and `sitemap.xml`; theme/headless/app-design/mvp shall have canonical → absorbing page; ppc/seo shall carry `noindex, follow`. | T-003, T-005 |
| REQ-009 | `sitemap.xml` shall list exactly the indexable URLs of §8 (EN + unchanged UA) in canonical form (trailing slash) — today it lists no-slash URLs that 301. | T-005 |
| REQ-010 | Home shall get Marko's Home copy when delivered; until then its title/meta shall drop "Marketing". | T-003, T-010 |
| REQ-011 | Where the About text is delivered, `/pages/about` shall exist, be in nav and sitemap. | T-001, T-004 |
| REQ-012 | Where the partnership ("Karl") text is delivered, it shall be a public, indexed page at a URL agreed with the owner, in sitemap. | T-001, T-005 |
| REQ-013 | The DACH / complex-integrations page ("Karl page") shall have sections in this order: hero → Alexander Karl block (photo, name, role, one first-person quote) → capabilities (6 cards) → architecture diagram (Shopify ↔ middleware ↔ ERP + POS, inline SVG with text labels) → 1–3 case blocks → process (4 steps) → "when we can help" → FAQ → CTA. | T-002, T-010 |
| REQ-014 | The DACH page shall include a "what an integration really includes" block (retries, reconciliation, monitoring, etc. — per copy). | T-002 |
| REQ-015 | The DACH page systems list shall name only systems we delivered: Shopify POS, Xentral, custom middleware/API. | T-002 |
| REQ-016 | The DACH page shall not show Alexander Karl's own client logos (Jungheinrich, EnBW, …). | T-010 |
| REQ-017 | While the photo and booking calendar are not delivered, the page shall use a neutral photo placeholder and a "Book a call" button opening the existing contact drawer; the page shall be listed in STATUS as "blocked: photo, calendar" and not go to prod with the placeholder photo. | T-010 |
| REQ-018 | The Alexander Karl block shall present him as Base X Tech's partner/contact in the DACH region without his direct email, phone or calendar; every CTA on the page shall lead to our contact form (existing drawer → our pipeline). Owner 2026-09-24: we handle leads; Karl joins calls only when needed. | T-010, T-004 |
| REQ-019 | Where Alexander's German copy is delivered, the DACH page shall also exist at `/de/<same path>` (first DE page on the site, following the existing `/uk/` pattern), with reciprocal `hreflang` en/de + `x-default`=EN, `<html lang="de">`, own title/meta/JSON-LD, listed in sitemap and llms.txt; the EN page shall be built with all strings in one data object so DE is a copy swap, not a rebuild. | T-001, T-003, T-005 |

### Environments
| ID | Requirement | Verified by |
|----|-------------|-------------|
| REQ-020 | When a commit lands on `main` of `alex-base-pr/base-x-tech`, Cloudflare Pages shall deploy it to `dev.base-xtech.com`. | T-020 |
| REQ-021 | When a PR branch is pushed, Cloudflare Pages shall produce a preview URL. | T-020 |
| REQ-022 | While on dev/preview, every response shall carry `X-Robots-Tag: noindex, nofollow` and `robots.txt` shall be `Disallow: /`. | T-021 |
| REQ-023 | The production build shall contain no `noindex` (except REQ-008 ppc/seo) and the `robots.txt` of REQ-040. | T-022 |
| REQ-024 | While on dev/preview, GA4, Meta Pixel and Clarity shall not load. | T-021 |
| REQ-025 | While on dev/preview, the contact form shall not send to `clickup.base-xtech.com`; it shall show the normal success state. | T-023 |
| REQ-026 | The production build shall be produced by the unchanged `npm run build` → `dist/`, so the existing `live` workflow in base-xtech/base-xtech deploys it. | T-022 |
| REQ-027 | `/uk/**` output shall be identical to the current build except for asset hashes and shared nav/footer. | T-024 |

### GEO (AI assistants)
| ID | Requirement | Verified by |
|----|-------------|-------------|
| REQ-040 | `public/robots.txt` (exists on `live`) shall allow all AI crawlers — training (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Amazonbot, meta-externalagent), search (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, Googlebot) and user-triggered (ChatGPT-User, Claude-User, Perplexity-User) — with `Content-Signal: search=yes, ai-input=yes, ai-train=yes` and both sitemaps (site + `/blog/sitemap.xml`). | T-040 |
| REQ-041 | When requested on prod with any AI crawler user agent from REQ-040, the site shall answer 200 (today GPTBot gets 403 at Cloudflare). | T-040 |
| REQ-042 | `public/llms.txt` shall be in the repo, generated at build from the §8 indexable set: one line per page with its title, URL and one-sentence summary from the page's meta description; positioning matches Marko's copy. | T-043 |
| REQ-043 | The build shall emit `llms-full.txt`: the clean text of every indexable EN page (H1, headings, body, FAQ), in site-map order, with source URLs. | T-043 |
| REQ-044 | Each page shall carry valid JSON-LD: `Organization` + `WebSite` on Home (name, url, logo, sameAs LinkedIn/Behance/Upwork); `Service` (name, description, provider, areaServed where stated in copy) on each service page; `FAQPage` where the page has FAQ; `BreadcrumbList` on all inner pages. Only facts present in the copy or repo — nothing invented. | T-042 |
| REQ-045 | All page copy (H1, headings, body, FAQ answers) shall be present in the initial HTML response without JavaScript, inside `<main>`; nav in `<nav>`, footer in `<footer>`. | T-041 |
| REQ-046 | While on dev/preview, `robots.txt` shall disallow all (REQ-022 wins); `llms.txt` shall still be served for review. | T-021 |

### QA & workflow
| ID | Requirement | Verified by |
|----|-------------|-------------|
| REQ-030 | `npm run qa` shall run T-001…T-006 locally against a built site and exit non-zero on any failure. | T-030 |
| REQ-031 | When a PR is opened, GitHub Actions shall run `npm run qa` and report pass/fail on the PR. | T-030 |
| REQ-032 | The repo shall contain `CLAUDE.md`, `docs/STATUS.md` (page × state board), `docs/OPEN-QUESTIONS.md` and this spec; each merged PR updates STATUS. | T-031 |
| NFR-001 | Mobile Lighthouse on each EN page: SEO ≥ 95, Accessibility ≥ 90, Performance ≥ 70 (old style baseline; recorded, not blocking below). | T-006 |
| NFR-002 | axe-core: zero `critical`/`serious` violations on EN pages at 375 px and 1440 px, except `color-contrast` and `target-size` (legacy palette/slider — design-owned, reported; Q-12). | T-006 |
| NFR-003 | No horizontal scroll at 375 / 768 / 1440 px on EN pages. | T-007 |
| NFR-004 | Zero console errors on EN pages. | T-001 |
| CON-001 | Keep existing URLs; no redirects (owner). | — |
| CON-002 | Existing stack: Vite 6 + EJS + SCSS; no new framework. | — |
| CON-003 | Repo history imported from base-xtech/base-xtech so changes merge back cleanly. | — |
| CON-004 | Build config must stay free of injected code (see §6: malware incident) — any change to `vite.config.js`/`package.json` scripts reviewed by diff. | T-032 |

## 4. Acceptance criteria

"Dev done" = all REQ-001…REQ-046 green (REQ-041 checked after prod) except those waiting on text (010 Home copy, 011, 012), and Alex has reviewed
every EN page on dev at phone + desktop width. "Prod ready" = dev done + Home/About/Karl texts in + owner's go on the
prod path (§16 follow-up).

## 5. Decisions

| # | Decision | Chosen option | Rationale | Rejected |
|---|----------|---------------|-----------|----------|
| D1 | URLs | Keep existing URLs, map Marko's 6 pages onto them | Owner: new site will be on Sanity; avoid redirect churn twice | Marko's new slugs + 301 |
| D2 | Absorbed pages | Keep live, out of nav/sitemap, canonical → parent; ppc/seo noindex | No redirects, links in old proposals still work | Leave in nav; 404 |
| D3 | Dev hosting | Cloudflare Pages, `dev.base-xtech.com`, Alex's CF account | Domain already on CF; free tier (500 builds/mo, unlimited previews) | Vercel; UA hosting subdomain |
| D4 | Prod path | Later: merge into base-xtech/base-xtech → existing `live` workflow (rsync) | Owner; decided after dev | CF Pages prod (blog routing unknown) |
| D5 | Repo | Import base-xtech/base-xtech with full history into alex-base-pr/base-x-tech | Clean merge back (D4) | Fresh history |
| D6 | Contact form | Old 8-field form, same endpoint; stubbed on dev | Known to work, zero work | Marko's 4-field form |
| D7 | Copy version | Latest file by timestamp per page (§6) | Only signal available | — |
| D8 | Slot → section mapping | Marko's slots rendered in existing components (hero-type-two, split, works, faq, cta); heading levels per Marko's slot map (1×H1, H2 per section, H3 per item) | Old style, new semantics | New components |
| D9 | QA stack | Playwright + @axe-core/playwright + linkinator + html-validate + Lighthouse CI | Covers render, a11y, links, markup, SEO/perf | Manual only |
| D11 | AI crawlers | Allow all, incl. training; `ai-train=yes` | Owner 2026-09-24: brand known to models without search | Search-only (today's setting) |
| D12 | Base branch | `upstream/live` imported as `main` of alex-base-pr/base-x-tech; merge back = PR into `live` (via `staging`) | `live` is what is deployed; `main` upstream is stale | upstream/main |
| D10 | Env switch | `DEPLOY_ENV=dev` at build → robots, analytics, form stub; CF `_headers` adds X-Robots-Tag | Apache prod ignores `_headers`; prod build unchanged by default | Runtime hostname sniffing only |

## 6. Facts (verified)

| Fact | Source |
|------|--------|
| alex-base-pr/base-x-tech is empty | `git clone` 2026-09-24 |
| Old site: Vite 6, EJS, SCSS, flickity, motion; `npm run build` → `dist/` + sitemap | base-xtech/base-xtech `package.json`, `vite.config.js` |
| Deploy: GH Actions, push `staging`/`live` → rsync to server (secrets REMOTE_*) ; `deploy-live.yml` job is misnamed "Deploy to Staging" | `.github/workflows/*` |
| Obfuscated malware (`global['!']…`, loads `require` and runs payload) was appended to `vite.config.js`; removed in `ac221cd` 2026-06-03. Current tree scanned — no remaining copy | `git show ac221cd`, grep of tree |
| Prod `.htaccess` (live): `.html` → 301 clean; clean → 301 trailing slash; canonical form is `/pages/x/`. Canonical tag is added by inline JS in `layout/head-alt.ejs:26`. `generate-sitemap.js` emits no-slash URLs | `public/.htaccess`, `layout/head-alt.ejs`, `generate-sitemap.js` |
| Live: Cloudflare in front; root served by shared hosting (`x-ray: wnp…`, `x-page-speed`), `/blog/` by Ghost 6.43 (Express) — different origins | `curl -I` 2026-09-24 |
| `www` → apex 301 already live | `curl` |
| Live pages: `/x` → 301 → `/x/`; `/x.html` also served; nav links use `.html`; no canonical tags | curl, `layout/*.ejs`, Marko's page list |
| Live sitemap: 15 EN + 15 UA URLs (list in §8) | `https://base-xtech.com/sitemap.xml` |
| Live robots.txt differs from repo `public/robots.txt` (CF-managed AI/Content-Signal rules) | curl vs repo |
| Form posts to `https://clickup.base-xtech.com`; fields name, email, phone, company, service, budget, tell_us_more | `layout/drawer/form.ejs`, `src/main.js:390` |
| Analytics: GA4 `G-JPQXHBD6WH`, Meta Pixel, Microsoft Clarity | `layout/head-alt.ejs`, `index.html:451` |
| Copy: 6 service pages + FAQ sets (Web Design, Shopify Dev) + slot map; no Home/About/Karl copy yet | archive 2026-09-24 |
| Copy files used: 01 Web Design (only), 02 Shopify Dev `final copy` (09-15), 03 Integrations `final copy` (09-02 06:32), 04 Migration `final copy` (08:10), 05 Apps `v2`, 06 CRO `v2`, 07 FAQ sets | archive timestamps |
| CF Pages Free: 500 builds/month, 1 concurrent, unlimited previews, 20k files, 25 MiB/file | developers.cloudflare.com/pages/platform/limits (2026-09-24) |
| ~~robots/llms server-only~~ CORRECTED 2026-09-24: `upstream/main` is stale (last 2026-06-03). Prod = `upstream/live` (2026-08-18), which has `public/robots.txt`, `public/llms.txt`, `404.html`, cookie-consent banner, `.claude/knowledge/` agent docs, hreflang/title fixes. Malware removed on live too (`34bfa66`). Work is based on `live`. | `git log upstream/live`, `git grep` |
| Live `llms.txt` is outdated: lists headless as its own service, calls the agency "AI tooling" | `curl https://base-xtech.com/llms.txt` |
| AI crawlers on live (spoofed UA from one IP): GPTBot 403; OAI-SearchBot, ClaudeBot, Claude-User, PerplexityBot, Google-Extended 200 | `curl -A` 2026-09-24 |
| Page copy is in raw HTML (769 words on Shopify Development without JS); no JSON-LD anywhere | curl + text extraction |
| Owner decisions D1, D2, D3, D4, D6, Karl page public | chat 2026-09-24 |

## 7. Assumptions (unverified)

| Assumption | Default | Blast radius if wrong | How to verify |
|------------|---------|-----------------------|---------------|
| A1 Latest-timestamp file = approved copy | as D7 | wrong text on a page | Marko confirms list in STATUS.md |
| A2 CF-managed robots.txt rules are injected by Cloudflare, not the origin | prod `robots.txt` from repo unchanged | AI-bot rules lost on prod | check CF dashboard → AI Crawl Control / managed robots |
| A3 Project cards for Migration & CRO: reuse the three home defaults | NAYA.TECH · Prime EVA · Gunia | pages read thinner | Marko |
| A4 Existing project images/logos exist in `public/images` for all named projects | reuse | missing images → text-only cards | check during build |
| A5 Hreflang EN↔UA pairs stay, though UA copy is older | keep | minor SEO noise | phase 2 |
| A6 Old form endpoint still accepts submissions | unchanged | lost leads (already true today if broken) | one real test after prod |
| A8 GPTBot 403 comes from Cloudflare AI-bot blocking (AI Crawl Control / Block AI bots), not the origin | Alex switches it to Allow | GPTBot stays blocked | CF dashboard + T-040 after change |
| A9 Bytespider stays disallowed (known to ignore robots, no citation value) | Disallow | none meaningful | owner may lift |
| A10 `llms.txt`/`llms-full.txt` help some assistants; no major engine has confirmed using them | ship (cheap) | wasted ~1 h | none needed |
| A11 DACH page is visually built from existing sections + two new light components (person/quote block, SVG diagram) in the old style | new components minimal | +0.5–1 day | Alex reviews on dev |
| A13 (superseded 2026-09-24 by the Figma "Complex Service" page, URL /pages/complex-solutions/) DACH page is a separate page with a narrow focus (complex Shopify ↔ ERP/POS/middleware integration for DACH), cross-linked with #4 which stays broad; URL proposed `/pages/shopify-erp-integration-dach` | as stated | keyword overlap with #4 | owner confirms slug when copy arrives |
| A12 Content in Drive folder `1hfUjjSvHXmPP_rVyNdJXRphycSbYwGSz` = final copy for Home/About/DACH | use once shared | wrong text | Marko |
| A7 Cloudflare Access (password on dev) not needed; noindex is enough | off | dev visible to anyone with the link | owner can switch on later |

## 8. Site map (approved in chat 2026-09-24)

A. Indexable EN pages

| # | URL | State | Content source |
|---|-----|-------|----------------|
| 1 | `/` | existing, new copy when delivered | Marko Home (pending) |
| 2 | `/pages/shopify-development` | existing → new copy | 02 + FAQ set |
| 3 | `/pages/service/custom-shopify-app-development` | existing → new copy | 05 v2 |
| 4 | `/pages/service/custom-shopify-integrations` | existing → new copy | 03 |
| 5 | `/pages/service/shopify-migration-service` | existing → new copy | 04 |
| 6 | `/pages/service/custom-web-design-services` | existing → new copy | 01 + FAQ set |
| 7 | `/pages/service/conversion-rate-optimization` | existing → new copy | 06 v2 |
| 8 | `/pages/about` | NEW | Marko (pending) |
| 9 | `/pages/complex-solutions/` | NEW | DACH / complex Shopify integrations page with Alexander Karl; EN now, DE by Alexander later; brief to Ira 2026-09-24; copy in Drive folder (access pending) |
| 10 | `/pages/privacy-policy` | unchanged | — |
| 11 | `/pages/terms-and-conditions` | unchanged | — |

B. Absorbed (live, not in nav/sitemap)

| URL | Canonical / robots |
|-----|--------------------|
| `/pages/service/shopify-theme-customization-and-development` | canonical → #2 |
| `/pages/service/shopify-headless-development` | canonical → #2 |
| `/pages/service/shopify-app-design-services` | canonical → #3 |
| `/pages/service/mvp-design-services` | canonical → #6 |
| `/pages/service/ppc-advertising` | noindex, follow |
| `/pages/service/seo-promotion` | noindex, follow |

C. Untouched: `/blog/**` (Ghost), `/uk/**` (15 pages).

Nav: Services (rows 2–7) · Portfolio (`/#section-works`) · Insights (`/blog/`) · About (when live) · Contact (drawer form).

## 9. Failure modes

| Condition | Expected behaviour | REQ |
|-----------|--------------------|-----|
| Dev build accidentally deployed to prod | prod build is default; dev flags only with `DEPLOY_ENV=dev`; T-022 greps `dist` for noindex/Disallow | REQ-023 |
| Copy longer than old component allows | layout must not break; T-007 catches overflow | NFR-003 |
| Text for Home/About/Karl late | ship without; nav hides About; status "blocked: text" | REQ-010/011/012 |
| Form endpoint down on prod | existing error state (unchanged) | — |
| Malicious code reappears in build config | T-032 fails the PR | CON-004 |

## 10. Quality attributes (ISO/IEC 25010 sweep)

| Characteristic | Target / n/a |
|----------------|--------------|
| Functional suitability | §8 pages render with approved copy (REQ-001/002) |
| Performance efficiency | NFR-001 perf ≥ 70 mobile, recorded |
| Compatibility | latest Chrome, Safari (WebKit), Firefox via Playwright |
| Interaction capability | NFR-002 axe; NFR-003 no h-scroll at 3 widths |
| Reliability | static site; rollback = previous deploy (CF) / previous `dist` (prod) |
| Security | CON-004; no secrets in repo; dev form stub |
| Maintainability | STATUS.md + CLAUDE.md; bridge site, replaced by Sanity |
| Flexibility | n/a — throwaway bridge |
| Safety | n/a — marketing site |

## 11. Compliance & standards

| Driver | Why | What it changes | Owner to confirm |
|--------|-----|-----------------|------------------|
| WCAG 2.2 AA (as QA checklist) | public site, EU buyers | NFR-002 | yes |
| GDPR / ePrivacy | `live` already has a cookie-consent banner gating analytics | keep the gate; dev disables analytics entirely | — |

## 12. Hardware notes

n/a.

## 13. Test plan

| ID | Test | Type | Covers |
|----|------|------|--------|
| T-001 | Playwright: every §8 URL → 200, no console errors | integration | REQ-001, 011, 012, NFR-004 |
| T-002 | Playwright: per service page, H1/title/meta/capability titles equal Marko's copy (fixture JSON) | integration | REQ-002 |
| T-003 | Playwright SEO: 1×H1, title ≤60, desc ≤160, unique; canonical exact; robots meta per §8B | integration | REQ-003/004/005/008/010 |
| T-004 | Playwright: nav/footer hrefs clean, services menu = 6 URLs; linkinator: 0 broken internal links | integration | REQ-006/007/011 |
| T-005 | Parse `dist/sitemap.xml` = §8 indexable set | unit | REQ-008/009/012 |
| T-006 | axe-core on EN pages @375/1440; Lighthouse CI mobile | integration | NFR-001/002 |
| T-007 | Playwright: `scrollWidth ≤ clientWidth` @375/768/1440 + full-page screenshots to `qa/screens/` | integration | NFR-003 |
| T-010 | Alex reviews each EN page on dev (phone + desktop), ticks STATUS.md | manual | REQ-002, 010 |
| T-020 | Push to main → dev URL updates; PR → preview URL | manual | REQ-020/021 |
| T-021 | `curl -I dev…` has X-Robots-Tag; `/robots.txt` Disallow; no gtag/fbq/clarity requests | integration | REQ-022/024 |
| T-022 | Prod build: grep `dist` — no `noindex` outside ppc/seo, robots = repo prod version, no analytics stubbing | unit | REQ-023/026 |
| T-023 | Dev: submit form → success state, no request to clickup host | integration | REQ-025 |
| T-024 | Diff `/uk/**` text content vs current build | unit | REQ-027 |
| T-040 | `curl -A <ua>` for every REQ-040 bot → 200 on prod; robots.txt parsed: each bot allowed on `/` | integration | REQ-040/041 |
| T-041 | Fetch raw HTML (no JS) of every EN page; extracted `<main>` text contains the H1, every H2/H3 and FAQ answers from the copy fixture | integration | REQ-045 |
| T-042 | Parse all `application/ld+json`; required types per page present; validated against schema.org shapes (and Google Rich Results test manually on 2 pages) | integration | REQ-044 |
| T-043 | `llms.txt` URLs = sitemap indexable set, all 200; `llms-full.txt` contains every page H1 | unit | REQ-042/043 |
| T-030 | `npm run qa` exits 0 locally and in GH Actions on a PR | integration | REQ-030/031 |
| T-031 | STATUS.md exists and each merged PR touches it (reviewed at merge) | manual | REQ-032 |
| T-032 | CI: `vite.config.js` has no lines > 300 chars and no `global[`, `eval(`, `Function(`; `npm audit --omit=dev` high=0 | unit | CON-004 |

Not testable before prod: A2 robots behaviour, A6 form endpoint.

## 14. Implementation plan

1. **Repo bootstrap** — import base-xtech/base-xtech with history into alex-base-pr/base-x-tech; `npm ci`; `npm run build` passes locally; add `CLAUDE.md`, `docs/STATUS.md`, `docs/OPEN-QUESTIONS.md`, this spec. (CON-003, REQ-032)
2. **QA harness** — Playwright + axe + linkinator + html-validate + LHCI, `npm run qa` against `vite preview`; run on the *unchanged* site → baseline report (expected failures: canonical, H1s, .html links). GH Action on PR. (REQ-030/031, T-032)
3. **Env switch + dev deploy** — `DEPLOY_ENV`, robots/analytics/form stub, `_headers`; Alex connects CF Pages to the repo and adds `dev` subdomain (step-by-step guide provided). (REQ-020…026)
4. **Global SEO/nav** — canonical in head, clean links, services menu = 6, sitemap generator from §8, absorbed-page canonicals/noindex. (REQ-003…009)
4b. **GEO base** — robots.txt + llms.txt into repo, llms generators, JSON-LD partials (Organization/WebSite/Service/FAQPage/BreadcrumbList), semantic `<main>/<nav>/<footer>` check; Alex switches GPTBot to Allow in Cloudflare. (REQ-040…046)
5. **Service pages** in Marko's order: Shopify Development → Integrations → Migration → Apps → Web Design → CRO; one PR per page, preview link, STATUS updated. (REQ-002)
6. **Home copy** when delivered (REQ-010). **About** (REQ-011). **Karl page** (REQ-012).
7. **Dev sign-off** — Alex walks every page (T-010); fix list; then decide prod path (D4).

## 15. Rollback

Dev: CF Pages "rollback to previous deployment". Prod (later): re-run `live` workflow on the previous commit.
Nothing touches DNS for prod, the blog, or `/uk/`.

## 16. Open questions (must be empty to start)

None blocking. Non-blocking, tracked in `docs/OPEN-QUESTIONS.md`: Home/About/Karl texts (Marko, today); Karl page URL;
project cards for Migration/CRO (A3); prod deploy mechanics (D4); cookie consent (§11);
Cloudflare AI-bot setting (A8, Alex);
Drive folder not readable by the connected account (share with alex.rudenko.base@gmail.com or export);
DACH page slug + overlap with #4 (default A13).
