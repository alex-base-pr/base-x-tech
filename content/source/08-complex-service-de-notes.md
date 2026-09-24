# Complex Solutions page: German (DE) translator's notes

Source: `content/pages/complex-solutions.en.json` → target: `content/pages/complex-solutions.de.json`
Context: `content/source/08-complex-service-figma.txt`. Translated 2026-09-24.

## Register

- Formal "Sie" throughout, including the FAQ answers and CTAs. No "du" anywhere.
- Tone: plain and confident, the way a DACH integration consultant talks to a Geschäftsführer or E-Commerce-Leiter. Short main clauses, no superlatives, no "revolutionär/nahtlos/ganzheitlich".
- Spelling: standard German (Germany) with ß (fließen, Großteil, außerhalb, maßgeblich). A Swiss variant (ss instead of ß: fliessen, Grossteil, ausserhalb, massgeblich) can be derived mechanically later. Also check "Livegang" vs Swiss "Go-live" usage then.
- Dashes: German spaced en dash ( – ) instead of the English em dash.
- Kept as standard DACH IT vocabulary: ERP, POS, CRM, PIM, API(s), Webhook, Middleware, Monitoring, Konnektor, Fulfillment, Private App, Barcode-Scanning, Routing, 3PL (explained once).

## Glossary

| EN | DE | Why |
|---|---|---|
| orders | Bestellungen | Shopify's German admin uses "Bestellungen". "Aufträge" is ERP language, but the merchant sees Shopify first. Used consistently. |
| stock / inventory (levels) | Bestand / Bestände, Warenbestand | Standard merchant term. |
| inventory (as system category, hero) | Lagerverwaltung | "Warenwirtschaft" in DACH usually means the ERP/WaWi itself (JTL-Wawi), so using it here would duplicate "ERP". |
| Inventory Sync (tag/outcome) | Bestandsabgleich | "Bestandssynchronisierung" (24 chars) is too long for a tag. "Abgleich" is what merchants say. |
| invoices | Rechnungen | |
| integration | Integration / Anbindung | "Integration" for the concept and cards. "anbinden/Anbindung" in running text (Shopify an das ERP anbinden), which is how DACH buyers search and speak. |
| integration layer | Integrationsschicht | Standard architecture term. |
| connector | Konnektor | Standard in DACH ERP world (e.g. Xentral, weclapp marketplaces). |
| data ownership | Datenhoheit | Established term in German integration projects. |
| system of record / "which system owns the data" | führendes System / "für welche Daten welches System führend ist" | This is exactly how German ERP consultants phrase it ("das ERP ist führend für Bestände"). |
| field mapping | Feldzuordnung | German equivalent, commonly understood. "Feld-Mapping" would also be fine. |
| retries | automatische Wiederholungen | |
| reconciliation | Datenabgleich | |
| monitoring | Monitoring (noun), überwachen (verb) | Both standard. |
| API limits | API-Limits | |
| Custom APIs (strip + card) | Individuelle APIs | "Custom" is not idiomatic in German B2B copy. "Individuelle Schnittstellen" is the most natural German, but the strip is a list of technology badges and the brief prefers keeping "APIs". Can be swapped for "Individuelle Schnittstellen" if the layout allows. |
| Middleware | Middleware | Standard. |
| custom (logic, automations, integration layer) | individuell | "maßgeschneidert" felt too salesy when repeated. |
| Private & Custom Apps | Private & individuelle Apps | See risks: Shopify's own German UI uses "benutzerdefinierte Apps" for custom apps. |
| Private App (tag/outcome title) | Private App | Kept as the recognised Shopify term. In running text it is written as an adjective: "eine private App". |
| off-the-shelf | fertig / Standard- | |
| Fulfilment | Fulfillment | German usage (Duden) spells it with double "ll". The English source uses British spelling. |
| carriers / couriers | Versanddienstleister / Paketdienste | |
| tracking | Sendungsverfolgung | |
| labels | (Versand-)Etiketten | |
| overselling | Überverkäufe | Common in German e-commerce. |
| physical locations / in-store | Ladengeschäfte / im Laden | "Filialen" would suggest a chain, which the source does not say. |
| In-store operations (diagram) | Ladenbetrieb | Short label. |
| Commerce platform (diagram) | Commerce-Plattform | Shopify's German marketing calls itself that. |
| go-live / launch | Livegang | Consistent across the process step and FAQ. |
| deprecated (API version) | abgekündigt | The correct German IT term. |
| Book a call | Gespräch vereinbaren | Neutral. Does not promise a phone call specifically, so it also works for video calls. |
| Read More | Weiterlesen | |
| By | Von | |
| Stage (prefix) | Phase | "Phase 01 … 04" is the usual German project-method wording. "Schritt" would also work but sounds more like a tutorial. |
| Our Capabilities | Unsere Leistungen | "Fähigkeiten/Kompetenzen" sounds odd as a section label on an agency site. |
| Our Process | Unser Vorgehen | Standard German consulting term. "Prozess" reads as an anglicism here. |
| Local Expertise | Expertise vor Ort | See risks. |
| DACH Partner | DACH-Partner | Hyphenated compound. |

