# German localisation: glossary and adaptation notes (2026-09-26)

Scope: new `content/pages/<page>.de.json` for home, shopify-development, shopify-integrations, shopify-migration, shopify-apps, conversion-rate-optimization and web-design. `complex-solutions.de.json` and `shell.de.json` already existed. Their terms are the reference, and neither file was changed.

Every new file mirrors its `.en.json` twin: same keys, same key order, same array lengths. A key-path diff script checked this and also looked for leftover English and meta lengths. The copy uses formal "Sie" throughout. Claude wrote it, and a native speaker has not proofread it yet. Alexander should review it, as he did for the Complex copy (see `2026-09-25-de-for-alexander.md`).

## Terminology (EN → DE)

| EN | DE | Note |
|---|---|---|
| Discuss Your Project (all CTA buttons) | Projekt besprechen | Same as Complex. The header pill "Kontakt aufnehmen" comes from shell.de.json |
| Book the audit | Audit anfragen | Same as Complex |
| Book the scoping (Migration) | Migrationsanalyse anfragen | "Scoping" is agency jargon. The offer text opens with "Migrationsanalyse:" to match |
| Fixed price: $1,999 | Festpreis: 1.999 € | Euro only on DE pages, same string as Complex (a test checks the Complex version). Plain space before €, as in Complex |
| First step / Start with a fixed-price audit | Erster Schritt / Starten Sie mit einem Festpreis-Audit | Same as Complex |
| Scope confirmed after a short call. | Der Umfang wird nach einem kurzen Gespräch abgestimmt. | Same as Complex |
| Our Capabilities | Unsere Leistungen | Same as Complex |
| Recent Projects | Aktuelle Projekte | |
| When We Can Help | Wann wir helfen können | Same as Complex |
| Client Stories | Kundenstimmen | |
| What it's like to work with us. | So ist die Zusammenarbeit mit uns. | |
| How We Build / Integrate / Migrate / Ship Apps / Run CRO | Unser Vorgehen | Same label as Complex's process section. The page-specific flavour moves into the section title |
| Our Design Process | Unser Designprozess | |
| FAQ / Questions we get asked | FAQ / Fragen, die wir oft hören | Same as Complex |
| Related services | Verwandte Leistungen | Same as Complex |
| Numbers that matter | Zahlen, die zählen | |
| Upwork Reviews / Happy Clients / Projects Delivered | Upwork-Bewertung / Zufriedene Kunden / Abgeschlossene Projekte | |
| What happens after launch matters more. | Was nach dem Livegang passiert, zählt mehr. | |
| launch (go-live) | Livegang | Same as Complex. "Launch" is kept only for the App Store ("Launch im App Store") |
| store | Shop | German merchants say "Shop", not "Store" |
| storefront | Storefront | Used by DACH Shopify agencies, especially next to Headless. "Shop-Frontend" is used once for "native store front end" |
| checkout | Checkout | |
| theme / theme customization | Theme / Theme-Anpassung | |
| Custom app / public app | Custom App / öffentliche App | "Custom App" is Shopify's own term, as in the Complex card. The nav uses "Individuelle Shopify-Apps" (shell.de.json) |
| Shopify Functions, checkout extensions | Shopify Functions, Checkout Extensions | Shopify API names |
| integration / connector | Integration, Anbindung / Konnektor | "Anbindung" for the act of connecting (as in Complex: "ERP-Anbindung"). "Konnektor" as in Complex FAQ 2. The offer text keeps "Connector" because it copies the Complex offer string word for word |
| system that owns the data | führendes System | Same as Complex |
| middleware | Middleware | |
| ERP / CRM / PIM / POS / 3PL | ERP / CRM / PIM / POS / 3PL | Neuter: "Ihr ERP", as in Complex |
| stock / inventory | Bestand / Bestände | |
| carriers / labels / tracking | Versanddienstleister / Etiketten / Sendungsverfolgung | Same as Complex |
| fulfilment | Fulfillment | German practice uses the US spelling |
| wholesale / retail | Großhandel, Händler / Endkunden, B2C | "B2B und B2C in einem System" in the Development hero and meta. "Retail" is not used in DACH copy |
| B2B company accounts | B2B-Firmenkonten | |
| price lists / payment terms | Preislisten / Zahlungsbedingungen | |
| made-to-order | auf Bestellung gefertigt / Auftragsfertigung | |
| configurator / product builder | (Produkt-)Konfigurator | |
| replatform | Plattformwechsel | |
| migration | Migration, Umzug | Both are used. "Umzug" is the plainer word in running text |
| in-house / custom platform | Eigenentwicklung / selbst entwickelte Plattform | Same as the Complex blog card |
| redirects / canonicals / hreflang | Weiterleitungen / Canonicals / hreflang | |
| staging build | Staging-Umgebung | |
| Search Console / coverage report | Search Console / Indexierungsbericht | Google's German UI name for the report |
| backlog (CRO) | Maßnahmenliste | Plain German instead of "Backlog" |
| quick wins / bigger bets | Quick Wins / größere Vorhaben | "Quick Wins" is standard German business usage |
| impact, effort and confidence | Wirkung, Aufwand und Sicherheit | |
| A/B test | A/B-Test | |
| session recordings | Session-Aufzeichnungen | |
| speed | Ladezeit | |
| Web Design / UX/UI Design | Webdesign / UX/UI-Design | Same as the nav |
| Creative Direction | Art Direction | The usual term in German agencies. The EN card text "brand and art direction" becomes "Marken- und Bildsprache" so "Art Direction" is not repeated |
| wireframes / prototypes / style guide / design system | Wireframes / Prototypen / Styleguide / Designsystem | German design practice uses these loanwords |
| case study (link labels) | Case Study | "Case Study zu X lesen". The linked posts are English |
| UK gifting brand | Britische Geschenkmarke | Same as the Complex blog card |
| CES Innovation Awards Honoree | Honoree der CES Innovation Awards | Same as Complex. Never "Gewinner" or "ausgezeichnet" |
| Hardware startup / Automotive / Jewellery / Homeware / Gifting / Logistics / Lifestyle brand | Hardware-Start-up / Kfz-Zubehör / Schmuck / Wohnaccessoires / Geschenke / Logistik / Lifestyle-Marke | "Kfz-Zubehör" because Prime EVA sells car mats, which is more concrete than "Automobil" |
| Store Build / Store Migration & Theme Customization / Shopify Development / UX/UI Design (testimonial context labels) | Shop-Aufbau / Shop-Migration & Theme-Anpassung / Shopify-Entwicklung / UX/UI-Design | The testimonial quotes stay in English |
| AI | KI | |
| Depth over shortcuts | Gründlich statt schnell geflickt | |

