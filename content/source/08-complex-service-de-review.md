# Complex Solutions page: German (DE) review

Reviewed: `content/pages/complex-solutions.de.json` against `complex-solutions.en.json`, plus the translator's notes (`08-complex-service-de-notes.md`). Review date: 2026-09-24.

## Automated checks (all passed)

- JSON structure: the DE file has exactly the same key paths and array lengths as the EN file. No keys are missing or extra.
- Register: formal "Sie" throughout. No du/dein/euch forms.
- Dashes: all dashes are spaced en dashes ( – ). No em dashes, no hyphen-as-dash, and no straight or English quotation marks in the copy.
- Numbers: 13 Jahre, mehr als 8 Stunden, vier bis sechs Monate, zweimal täglich, drei Systeme, "Wochen", and all dates/datetimes match the source.
- Spelling: German-standard ß is used correctly (fließen, Großteil, außerhalb, maßgeblich, einschließlich). No typos found.
- Back-translation: I back-translated every string. Apart from the items in the table below, the German says the same thing as the English. No claims were added or dropped, and no promises became stronger or weaker.

## Findings

| JSON path | German now | Issue (drift / error / style) | Severity | Proposed German |
|---|---|---|---|---|
| `faq.items[4].a` | "…Fulfillment-Systemen aus **allen** gängigen Kategorien…" | **Drift, strengthened claim.** The EN says "across the common categories", not "all". "allen" widens the experience claim, which the notes themselves call a UWG risk. | must-fix | "Mit ERP-, CRM-, PIM- und Fulfillment-Systemen aus den gängigen Kategorien, angebunden über die jeweils verfügbare API. …" |
| `faq.items[3].a` | "…eine Fulfillment-Schicht, die Versandcodes erzeugt, **Paketdienste in Echtzeit synchronisiert** und…" | **Error/style.** In German you cannot "synchronize a courier", so the phrase reads as a mistranslation (EN "syncs couriers in real time"). Say what is synchronized, and keep it as neutral as the source. | must-fix | "…eine Fulfillment-Schicht, die Versandcodes erzeugt, Daten in Echtzeit mit den Paketdiensten abgleicht und zweimal täglich Abholungen einplant." |
| `strip.items[8]` | "lexoffice" | **Outdated brand name.** Lexware renamed lexoffice to **Lexware Office** in 2024–25; the rename is confirmed, but I am not sure of the exact date. A DACH reader will notice the old name. Change it in EN as well, so the two languages stay in parity. | must-fix | "Lexware Office" (EN too) |
| `hero.title` | "Komplexe Systeme,<br> verbunden so, wie<br> Ihr Unternehmen arbeitet." | **Style/word order.** "verbunden so, wie" is unidiomatic. German puts "so" before the participle. The length stays the same. | should-fix | "Komplexe Systeme,<br> so verbunden, wie<br> Ihr Unternehmen arbeitet." |
| `faq.items[2].a` | "Indem wir festlegen, welches System für **den Wert** führend ist…" | **Style/clarity.** "den Wert" has no referent in German ("the number" = the stock figure). | should-fix | "Indem wir festlegen, welches System für den Bestand führend ist, bevor irgendetwas gebaut wird." |
| `faq.items[2].a` | "…wenn sich **zwei** Systeme **beide** für maßgeblich halten." | **Style.** "zwei … beide" is redundant. | should-fix | "…wenn sich zwei Systeme gleichzeitig für maßgeblich halten." |
| `capabilities.cards[5].description` | "…und Sendungsverfolgung direkt im Bestellablauf – statt nachträglich aufgesetzt." | **Style/grammar.** The ellipsis leaves no verb ("wired into"), and "statt nachträglich aufgesetzt" then has nothing to contrast with. | should-fix | "Versanddienstleister, Etiketten und Sendungsverfolgung – direkt in den Bestellablauf eingebunden statt nachträglich aufgesetzt." |
| `case.outcomes[1].text` | "Die Verfügbarkeit bleibt zwischen Onlineshop und Ladengeschäften **abgestimmt**…" | **Style.** In German, stock is "synchron", not "abgestimmt". "abgestimmt" also appears 3× on the page with different meanings (strip label, outcome 1, outcome 2). | should-fix | "Die Verfügbarkeit bleibt zwischen Onlineshop und Ladengeschäften synchron, ganz gleich, über welchen Kanal Produkte verkauft werden." |
| `posts.items[2].title` | "Einen KI-Analyse-Agenten mit der **Claude API** entwickeln" | **Compound hyphenation.** The page hyphenates everywhere else (Shopify-App, Shopify-Shop, Nova-Poshta-Integration). "Claude API" is not a fixed proper name in German running text in the way "Shopify App Store" is. | should-fix | "Einen KI-Analyse-Agenten mit der Claude-API entwickeln" |
| `posts.items[*].date` | "08. Juni 2026" | **Style.** Written-out German dates have no leading zero. (Datetime values are unaffected.) | should-fix | "8. Juni 2026" (and "16. Juni 2026", "21. Mai 2026" are already fine) |
| `reliable.paragraphs[0]` | "…und automatische Wiederholungen, Datenabgleich und Monitoring einzubauen…" | **Terminology.** The German IT term for retries is "Wiederholungsversuche". "Wiederholungen" alone is vague. | should-fix | "…und automatische Wiederholungsversuche, Datenabgleich und Monitoring einzubauen…" |
| `posts.*` (template) | Blog cards link to English articles | **UX.** German visitors land on English posts without warning, as the notes also say. This is not a copy change. | should-fix (template) | Add an "EN"/"(Englisch)" badge in the card template, or add "(auf Englisch)" to `posts.text`. |
| `meta.description` | "…mit Integrationen, Apps und Automatisierungen **für synchrone Abläufe**." (146) | **Style.** "synchrone Abläufe" sounds technical and stiff. The hero lead's wording is more natural. "an ERP" without an article is fine in a list. | optional | "Wir binden Shopify an ERP, POS, Lagerverwaltung und individuelle Systeme an – mit Integrationen, Apps und Automatisierungen, die Abläufe synchron halten." (153 chars) |
| `capabilities.cards[0].description` | "…zwischen Shopify und Ihrem ERP – **ganz** ohne Handarbeit." | **Drift (slight strengthening).** "ganz" adds emphasis to an already absolute claim. | optional | "…zwischen Shopify und Ihrem ERP – ohne Handarbeit." |
| `capabilities.cards[4].title` | "Individuelle Automatisierung" | **Consistency.** The EN is plural, and the rest of the page uses "Automatisierungen". The plural is 30 characters, which is still within the card limit. | optional | "Individuelle Automatisierungen" |
| `help.cards[1].description` | "Standard-Konnektor" | **Consistency.** Elsewhere on the page the compound is closed: "Standardintegration", "Standardlösungen". | optional | "Standardkonnektor" |
| `faq.items[6].a` | "Wir überwachen die **Verbindungen**, die wir bauen…" | **Terminology consistency.** "Connection(s)" is "Anbindung(en)" in card 3 and FAQ 6. | optional | "Wir überwachen die Anbindungen, die wir entwickeln, und schlagen bei Störungen Alarm…" |
| `faq.items[7].a` | "…die die Sendungsverfolgung an den Shop zurückmelden…" | **Style.** "Sendungsverfolgung" is the function; what gets pushed back is the tracking data. | optional | "…die Trackingdaten an den Shop zurückspielen…" |
| `faq.items[2].a` | "…bevor die Lösung mit Live-Daten arbeitet." | **Consistency.** "Livegang" is closed elsewhere. "Live-Daten" is allowed, but mixing the two looks inconsistent. | optional | "Livedaten" (or leave it; both are correct) |
| `process.steps[1].description` | "was passiert, wenn Systeme sich widersprechen" | **Word order.** The reflexive pronoun usually comes before the noun subject. | optional | "was passiert, wenn sich Systeme widersprechen" |
| `partner.paragraphs[1]` | "…– und nicht etwas, bei dem Sie ständig Brände löschen müssen." | **Style.** Correct, but "etwas" is weak. | optional | "…– und nicht zur Dauerbaustelle, an der Sie ständig Brände löschen müssen." (or keep) |
| `cta.label` | "Sprechen wir" | **Style.** Reads truncated on its own, and it clashes with "Sprechen Sie…" two lines below. | optional | "Lassen Sie uns sprechen" or "Kontakt" |