## Deviations from literal meaning

1. **Hero H1**: "connected around how your business works" became "verbunden so, wie Ihr Unternehmen arbeitet". "Around" has no natural German equivalent. The meaning is kept: the systems follow the business, not the other way round.
2. **Capabilities H2**: "integrate" became "verbinden" instead of "integrieren". "Was wir integrieren, entwickeln und automatisieren" is 134% of the English length. "verbinden" gives 129% and reads more naturally.
3. **"Behind the integration" (label)** became "Unter der Haube" (German idiom for "under the hood"). The literal "Hinter der Integration" is not idiomatic.
4. **Partner quote**: "Every setup is different" became "Jede Systemlandschaft ist anders". "Setup" is an anglicism, and "Systemlandschaft" is what a German consultant would say. "not a source of constant firefighting" became "und nicht etwas, bei dem Sie ständig Brände löschen müssen". "Feuerwehreinsatz" also exists as a metaphor, but spoken German says "Brände löschen". "Our approach ensures" became "Unser Vorgehen sorgt dafür" (see risks).
5. **"Proven in practice"** became "In der Praxis bewährt" (literal, same claim level).
6. **"What we built"** became "Was wir umgesetzt haben". "Was wir gebaut haben" is colloquial for software in formal copy.
7. **"including the ones that fail"** became "einschließlich der Fehlerfälle" (process step 3, FAQ 3). Literally "auch die, die scheitern", which reads clumsily. The meaning is the same: failure scenarios are tested deliberately.
8. **FAQ H2** "Questions we get asked" became "Fragen, die wir oft hören". "oft" is a small addition to sound natural. The literal "Fragen, die uns gestellt werden" is 141% of the length and stiff.
9. **CTA "We’ll take it from there."** became "Um die nächsten Schritte kümmern wir uns." A literal "Den Rest übernehmen wir" would over-promise (it implies we take over all the work).
10. **CTA H2** "Have a complex system to connect?" became "Sie möchten ein komplexes System anbinden?". German questions with "Haben Sie … anzubinden?" sound awkward.
11. **FAQ 7**: "silent … than a loud one" became "ein unbemerkter Integrationsfehler kostet mehr als ein offensichtlicher". "still/laut" does not carry the same metaphor in German. "breaks" became "fallen aus".
12. **Blog excerpt 2**: "TTNs" became "Frachtbriefe (TTN)". German readers do not know the Ukrainian abbreviation.
13. **Blog title 2**: "Nova Poshta Shopify Integration" became "Nova-Poshta-Integration für Shopify". This follows correct German compound hyphenation.
14. **Posts label** "Go deeper" became "Tiefer einsteigen" (idiomatic, 17 chars vs 9).
15. **Meta title/description**: these are rewritten for German SEO rather than translated (see below). The English meta description equals the hero lead. The German one is a shortened variant of the lead with "Shopify … anbinden" up front.

## Length check (headings and cards)

All section headings (H1/H2) are within 130% of the English character count (HTML tags excluded). The longest is the process H2 at about 125%.
Items exceeding 130% of the English length. All are short, and all card titles are 30 characters or fewer except the "help" cards:

- capabilities card "Individuelle APIs": 17 chars (EN 11)
- capabilities card "Individuelle Automatisierung": 28 chars (EN 18). The plural "Automatisierungen" would be 30.
- outcome/tag "Automatisierung": 15 (EN 10)
- process steps "Entwickeln & testen": 19 (EN 12). "Livegang & Monitoring": 21 (EN 16).
- labels "Wann wir helfen können" (22 vs 16) and "Tiefer einsteigen" (17 vs 9)
- blog title 1: 77 chars (EN 58, 133%). This is a card title and may wrap to one more line.
- help cards over 30 chars, but shorter than or equal to the English: "Ihre Systeme laufen auseinander" (31, EN 31), "Ihr Ablauf passt in keine fertige App" (37, EN 41), "Handarbeit wird zum Teil des Systems" (36, EN 42).

German words are long. Watch "Integrationsschicht", "Bestandsaktualisierungen" and "Fulfillment-Dienstleister" on mobile, and consider `hyphens: auto` with `lang="de"` on the page.