## Numbers

- 4.8* → 4,8*
- 10M+ → 10 Mio.+ and 1M+ → 1 Mio.+. A non-breaking space sits between the number and "Mio."
- 5.0 rated → mit 5,0 bewertet
- $3M+ raised → "Über 3 Mio. US-Dollar Kapital eingeworben". This is a historical funding fact in dollars, so it was not converted to euros. It is written out, with no "$" sign, which follows the approach of the UK version.
- The only price is the audit/scoping block: "Festpreis: 1.999 €". There are no hourly rates.
- Dates: "19. Juni 2026".

## SEO keyword choices

| Page | Meta title (length) | Target phrase |
|---|---|---|
| Home | Shopify-Agentur für Entwicklung & Webdesign \| Base X Tech (57) | Shopify Agentur |
| Development | Shopify-Entwicklung & individuelle Shops \| Base X Tech (54) | Shopify Entwicklung |
| Integrations | Shopify-ERP-Anbindung, CRM & API-Integration \| Base X Tech (58) | Shopify ERP Anbindung, Shopify Integration |
| Migration | Shopify-Migration von Magento & WooCommerce \| Base X Tech (57) | Shopify Migration (von Magento/WooCommerce) |
| Apps | Shopify-App-Entwicklung & Automatisierung \| Base X Tech (55) | Shopify App Entwicklung |
| CRO | Conversion-Optimierung für Shopify (CRO) \| Base X Tech (54) | Conversion Optimierung Shopify |
| Web design | Shopify-Webdesign & UX/UI-Design \| Base X Tech (46) | Shopify Webdesign |

All meta descriptions are 160 characters or fewer. Migration is exactly 160.

- **Hyphenation.** The titles use the correct German hyphenated compounds ("Shopify-Agentur", "Shopify-Entwicklung"). Google treats the hyphen as a word separator, so the titles still match the unhyphenated searches ("Shopify Agentur"). They also stay consistent with the nav and form in shell.de.json.
- **Integrations vs Complex.** The Integrations page leads with "ERP-Anbindung". Complex already uses "Shopify-ERP-Integration, POS & Middleware" in its title. Using different head terms keeps the two DE pages from competing for the same query.
- **Search check (2026-09-26).** A quick web search showed that DACH agencies use all of these phrases:
  - "Shopify Agentur"
  - "Shopify Entwicklung"
  - "ERP-Anbindung"
  - "Shopware zu Shopify migrieren"
  - "Shopify Migration … ohne Ranking-Verlust"
  - "Conversion Optimierung Shopify"

  Examples: greenblut.com, ostend.digital, niccos.com, we-site.de, thinkideas.de, 14agency.de, rossigroup.de. "Shopware zu Shopify" is clearly the main DACH migration query. See Shopware below.

## Adaptations and why

- **Shopware (not added).** The EN Migration copy lists Magento, WooCommerce, BigCommerce and in-house platforms. It does not say "other platforms", and no Base X Shopware migration is on record. Shopware's only mention on the site is in Alexander's bio, which describes his own experience. So neither the DE meta nor the body names Shopware. This is the biggest SEO opportunity for DACH. If the owner can confirm a Shopware project, or wants a line such as "and other platforms such as Shopware", add it to the EN source first. Then add a Shopware card or meta mention to DE.
- **Development hero.** "B2B and retail on one stack" became "B2B und B2C in einem System", because German e-commerce people say B2C, not Retail.
- **Home capabilities heading.** It is split into three fragments ("Alles, um modernen E-Commerce / aufzubauen, zu skalieren / und zu automatisieren."). German puts the verbs at the end, so the muted middle fragment still carries the verbs, as the EN version does.
- **Home "What people say about us:".** This became "Das sagen unsere Kunden:", which is more natural than a literal "Was man über uns sagt".
- **Blog titles and excerpts on Home** are translated, as on the Complex blog cards. The posts themselves are English. The truncated excerpts end in "…", as in EN.
- **Web design FAQ.** The line "Copy in German is written by a native speaker, not translated by us" is kept in meaning. The DE copy on this site is itself Claude-written and not yet proofread. The claim only becomes true once Alexander (or another native speaker) has reviewed these pages.
- **Related link hrefs** are unchanged from EN, per the rules. The DE Integrations page therefore links "Komplexe Systeme (DACH)" to `/pages/complex-solutions/` (EN), while shell.de.json links to `/de/pages/complex-solutions/`. Where the DE template renders these links, the href probably should be the `/de/` one. The DE templates own that decision.
