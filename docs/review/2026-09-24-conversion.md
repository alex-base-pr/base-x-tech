# Conversion review: dev.base-xtech.com (bridge release)

Date: 2026-09-24 · Reviewer role: B2B conversion / agency lead gen · Scope: EN pages on dev, the contact drawer (`layout/drawer/form.ejs`) and its handler (`src/main.js`), checked against the content lead's sources (`content/source/*`) and `docs/OPEN-QUESTIONS.md`.

Buyer used as the lens: an EU/DACH merchant with a €5–15k custom build, evaluating an agency they have never worked with. That buyer isn't asking "can they code Shopify?" The questions are "will this go wrong, will they disappear, what will it really cost, and who am I actually dealing with?"

Visual style is out of scope. Where a fix needs a new layout, it's marked **redesign**. Where it's a string, a partial or a data change, it's marked **bridge**.

---

## Scores

| # | Dimension | Score | One-line justification |
|---|-----------|:-----:|------------------------|
| 1 | Above-the-fold clarity | **6/10** | The service H1s say what and for whom in about 3 seconds ("Shopify migration without losing what already works"). No hero shows why us (proof), where (EU) or what happens next, and the home hero is still "Essential design & development". |
| 2 | Pains | **6/10** | Operational pains are specific and credible (re-typed orders, stock drift, SEO loss, API deprecation). Buyer-risk pains (vendor risk, hidden cost, who does the work, time zone, Ukraine) are almost absent. |
| 3 | Triggers & proof | **4/10** | The same three testimonials appear everywhere, and one quote's tag is relabelled to fit each page. No project card links to a case study, and Prime EVA links out to the client's live store. The only outcome number (CRO "50-200 %") has no case behind it. The DACH partner is a grey placeholder. |
| 4 | Objection handling | **6/10** | The FAQs are the best copy on the site: honest, technical and specific ("A rebuild you did not need is the most expensive thing on a Shopify project"). They answer technical objections only. Commercial ones (price, contract, ownership, continuity, communication) go unanswered on 6 of 7 pages. |
| 5 | CTAs | **4/10** | Six labels ("Discuss Your Project", "Get Quote", "Book a call", "Let's Talk", "Contact us", "discuss a project") all open the same form. "Book a call" promises something that doesn't exist, and nothing says what happens after you click. |
| 6 | Form friction | **3/10** | Phone and company are required. Budget is in USD and pre-selected at **$2k**. The service list doesn't match the services sold. The textarea is optional. The success copy is broken English, and it shows even when the submit fails. |
| 7 | Cross-page journey | **3/10** | Service pages have zero in-body internal links. Cross-sell cues in the copy ("They get rebuilt, not carried over") go nowhere. Cases aren't linked. Nav "Portfolio / Team / Clients" drops the buyer onto the old-copy home. `/blog/` is 404 on dev. |
| 8 | Quick-win potential | **8/10** | Most of the damage is strings, one partial, the form and the links. About 70% of the lift is available without the redesign. |
| | **Overall (conversion readiness today)** | **4.5/10** | The new copy is genuinely strong (about 7/10 as writing). It's wrapped in legacy pricing, a leaky and cheap-signalling form, recycled proof and no journey. The copy earns attention and the mechanics waste it. |

---

## Top 10 issues, ranked by expected impact on enquiries

### 1. The form loses leads silently and pre-qualifies every lead as "$2k"
**Evidence**
- `src/main.js`: the `finally` block runs `successMsg.classList.add('success')` whatever happens. If the ClickUp POST fails (non-2xx, `result.success` false, or a network error), the visitor sees "thanks" and the lead is only `console.error`-ed. This is already logged as Q-11 and was left out of scope. It shouldn't be.
- `layout/drawer/form.ejs`: `<input type="radio" name="budget" value="2k" checked>`. Every visitor who doesn't touch the radio is recorded as a $2k lead in ClickUp, and the first thing a €10k buyer sees is a $2k anchor.
- Success copy, verbatim: "thanks you for submitting the form / We will back shortly to you with response." That's two grammar errors, in the very moment a stranger is judging whether you're careful.
- The lead payload has no page URL. Only UTM params, browser language and the service select are sent, so you can't tell which service page converted.

**Why it matters for this buyer**
- A €5–15k enquiry is rare: a handful a month. Losing one silently costs more than any copy fix earns.
- The $2k default tells a DACH buyer "this is a cheap shop", which is the opposite of "if the build is the hard part, that's the work we take".
- Broken English at the moment of commitment confirms the offshore-risk fear.

