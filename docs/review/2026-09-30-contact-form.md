# Contact form: design match, conversion, lead quality (2026-09-30)

Compared: Figma "Modal-form" 825:33 / "Modal-mobile" 825:122, the current v2 modal on dev (`layout/v2/form.ejs`),
and the old form on base-xtech.com (live).

## 1. What differs from Figma

| # | Figma | Now on dev | Why it changed | Keep? |
|---|---|---|---|---|
| 1 | 7 elements, fits one screen (desktop ~720 px, mobile card) | 8 elements; desktop panel 928 px → scrolls at 900 px height, privacy line cut; mobile 1040 px | "How did you find us?" select + two lines under the button were added (growth review) | **No:** move the source question out (see 3.1) |
| 2 | Budget: 4 chips in one row, `$2K–5K` pre-selected (green) | 4 EUR chips + "Not sure yet" on its own full-width row, nothing pre-selected | EUR (owner A3); pre-selection sent every lead as "$2–5K" | Keep EUR + no default; put "Not sure yet" back into the row as a small 5th chip |
| 3 | "Company name*" required, phone placeholder `+1 234 567 890` | "Company or store URL" optional, "Phone (optional)" | conversion review: fewer required fields | Keep optional; relabel (3.2) |
| 4 | Button label left-aligned, bold | centred, regular weight | build detail | **Fix to Figma** |
| 5 | Select 44 px like the inputs | select 55 px | build detail | **Fix to Figma** |
| 6 | Mobile: floating card with margins | full-screen sheet | usability (keyboard, scroll) | Keep full-screen, but match spacing/sizes |
| 7 | Accent `#81a13f` | `#B5DC4A` | owner brand decision 2026-09-25 | Keep |

Old live form: every field required (name, email, **phone**, **company**), caps labels, "SEND". The v2 form is
already better for conversion; the gap now is mostly layout and what sales receives.

## 2. What sales gets today (ClickUp task)

Name, email, phone, company, service, budget, source, **browser** language, page, first landing page, first referrer,
first-touch UTM, message. Missing / weak:

- **Site language of the page** (EN/DE/UK): browser language ≠ the language to reply in (a German buyer on an English
  browser). Sales needs this to route DE leads to Karl.
- **Store URL** is mixed with company name, so it is often just "ACME GmbH" → sales has to search.
- **Message** is optional and the placeholder does not ask for what sales needs (platform, systems, deadline).
- Nothing tells the buyer **what happens next** after sending (who replies, when, a 30-min call).

## 3. Recommendations (balance: 2 required fields, better info for sales)

1. **"How did you find us?" → after sending.** In the success state: "One quick question: how did you find us?"
   as one-click chips (Google, ChatGPT/AI, Clutch, Referral, LinkedIn, Other). Form gets one field shorter and fits
   one screen again; self-reported source (AI assistants, referrals, which analytics can't see) is still collected.
   UTM/referrer stay automatic. **Open:** the ClickUp proxy (clickup.base-xtech.com) only creates tasks as far as
   the site code shows; adding the answer to the same task needs an update endpoint there. Fallback without backend
   work: the answer goes to GA4 as an event, and the form keeps the source as compact chips instead of a select.
2. **Company field → "Website or store URL"**, placeholder `yourstore.com`, optional. One field that sales can open
   in a click; the company name is on the site.
3. **Message placeholder that guides:** EN "Your platform, the systems involved and any deadline, e.g. Shopware →
   Shopify, Xentral, live by March." (DE/UK equivalents). Still optional.
4. **Budget row as in Figma:** 4 chips + a small "Not sure yet" in one row (two rows on mobile), no default.
5. **Lead gets `Site language: de`** (page `lang`) and a first line summary for ClickUp:
   `DE · Custom Shopify Integrations · €15–40k · yourstore.com`, so sales triages from the task name/list.
6. **Success state says what's next:** "Sofiia will reply within 1 working day with times for a free 30-minute
   call." (UK/DE equivalents; on DE Complex: Alexander Karl.)
7. **Visual match to Figma:** button label left/bold, 44 px select, spacing so desktop fits in 800 px height.
8. **Measure:** GA4 `form_open`, `form_start` (first field focus), `generate_lead` (exists) → form-completion rate
   by page. Today only `generate_lead` exists, so drop-off can't be seen.

Not recommended: more required fields (phone/company), a timeline field, a multi-step wizard (7 fields don't need it),
blocking free-mail addresses.

Effort: 1–4, 7 ≈ 2 h · 5–6 ≈ 1 h · 8 ≈ 1 h (+ GA4 key-event setup by the owner) · tests updated with each.

## 4. Done (2026-09-30, owner "go" on 1–8)

1. Source question → a one-click second form in the success state; sent as a separate ClickUp task
   `… - <email> - Source: <answer>` (with the lead's email, time and UTM for matching). Writing it into the lead
   itself: later, needs an update endpoint in the ClickUp proxy.
2–4. Website field, guiding placeholder, budget in one row (DE labels shortened to "5–15 Tsd. €" etc.; values unchanged).
5. Task name and first description line: `DE · service · budget · website · country · utm: source/campaign`;
   `Site language`, `Location (approx.)` (country from Cloudflare `/cdn-cgi/trace` + browser time zone; privacy
   policies EN/DE/UK updated).
6. Success text: Sofiia replies within 1 working day with times for a free 30-minute call.
7. Figma sizes (550 px sheet, 44 px fields/select, 90 px textarea, left/500 button label, mobile card 12 px from edges).
8. GA4 `form_open`, `form_start`, `lead_source` (+ existing `generate_lead`). Mark them as key events in GA4 if wanted.

UTMs (owner): first-touch UTM of the visit, UTMs on the current URL, and a **campaign history** in localStorage
(last 10 campaigns, 90 days; a new campaign is appended, the same one refreshes its date; `utm_content` alone is not a
campaign). The lead gets `Last campaign UTM` and `Campaign history (oldest first)` with date, UTMs, landing page and
referrer. Tests: `qa/tests/review-v2.spec.js` (form + campaign history, ClickUp stubbed), `qa/tests/contact-form-2026-09-30.spec.js`.
