# Open questions

None of these block the work that is in progress. Default in brackets is what we build until answered.

| # | Question | Who | Default until answered | Opened |
|---|----------|-----|------------------------|--------|
| Q-1 | Home copy | Marko | old copy, title/meta without "Marketing" | 2026-09-24 |
| Q-2 | About copy | Marko | page not built, not in nav | 2026-09-24 |
| Q-3 | DACH page: 7 questions in the brief (section order, 6 capabilities, cases, Alexander's role + quote, URL, keywords, copy owner/date) | Marko | structure from the brief, placeholder copy on dev only | 2026-09-24 |
| Q-4 | DACH page: Alexander's photo | Alexander | neutral placeholder; page does not go to prod with it | 2026-09-24 |
| Q-5 | "Book a call": whose calendar | Alex / Marko | opens our contact form | 2026-09-24 |
| Q-6 | Project cards for Migration and CRO pages | Marko | the three home defaults (NAYA.TECH, Prime EVA, Gunia) | 2026-09-24 |
| Q-7 | Copy versions: confirm latest file per page is the approved one (01, 02 final, 03 final, 04 final, 05 v2, 06 v2, 07 FAQ) | Marko | latest by timestamp | 2026-09-24 |
| Q-8 | Prod deploy path after dev sign-off (PR into base-xtech/base-xtech `staging` → `live`) | Alex | decided after dev | 2026-09-24 |
| Q-9 | ~~Cloudflare: allow GPTBot~~ Checked 2026-09-24: no crawler is blocked. Note: ~half of every bot's requests (incl. Googlebot) are "unsuccessful" in AI Crawl Control — likely old sitemap redirects/404s; re-check after prod release | Alex | — | 2026-09-24 |
| Q-10 | Team photos for About/site | Alex | placeholders only; do not use Drive "content" photos | 2026-09-24 |
| Q-11 | Contact form shows success even when the ClickUp request fails (`src/main.js`, `finally` block) — leads can be lost silently. Fix in this release? | Alex | unchanged (out of scope) | 2026-09-24 |
| Q-12 | Accessibility: colour contrast (#bbb, accent) and slider dot size fail WCAG AA — treated as design-owned, not blocking in this bridge release. OK? | Alex | reported, not fixed | 2026-09-24 |
| Q-13 | Shopify Development page: keep the old pricing section (Quick Start from $2200, Turnkey from $4500, "payment and shipping setup for Ukraine")? Marko's copy has no pricing | Alex / Marko | kept unchanged | 2026-09-24 |
| Q-14 | Home: interim title "Shopify Development & Web Design Agency \| Base X Tech" ("Marketing" dropped, REQ-010) until Marko's Home copy | Marko | interim title | 2026-09-24 |
| Q-15 | Lili Mager quote has two wordings in Marko's files: Integrations/Apps "…fully functional and met all our needs" vs Web Design "…met all of our expectations and unique needs". Which is the real one? | Marko | each page uses its own file | 2026-09-24 |
| Q-16 | Project cards changed vs the page list: Apps = Nova Poshta Connect, UK gifting brand, Mo (not Prime EVA); Web Design = Innan, Gunia, Prime EVA (not BONKIND); Migration = UK gifting brand, Prime EVA, Gunia. Built from the final copy files | Marko | as in final copy | 2026-09-24 |
| Q-17 | Morpheus Media NYC: can it be named on the Apps page (now "a US agency partner")? | Marko | anonymous | 2026-09-24 |
| Q-18 | Migration page `<main id>` is `custom-shopify-integrations` (copy-paste leftover), so it inherits that page's CSS. Rename? | Alex | unchanged | 2026-09-24 |
| Q-19 | Complex page FAQ = the same 8 pairs as Shopify Integrations (as in Figma). Duplicate content; FAQPage schema left off this page. Unique DACH questions? | Marko | same FAQ, no schema | 2026-09-24 |
| Q-20 | ~~Fresh Market real?~~ **Answered 2026-09-24 (Alex): yes, real and disclosable.** | — | — | 2026-09-24 |
| Q-21 | **Answered (Alex): rephrase without the claim — done.** Was: Alexander's quote claims "integrations with every major system in the Swiss market" — his experience or ours? Figma comment #121 ("where is this text from?") may be about it | Alexander / Marko | shown on dev; confirm before prod | 2026-09-24 |
| Q-22 | Complex page title/meta/URL are drafts (not in Figma): "Complex Shopify Systems: ERP, POS & Middleware \| Base X Tech", /pages/complex-solutions/ | Marko | draft | 2026-09-24 |
| Q-23 | Systems strip widened on Alex's call ("we can build any of them"): 17 DACH systems as a marquee. The German reviewer flags UWG §5 (misleading advertising) if the list reads as past projects — label says "systems you already use"; Alexander to sanity-check before prod | Alexander | 17 systems | 2026-09-24 |
| Q-24 | **Done:** /de/pages/complex-solutions/ by our copywriter agent + independent proofread; Alexander or we release. DE in the language switcher only where a DE page exists — done. Open: "EN" badge on blog cards, "Private App" → "Custom App" in both languages | Alex | page reachable via hreflang/sitemap only | 2026-09-24 |
| Q-25 | **Answered (Alex): SAP Business One, Akeneo, Salesforce — no delivered project yet, can take on.** Shown separately under the strip as "Ready to integrate (no delivered project yet)" / "Integrierbar (noch kein abgeschlossenes Projekt)"; the other 14 are systems with delivered projects | — | — | 2026-09-24 |
