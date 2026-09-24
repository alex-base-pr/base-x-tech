# New service-page design (Figma "Сервісна сторінка") — review + implementation estimate

Source: Figma page "Сервісна сторінка" — frames *Service Page* (637-238, final, Web Design example), *Home screen 1/2*
(688-496 etc., alternative centred hero with a project strip), *Mobile*, *Service* (grey wireframe). UI kit: TWK Everett,
Heading L 75 / M 40 / S 32 / XS 24, body 16. Reviewed 2026-09-24 with the same three lenses as
[the dev review](2026-09-24-summary.md): conversion, brand, buyer.

## What the design is

Dark header with pill navigation (Services · Portfolio · Insights · About · Contact), language globe, green "Let's talk";
left rail with section dots. Sections: hero (service tag, 3-line H1 with the last line in grey, lead, "Discuss Your
Project") → Our Capabilities (/01–/06 list, active row highlighted + thumbnails) → Recent Projects (3 large cards:
industry tag, big visual, name, one-line outcome, service tags, arrow to case; badge like "10M+ possible
configurations") → CTA → When We Can Help (3 columns, description revealed on hover) → Client Stories (client list as
tabs + quote + avatar/logo + context "Stealth Startup US · Shopify Application") → "Become a Client" → Our Design
Process (4 cards with icons) → Numbers that matter (4.8* Upwork · 60+ · 100+) + "What happens after launch matters
more." → FAQ (white accordion cards) → final CTA with floating project screenshots → footer.

It is exactly Marko's slot map (eyebrow/H1/lead/CTA, 6 capabilities, 3 projects, 3 conditions, quotes, 4 steps,
stats, FAQ, CTA) — the copy we already put on dev fits 1:1.

## Against the dev-review findings

| Finding (dev review) | New design | Verdict |
|---|---|---|
| 4 Proof exists but isn't used | Big real project visuals, one-line outcome, service tags, arrow to case, metric badge ("10M+ possible configurations"); client stories with context line | **Solved visually.** Still needs: link targets (case pages / blog cases), role + country on quotes, permission for logos |
| 6 Generic "Approach" block | Gone | **Solved** |
| 5 Positioning on the page | H1 "Shopify design for products that take more than one click" + lead "…then build it ourselves" — specific, ownable | **Strong** |
| 7 CTA consistency | Pair button "Discuss Your Project" + arrow repeated; but also "Become a Client" and "Let's Talk" | **Better, not done** — one label per slot, and "Become a Client" reads presumptuous for a first contact |
| 3 Who we are / where / contract / GDPR | Nothing in page or footer (footer: logo, nav, Upwork/LinkedIn/Behance, "© 2026 Base X All right reserved") | **Open.** Add a "Working with us" row and a footer line (entity, location, Impressum/Privacy) — critical for DACH |
| 8 Process stages without deliverables | 4 cards, activity descriptions, no duration/output | **Open** — room exists in the cards for "You get … · ~N weeks" |
| 1 Contact form | Not in this frame ("Contact popup" designed separately) | **Open** — check the popup against the form findings |
| 2 $2200 pricing card | Not in the design | **Solved by omission**; still worth one line "fixed quote after scoping" near the final CTA |
| Stats | Same three numbers; "4.8*" has an asterisk with no footnote; "What happens after launch matters more." is a strong line with nothing under it | Add the footnote (source + count of reviews); put the support offer under the post-launch line |
| Naming | Footer "Base X", testimonial "Base X went through…" | Pick one name (Base X Tech) |

## New risks the design introduces

1. **Hidden content.** "When We Can Help" descriptions appear only on hover; capabilities are greyed until active.
   On touch devices there is no hover, and content must be in the HTML (not injected) for Google/AI assistants.
   Build it as always-rendered text with CSS emphasis, tap-to-expand on mobile.
2. **Contrast.** Inactive capability rows and grey H1 line (#9a9a9a-ish on #0b0b0b / #eee) likely fail WCAG AA —
   the same issue as the current site. Needs a darker grey on light and lighter grey on dark (check with the kit).
3. **Blurred scroll-reveal headings** ("Numbers that matter", "What happens after launch…") — must respect
   prefers-reduced-motion and not hide text from crawlers.
4. **Assets.** Every service page needs 3 project visuals + screenshots for the final CTA; only some exist in the repo
   (Prime EVA, NAYA, KLOTT). Innan, Gunia, Nova Poshta, Fresh Market visuals must come from Ira. We have view-only
   Figma access ("Ask to edit") — export needs Ira or Dev Mode access.
5. **Mixed design period.** If service pages switch to the new design while Home, legal pages and /uk/ stay old,
   the site looks like two companies. Either ship all EN pages together (Home needs its design) or keep the new
   design on dev until Home is ready.

## Buyer lens (same four personas)

- **Tom (UK, configurator):** biggest gain — Prime EVA card with "10M+ possible configurations" and the configurator
  story is exactly his proof. Would move from ~40% to ~60% once the pricing card is gone and cases link somewhere.
- **Marta (Magento):** gains visual trust; still needs migration numbers (the Migration page's cards).
- **Katrin (DE):** design looks like a serious agency — but footer/legal/who-we-are gaps remain; still "no" without
  Impressum, German contact, DPA line.
- **Lukas (CH, white-label):** nothing specific for partners; unchanged.

## Implementation estimate (into the current codebase)

What we reuse: all page copy (already structured by Marko's slots, easy to move into `content/pages/*.json` like the
Complex page), SEO/GEO layer (canonical, JSON-LD incl. FAQPage, llms), site map, DE/hreflang/switcher logic, dev
pipeline and the QA suite (catches regressions in canonical, schema, links, a11y, copy fidelity).

What is new: design tokens + base styles from the UI kit; new header (pill nav + services dropdown + globe + CTA),
footer, mobile menu; ~9 section components with interactions (capability list, project cards, hover/tap reveal,
testimonial tabs, accordion, section-dot rail, scroll reveals, floating CTA images).

| Block | Effort |
|---|---|
| Tokens, typography, grid, buttons, pills from UI kit | 0.5 day |
| Header + footer + mobile nav + language globe | 1 day |
| Service template: 9 sections + interactions, responsive per Mobile frame | 2 days |
| Move 6 service pages to JSON + new template (copy exists) | 0.5 day |
| Complex page (EN + DE) in the new style (its Figma is the same system) | 0.5–1 day |
| Visual QA vs Figma at 1440/375, a11y (contrast, hover content), performance, reduced motion | 1 day |
| **Total** | **≈ 5.5–6 working days**, parallelisable to ~3–4 calendar days |

Dependencies that decide the date more than code does: project visuals and icons exported from Figma (Ira / Dev Mode
access), the Contact popup design, Home (and About) designs if we don't want a mixed-design period, and the
"who we are" facts.

Recommendation: build the new template on a branch (`design-v2`) with its own Cloudflare preview URL while the
current bridge version stays on dev/prod; switch when Home is designed. Start with the Web Design page (it is the
Figma example), then roll out the other five from data.

## Side note — new Figma comments on Complex Service (Vadym-Marko, 24 Sep)

A real DACH case ("German specialty food retailer": Shopify POS · Mettler Toledo scales · Xentral ERP · custom
middleware; challenge: weighed goods across physical stores) and a factual bio for Alexander Karl ("Berlin-based
interim product owner and e-commerce consultant with 40+ completed digital projects…", "your point of contact for
projects in Germany, Austria and Switzerland"). These answer the trust gaps on the DACH page and should replace the
placeholder case/quote once Vadym confirms the final text.