## Ambiguities and risks (content, legal, UX)

- **Partner quote vs Figma.** The Figma quote p1 contained "We’ve built integrations with every major system in the Swiss market". The JSON replaced it with a neutral sentence, and I translated the JSON. Do not bring the Figma claim back for DACH without proof. An unverifiable superlative is a risk under UWG § 5 (misleading advertising) in Germany, and under UWG Art. 3 in Switzerland.
- **"ensures" → "sorgt dafür".** I deliberately avoided "gewährleistet/garantiert", because in German B2B contracts "Gewährleistung/Garantie" carry legal meaning. Similar wording: "ohne Handarbeit" (ERP card) is marketing shorthand from the English "without hands". It is acceptable, but it is an absolute statement.
- **Systems strip** ("Abgestimmt auf die Systeme, die Sie bereits nutzen"). Listing Xentral, JTL-Wawi, weclapp, SAP B1, Business Central, DATEV, lexoffice etc. implies hands-on experience with each. FAQ 5 stays deliberately vague ("aus allen gängigen Kategorien"). If the agency has not integrated a listed system, a German competitor or customer could call the strip misleading. Recommend confirming the list with Alexander Karl. Also, DATEV and lexoffice are accounting tools, not "systems you connect to Shopify" in the usual sense. That is fine as long as it is true.
- **"lexoffice"** was rebranded to "Lexware Office" in 2024/25. I kept the given name as instructed, but the current name should probably be checked.
- **"Expertise vor Ort"** ("Local Expertise"). "vor Ort" implies physical on-site presence in DACH. That is accurate only if Alexander Karl can actually visit clients. Alternatives: "Expertise für die DACH-Region" or "Ihr Ansprechpartner in DACH".
- **"Private App".** Shopify deprecated "private apps" in 2022, and the current Shopify term is "custom apps" ("benutzerdefinierte Apps" in German admin). Technical German readers may notice. I kept "Private App" as the case-study tag because the English uses it. Consider "Custom App" or "individuelle App" in both languages.
- **"firefighting" → "Brände löschen".** Idiomatic and not offensive. It is fine for a first-person quote.
- **FAQ 4 "syncs couriers in real time"** is ambiguous: does it sync with the courier systems, or sync courier data? I translated it as "Paketdienste in Echtzeit synchronisiert", which is equally vague. It is worth clarifying with the author.
- **FAQ 1 "rather than telling you it cannot be done"** is kept. It implies a quasi-promise that every system can be connected. That is a soft claim, but German buyers read it literally.
- **FAQ 6** reuses the UK case (4–6 months) and "weeks". No numbers were added.
- **Blog cards link to English articles.** German visitors will land on English posts. Recommend adding a small "(Englisch)" or "EN" badge in the template, or a note in the posts intro. I did not add it to the copy.
- **Blog title 3** is translated as an infinitive headline ("Einen KI-Analyse-Agenten … entwickeln"). It should match the English article's H1 if German versions are ever written.
- **Eyebrow "Komplexe Lösungen"** should match the German nav label, if the header gets translated.
- **Book a call.** "Gespräch vereinbaren" does not say "kostenlos/unverbindlich". Add that only if it is true, and in both languages.

## SEO

- **Proposed title (55 chars):** `Shopify-ERP-Integration, POS & Middleware | Base X Tech`
  - Duden-correct hyphenation. Google treats hyphens as separators, so it matches "Shopify ERP Integration".
- **Proposed meta description (146 chars):** `Wir binden Shopify an ERP, POS, Lagerverwaltung und individuelle Systeme an – mit Integrationen, Apps und Automatisierungen für synchrone Abläufe.`
- Both are already written into `meta` in the DE JSON.
- **Target queries (DE):**
  1. Shopify ERP Integration
  2. Shopify ERP Anbindung
  3. Shopify Warenwirtschaft anbinden
  4. Shopify Xentral Schnittstelle
  5. Shopify JTL-Wawi Anbindung
  6. Shopify POS Warenwirtschaft Bestandsabgleich
  7. Shopify Schnittstelle programmieren / individuelle Shopify App
  8. Shopify Middleware Agentur
- H1 does not contain "Shopify" (the English does not either). If SEO weight matters more than the design line, consider an H1 or lead variant mentioning "Shopify-Anbindung". The lead currently says "E-Commerce", not "Shopify".
- Suggested German URL (not in JSON): `/de/pages/komplexe-loesungen/`, or keep the English slug with a `/de/` prefix. Add hreflang de-DE / de-AT / de-CH (plus later de-CH ss-variant).
