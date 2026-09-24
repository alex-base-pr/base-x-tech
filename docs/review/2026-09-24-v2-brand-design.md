# Brand and visual design review: design-v2 on dev.base-xtech.com

Date: 2026-09-24 · Reviewer lens: brand strategist + senior visual/UI designer
Scope: `/`, the six service pages, `/pages/complex-solutions/` (EN + DE), header, footer, modal, mobile menu, and `/uk/` for the brand-split risk. Blog is only on prod and is not reviewed here.
Method: Playwright (repo `node_modules`, Chromium) full-page and section screenshots at 1440×900 and 375×812, DOM probes for contrast, fonts, naming and CTA labels, raw-HTML greps, compared against `docs/design-v2/*.txt` (Figma outlines) and the two earlier reviews.
Screenshots are in the session scratchpad (`…/scratchpad/shots/`). They are temporary, so re-run the scripts if you need them later. File names are cited below, e.g. `home-1440.png`, `ch/integ-1440-2.png`, `projects-apps-1440.png`, `modal-1440.png`, `menu-375.png`.

Owner decisions respected and not re-argued: "AI Automation" stays, no team photos, Figma project images (including AI-generated ones) are approved, Karl photo pending Marko.

---

## Scores

| | Score | One-line reason |
|---|---|---|
| **Brand** | **6 / 10** | The service pages are specific and credible, and the worst generic copy is gone. But the site now makes three different promises (home, services, Complex). Origin, people and legal facts have disappeared from the EN site altogether. |
| **Visual design** | **7 / 10** | The dark, editorial v2 system is disciplined, and it matches the Figma closely on home and service pages. It reads as a real agency. It is held back by a second design system on Complex, an accent green that fails contrast everywhere it carries white text, cropped project images, and several half-empty sections. |

**Does it look like a premium EU agency?** From 2 metres away, yes. The black canvas, the restrained type, the /01 numbering and the big project cards are in the league of good Berlin and Amsterdam studio sites. Up close, no, not yet. A premium EU buyer looks for *who, where, which entity and which clients*, and the site doesn't answer any of it. "About" scrolls to an abstract "Our approach doesn't change" block. There's no city, no legal line in the footer and no Impressum. Trust badges are 30 px. The same three cases rotate on every page. The design has reached premium; the brand evidence hasn't.

---

## Positioning check: one clear promise?

| Page | H1 / core promise | What it signals |
|---|---|---|
| `/` | "Building the systems behind modern commerce" · "Everything needed to build, scale, and automate modern commerce" · final CTA "Have a complex challenge? … a custom Shopify build, an internal tool, or an AI-powered workflow" | Broad systems/automation studio. **"Shopify" isn't in the H1 or the capabilities heading.** |
| Service pages | "…for stores that need more than a theme", "…for the systems your business runs on", "…where the fix is in the build" | Shopify engineering for the hard part. **Consistent and strong.** |
| `/pages/complex-solutions/` | "Complex systems, connected around how your business works." | Generic systems integrator, **no Shopify**, and a different visual identity |
| `<title>` `/` | "Shopify Development & Web Design Agency" | Design-led Shopify shop |
| meta + `llms.txt` line 3 | "builds the systems behind modern commerce … AI automation" | Matches the home H1 |
| `llms.txt` line 5 | "a web design and development agency building Shopify stores…" | The old positioning is still there |

So the home page now has a *direction* ("systems"), which is better than "Essential design & development". But it doesn't connect to the six service H1s, and Complex is a third voice. The service pages already share the best umbrella: **"Shopify for the hard part of the build: stores, systems and apps that need more than a theme."** The home H1 can keep its rhythm and add the platform, e.g. "Building the Shopify systems behind modern commerce".

**Tone of voice.** Service-page copy is still on voice (second person, mechanisms, honest limits). Home-page copy slips back into agency-speak: "Pragmatic innovation", "Complex problems deserve thoughtful solutions", "help you find the right solution", "Gunia … delivering a seamless shopping experience". The Karl quote on Complex still has "making systems work together seamlessly" and "Our approach ensures…". "Solutions" survives in the nav label "Complex Solutions (DACH)" on every page.

---

## Top 10 findings

