# Conversion review v2: dev.base-xtech.com (design v2)

Date: 2026-09-24 (second round) · Reviewer role: B2B conversion / agency lead gen · Previous round: [2026-09-24-conversion.md](2026-09-24-conversion.md), [2026-09-24-summary.md](2026-09-24-summary.md)

Scope checked: `/`, the six service pages, `/pages/complex-solutions/` and `/de/pages/complex-solutions/`, privacy, terms, 404, the contact modal (`layout/v2/form.ejs`, handler in `src/main.js`) and the mobile menu (`layout/v2/nav.ejs`). Rendered with Playwright (Chromium) at 1440×900 and 375×812. I opened the modal, submitted it empty to check validation, closed it with Escape, and opened the mobile menu and its Services level. I did not send the form. Blog links were checked on prod, because `/blog/*` is 404 on dev.

Buyer lens, same as last time: an EU/UK/DACH merchant with a €5–15k custom build, evaluating an agency they have never worked with.

Owner decisions not re-opened here: "AI Automation" stays in the home hero list, no team photos for now, Karl's photo is with Marko, and Figma project images (including AI-generated ones) are approved.

---

## Score: 6/10 (was 4.5/10)

**Reason:** the legacy layer that undercut the copy is gone: the $2200 "for Ukraine" pricing, the old home page, the "Approach" platitudes on service pages and the form that faked success. The site now reads as one company. But the form still anchors every lead at "$2K–5K" in USD, and nothing on the site says who the company is or where it is. The DACH page is still an English-chrome page with a generic partner block.

---

## Top 10 findings, ranked by expected impact on qualified leads

### 1. The form still pre-qualifies every lead as "$2K–5K" in USD, and still can't tell you which page converted
**Evidence**
- `layout/v2/form.ejs`: `<input type="radio" name="budget" value="$2K–5K" checked>`. Playwright on `/pages/service/shopify-migration-service/` and `/de/pages/complex-solutions/`: the modal opens with `budget = "$2K–5K"` pre-selected, and the option is shown highlighted in the accent green.
- All budget bands are USD (`$2K–5K · $5K–10K · $10K–25K · $25K+ · Not sure`), including on the German page.
- `Company name*` is still `required`. An empty submit flags `name`, `email` and `company` as invalid.
- The service select always opens on "Shopify Development", even from the Migration or DACH page.
- The textarea ("Tell us about the project") is optional.
- `src/main.js`: the payload has name, email, phone, company, service, budget, browser language and UTM params only. There's no `location.pathname`.

**Why it matters**
- Every visitor who doesn't touch the budget radio lands in ClickUp as a $2–5k lead.
- The first price a €10k DACH buyer sees is $2k, in the wrong currency, highlighted as the default.
- The service default means leads from Migration or Complex are mislabelled unless the visitor changes it.
- Without the page path, you can't tell which service page earns enquiries, which is the one number you need to steer this release.

**Fix**
- Remove `checked`. Make budget required with no default. Use EUR bands, e.g. "Under €5k · €5–15k · €15–40k · €40k+ · Not sure yet". On EN/UK pages, add GBP/USD in the label if needed ("€5–15k (≈ $5.5–16k)").
- Pre-select the service from the page. A `data-service` on the `[data-form-trigger]` or on `<main>`, read on open, is enough.
- Add `formatToDescription('Page', location.pathname)` to `descriptionParts`.
- Make "Company name" optional, or replace it with "Store URL (optional)".
- Make the textarea required, or move it to the top.

**Effort:** S · **Owner input:** yes, for the EUR bands you're comfortable showing.

