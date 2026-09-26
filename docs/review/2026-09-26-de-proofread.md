# German proofread of the DE service pages (2026-09-26)

Scope: `content/pages/{home,shopify-development,shopify-integrations,shopify-migration,shopify-apps,conversion-rate-optimization,web-design}.de.json` against their `.en.json` twins, plus consistency with `complex-solutions.de.json`, `shell.de.json` and `docs/review/2026-09-26-de-glossary.md`. An independent editor did this review. They did not write the copy.

Only string values were changed. Keys, structure, hrefs, images, `_note`/`_source` fields, English client quotes and names were left alone. The price string "Festpreis: 1.999 €" is unchanged everywhere.

## Verdict

**Good base, publishable after these fixes and a native read.** The copy uses formal "Sie" consistently, capitalises "Sie/Ihr" correctly, and uses correct German number and date formats. Non-breaking spaces in "10 Mio.+" and "1 Mio.+" are correct, and all Gedankenstriche are spaced en dashes. None of the 7 files had straight quotes, double spaces or stray em dashes. Keys match EN exactly. No new claims or numbers were found.

The weak points were:

- **Developer calques**, for example "gegen die API", "unter realem Traffic", "Integrationen brechen" and "Das Design bricht".
- **A few literal renderings**, for example "definieren die Chance", "Was ist neu in", "Ja, und wir haben es bereits getan" and "um sich zu verkaufen".
- **Two terms with the wrong connotation.** "Abnahme" means formal legal acceptance. "Sicherheit" in ICE scoring reads as security.
- **One FAQ where the question and answer no longer matched** (CRO FAQ 4).

66 edits in 6 commits. After the fixes, all meta titles are 60 characters or fewer and all descriptions are 160 or fewer:

| Page | Title | Description |
|---|---|---|
| Home | 57 | 151 |
| Development | 54 | 149 |
| Integrations | 58 | 157 |
| Migration | 57 | 159 |
| Apps | 55 | 159 |
| CRO | 54 | 156 |
| Web design | 46 | 148 |

## Decisions on the terms the brief asked about

| Term | Decision | Why |
|---|---|---|
| Quick Wins | **Kept** | Standard German business usage. DACH CRO agencies write it this way, and no German word is as short and precise ("schnelle Erfolge" is vaguer). Capitalised as a noun. |
| Art Direction (web design card, tag, meta) | **Kept, flagged** | German agencies use "Art Direction" for visual and brand direction, and the card text already says "Marken- und Bildsprache". EN says "Creative Direction", which in German agencies means the overall creative lead. That is a slight shift in meaning, so Alexander should confirm (H4). |
| Hardware-Start-up | **Kept** | Duden spells it "Start-up". The hyphenated compound is correct. |
| Case Study zu X lesen | **Kept** | The linked posts are in English. "Case Study" is the usual DACH agency label, and "Fallstudie" sounds academic. The wording is consistent across all 7 pages. |
| Gründlich statt schnell geflickt | **Kept** | It is idiomatic and punchy, it matches its siblings ("Pragmatische Innovation", "Langfristig gedacht"), and the card text picks it up with "schnelle Notlösungen". It is slightly colloquial, so Alexander may prefer "Gründlichkeit statt Abkürzungen" (H5). |
| Launch | **Changed** to "Veröffentlichung im App Store" and "Livegang & Wartung" | A natural German term exists. This supersedes the glossary exception for "Launch im App Store". |
| Abnahme (Build & Review step) | **Changed** to "Prüfung" | "Abnahme" implies formal acceptance under § 640 BGB, but this step describes iterative review. |
| Sicherheit (ICE "confidence") | **Changed** to "Erfolgswahrscheinlichkeit" | "Sicherheit" reads as security or safety. This supersedes the glossary row. |
| Connector (offer text) | **Changed** to "Konnektor" in the Integrations and Complex offers | Every other mention on the DE site says "Konnektor". The Complex test only checks the "Wir erfassen Ihre Systeme" prefix. |
| Verb-pair step titles ("Entwickeln & testen", "Messen & wiederholen") | **Kept** | Infinitive phrases are correct per Duden, since only the first word is capitalised. They also match Complex ("System erfassen", "Logik planen", "Entwickeln & testen"). |
| "dauert Wochen" | **Kept** | Idiomatic. It is also the same wording as Complex FAQ 4. |

## Web design FAQ: the "native speaker" line

