# Open questions, improvements, scaling and the blog (2026-09-24)

Companion to the [round-2 review summary](2026-09-24-v2-summary.md). Sources: the five v2 reviews, mainly
[growth & blog](2026-09-24-v2-growth.md). Earlier questions: `docs/OPEN-QUESTIONS.md` (Q-1…Q-25).

## 1. Open questions — who has to answer

### Alex (facts only you have)

| # | Question | Unblocks | Default until answered |
|---|---|---|---|
| A1 | Legal entity, country, invoicing currency; can we say "Team in Kyiv, working CET hours"? | "Who you'll work with" strip, privacy policy, Impressum, consistent profiles | nothing shown (today) |
| A2 | Team size and 2–3 names + roles buyers will talk to (text only, no photos) | trust strip, case bylines | none |
| A3 | EUR budget bands for the form, and a price range per service you are OK to publish | form, price anchor on every service page | no budget pre-selected, no range |
| A4 | Reply time you can keep (e.g. "within 1 business day") | form success + note under Send | "shortly" |
| A5 | Remove "50–200% conversion uplift" on CRO, or give the source | UWG risk in DE, trust | keep until you say remove |
| A6 | Which delivered project was the Xentral work; can it and Prime EVA / Fresh Market / Gunia / VT Advantec be named with numbers? | case studies, Xentral landing page, DACH proof | anonymous |
| A7 | Paid entry offers — do we sell a fixed-price **Integration Audit** and **Migration Scoping**? Price? | DACH/Integrations/Migration CTAs, Katrin/Marta personas | not offered |
| A8 | Clutch shows $25–49/h — keep or change? Partner Directory says London, Clutch Kyiv/Lviv/Kraków: which story? | consistent profiles (AI assistants merge them) | unchanged |
| A9 | Ghost admin access for Marko (link tagging, nav, CTAs, blog title "AI tooling … Asia-Pacific") | blog fixes | — |
| A10 | Delete the `design-v2` GitHub branch (merged; auto-guard blocked me) | tidy repo | keep |
| A11 | Release date and "go" for `staging` → `live` after your dev check | prod | not pushed |

### Marko (copy / content)

| # | Question | Default |
|---|---|---|
| M1 | Karl block: his photo, a monogram tile, or no person at all (your talk with Marko) | placeholder, page on dev only |
| M2 | 4–6 DACH-specific FAQs (then FAQ schema goes on; Q-19) | Integrations FAQ, no schema |
| M3 | One umbrella line with "Shopify" under the home H1 and on Complex (H1 stays as designed) | none |
| M4 | "When We Can Help" descriptions on service pages (titles only today) | empty cells |
| M5 | Alexander's own first-person quote (DE + EN) | current generic quote |
| M6 | Home principles "Pragmatic innovation" / "Long-term thinking" have no text — fill or drop | shown empty |
| M7 | One tag per testimonial (Gunia quote is used with 5 tags) — confirm the correct context for each | first tag |

### Designer (Ira)

| # | Question | Default |
|---|---|---|
| D1 | Accent green fails contrast with white text (2.95:1) — darker accent for buttons/tiles or dark label? | as designed |
| D2 | Complex uses its own pill buttons / centred layout — align with v2 service system? | as in Figma |
| D3 | Empty areas in process cards / CTA; cropped project images (UK gifting, Mo, Innan) | fixing crops with `object-position` |
| D4 | `/uk/` pages are still the old design — redesign, or label the link "Українська (стара версія)"? | linked as is |

## 2. Improvements I can do without anyone (≈ 1 day)

Form: no pre-selected budget, service pre-selected from the page, page URL + first landing page + referrer + UTM
in every lead, company optional, "How did you find us?" select · testimonial tags · related-services row + FAQ
cross-links · Prime EVA card without the off-site link until the case exists · hreflang self-reference / x-default ·
Open Graph tags · real 404 status · `/de/` header/footer/form in German · Complex CTA "Discuss your project /
Projekt besprechen" · `llms-full.txt` cleanup · GA4 events (`form_open`, `email_click`, `blog_to_service`,
`profile_click`) + key events + "AI assistants" channel group · Bing Webmaster + IndexNow.

## 3. Scaling for clients — what to build next

Principle from the growth review: **proof first, page second.** Every new page must stand on a delivered project;
a page for a system you never delivered is thin content and, for German buyers, a UWG risk.