### 2. "Who are we, where are we, who does the work" is now answered nowhere
**Evidence**
- Across the 12 rendered pages, the words "Kyiv", "UTC", "team", "contract" and "invoice" (in the commercial sense), and any named delivery person, do not appear. "Ukrain…" appears only in client descriptors ("Ukrainian luxury homeware brand", "Carrier app for Ukrainian stores").
- The old home said "based in Kyiv, Ukraine" and named three people (Vadym-Marko Hruden, Vadim Hula, Sofia Zabrodska). Both are gone. The only named people left are blog bylines and Alexander Karl.
- Nav "About" links to `/#section-team`. That anchor is the home "Approach" block (`<h2 id="h-approach-title">Technology changes fast. Our approach doesn't.</h2>`) with three principles: "Depth over shortcuts", "Pragmatic innovation", "Long-term thinking". The last two have no description at all (empty `<li class="h-principle">`).
- The privacy policy (`/pages/privacy-policy/`) names no legal entity, address or controller. The only contact is `hello@base-xtech.com`.

**Why it matters**
- For a first-time €5–15k buyer, "who am I actually contracting with, and who writes the code?" outweighs every technical FAQ.
- The previous round flagged this as the biggest non-form gap. The redesign made it worse by removing the little that was there.
- A DACH buyer who clicks "About" and gets three abstract nouns will not ask. They'll leave.

**Fix** (no photos needed, which stays within the owner decision)
- Add a short "Who you're working with" block to the `/#section-team` Approach area. Four text lines with facts only:
  - where the team is;
  - team size, and that it's in-house (no freelancers on client code);
  - contracting entity and invoicing currency;
  - who the client talks to, by name and role.
- Fill the two empty principle descriptions, or cut the list to one.
- Add a shared "Working with us" FAQ row set (2–4 rows) to every service page: "Who does the work?", "Time zone and language?", "How is it contracted and invoiced?", "Who owns the code?". The Apps page already has the ownership answer ("You do… including the repository"); reuse it.
- Add the legal entity and address to the privacy policy.

**Effort:** S (copy) · **Owner input:** yes (entity, team size, location wording, names and roles).

### 3. The DACH page speaks German in the body and English everywhere the buyer acts
**Evidence** (`/de/pages/complex-solutions/`)
- `<html lang="de">`, but the header nav is "Services · Portfolio · Insights · About · Contact · Let's talk", the footer is English, and the contact modal opens as "Let's talk about your project" with "Your name*", "What's your project budget?", USD bands and "Send project details". Native validation says "Please fill out this field."
- Every CTA (5×) is "Gespräch vereinbaren" (EN page: "Book a call" 5×). Each one opens the same form, and there's no calendar.
- The partner quote is still generic, and uses a word from the content lead's banned list: "making systems work together seamlessly" (EN) / "reibungslos zusammenarbeiten" (DE). It says nothing about Alexander: no years, no region, no "I'm in the first call".
- The label is still "Expertise vor Ort" / "Local Expertise", which implies on-site presence (flagged last round).
- The FAQ is still the eight Integrations questions verbatim (Q-19). There's no GoBD/DATEV, EU hosting, German-language support or contract question.
- There's no Impressum anywhere. `/pages/impressum/` and `/de/pages/impressum/` do not exist, and the footer has only Terms and Privacy.
- The "Tiefer einsteigen" cards include "Nova-Poshta-Integration für Shopify" and "Einen KI-Analyse-Agenten…". Neither is relevant to a DACH ERP buyer, and all three link to English articles with no "EN" marker.

**Why it matters**
- This page exists to win German-speaking buyers. At the moment of commitment they get an English form priced in dollars.
- A missing Impressum on a page aimed at Germany is both a trust signal and a legal one (§5 DDG).
- The only thing this page has over the Integrations page is "a person in the region", and that person currently says nothing personal.

**Fix**
- Build a DE variant of `layout/v2/form.ejs` for `lang="de"` (strings only, same field names), with EUR bands and the service pre-selected to "Complex Solutions".
- Translate the header and footer labels on `/de/`.
- Rename the CTA to "Projekt besprechen" / "Discuss your project" until a calendar exists.
- Rewrite the quote in first person with facts Alexander signs off on, and drop "seamlessly".
- Change the label to "Ihr Ansprechpartner in der DACH-Region" (unless he is actually on-site).
- Replace 3 of the 8 FAQs with DACH questions.
- Swap the Nova Poshta card for a DACH or ERP post, or drop it.
- Add an Impressum.