| # | Finding | Evidence | Fix | Effort |
|---|---|---|---|---|
| 1 | **Three promises, not one.** Home says "systems behind modern commerce" with no Shopify. Services say "Shopify … more than a theme". Complex says "complex systems" with no Shopify. The `<title>` says "Web Design Agency" and `llms.txt` line 5 says "web design and development agency". | `/` `h1`, `#h-caps-title`, `#h-cta-title`; `/pages/complex-solutions/` `.cx-hero__title`; `https://dev.base-xtech.com/llms.txt`; `home-1440-fold.png`, `ch/complex-1440-0.png` | Pick one umbrella line and use it in: home H1 (add "Shopify"), home capabilities heading, home final CTA lead (drop "internal tool"), Complex H1/lead (add "Shopify", e.g. "Shopify, ERP and POS, connected around how your business works"), `<title>`, meta and `llms.txt` line 5. | S |
| 2 | **Complex is a second design system on the same EN site.** It uses Onest/Google Sans Flex headings, pill buttons ("Book a call", 53 px, radius 999), centred section heads, light-grey panels, no green arrow CTA, and an inline "EN \| DE" in the header where other pages show only the globe. This follows its own Figma frame (Complex.txt uses Onest + Google Sans Flex, pills). The problem is the brand, not the build. A visitor moving from Integrations to Complex sees what looks like another company. | `ch/complex-1440-0.png` … `-4.png` vs `ch/integ-1440-0.png`; `src/styles/v2/_complex-v2.scss:20,72`; header `.v2-pill` vs `[data-lang]` | Ask Ira to re-skin Complex on the service template tokens: Host Grotesk, square white + green-arrow button, "Discuss your project", `.v2-tag` eyebrows, left tag / right heading layout. Keep the unique blocks (systems strip, architecture diagram, case, Karl) and restyle them. Until then, at least unify the button and CTA label. | M |
| 3 | **The accent green fails WCAG AA wherever it carries white text.** White on `#81a13f` is **2.96:1**. That covers header "Let's talk", all stat tiles (4.8* / 60+ / 100+ and their labels), process numbers `.v2-process__icon`, the selected budget chip, and the FAQ toggle. The "Numbers that matter" heading (`#9a9a9a` on `#ededed`) is **2.40:1**, and the inactive help numbers `.v2-help__num` are **2.48:1**. The light-tag labels ("Our Capabilities", "Approach") are 3.99:1 at 16 px. | DOM contrast probe on `/` and `/pages/service/custom-shopify-integrations/`; `src/styles/v2.scss:33,90,248,255,258`; `ch/integ-1440-3.png` | Either put dark text (`#040507`) on the green (about 7:1, and it looks sharper), or darken the accent for filled use to about `#5c7a22` (≥4.5:1 with white) and keep `#81a13f` for dots and lines. Raise `.v2-stats__title` to `#767676` or darker. Raise `.v2-tag--light` text to `#5e5e5e`. | S |
| 4 | **Origin, people and legal facts are gone from EN.** "Kyiv" appears on **0** EN v2 pages (the old home had it). Nav "About" goes to `/#section-team`, which is the abstract Approach block with no people. The footer has no entity, address, VAT, Impressum or contact email. The trust badges (Upwork Top Rated, Clutch Global, DesignRush) render at about 30 px and are unreadable, especially at 375. DE is unchanged: "Expertise vor Ort", "Private App", an English modal with USD budgets, no Impressum. | `/` `a[href="/#section-team"]`, `footer`; `ch/home-1440-2.png` (Trusted by row), `ch/home-375-3.png`; `modal-de-1440.png`; `/de/pages/complex-solutions/` | Add a "Who does the work" band before the final CTA on every page. Use only verified facts: team of N in Kyiv, one hour ahead of Berlin, contracting entity, invoicing currency, "you own the code and repo", DPA on request. Add a footer legal line (entity · address · email · Impressum/Privacy). Show badges at 56–64 px with a caption. Relabel "About" to "Approach" until the About page exists, or point it at the new band. DE: localise the modal (labels, EUR) and add the Impressum before prod. | S (band, footer) / M (DE) |
| 5 | **Project images are cropped badly.** The UK gifting "ONE PIPELINE / THREE STAGES" slide is cut on the left ("NE PIPELINE", "RDER", "DISPATC") on Integrations, Migration, Apps and CRO. The Mo: Story Slider visual cuts "Fullscreen Option" at the left edge, and Innan cuts its nav ("ELS BESPOKE", "ATEST"). The gifting image is also a presentation slide with its own condensed display font and its own "BASE X TECH" lockup, which clashes with the v2 type. | `projects-apps-1440.png`, `projects-migr-1440.png`, `projects-cro-1440.png`, `ch/integ-1440-1.png`, `ch/integ-375-1.png` | Re-export these three at the card ratio (755×600 desktop, 369×300 mobile) with safe margins, or set `object-position: left center` / `object-fit: contain` on a dark field for slide-type images. For the gifting brand, ask Ira for a product or configurator visual instead of a slide. | S |
| 6 | **Half-empty sections read as unfinished.** (a) "When We Can Help" has titles only. `content/pages/*.en.json → help.items[]` has no `text`, so each of the three cells is about 500 px of black with one line at the bottom, and the hover has nothing to reveal. (b) Process cards (`.v2-process`, and `.cx-process` on Complex) have about 150 px of dead space between the number and the title. (c) The service-page final CTA has an empty right half (Figma has floating screenshots). (d) The home hero is a 245×176 thumbnail over about 400 px of black. | `ch/integ-1440-2.png`, `ch/integ-1440-3.png`, `ch/integ-1440-4.png`, `ch/complex-1440-3.png`, `home-1440-fold.png`; `content/pages/shopify-integrations.en.json:95-110` | (a) Add one or two sentences per item (Marko's slot map has a slot for it) and render them always visible, not only on hover. (b) Cut `min-height` so cards hug their content, or put the deliverable ("You get: …") in the gap. (c) Add the Figma floating project shots, or centre the CTA like the mid-page one. (d) Ask Ira whether the hero thumbnail should be the 2-image stack at larger size. | S (a,b) / M (c,d) |
| 7 | **The portfolio looks thin and inconsistent.** The UK gifting brand appears on 4 pages and Prime EVA on 6 (home + 5 services). Gunia is "Lifestyle brand" with a petals-and-earring portrait on `/`, "Homeware" with a woman in a knitted dress on Migration, and a "Ukrainian luxury homeware brand" in copy. VT Advantec ("API integration") is shown with a pickleball player. Nova Poshta Connect is a zoomed Ukrainian-language UI crop. Mo: Story Slider and VT Advantec have no arrow link while the others do. | `ch/home-1440-1.png`, `projects-migr-1440.png`, `projects-apps-1440.png`, `ch/integ-1440-1.png`, `ch/integ-375-2.png` | Give each client one industry tag and one hero visual, used everywhere. Where a page can't have 3 distinct cases, show 2 rather than repeat. For B2B/API work, use a product or system visual (the architecture diagram style from Complex works well). Use an English-locale screenshot of Nova Poshta Connect plus the App Store rating as a badge. Every card either links somewhere or hides the arrow slot consistently. | M (needs assets) |
| 8 | **Naming and label drift.** The DACH page appears as "Complex Solutions (DACH)" (nav, mobile menu), "Complex Solutions" (eyebrow), "Complex Systems (DACH)" (JSON-LD `Service.name`, breadcrumb) and "Complex Shopify Systems" (`<title>`). The home testimonials still say "Base X went through…" (twice). CTAs come in 8 labels: "Let’s talk", "Let’s Talk", "Let's Talk" (straight apostrophe on 5 service pages), "Discuss Your Project", "Book a call", "Gespräch vereinbaren", "Send project details", "More articles". The CSS family is named `TWKEverettV2` but loads Host Grotesk, which is a maintenance trap. | DOM probe (CTA counts per page); `/pages/complex-solutions/` JSON-LD; `/` `#section-reviews`; `src/styles/v2.scss:9-16` | One name: "Base X Tech" in all text (quotes may keep the client's wording, but say so or paraphrase). One page name: "Shopify + ERP (DACH)" or similar, the same in nav, eyebrow, title and schema. One primary CTA verb ("Discuss your project"), with "Let's talk" only in the header pill, and one apostrophe (’). Rename the font alias to `HostGroteskV2`. | S |
| 9 | **Typography: Host Grotesk holds up; the mix around it doesn't.** At 105 % size-adjust, Host Grotesk sets the 75 px/94 % display lines without descender collisions (checked "challenge? / solve", "systems your / business") and reads close to Everett's neutral grotesk. It is a sound free substitute. The problem is the number of faces on one site: Host Grotesk, **Onest** (client-story quote, FAQ heading, modal title, all Complex headings), **Arial** (modal submit "Send project details" and close button, because `button` doesn't inherit the font), and on `/uk/` a condensed uppercase display face. The modal submit is visibly Arial and left-aligned. | `modal-1440.png`; probe: `BUTTON.v2-btn--wide` and `BUTTON.v2-modal__close` compute to Arial; `src/styles/v2.scss:314-320`, `v2/_modal.scss:34` | Add `font: inherit` to buttons in `body.v2` and centre the submit label. Limit Onest to one role (or drop it; Figma uses it inconsistently). Note that `Onest-Regular` ships only 400 while the modal title asks for 300. | S |
| 10 | **`/uk/` is one click away and looks like a different company.** The globe menu offers "EN / УКР", and УКР lands on the old design: uppercase condensed display type, grey glass header, "BASE X", "UTC: +3", "Преміальний дизайн та розробка", fashion positioning, a React/Next.js tag cloud. Owner decision stands (UK stays as is), but the switcher advertises it on every EN page. | `ch/uk-1440-0.png`, `uk-375.png`; `/` `a[data-lang="uk"]` | Until UK is re-skinned, remove УКР from the EN globe menu (keep hreflang if SEO needs it) or label it "Українською (стара версія)". Put a UK re-skin (template + copy transfer) on the roadmap so the split has an end date. | S (switcher) / L (re-skin) |

---

## Visual fidelity to Figma

| Area | Match | Notes |
|---|---|---|
| Header (pills, globe, green "Let's talk", 1 px rules, left rail with section dots) | High | 80 px tall vs Figma's ~90. The mobile header uses a burger icon where the Figma has a "Menu" text pill (`Mobile-menu.txt`). |
| Home hero, capabilities, reviews, projects, approach, articles, stats, roadmap, CTA, footer | High | Sizes, weights, tags and colours follow `Home-Page.txt`. The footer copyright now reads "Base X Tech" (Figma still says "Base X All right reserved"). |
| Service template (Integrations reference) | High | Hero crosshair + pill, capability cards with "0 - 1" counters, project rows, help, stories, process, stats, FAQ. The Figma help-item description (which was wrong copy) is omitted, leaving the cells empty (finding 6). The final CTA is missing the floating images. |
| Complex | High to its own frame | Its frame is a different system (finding 2). |
| Modal | Medium | Layout and fields match `Modal-form.txt`. The title is Onest 300 and renders as 400. The submit button renders in Arial. |
| Mobile | Medium-high | The hero, stacked cards and menu match. The side gutter is 12 px in hero and menu but 24 px in content sections, while Figma is 12 px throughout (369 of 393). |

## Spacing rhythm

Service and home sections use `padding: 3rem … 6rem` (top/bottom asymmetric) with a left-tag/right-heading head. That is consistent within the v2 template and gives a good editorial cadence on desktop. Rhythm breaks in three places. Oversized fixed-height cells (help, process) create dead zones. Complex uses its own centred ~120 px cadence. On mobile the gutter jumps between 12 and 24 px (`ch/home-375-0.png`: hero text at x=12, capabilities at x=24; footer at x=30).

## Imagery

This is a strength where the images are product-real: the NAYA hardware, the Prime EVA configurator on a monitor, the KLOTT device shots in the capability cards. Consistency drops with the presentation slide (UK gifting), the stock sports photo (VT Advantec), the fashion portraits used for a "homeware" client (Gunia), and a Ukrainian UI crop (Nova Poshta). The Fresh Market case on Complex still shows the grey image-placeholder icon. The Karl photo placeholder is expected (pending Marko) and is not counted as a defect.

---

## Fixed since the last reviews (2026-09-24 brand + design-service-page)

- **$2200 "premium template … shipping setup for Ukraine" pricing card**: gone from Shopify Development.
- **Shared "Approach" block** (Immersion / Transparency / Quality, "we work within your budget", real names beside empty sentences): gone from service pages. Home has the Figma version ("Depth over shortcuts…"). It's still generic, but it no longer puts staff names next to it.
- **Footer**: "© 2026 Base X Tech. All rights reserved." (was "Base X All right reserved").
- **Lead form**: service options are now the six services + Complex + "Not sure yet". The success message is correct English ("Thank you — your project details are with us…"). The old "thanks you … We will back shortly" typo is gone.
- **4.8\* footnote** added ("Average client rating on our Upwork agency profile").
- **Case links**: project cards now link to the blog case studies (UK gifting, NAYA, Nova Poshta), which fixes "flagship case never linked".
- **Old home copy removed**: "Essential design & development", "Transparence", "Ecommerece", "let's get down to business", bonkind, the React/Next.js tag cloud, "40+ vs 100+".
- **"Become a Client"** (Figma) was not used; the stories CTA is "Discuss Your Project".
- **Header**: the service names in the dropdown match the H1s; "Ecommerce / Design" group labels are gone.

## Still open from the last reviews

- One umbrella promise on home, `llms.txt` line 5 and `<title>` (finding 1).
- "Complex Solutions" naming with no Shopify in the H1 (findings 1, 8).
- Karl quote: "seamlessly", "Our approach ensures". The "Local Expertise / Expertise vor Ort" label is still live on EN and DE.
- "Private App" terminology (Apps, Complex EN/DE).
- Who / where / entity / DPA / continuity (finding 4). This is now *worse*, because the Kyiv line left with the old home.
- DE chrome: English modal, USD, no Impressum, no German privacy notice.
- Testimonials: the same three rotate everywhere, with no source (Clutch/Upwork) on each quote. "Base X went through…".
- CRO "50–200 %" still has no substantiation on the page.
- Process stages list activities, not deliverables or durations.
- Mixed-design period: Complex vs the service template, and `/uk/` (findings 2, 10).

---

## Visual bugs

| # | Bug | Where | Screenshot |
|---|---|---|---|
| 1 | UK gifting project image cropped on the left edge, cutting text | Integrations, Migration, Apps, CRO, `.v2-project` media, 1440 and 375 | `projects-apps-1440.png`, `ch/integ-375-1.png` |
| 2 | Mo: Story Slider image cuts "Fullscreen Option" copy at the left edge | Apps | `projects-apps-1440.png` |
| 3 | Innan image cuts the site nav at the left edge | CRO (and wherever Innan is used) | `projects-cro-1440.png` |
| 4 | Modal submit "Send project details" and the close button render in Arial; the submit label is left-aligned | All pages, `.v2-btn--wide`, `.v2-modal__close` | `modal-1440.png` |
| 5 | "When We Can Help" cells have no body text: 3 × ~500 px of empty black, and hover reveals nothing | All six service pages, `.v2-help__item` | `ch/integ-1440-2.png`, `ch/integ-375-2.png` |
| 6 | Hero dashed crosshair line runs through the H1 ("for the systems your") | Service heroes, 1440 | `integ-1440-fold.png` |
| 7 | Systems strip leaves orphan "·" separators at line ends and wraps "Microsoft Dynamics 365 Business Central" awkwardly | Complex EN/DE at 375 (and at 1440 after "Middleware ·") | `ch/complex-375-0.png`, `ch/complex-1440-0.png` |
| 8 | Fresh Market case shows a generic image-placeholder icon | Complex EN/DE `.cx-case` | `ch/complex-1440-2.png` |
| 9 | VT Advantec card has no arrow link while its sibling cards do (the same goes for Mo: Story Slider on Apps) | Integrations, Apps | `ch/integ-1440-1.png`, `ch/integ-375-2.png` |
| 10 | Trust badges are ~30 px and unreadable | Home "Trusted by" row, 1440 and 375 | `ch/home-1440-2.png`, `ch/home-375-3.png` |
| 11 | Mobile side gutter is inconsistent (12 / 24 / 30 px) | Home 375: hero vs sections vs footer | `ch/home-375-0.png`, `ch/home-375-4.png` |
| 12 | Stats footnote is placed differently: under the heading on home, under the tiles on service pages | `/` vs service pages, `.v2-stats` | `ch/home-1440-3.png` vs `ch/integ-1440-3.png` |
| 13 | Complex header shows an inline "EN \| DE" switch; other pages show only the globe | `/pages/complex-solutions/` header | `ch/complex-1440-0.png` |
| 14 | "Insights" and "More articles" link to `/blog/`, which returns 404 on dev (expected, since blog is prod-only; confirm it resolves after deploy) | Header, footer, home articles | `blog-1440.png` |

Checked and fine: no horizontal overflow at 375 on any EN/DE page; no broken images; all `<img>` have `alt`; `/uk/`'s 1568 px scrollWidth at 1440 is the off-canvas drawer, clipped by `body{overflow-x:hidden}`, and does not scroll.

---

## Suggested order

1. Contrast tokens, button font, image crops, help-item copy, naming and CTA labels (findings 3, 5, 6a, 8, 9). About one day, no design dependency.
2. Umbrella line on home, Complex, title and `llms.txt` (finding 1). Needs a copy decision from Marko or Alex, then about 1 hour.
3. "Who does the work" band + footer legal line + larger badges; hide УКР in the switcher (findings 4, 10). Needs verified facts from Alex.
4. With Ira: Complex re-skin onto the template, CTA floating images, hero thumbnail, per-client visuals (findings 2, 6c-d, 7).