| Priority | What | Why | Effort |
|---|---|---|---|
| 1 | **Lead-source tracking** (form fields + ClickUp fields Source / Service / Value / Won) | without it no channel, page or blog post can be judged | S |
| 2 | **Case studies** for Prime EVA, Fresh Market, the Xentral project, Gunia, VT Advantec | the missing evidence behind every persona's "maybe"; also what AI assistants cite | M each |
| 3 | **Per-system landing pages** where you have delivered: Shopify + Xentral (EN + DE), Shopify POS + inventory | "shopify xentral" SERP is Xentral docs + their partners — reachable | M |
| 4 | **Per-use-case pages**: custom product configurator (NAYA, Prime EVA); later B2B/wholesale; white-label for agencies | configurator SERP is app listicles, few real custom builds | M |
| 5 | **Shopware → Shopify** guide (DE + EN) | main DACH migration route; covered nowhere on site or blog | M |
| 6 | **Paid entry offers**: Integration Audit, Migration Scoping (credited against the build) | converts cautious €5–15k buyers better than an e-book | S (copy) + your decision |
| 7 | **DE expansion**: Impressum/Datenschutz, DE form, Xentral DE page, then DE Migration + Integrations (native, Karl reviews) | DACH is where Karl adds leverage | M–L |
| 8 | **Portfolio index `/work/`** with filters (service, system, country) — in the Sanity build | one place to send buyers and assistants | L |

Don't: industry pages with one project each; "Shopify + SAP/Salesforce" pages (no project yet); machine-translating
all six pages; trying to rank for "Shopify Agentur".

**Channels that feed the site, ranked by leads per hour:** 1 Karl (DE one-pager, Loom, monthly list of target
merchants) · 2 Shopify Partner Directory (8 reviews, German, fix location) · 3 Clutch (3 fresh reviews, Shopify focus,
rate) · 4 Xentral partner programme (after the Xentral case) · 5 white-label agency partners · 6 LinkedIn from people
(Alex, Marko; 1 post/week each) · 7 Upwork (cash flow, ≥ $3k) · 8 "best agency" listicles (low direct, high for AI
citations). Google Ads only after tracking and per-system pages exist.

## 4. The blog — more weight or not?

**Yes, more weight — but not more volume, and a different mix.**

- You already publish a lot (21 posts since May, 10 in July). The problem is what and how it connects:
  7 of 21 are generic / seasonal / AI-opinion and support no service; the 4 migration guides and 5 case studies are
  barely linked from service pages; 9 posts link to no service page; **every blog CTA is a `mailto:`**, so blog leads
  bypass ClickUp and GA4 — today you cannot see what the blog produces.
- **New mix:** ~50% case studies · ~35% system-specific integration/migration guides (DE where DACH) · ~15%
  cost/decision pieces from your own project numbers · stop generic/news/opinion (refresh only).
- **Cadence:** 4 pieces/month (12 in Oct–Dec) + 2 refreshes/month. First four: Prime EVA case · Fresh Market case
  (EN + DE) · "Shopify + Xentral: what the standard connector doesn't cover" (DE first) · Shopware → Shopify guide.
- **Who:** Marko owns calendar and editing; the developer who built it gives a 45-min interview + review (~2 h);
  Alex gets client approvals; Karl co-signs DE pieces.
- **Definition of done per post:** link to its service page in the first third · CTA card that opens the form (no
  `mailto:`) · the service page links back the same week · named author + technical reviewer · added to `llms.txt`.
- **Fix now in Ghost:** outbound `?ref=` tagging off, one 404 link, nav still points to 4 absorbed service pages,
  blog home title/H1 "AI tooling … Asia-Pacific", 50 tag pages for 21 posts.
- **Platform:** stay on Ghost until the Sanity site ships; then decide with 6 months of `blog_to_service` →
  `generate_lead` data.

## 5. Roadmap

| When | Items |
|---|---|
| **Before release (this week)** | section 2 fixes · contrast decision (D1) · your facts A1–A5 · release |
| **Next 2 weeks** | lead-source tracking live, October baseline · service ↔ blog links · Ghost hygiene · blog CTA cards · Partner Directory + Clutch review requests · DACH own FAQ · start Prime EVA case |
| **90 days (Oct–Dec)** | 12 blog pieces per plan · Xentral page EN + DE · DE legal + DE form · Xentral partner application · entry offers live · monthly review: leads / qualified / won by source and landing page + 10-prompt AI visibility check |
| **6 months (Jan–Mar 2027, with Sanity)** | `/work/` portfolio · per-system pages for each newly delivered system · configurator + B2B pages · per-source migration pages · partners page · DE Migration + Integrations · Google Ads test on DE/EN long tail |

**Measure one thing monthly:** qualified leads (≥ €5k) and won value by source and by landing page. That answers
"does the blog work" and "which page to build next".