## Verdicts on the translator's riskiest choices

| Choice in notes | Verdict |
|---|---|
| Partner quote: translated the neutral JSON, not the Figma claim "every major system in the Swiss market" | **Keep.** Do not reintroduce the Figma claim without proof (UWG). |
| "ensures" → "sorgt dafür" (avoiding gewährleisten/garantieren) | **Keep.** The choice is correct and legally safer. |
| "ohne Handarbeit" (ERP card) | **Keep**, but drop "ganz" (optional item above). |
| Systems strip implies hands-on experience with every listed system | **Keep the wording.** This is a content/legal check, not a translation fix: Alexander Karl should confirm the list before the DE launch. |
| lexoffice name | **Change to "Lexware Office"** (must-fix, in EN and DE). |
| "Expertise vor Ort" | **Keep** if Alexander Karl is based in DACH and meets clients in person. That is the same claim level as "Local Expertise". Otherwise change to "Expertise für die DACH-Region". |
| "Private App" tag / "Private & individuelle Apps" | **Keep for now** to stay in parity with EN. Longer term, change both languages to "Custom App" / "individuelle Shopify-App", because Shopify retired "private apps" in 2022. |
| "firefighting" → "Brände löschen" | **Keep.** |
| FAQ 4 "Paketdienste in Echtzeit synchronisiert" | **Change** (must-fix above). |
| FAQ 1 "statt Ihnen zu sagen, dass es nicht geht" | **Keep.** It matches the source exactly. The quasi-promise is a business decision about the EN copy, not a translation issue. |
| "Unter der Haube" for "Behind the integration" | **Keep.** It is idiomatic and on topic. |
| "Livegang" | **Keep.** It is established in DACH e-commerce ("Go-live" is equally common). |
| "Phase", "Unser Vorgehen", "Unsere Leistungen", "Bestellungen", "Lagerverwaltung", "Fulfillment", "führendes System", "Datenhoheit", "abgekündigt" | **Keep all.** They are correct and idiomatic DACH terms. |
| "Individuelle APIs" (strip and card) | **Keep.** "Individuelle Schnittstellen" (27 chars) is slightly more natural for the card title if the layout allows. |
| "Fragen, die wir oft hören" (adds "oft") | **Keep.** The addition is harmless. |
| "Gespräch vereinbaren" (no "kostenlos") | **Keep.** |
| "Frachtbriefe (TTN)" | **Keep.** It is correct (TTN = consignment note). |
| Blog cards link to English articles | **Add an EN badge** in the template (should-fix above). |

## SEO

- **Title** `Shopify-ERP-Integration, POS & Middleware | Base X Tech` is 55 characters (≤ 60). **Keep.** The main query "Shopify ERP Integration" is at the front, and the Duden hyphenation does not hurt matching. An optional variant aimed at "Anbindung" searches is `Shopify-ERP-Anbindung, POS & Middleware | Base X Tech` (53). A/B only; the current title is fine.
- **Meta description** is 146 characters (≤ 155) and covers "Shopify … anbinden", ERP, POS and Lagerverwaltung. The query fit is good. Only the ending "für synchrone Abläufe" is stiff; an optional 153-character alternative is in the table.
- Consider "Shopify" in the H1 or lead as the notes suggest. That is optional and a design decision.

## Verdict

**Ready for dev review: yes, after the 3 must-fix items.** Those are the FAQ 5 "allen" claim, the FAQ 4 courier sentence, and lexoffice → Lexware Office. All three are one-line edits. The should-fix items can go in the same pass. The translation is otherwise accurate, idiomatic, consistent in register and punctuation, and structurally identical to the EN file.

Counts: must-fix 3, should-fix 9, optional 10.