In EN, the sentence "Copy in German is written by a native speaker, not translated by us" sits in the answer about designing for German and EU markets. It is a service promise for client stores, not a claim about this site. The DE version put it right after "Wir betreiben selbst eine mehrsprachige Website", so readers could take it as a claim about our own text. That claim is not true yet, because this DE copy is machine-written and has not been proofread. The DE line now reads "Deutsche Texte für Ihren Shop schreibt ein Muttersprachler – wir übersetzen sie nicht selbst." That scopes the promise to client stores. Whether the promise is deliverable is a business question (H1).

## Conflicts in the live files (complex-solutions.de.json, shell.de.json)

1. **Fixed:** `complex-solutions.de.json › offer.text` "Connector" → "Konnektor" (see above).
2. **Not fixed, because a test pins the string:** `shell.de.json › form.successTitle` "Vielen Dank — Ihre Projektdetails sind bei uns." uses an unspaced-style em dash. German typography calls for a spaced en dash: "Vielen Dank – Ihre Projektdetails sind bei uns." `qa/tests/answers-2026-09-25.spec.js:36` pins the em dash. The string and the test should change together.
3. **Not fixed, because a test pins the string:** `shell.de.json › team.location` "Unser Team arbeitet von Kyiv, Lviv, Kraków und Spanien aus, zu MEZ-Zeiten." uses English and Polish city spellings. German forms are "Kyjiw" (Foreign Office usage since 2022; Duden also lists "Kiew"), "Lwiw" and "Krakau". "zu MEZ-Zeiten" is also awkward. Suggested: "Unser Team arbeitet von Kyjiw, Lwiw, Krakau und Spanien aus – nach mitteleuropäischer Zeit (MEZ)." `qa/tests/answers-2026-09-25.spec.js:42` pins the string (H6).
4. **Structural, outside the editor's remit:** `shell.de.json` has no `ui` block. `shell.en.json` says a missing `ui` falls back to EN per key. So the new DE pages would render English UI strings:
   - "[ Scroll to Explore ]" (service hero)
   - "View" (project link aria-label)
   - "Shopify store" (project image alt, joined with an em dash in `layout/pages/service-v2-body.ejs:64`)
   - "What we focus on", "services" and "By" (home)

   Suggested DE values:
   - scrollHint "[ Scrollen und entdecken ]"
   - viewProject "Ansehen"
   - storeAlt "Shopify-Shop"
   - focusLabel "Unsere Schwerpunkte"
   - servicesOf "– Leistungen"
   - byAuthor "Von" (Complex already uses "Von")

   This must be done before the DE pages go live.
5. The glossary rows for "Launch", "confidence → Sicherheit" and "Connector (offer)" are superseded by this review. The glossary file itself was not edited.

## For the human native reviewer (Alexander Karl)

Please check these items. None of them block the fixes above.

- **H1. Web design FAQ 6, the native-speaker promise.** Is it true that a native speaker writes German copy for client stores, and who is it (you)? If not, the sentence should go in EN and DE.
- **H2. Web design "unsere eigenen Entwickler".** EN "the developers who built the last one" is ambiguous. DE now says the files go directly to our own developers, the same team, which is how FAQ 1 reads. Please confirm that reading with Marko.
- **H3. CRO "Erfolgswahrscheinlichkeit".** It is long in a card. Alternatives are "Zuversicht" (common in ICE explanations, but odd in sales copy) or keeping the English "Impact, Confidence, Ease".
- **H4. "Art Direction" vs "Creative Direction"** on web design. See the table above.
- **H5. "Gründlich statt schnell geflickt"**: keep it, or use a more neutral "Gründlichkeit statt Abkürzungen"?
- **H6. City names in the team line**: Kyjiw/Kiew, Lwiw, Krakau. This is a brand and political choice. The test must be updated with the string.
- **H7. "Honoree der CES Innovation Awards"** (glossary choice, kept). The English "Honoree" inside German text is deliberate, to avoid overclaiming. A German reader may still stumble on it. "ausgewählt als CES Innovation Awards Honoree" is an option.
- **H8. Migration meta "Rankings im Blick"** replaces "Rankings gesichert", which sounded like a guarantee. Please check that it reads naturally in the SERP.
- **H9. Home meta** now ends "– bis zum Livegang" (EN "from idea to launch"). "von der Idee bis zum Livegang" does not fit in 160 characters.
- **H10. Overall tone.** The rhetorical EN patterns ("we will tell you that instead", "that is the part nobody quotes for") were kept close to EN. Please do a read-aloud pass for anything that still sounds translated. The migration and integrations FAQs are the most likely places.