**Fix**
- Show success only on `result.success`. On failure, show: "Something went wrong on our side and your message was not sent. Please email hello@base-xtech.com, or try again." Keep the typed values.
- Remove `checked`. Make the budget field required with no default.
- Add a hidden `page` field (`location.pathname`) to the payload.
- Replace the success copy with: "Thank you, we have your message. You will get a reply from a person on our team within one business day (Kyiv time, CET+1). Usually it's two or three questions about your store, then a 30-minute call if it makes sense." Confirm the SLA and wording before shipping.

**Effort:** S · **bridge**

### 2. The legacy pricing block on Shopify Development contradicts the positioning and anchors below the target deal
**Evidence** (https://dev.base-xtech.com/pages/shopify-development/, the "Shopify Development Pricing" block)
- "Quick Start **from $2200** / 3-5 weeks" with "Responsive design (**premium template**)" and "Payment and shipping setup **for Ukraine**".
- "Shopify Turnkey from $4500" with "Unique Shopify store that will **leave competitors behind**" and "**Seamless** integration with business systems".
- The block sits directly under an H1 that says "for stores that need more than a theme". Q-13 kept it by default, and it isn't in the content lead's source (`02-shopify-development.txt` has no pricing).

**Why it matters**
- The EU buyer reads three things in five lines: a template shop, a Ukrainian-market offer, and a price 2–7× below their budget.
- The price makes them doubt the "complex builds" claim. The "Ukraine" line tells them this offer isn't for them.
- "Seamless" and "leave competitors behind" are on the content lead's banned list, so the page contradicts itself.
- A buyer who does trust the price arrives expecting €4.5k for a €12k scope, and that's a lost deal at quote stage.

**Fix**
- Delete the block. Replace it with a single pricing-signal paragraph, which can reuse the existing stats or text partial.
- Suggested copy: "What builds cost. Most custom builds we take on fall between €5,000 and €15,000; integration-heavy builds run higher. You get a written scope and a fixed quote before any code is written, and we will tell you if what you need is smaller than the work we take on." Confirm the numbers with sales before publishing.
- Show the same range in the form's budget options (see #6).

**Effort:** S · **bridge**

### 3. The proof exists but isn't connected: cases are unlinked, off-site or missing
**Evidence**
- Every service page's "Recent Projects" cards have no link, except Prime EVA, which links to `https://primeeva.com/`. That sends a warm lead to a client's store with no way back.
- The "UK gifting brand" appears in at least 12 FAQ answers and cards across Integrations, Migration, Apps and CRO ("1M+ profiles and thirteen years of history"). Its case study exists on production (`https://base-xtech.com/blog/custom-shopify-integrations-gifting-brand/`, HTTP 200), yet no service page links to it.
- Shopify Development leans on configurators ("Can you build a product configurator on Shopify? … Prime EVA is the example"). The home page links a configurator case (`/blog/shopify-product-configurator-naya-tech/`) that this page never mentions.
- Nova Poshta Connect and "Mo: Story Slider Navigation … 5.0 rated" on the Apps page don't link to their App Store listings. That's the one piece of third-party-verifiable proof you own.

**Why it matters**
- An agency the buyer doesn't know is judged on "show me one thing like mine". The site says it has that thing and then won't show it.
- A case study also tends to be the page that directly precedes an enquiry on agency sites. Right now it's unreachable from the money pages.

**Fix**
- Link each project card to its case study, or to the App Store listing. Add "Read the case →" under the card description.
- In FAQ answers, turn the first mention of "UK gifting brand" on each page into a link to the case.
- Add Naya Tech (configurator) as a card, or link it from the configurator FAQ.
- Make the Prime EVA link a case link if a case exists. If not, remove the external link.
- Confirm the blog URLs resolve on prod after release, since `/blog/` is 404 on dev.

**Effort:** S (links) / M (writing a Prime EVA case) · **bridge**

### 4. Vendor-risk objections aren't addressed anywhere
**Evidence**
- FAQ sets on all service pages are about technology. "Who owns the app and the code? You do… including the repository" appears only on the Apps page.
- Nothing on any service page answers any of these:
  - where the team is and who actually does the work (in-house or freelancers);
  - which language and time zone you'll work in;
  - how you're invoiced (EUR? EU contract?);
  - what happens if you part ways;
  - warranty or bug-fix period. The only mention is inside the legacy pricing block: "30 days of warranty support".
  - Ukraine and continuity.
- Home says "based in Kyiv, Ukraine" and the header says "UTC: +2". Kyiv is UTC+3 today, so the header is wrong half the year.
- The DACH brief asked for "Talk to us in German or English" and FAQ angles such as "GoBD / DATEV exports, hosting in the EU, German-language support". None are on the live DACH page, which reuses the Integrations FAQ verbatim (Q-19).

**Why it matters**
- For a first-time €5–15k buyer, these objections outweigh the technical ones.
- A DACH buyer who sees "Kyiv" will think "what if the team can't work next month?" and won't ask. They'll just pick the Berlin agency.
- Answering it plainly is a differentiator. Hiding it isn't.

**Fix**
- Add one shared FAQ partial, "Working with us", with four rows, included on every service page and the DACH page. It only needs confirmed facts. Suggested wording, facts to be verified:
  - **Who actually does the work?** "Our own team of 20+ designers and developers in Kyiv. No freelancers or subcontractors on your code. Your project has one project manager from scope to launch."
  - **What about time zones and language?** "We work CET-overlapping hours, in English, and German with our DACH partner Alexander Karl. You get a shared channel and a weekly written status."
  - **Is it risky to work with a team in Ukraine?** "We have delivered continuously since 2022. [State the real continuity measures: backup power and connectivity, a distributed team, code in your repository from day one.] Your code and access are never only on our side."
  - **How is it contracted and invoiced?** "Fixed quote after scoping, a written contract, invoicing in EUR. Code, repository and accounts are yours. If you move on, we hand over documented."
- Add a DACH-specific row: "Can we work in German?"

**Effort:** S (copy + partial) · **bridge**. The facts need a sales/founder sign-off.

### 5. CTAs are inconsistent, and "Book a call" makes a promise that doesn't exist
**Evidence** (https://dev.base-xtech.com/pages/shopify-development/)
- Hero: "Discuss Your Project". Pricing: "Get Quote" ×2. Approach block: "Book a call". Closing: "Let's Talk". Header: "Contact us". Footer widget: "Discuss Your Project / Sofia Zabrodska".
- Every one of them opens the same drawer, whose title is "let's discuss a project".
- The DACH page uses "Book a call" everywhere (4×). Q-5 says there is no calendar: it "opens our contact form", which then requires a phone number.
- No CTA says what happens next.
- The closing lines are good and should be the template: "Tell us what the two systems are and we'll tell you what connecting them takes." (Integrations). "Tell us what you're on now and we'll tell you what moving actually involves." (Migration).

**Why it matters**
- "Book a call" sets up an expectation of picking a slot. Getting a form instead feels like bait, and bounce at the drawer is highest for exactly the buyer who wanted a call.
- Six labels also read as six different things. That's a small but real clarity tax.

**Fix**
- Use one primary action per page with one label. For service pages, keep "Discuss Your Project" in the hero and "Let's Talk" in the closing CTA, as the slot map intends.
- Remove "Get Quote" (it goes with #2).
- Rename "Book a call" to "Discuss Your Project" (DE: "Projekt besprechen") until a real calendar exists. When it does, "Book a call" should open the calendar, not the form.
- Add one micro-line under the hero CTA and the closing CTA, in the existing lead or body slot: "A person replies within one business day. No sales sequence." Confirm before shipping.
- Retitle the drawer from "let's discuss a project" to the page's own ask, e.g. "Tell us what the store has to do".

**Effort:** S · **bridge**

### 6. The form asks the wrong things, in the wrong order, in the wrong currency
**Evidence** (`layout/drawer/form.ejs`)
- `Phone *` and `Company *` are required. The placeholder "e.g. Inditex" sets an enterprise frame the €5–15k buyer isn't in.
- The service select offers "Shopify Development / Website Design / Custom Development / API Integration / Theme Store". There's no Migration, Custom Apps, CRO or ERP/DACH option, no "Not sure", and a default of "Shopify Development" with no placeholder.
- Budget options are `$2k / $5k+ / $10k+ / $25k+` in USD, with $2k pre-checked.
- The most useful field is last and optional: "Tell us more if you need".

**Why it matters**
- Required phone is the single biggest drop-off field for cold B2B buyers, especially DACH, where an unsolicited call is unwelcome.
- Company as a text field is weaker for qualification than the store URL, which also tells sales the platform, size and market in ten seconds.
- A service list that doesn't include what the visitor just read about makes the form feel like it belongs to another company.

**Fix** (keep it at 6 fields, reordered)
1. **What does the store need to do?** Required textarea. Placeholder: "e.g. Connect Shopify to our JTL-Wawi so stock and orders sync; migrate from Magento 2 without losing rankings".
2. **Store URL** (optional). Replaces Company.
3. **Service**. Mirror the nav: Shopify development · Integrations / ERP · Migration · Custom app · Design · CRO · Not sure yet. Pre-select from the page the drawer was opened on.
4. **Budget** in EUR, no default: "Under €5k · €5–15k · €15–40k · €40k+ · Not sure yet".
5. **Name** and **Work email**, both required.
6. **Phone**, optional, labelled "Phone (optional, only if you prefer a call)".
- Under Send, add: "We use your details only to reply to this enquiry. Privacy policy." A DACH buyer expects to see this.
- Rename Send to "Send enquiry".

**Effort:** S–M (template plus handler field mapping) · **bridge**

### 7. Social proof is recycled and relabelled, and the one outcome claim can't be verified
**Evidence**
- All six service pages show the same three quotes: VT Advantec, Lili Mager, Gunia.
- The same Gunia sentence ("I can recommend them both for store migration and for theme customization") is tagged "Theme Development" (dev, apps), "Migration" (integrations), "Store Migration" (migration), "Theme Customization" (web design) and "Website Redesign" (CRO).
- "Lili Mager" has no company or role. The Lili Mager quote exists in two wordings across pages (Q-15).
- Clutch (`clutch.co/profile/base-x-tech`) is linked only on the home page. Upwork appears only as a footer icon.
- CRO says "50-200 % conversion uplift range" with no case. The CRO project cards are UX work ("Enquiry flow built for pieces sold on request"), not measured results. The content lead warned about this: "the thing a sceptical DACH buyer tests you on" (`06-conversion-rate-optimization.txt`, line 225).

**Why it matters**
- A buyer who reads two service pages (and most who enquire do) sees identical quotes with different labels. That reads as padding, not as three happy clients.
- An unbacked outcome claim is the first thing that breaks trust with an analytical DACH buyer.
- The claim is also a UWG §5 exposure, the same risk the DE reviewer flagged for the systems strip.

**Fix**
- Keep one tag per quote everywhere (the service it was really about).
- Add "Lili Mager, [role], [company]" if you have permission; otherwise drop it.
- Next to the stats line, add linked text: "4.8 on Upwork (see reviews) · Clutch profile", linking to the real profiles. Verifiable beats impressive.
- On CRO, either attach the range to a named or anonymised case ("Innan Jewellery: enquiry rate +X% after …") or replace it with a countable stat ("100+ projects"), as the other pages do.
- Collect two new quotes: one integration or ERP client (Fresh Market would suit Integrations and DACH), and one from the UK gifting brand.

**Effort:** S (tags, links, CRO stat) / M (new quotes) · **bridge**

### 8. The DACH page has the right structure, but its trust layer is unfinished
**Evidence** (https://dev.base-xtech.com/pages/complex-solutions/)
- Alexander Karl's photo is `<div class="person-quote--placeholder" … aria-label="Photo of Alexander Karl (placeholder)">`. This is known (Q-4) and prod is already blocked on it.
- His quote is generic. "ERP integration isn't just about connecting APIs – it's about understanding business processes…" could be signed by anyone and says nothing about him: no years, no systems, no location, no "call me".
- The brief's intended "Talk to us in German or English" line is missing.
- Every CTA is "Book a call" into the anonymous form, whose footer widget shows "Sofia Zabrodska", not Alexander.
- The Fresh Market case has no numbers, no timeline and no client quote. "Key outcomes" restates the capability names ("Private App", "Inventory Sync") instead of outcomes.
- The "Go deeper" cards include a Ukrainian Nova Poshta article and an AI analytics post. Neither is DACH- or ERP-relevant, and on dev all three 404.

**Why it matters**
- The whole point of the page is "a person in the region". A faceless partner with a textbook quote removes the one advantage the page has over the Integrations page.

**Fix**
- Real photo (already planned).
- Rewrite the quote in first person with specifics Alexander can sign off on. Pattern: "I have spent [N] years on ERP projects in Germany and Switzerland. When you talk to Base X Tech about a DACH integration, I am in the first call, in German, and I stay the person you can reach."
- Under his name, add "Talk to us in German or English."
- Add one number to Fresh Market (overselling incidents or manual corrections before and after, SKUs, locations, weeks to live), even if approximate and approved.
- Replace the Nova Poshta card with the UK gifting case, which is the ERP- and production-heavy one.
- Replace at least 3 of the 8 duplicated FAQs with DACH ones: GoBD/DATEV, EU hosting of middleware, German-language support, contract under German law or EU entity (only if true).
- Change the CTA label per #5.

**Effort:** S–M (depends on Alexander) · **bridge**

### 9. There's no journey: service pages are islands, and nav sends buyers to the old home page
**Evidence**
- The only internal links on every service page are the nav and footer. Project cards and FAQ answers don't link, and there's no "related service" link.
- Perfect bridges exist in the copy and go nowhere:
  - Migration FAQ: "They get rebuilt, not carried over. Your ERP, CRM, fulfilment and courier connections…" should point to Integrations.
  - Shopify Development capability "Custom Checkout" should point to Apps ("Functions & Extensions").
  - Web Design's "then build it ourselves" should point to Shopify Development.
  - CRO "Speed & Core Web Vitals / It is development work" should point to Shopify Development.
  - Integrations should point to Complex Solutions (the DACH brief says "The two link to each other").
- Nav "Portfolio", "Team" and "Clients" link to `/#section-works`, `/#section-team` and `/#section-reviews`. That's the home page with old copy ("We craft seamless, high-performing online stores", "let's get down to business"), and its portfolio (Naya Tech, bonkind, klott) doesn't match the service pages' projects. bonkind was dropped per the slot map but is still on home.
- The home service cards ("ecommerce", "website & identity", "Development") don't link to any service page.

**Why it matters**
- An agency buyer typically views 3–5 pages before enquiring.
- Every click that lands on the old home page resets the tone from "specific engineers" to "generic studio", and every page without a next step is an exit.

**Fix**
- Add one contextual in-text link in one FAQ answer per page. That's five link edits, no design needed.
- Add "Related: Shopify integrations →" under the closing CTA body.
- Link the home service cards to the matching service pages.
- Until home copy lands, swap the home H1 and lead (two strings) to the positioning line. Suggested: "Shopify development for stores that need more than a theme" / "Store builds, custom apps, integrations and migrations for merchants in the EU and UK. If the build is the hard part, that's the work we take." Title-only was the Q-1/Q-14 default, but these two strings are the cheapest conversion fix on the site.

**Effort:** S · **bridge**

### 10. Legacy generic blocks sit next to the new copy on every page
**Evidence**
- Every service page carries the old "Approach" block:
  - "we work within your budget"
  - "Immersion: We're dedicated to crafting new solutions that push the boundaries of what's possible, ensuring your business stays ahead of the curve."
  - "Quality: Excellence is woven into everything we do…"
- "dedicated" and "solutions" are on the content lead's banned list (`00-slot-map.txt`, voice rules).
- The home version even has the typo "Transparence".
- The block's one useful asset, three named people (Vadym-Marko Hruden, Head of Sales; Vadim Hula, Project Manager; Sofia Zabrodska, Business Development Manager), is wasted on platitudes.

**Why it matters**
- Placed directly after the most specific FAQ on the page, this block reads like a template.
- It also answers "who will I talk to?" badly when it could answer it well.

**Fix**
- Keep the layout and replace the three texts, via the partial, with who does what for the client:
  - Vadym-Marko: "Your first call. Scopes the build and writes the estimate."
  - Vadim: "Runs your project day to day. Weekly written status."
  - Sofia: "Answers your enquiry within one business day."
- Label: "Who you'll work with". Drop "we work within your budget" (it signals cheap; see #2).
- Confirm the roles are accurate.

**Effort:** S · **bridge**

---

## Per-dimension notes (evidence not covered above)

**1. Above the fold.** The Shopify Development, Migration and Integrations heroes pass the 5-second test on what and for whom:
- "Custom checkout, configurators, B2B and retail on one stack."
- "Magento, WooCommerce, BigCommerce or something built in-house."

What none of them has above the fold:
- **Proof.** The "100+ / 4.8 Upwork" line sits below the six capability cards.
- **Geography.** Nothing says EU or DACH.

Adding one proof line under the lead (bridge; it may need a slot) is the cheapest trust gain. Web Design's H1, "Shopify design for products that take more than one click", is clever but takes a second read. The DACH H1 "Complex systems, connected around how your business works." never says Shopify (the DE notes flag this too).

**2. Pains.** Named well:
- manual re-typing, stock drift, missing ERP apps (Integrations);
- end-of-life platform, hosting cost, dev dependency (Migration);
- "Someone on your team is the integration" (Apps), the strongest pain line on the site.

The "When We Can Help" cards on service pages are titles only (the footer is empty in HTML). That's acceptable per the slot map, but on the DACH page the same cards carry a sentence each and read better. Missing pains are covered in #4, plus "the last agency left us with a mess": only Apps touches it ("Can you take over an app someone else built?"). Shopify Development has the perfect line buried in the last FAQ: "Handing over a login and disappearing is where most of the problems we get called in to fix started." Promote it to the "When We Can Help" H2 area or the closing CTA body.

**3. Triggers.**
- **Scarcity/urgency:** none, and correctly so for this buyer. Don't add any.
- **Risk reversal:** implicit only ("we scope and estimate before writing code", "we will say so rather than sell you the upgrade"). Make it explicit: "Fixed quote after scoping; you can stop after the scope and keep the document." (Only if true; this is a strong move for €5–15k.)
- **Process transparency:** good. The four stages per page are specific and differentiated.
- **Authority:** two App Store apps, unlinked (see #3). No Shopify Partner badge or tier is mentioned anywhere; add it if you hold one.

**4. Objections.** The technical FAQ answers are best-in-class for agency sites. Keep them word for word. What's missing is the commercial layer (#4), and a "what does it cost" row on Shopify Development, Integrations and Apps. Web Design has one, but it dodges: "It depends on the number of page types…". Give a range.

**5–6.** See #1, #5 and #6.

**7.** See #3 and #9. Also: DACH "Go deeper" blog cards link to English articles without a marker (DE review, should-fix).

---

## Quick wins (no new design) vs redesign

**Bridge (copy, partials, form, links) — do before prod:**
1. Form: success only on real success, remove the $2k default, fix the success copy, add the page field (#1).
2. Remove the pricing block and add a EUR range sentence (#2).
3. Link project cards and first FAQ mentions to case studies and App Store listings (#3).
4. "Working with us" FAQ partial (#4, needs facts).
5. One CTA label per slot; rename "Book a call" until a calendar exists; one line on what happens next (#5).
6. Form fields: phone optional, store URL instead of company, services matching the nav, EUR budget, privacy line (#6).
7. Consistent testimonial tags, Upwork/Clutch links, CRO stat fixed (#7).
8. DACH: real photo, specific quote, "German or English", one Fresh Market number, DACH FAQs (#8).
9. Contextual links between services; home H1 and lead swap; home service cards linked (#9).
10. Approach block rewritten as "Who you'll work with" (#10).

**Redesign:**
- Proof bar in the hero (logos, rating, App Store) as a designed element.
- Case-study template with numbers (problem → built → result → quote).
- About page (the "who are we" answer; Q-2).
- Real calendar booking with a slot picker for DACH.
- A pricing or "typical engagements" section as a designed component.
- Sticky or secondary CTA on long pages.
- Related-services module.
- Team photos (Q-10).

---

## What's already strong — keep it

- **The FAQ copy on all six service pages.** It's specific, candid and turns the scope conversation into proof of expertise:
  - "A rebuild you did not need is the most expensive thing on a Shopify project."
  - "Migrations rarely fail on launch day. They fail three weeks later…"
  - "we would not claim to maintain an app we have never seen."
  - "…we will say so rather than sell you the upgrade."

  This is the voice that sells a €10k build to a sceptic. Don't dilute it in the redesign.
- **Service H1s and leads** (Shopify Development, Migration, Integrations, CRO). Clear who, what and outcome, with no banned words.
- **Per-service process stages.** Each has a reason clause ("because what gets missed is what gets lost"), which is process transparency done right.
- **Closing CTA bodies** in the form "Tell us X and we'll tell you Y". They lower the ask to a single fact the buyer already knows. Reuse the pattern for the drawer title.
- **Honest disqualifiers** ("we will tell you if what you need is smaller than the work we take on"). These qualify leads and build trust at once.
- **DACH page structure.** Partner block, architecture explanation, a real named case (Fresh Market), and an honest "Ready to integrate (no delivered project yet)" line that keeps the systems strip truthful.
- **Lead attribution basics** (UTM, gclid, `generate_lead` event). Just add the page path (#1).