**Effort:** M · **Owner input:** yes (Karl's quote and role wording, Impressum data, DACH FAQ facts). The photo is out of scope here, as decided.

### 4. Proof still leaks off-site or dead-ends on the strongest cards
**Evidence**
- Prime EVA appears as a project on the home page and on 5 service pages. It links only to `https://primeeva.com/` (`aria-label="Visit the Prime EVA store"`, `target="_blank"`). It's the flagship configurator/ERP case with a "10M+ possible configurations" badge, and there's no case study behind it. (Release notes: "10M+ configurations badge unverified".)
- Home: Gunia links to `https://guniaproject.com/`. On the service pages, Gunia has `"link": null`.
- Apps: "Mo: Story Slider Navigation … 5.0 rated" has `"link": null`. Nova Poshta Connect links to the blog post, not the App Store listing. The App Store is the only third-party-verifiable proof you own.
- Integrations: the "VT Advantec" card has `"link": null`.
- The case links that were added (Innan, UK gifting, Nova Poshta, Naya) are icon-only round buttons with an `aria-label`. There's no visible "Read the case" text.

**Why it matters**
- "Show me one thing like mine" is the step right before an enquiry.
- The strongest thing on the site sends the buyer to someone else's shop, with no way back and no explanation of what you built there.

**Fix**
- Prime EVA: write a short case (even 300 words: problem → built → one number), or at minimum remove the external link.
- Link Mo and Nova Poshta Connect to their App Store listings, and show the rating as text ("5.0 on the Shopify App Store").
- Add a visible text label "Read the case →" next to the round link.
- Remove or hide the round link where `link` is null, so the card doesn't look broken.

**Effort:** S (links, labels) / M (Prime EVA case) · **Owner input:** yes for the Prime EVA case and verifying "10M+"; no for the links.

### 5. Testimonials: same three quotes everywhere, relabelled per page, and the home set is anonymous
**Evidence** (`content/pages/*.json` → `stories.items[].context`)
- The same Gunia quote ("I can recommend them both for store migration and for theme customization") is tagged "Theme Development" (Development, Apps), "Migration" (Integrations), "Store Migration" (Migration), "Theme Customization" (Web Design) and "Website Redesign" (CRO). That's five labels for one sentence.
- The VT Advantec quote is tagged "Shopify Development", "Platform Integration" or "Custom APIs" depending on the page.
- Lili Mager still has no role or company, and still two wordings: "met all our needs" (Development, Integrations, Apps, Migration, CRO) vs "met all of our expectations and unique needs" (home, Web Design). Q-15 is still open.
- Home `/#section-reviews`: the three quotes are signed "Stealth Startup US", "Stealth Startup US" and "Lili Mager". The carousel then repeats all three, so the DOM text shows six quotes, four of them from "Stealth Startup US".

**Why it matters**
- Buyers who enquire usually read two or more service pages.
- Seeing an identical quote with a different tag reads as padding.
- "Stealth Startup US" twice is the weakest possible attribution on the page that sets first impressions.

**Fix**
- One fixed tag per quote, everywhere: the work the client actually bought.
- Add role and country to each signature where permission exists ("Lili Mager, Founder, [brand], DE").
- On home, use VT Advantec (the multi-year partner quote) instead of one of the two "Stealth Startup US" quotes.
- Collect one integration/ERP quote (Fresh Market) and one from the UK gifting brand.

**Effort:** S (tags, home swap) / M (new quotes) · **Owner input:** yes for names/roles and new quotes.

### 6. The CRO page still leads its proof with an unbacked "50-200 % conversion uplift range"
**Evidence** (`/pages/service/conversion-rate-optimization/`, "Numbers that matter")
- The stats read "4.8* Upwork Reviews · 50-200 % conversion uplift range · 100+ Projects Delivered".
- The CRO project cards describe UX work ("Enquiry flow built for pieces sold on request rather than in stock"), not measured results.
- The footnote explains only the 4.8.
- The line under the stats, "What happens after launch matters more.", doesn't fit a CRO page.

**Why it matters**
- It's the first number an analytical buyer tests.
- In Germany it's a UWG §5 exposure: same finding as last round, still open.

**Fix**
- Either attach the range to a named or anonymised case with a footnote ("Innan Jewellery: enquiry rate +X% in N weeks"), or replace it with "60+ Happy Clients" as on the other pages.
- Swap the closing line for a CRO-specific one, e.g. "Every change reported against the baseline we agreed."

**Effort:** S · **Owner input:** yes (source for the range, or approval to remove it).

### 7. Price signal was removed and nothing replaced it
**Evidence**
- The legacy pricing block is gone from `/pages/shopify-development/` (good).
- The site now contains no price, range or engagement size anywhere. The only cost FAQ, on Web Design, dodges: "It depends on the number of page types and whether we are building it as well as designing it. We scope every project before quoting…".
- The only price the buyer sees is the "$2K–5K" default in the form (#1).

**Why it matters**
- A €5–15k buyer self-qualifies on a range.
- With no range, the form default becomes the anchor. You'll get more sub-€5k leads and lose buyers who assume you're either too cheap or unaffordable.

**Fix**
- Add one sentence on Shopify Development, Integrations and Apps (FAQ row "What does a build cost?", or a line under the process steps). For example: "Most custom builds we take on fall between €5,000 and €15,000; integration-heavy work runs higher. You get a written scope and a fixed quote before any code is written."
- Rewrite the Web Design cost answer to include a range.

**Effort:** S · **Owner input:** yes (the range).

### 8. No response-time promise at any point in the funnel
**Evidence**
- The success state says "Thank you — your project details are with us. We'll reply by email shortly." ("shortly" is undefined.)
- The modal title is the same generic "Let's talk about your project" on every page.
- There's no micro-line under any hero or closing CTA about what happens after sending.
- The service closing CTAs are good and reduce the ask ("Tell us what the two systems are and we'll tell you what connecting them takes."). The modal doesn't carry that promise through.

**Why it matters**
- For a buyer with no relationship yet, "who replies, when, and is this a sales sequence?" is the last hesitation before Send.

**Fix**
- Under the submit button, next to the privacy line, and in the success state: "A person from our team replies within one business day (CET). Usually two or three questions about your store, then a 30-minute call if it makes sense."
- Optionally, pass the page's closing-CTA line into the modal subtitle.

**Effort:** S · **Owner input:** yes (confirm the SLA you can keep).

### 9. Service pages are still mostly islands; the cross-links the copy promises aren't there
**Evidence**
- The only in-body link from one service page to another is on Web Design (FAQ "Do you design and build…", linking to `/pages/shopify-development/`).
- Integrations never links to Complex Solutions, and Complex never links to Integrations (the DACH brief says "The two link to each other").
- Migration's "What about our current integrations?" answer doesn't link to Integrations.
- The CRO "Speed & Core Web Vitals" card doesn't link to Development.
- Home capability "AI & Automation" links to `/pages/service/custom-shopify-integrations/`, whose body never mentions AI. The only AI content is the blog post "Building an AI Analytics Agent with Claude API". This isn't about the hero list, which stays: the capability card's destination doesn't deliver what the label promises.
- The 404 page's "Or go straight to" list omits Complex Solutions.
- The `Insights` nav item and all home and Complex blog cards are 404 on dev. This is dev-only (all six checked URLs are 200 on prod), but reviewers on dev hit dead ends.

**Why it matters**
- Agency buyers view 3–5 pages before enquiring. A page with no contextual next step is an exit.
- The Integrations → Complex link is the only route a DACH ERP buyer would take from the English pages to the DACH page.

**Fix**
- Add one in-text link in one FAQ answer per page:
  - Migration → Integrations;
  - Integrations → Complex ("Working in Germany, Austria or Switzerland? See our DACH integration page");
  - Complex → Integrations;
  - CRO → Development;
  - Apps → Integrations.
- Point "AI & Automation" at the AI article, or at a section of Apps that mentions automation (Apps has "Custom Automations").
- Add Complex to the 404 list.
- On dev, proxy or redirect `/blog/*` to prod.

**Effort:** S · **Owner input:** no.

### 10. Home above the fold doesn't say Shopify, who it's for, or why you
**Evidence** (`/`, 1440 and 375)
- H1: "Building the systems behind modern commerce". There's no sub-line. The rest of the fold is the three-item list (Shopify Apps / AI Automation / Shopify Development) and "Discuss Your Project".
- No proof above the fold. "Trusted by" is three small badges (Upwork, Clutch, GoodFirms) below the Approach block, roughly 5 screens down. The GoodFirms widget throws console errors (`403`, "Refused to display 'https://widget.goodfirms.co/' in a frame because it set 'X-Frame-Options' to 'sameorigin'").
- The service pages pass the 5-second test ("Shopify development for stores that need more than a theme"). Home, which gets the most direct and brand traffic, is the only page that doesn't.

**Why it matters**
- Referral, Clutch and LinkedIn traffic lands on home.
- "Systems behind modern commerce" could be any IT vendor. The positioning line that works ("If the build is the hard part, that's the work we take") is only on the service pages.

**Fix** (keeps the approved H1 and the hero list)
- Add one lead line under the H1: "Shopify builds, apps and integrations for merchants in the EU, UK and US. If the build is the hard part, that's the work we take."
- Add one proof line near the CTA: "4.8 on Upwork · 100+ projects · 2 apps on the Shopify App Store", each linked.
- Move "Trusted by" up, or drop the GoodFirms embed for a static badge.

**Effort:** S · **Owner input:** yes (Marko signs off on the home copy addition).

---

## Fixed since last review

| Previous finding | Status on dev now | Evidence |
|---|---|---|
| #1 Form shows success on failure | **Fixed** (v2 modal) | `src/main.js` `finally`: `if (!sent && errorMsg) errorMsg.classList.add('error')`. `#error-msg` has "Sorry, the form didn't send… email hello@base-xtech.com" and "Try again". |
| #1 Broken success copy ("We will back shortly to you") | **Fixed** | "Thank you — your project details are with us." |
| #1 $2k default | **Not fixed**, only relabelled | now `value="$2K–5K" checked` (see #1) |
| #1 Page URL in payload | **Open** | no `pathname` in `descriptionParts` |
| #2 Legacy "$2200 / for Ukraine" pricing block | **Fixed** (removed) | not present on `/pages/shopify-development/`. No replacement range (see #7). |
| #5 CTA label chaos on service pages | **Mostly fixed** | Service pages use "Discuss Your Project" ×3 and closing "Let's Talk". "Get Quote" is gone. Complex still uses "Book a call" / "Gespräch vereinbaren" (see #3). |
| #6 Phone required | **Fixed** | "Phone (optional)" |
| #6 Service list mismatched ("Theme Store", no Migration/Apps) | **Fixed** | 8 options mirroring the nav plus "Not sure yet". Not pre-selected per page (see #1). |
| #6 Privacy line under the form | **Fixed** | "We use your details only to reply to this request. Privacy policy". This contradicts the policy's "Marketing purposes – We send emails…" (quick win Q6). |
| #6 Company required / USD budget | **Open** | see #1 |
| #3 Case links from service cards | **Partly fixed** | Innan → `/blog/innan-jewellery-shopify-case-study/`, UK gifting → `/blog/custom-shopify-integrations-gifting-brand/`, Nova Poshta → blog, Naya (home) → blog. Prime EVA, Mo and VT Advantec are still external or unlinked (see #4). |
| #9 Home old copy ("craft seamless… solutions", BONKIND) | **Fixed** | the v2 home from approved Figma copy. BONKIND is gone. |
| #9 Home service cards unlinked | **Fixed** | all capability rows link to service pages |
| #9 In-body cross-service links | **Barely** | 1 link (Web Design → Development), see #9 |
| #10 "Approach" block (Immersion / Quality / "we work within your budget") on service pages | **Fixed** (removed) | Home has a new Approach block with two empty principles (see #2). |
| Header "UTC: +2" wrong half the year | **Fixed** (removed) | not in v2 header |
| Stats without source | **Fixed** | footnote "* Average client rating on our Upwork agency profile." |
| Mobile | **OK** | 375px: no horizontal scroll (`scrollWidth` 375). Header is `position: sticky` with a persistent "Let's talk". Mobile menu shows Services → 7 pages including "Complex Solutions (DACH)". Modal fits at 375, with submit reachable after about 90px of scroll. Escape closes the modal. |
| #7 Clutch linked only on home | **Open** | still home-only (badge in "Trusted by") |
| #7 CRO "50-200 %" | **Open** | see #6 |
| #7 Gunia quote relabelled per page | **Open** | see #5 |
| #8 DACH trust layer (quote, "German or English", Fresh Market numbers, DACH FAQ) | **Open** | see #3. Fresh Market "Key outcomes" still restate capability names. |
| #4 Vendor-risk objections | **Open, and worse** | Kyiv and the named people were removed (see #2) |

---

## Quick wins (each under one day, most under one hour)

| # | Change | Where | Owner input? |
|---|--------|-------|:---:|
| Q1 | Remove `checked` from the budget radio and make budget `required` | `layout/v2/form.ejs` | no |
| Q2 | Add `Page: location.pathname` to the lead description | `src/main.js` `descriptionParts` | no |
| Q3 | Pre-select the service from the page (`data-service` on `<main>`, set `select.value` on modal open) | `layout/pages/service-v2-body.ejs`, `complex-v2-body.ejs`, `src/v2.js` | no |
| Q4 | Make "Company name" optional (or turn it into "Store URL (optional)") | `layout/v2/form.ejs` | no |
| Q5 | Switch budget bands to EUR | `layout/v2/form.ejs` | yes (bands) |
| Q6 | Make the privacy policy match the form note: drop "Marketing purposes" or make it opt-in; add the legal entity | `pages/privacy-policy` | yes (entity) |
| Q7 | Add a reply-time line under Send and in the success state | `layout/v2/form.ejs` | yes (SLA) |
| Q8 | One tag per testimonial across all pages; swap one "Stealth Startup US" on home for VT Advantec | `content/pages/*.json` | no |
| Q9 | Link Mo and Nova Poshta Connect to their App Store listings. Remove the Prime EVA external link, or keep it with "Live store" as a visible label | `shopify-apps.en.json`, all `projects` | no |
| Q10 | Add a visible "Read the case →" label beside round case links; hide the link button where `link` is null | service template | no |
| Q11 | Add five contextual FAQ links (Migration→Integrations, Integrations↔Complex, CRO→Development, Apps→Integrations) | `content/pages/*.json` | no |
| Q12 | CTA on Complex: "Book a call" → "Discuss your project" / "Projekt besprechen" | `complex-solutions.*.json` | no |
| Q13 | Translate the header, footer and modal strings on `/de/` | `layout/v2/*.ejs` with a `lang` switch | no (translation already in-house) |
| Q14 | CRO: replace "50-200 % conversion uplift range" with "60+ Happy Clients" until a sourced case exists; fix the closing line | `conversion-rate-optimization.en.json` | yes (confirm removal) |
| Q15 | Fill or remove the two empty home principles ("Pragmatic innovation", "Long-term thinking") | `home.en.json` | no |
| Q16 | Add Complex Solutions to the 404 "Or go straight to" list | `404.html` | no |
| Q17 | Point home "AI & Automation" at the AI article or the Apps automation section | `home.en.json` | no |
| Q18 | Dev only: redirect `/blog/*` to prod so reviewers don't hit 404s | Cloudflare Pages `_redirects` | no |

Needs facts but is still under one day once you have them: the "Who you're working with" text block and the "Working with us" FAQ rows (#2), one EUR price range sentence (#7), and Alexander's first-person quote (#3).