## Commits

1. `810ea26` de: replace calques and Denglisch on the DE service pages
2. `e32ee1c` de: consistent terminology (Konnektor, Prüfung, Bestandsaufnahme, ICE scoring)
3. `955db04` de: grammar and idiom fixes on the DE service pages
4. `d19657b` de: restore EN meaning where the DE copy drifted
5. `6cca3aa` de: meta descriptions
6. `6c3924a` de: integrations help card, avoid repetition

## Every change

Counts by type:

| Type | Changes |
|---|---|
| Anglicism / calque | 20 |
| Terminology | 12 |
| Grammar / idiom | 23 |
| Meaning vs EN | 7 |
| SEO meta | 4 |

Some keys appear twice because two separate fixes touched them.

| # | File | Key | Before → After | Type | Reason |
|---|---|---|---|---|---|
| 1 | home | `roadmap.steps.0.description` | „und definieren die Chance“ → „und loten die Chancen aus“ | Anglicism / calque | Calque of "define the opportunity"; "Chance definieren" is not idiomatic German |
| 2 | home | `articles.items.0.title` | „Was ist neu in Shopify 2026: die“ → „Neu in Shopify 2026: die“ | Anglicism / calque | Calque of "What's new in"; German headline style is "Neu in …" |
| 3 | shopify-development | `faq.items.2.a` | „Ja, und wir haben es bereits getan.“ → „Ja, das haben wir bereits umgesetzt.“ | Anglicism / calque | Calque of "Yes, and we have." |
| 4 | shopify-development | `process.steps.3.description` | „unter realem Traffic“ → „bei echtem Traffic“ | Anglicism / calque | "unter realem Traffic" is a calque; "bei echtem Traffic" is the natural phrase |
| 5 | shopify-development | `faq.items.7.a` | „unter realem Traffic“ → „bei echtem Traffic“ | Anglicism / calque | As above |
| 6 | shopify-integrations | `help.items.1.description` | „was ein Sync verpasst hat“ → „was ein Abgleich verpasst hat“ | Anglicism / calque | Anglicism; same sentence already says "Batch-Abgleichen" |
| 7 | shopify-integrations | `help.items.2.description` | „den Konnektor gegen die API Ihres ERP – oder gegen Datenbank“ → „den Konnektor auf Basis der API Ihres ERP – oder über Datenbank“ | Anglicism / calque | Developer calque "build against the API" |
| 8 | shopify-integrations | `process.steps.3.description` | „unter realem Volumen und behalten die Alarmierung bei“ → „unter realer Last und halten die Alarmierung aktiv“ | Anglicism / calque | "unter realem Volumen" and "Alarmierung beibehalten" are calques; "unter realer Last" is the standard IT term |
| 9 | shopify-integrations | `faq.items.6.a` | „Integrationen brechen, wenn“ → „Integrationen fallen aus, wenn“ | Anglicism / calque | Calque of "integrations break" |
| 10 | shopify-migration | `process.steps.2.description` | „prüfen sie gegen die Quelle“ → „gleichen sie mit der Quelle ab“ | Anglicism / calque | Calque of "check against" |
| 11 | shopify-migration | `faq.items.2.a` | „gegen die Quelle geprüft“ → „mit der Quelle abgeglichen“ | Anglicism / calque | Calque of "checked against the source" |
| 12 | shopify-migration | `faq.items.5.a` | „wurden gegen die API der alten Plattform entwickelt“ → „wurden für die API der alten Plattform entwickelt“ | Anglicism / calque | Calque of "written against the API" |
| 13 | shopify-migration | `faq.items.7.a` | „gegen die Live-Antworten geprüft“ → „anhand der Live-Antworten geprüft“ | Anglicism / calque | Calque of "verified against" |
| 14 | shopify-migration | `process.steps.1.title` | „Planung & Mapping“ → „Planung & Zuordnung“ | Anglicism / calque | Anglicism; the step text itself says "ordnen … zu" |
| 15 | shopify-apps | `capabilities.items.5.title` | „Launch im App Store“ → „Veröffentlichung im App Store“ | Anglicism / calque | Anglicism with a natural German equivalent |
| 16 | shopify-apps | `process.steps.3.title` | „Launch & Wartung“ → „Livegang & Wartung“ | Anglicism / calque | Glossary term for launch is "Livegang"; step covers custom apps, not only App Store |
| 17 | web-design | `help.items.2.title` | „Das Design bricht bei der Umsetzung immer wieder“ → „Bei der Umsetzung leidet das Design immer wieder“ | Anglicism / calque | Calque of "design keeps breaking" |
| 18 | web-design | `projects.items.0.text` | „Markengetriebene Shopify-Storefront“ → „Markenorientierte Shopify-Storefront“ | Anglicism / calque | "markengetrieben" is a calque of "brand-led" |
| 19 | conversion-rate-optimization | `capabilities.items.3.description` | „Die Ansicht, die der Großteil Ihres Traffics sieht, als die eigentliche Hauptansicht behandelt.“ → „Die Ansicht, die die meisten Ihrer Besucher sehen, als eigentliche Hauptansicht behandelt.“ | Anglicism / calque | Traffic cannot "see"; calque of "most of your traffic sees" |
| 20 | conversion-rate-optimization | `faq.items.0.a` | „Checkout, Mobile, Ladezeit“ → „Checkout, mobile Ansicht, Ladezeit“ | Anglicism / calque | "Mobile" as a noun is Denglisch |
| 21 | conversion-rate-optimization | `capabilities.items.0.description` | „Aufwand und Sicherheit“ → „Aufwand und Erfolgswahrscheinlichkeit“ | Terminology | ICE "confidence": "Sicherheit" reads as security/safety; "Erfolgswahrscheinlichkeit" says what is scored |
| 22 | conversion-rate-optimization | `process.steps.0.description` | „Aufwand und Sicherheit“ → „Aufwand und Erfolgswahrscheinlichkeit“ | Terminology | ICE "confidence": "Sicherheit" reads as security/safety; "Erfolgswahrscheinlichkeit" says what is scored |
| 23 | conversion-rate-optimization | `faq.items.0.a` | „Aufwand und Sicherheit“ → „Aufwand und Erfolgswahrscheinlichkeit“ | Terminology | ICE "confidence": "Sicherheit" reads as security/safety; "Erfolgswahrscheinlichkeit" says what is scored |
| 24 | conversion-rate-optimization | `faq.items.2.a` | „Aufwand und Sicherheit“ → „Aufwand und Erfolgswahrscheinlichkeit“ | Terminology | ICE "confidence": "Sicherheit" reads as security/safety; "Erfolgswahrscheinlichkeit" says what is scored |
| 25 | shopify-migration | `process.steps.0.title` | „Analyse & Inventur“ → „Analyse & Bestandsaufnahme“ | Terminology | "Inventur" is a stock-take; "Bestandsaufnahme" as on the Integrations page |
| 26 | shopify-development | `process.steps.2.title` | „Entwicklung & Abnahme“ → „Entwicklung & Prüfung“ | Terminology | "Abnahme" is formal acceptance with legal effect (§ 640 BGB), not an iterative review; step text says "prüfbaren Etappen" |
| 27 | shopify-apps | `process.steps.1.title` | „Entwicklung & Abnahme“ → „Entwicklung & Prüfung“ | Terminology | As on Development |
| 28 | shopify-integrations | `offer.text` | „empfehlen Connector oder“ → „empfehlen Konnektor oder“ | Terminology | Same page, Complex FAQ and help cards use "Konnektor" |
| 29 | complex-solutions | `offer.text` | „empfehlen Connector oder“ → „empfehlen Konnektor oder“ | Terminology | Conflict with "Konnektor" in the same file (FAQ, reliable, help); test only checks the "Wir erfassen Ihre Systeme" prefix |
| 30 | home | `projects.items.1.text` | „maßgefertigte Automatten“ → „maßgefertigte Autofußmatten“ | Terminology | "Automatten" is easily misread as "Automaten" |
| 31 | home | `projects.items.1.imageAlt` | „maßgefertigte Automatten“ → „maßgefertigte Autofußmatten“ | Terminology | As above |
| 32 | shopify-development | `projects.items.1.text` | „Anfrage-Logik“ → „Anfragelogik“ | Terminology | Duden compound, consistent with "Rabattlogik", "Produktionslogik" |
| 33 | shopify-development | `help.items.2.title` | „Ihr Produkt muss konfiguriert werden, um sich zu verkaufen“ → „Ihr Produkt muss vor dem Kauf konfiguriert werden“ | Grammar / idiom | "um sich zu verkaufen" is unidiomatic |
| 34 | shopify-development | `faq.items.4.a` | „Seltener, als es empfohlen wird.“ → „Seltener, als häufig empfohlen wird.“ | Grammar / idiom | Dangling "es" |
| 35 | shopify-development | `faq.items.5.a` | „erweitern es dort, wo das trägt,“ → „erweitern es dort, wo das sinnvoll ist,“ | Grammar / idiom | "tragen … trägt" repetition |
| 36 | shopify-integrations | `help.items.1.title` | „Der Bestand stimmt nicht mehr, wenn er synchronisiert ist“ → „Beim Abgleich ist der Bestand schon veraltet“ | Grammar / idiom | Clumsy literal rendering of "wrong by the time it syncs" |
| 37 | shopify-integrations | `hero.lead` | „übereinstimmen muss, ist das unsere Arbeit.“ → „übereinstimmen muss, ist genau das unsere Arbeit.“ | Grammar / idiom | Adds the emphasis of "this is the work" |
| 38 | shopify-migration | `hero.lead` | „und begleiten ihn, bis“ → „und begleiten den Shop, bis“ | Grammar / idiom | "ihn" is ambiguous after a three-item list |
| 39 | shopify-migration | `help.items.0.description` | „Wenn für einen neuen Banner ein Ticket“ → „Wenn schon für eine Banneränderung ein Ticket“ | Grammar / idiom | Web banner is "das Banner"; EN says "banner change" |
| 40 | shopify-migration | `faq.items.2.a` | „mit der Quelle abgeglichen, statt einfach als korrekt angenommen.“ → „mit der Quelle abgeglichen, statt einfach als korrekt angenommen zu werden.“ | Grammar / idiom | Incomplete "statt"-infinitive |
| 41 | shopify-migration | `faq.items.3.a` | „die nur in jemandes Kopf existieren“ → „die nur in den Köpfen einzelner Mitarbeiter existieren“ | Grammar / idiom | "in jemandes Kopf" is stilted |
| 42 | shopify-migration | `faq.items.4.a` | „statt Sie standardmäßig auf Plus zu setzen“ → „statt Ihnen pauschal Plus zu empfehlen“ | Grammar / idiom | "jemanden auf Plus setzen" is unidiomatic |
| 43 | shopify-apps | `help.items.0.description` | „Wenn es jemandes Job ist, zwei Systeme manuell abzugleichen“ → „Wenn die Aufgabe einer Person darin besteht, zwei Systeme von Hand abzugleichen“ | Grammar / idiom | "jemandes Job" is colloquial and stilted |
| 44 | shopify-apps | `faq.items.1.a` | „als eine öffentliche App passend zu biegen“ → „als eine öffentliche App zurechtzubiegen“ | Grammar / idiom | German idiom is "zurechtbiegen" |
| 45 | shopify-apps | `faq.items.5.a` | „eine App, die wir nie gesehen haben, würden wir nicht als gewartet ausgeben“ → „die Wartung einer App, die wir nie gesehen haben, würden wir nicht zusagen“ | Grammar / idiom | "als gewartet ausgeben" is unidiomatic |
| 46 | conversion-rate-optimization | `process.steps.2.description` | „und testen sie per A/B-Test“ → „und prüfen sie per A/B-Test“ | Grammar / idiom | Tautology "testen … per Test" |
| 47 | conversion-rate-optimization | `stats.items.1.text` | „ordnen sie nach dem, was sie Sie kosten,“ → „ordnen sie nach den Kosten, die sie Ihnen verursachen,“ | Grammar / idiom | "sie Sie" is hard to read |
| 48 | conversion-rate-optimization | `faq.items.2.a` | „abgestimmt ist und nicht vorausgesetzt.“ → „abgestimmt ist und nicht einfach angenommen wird.“ | Grammar / idiom | Incomplete clause; "vorausgesetzt" is the wrong verb |
| 49 | conversion-rate-optimization | `faq.items.6.a` | „eine Verbesserung an schlechten Daten zu messen“ → „eine Verbesserung anhand fehlerhafter Daten zu messen“ | Grammar / idiom | Wrong preposition |
| 50 | conversion-rate-optimization | `faq.items.7.a` | „Beides ist möglich, laufend funktioniert besser.“ → „Beides ist möglich, laufende Betreuung funktioniert besser.“ | Grammar / idiom | Adverb "laufend" used as a subject |
| 51 | web-design | `capabilities.title` | „Jede Fläche, mit der Käufer“ → „Jeder Berührungspunkt, mit dem Käufer“ | Grammar / idiom | "Fläche" does not carry "surface" in the UX sense |
| 52 | web-design | `capabilities.titleMuted` | „tatsächlich in Berührung kommen.“ → „tatsächlich in Kontakt kommen.“ | Grammar / idiom | Avoids "Berührungspunkt … in Berührung" |
| 53 | web-design | `process.title` | „Vom Verständnis des Problems zu einem Design, das bereit für die Umsetzung ist.“ → „Vom Verständnis des Problems bis zum umsetzungsreifen Design.“ | Grammar / idiom | Calque "ready to build"; matches the card title "Umsetzungsreifes Design" |
| 54 | web-design | `faq.items.0.q` | „Gestalten und entwickeln Sie, oder nur Design?“ → „Übernehmen Sie Design und Umsetzung oder nur das Design?“ | Grammar / idiom | Ungrammatical mix of verb and noun |
| 55 | conversion-rate-optimization | `faq.items.3.q` | „Haben wir genug Traffic für A/B-Tests?“ → „Brauchen wir für A/B-Tests genug Traffic?“ | Meaning vs EN | EN asks "Do we need enough traffic"; the answer "For testing, yes" no longer fitted the question |
| 56 | conversion-rate-optimization | `faq.items.3.a` | „Für Tests braucht es ihn tatsächlich.“ → „Für Tests ja.“ | Meaning vs EN | Mirrors EN "For testing, yes." now that the question matches |
| 57 | shopify-development | `faq.items.4.a` | „Wenn ein gut gebautes Theme“ → „Wenn also ein gut gebautes Theme“ | Meaning vs EN | Restores the causal "so … instead" of EN |
| 58 | shopify-integrations | `faq.items.7.a` | „sowie Versanddienstleister angebunden, die Etiketten erzeugen“ → „sowie Versandanbindungen entwickelt, die Etiketten erzeugen“ | Meaning vs EN | The relative clause made the carriers generate labels; EN says the integrations do |
| 59 | web-design | `capabilities.items.2.description` | „Dateien gehen an die Entwickler, die auch den letzten Shop gebaut haben – dazwischen“ → „Dateien gehen direkt an unsere eigenen Entwickler – dazwischen“ | Meaning vs EN | "den letzten Shop" read as "your previous shop"; EN means the same in-house team (see FAQ 1) |
| 60 | web-design | `faq.items.0.a` | „Ihr Design geht an die Entwickler, die auch den letzten Shop gebaut haben, sodass“ → „Ihr Design geht direkt an unsere eigenen Entwickler, sodass“ | Meaning vs EN | As above |
| 61 | web-design | `faq.items.5.a` | „Deutsche Texte schreibt ein Muttersprachler, nicht wir als Übersetzer.“ → „Deutsche Texte für Ihren Shop schreibt ein Muttersprachler – wir übersetzen sie nicht selbst.“ | Meaning vs EN | Makes clear this is a service promise for client stores, not a claim about this site's copy |
| 62 | home | `meta.description` | „Base X Tech entwickelt die Systeme hinter modernem E-Commerce: individuelle Shopify-Entwicklung, Apps, Integrationen und KI-Automatisierung.“ → „Wir entwickeln die Systeme hinter modernem E-Commerce: individuelle Shopify-Entwicklung, Apps, Integrationen und KI-Automatisierung – bis zum Livegang.“ | SEO meta | EN "from idea to launch" was lost; brand is already in the title |
| 63 | shopify-migration | `meta.description` | „Weiterleitungen und Rankings gesichert.“ → „Weiterleitungen und Rankings im Blick.“ | SEO meta | "gesichert" promises more than EN "handled" |
| 64 | conversion-rate-optimization | `meta.description` | „Wir analysieren Ihren Shopify-Shop“ → „Wir prüfen Ihren Shopify-Shop“ | SEO meta | Frees space for "Mobilansicht" |
| 65 | conversion-rate-optimization | `meta.description` | „Checkout, Mobile, Ladezeit“ → „Checkout, Mobilansicht, Ladezeit“ | SEO meta | "Mobile" as a noun is Denglisch |
| 66 | shopify-integrations | `help.items.1.description` | „gleichen ab, was ein Abgleich“ → „holen nach, was ein Abgleich“ | Grammar / idiom | Avoids "gleichen ab … Abgleich" after the Sync → Abgleich fix |
