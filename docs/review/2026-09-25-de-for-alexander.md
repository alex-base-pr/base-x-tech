# German strings for Alexander's review (K3, 2026-09-25)

Every German string added or changed while applying the team answers (docs/review/2026-09-25-answers.md).
Formal "Sie" throughout (Alexander's own site uses "Du"; that choice is also his, K3). Written by Claude, not yet
proofread by a native speaker. Page: `/de/pages/complex-solutions/` plus the German shell (header, footer, form).
Files: `content/pages/complex-solutions.de.json`, `content/pages/shell.de.json`.

## Given by the team (check only)

| Where | EN source | DE |
|---|---|---|
| Footer (A1) | Base X Tech Ltd, registered in London, UK. Our team works across Kyiv, Lviv, Kraków and Spain, on CET hours. | Base X Tech Ltd, eingetragen in London, UK. Unser Team arbeitet von Kyiv, Lviv, Kraków und Spanien aus, zu MEZ-Zeiten. |
| Form budgets (A3) | Up to €5k / €5–15k / €15–40k / €40k+ / Not sure yet | Bis 5.000 € (not shown on Complex) / 5.000–15.000 € / 15.000–40.000 € / Über 40.000 € / Noch unklar |
| Form success (A4) | Thank you — your project details are with us. We reply within 1 working day. | Vielen Dank — Ihre Projektdetails sind bei uns. Wir antworten innerhalb eines Werktages. |
| Hero sub-line (M3) | Custom Shopify integrations with the ERP, POS and systems behind your operations. | Individuelle Shopify-Integrationen mit ERP, Kassensystem und den Systemen hinter Ihrem Betrieb. |
| Partner heading (K2) | Your contact in the DACH region | Persönlicher Ansprechpartner im DACH-Raum |
| Systems caption (K1) | Systems we connect | Systeme, die wir anbinden |
| Case heading | What's included | Leistungsumfang |
| Footer link (A54) | Terms & Conditions | Terms (EN) — temporary, until the terms page exists in German |

## Written by us (please review)

| Where | EN source | DE |
|---|---|---|
| Form success, 2nd line | We reply within 1 working day. If it's urgent, write to | Wir antworten innerhalb eines Werktages. In dringenden Fällen schreiben Sie uns an |
| Note under "Send" (A4) | We reply within 1 working day. | Wir antworten innerhalb eines Werktages. |
| Team block label (A2) | Who you'll talk to | Ihre Ansprechpartner |
| Team block notes (A2) | first contact, proposals · runs your project · your contact in German | erster Kontakt, Angebote · leitet Ihr Projekt · Ihr Ansprechpartner auf Deutsch |
| Team block role | DACH Partner | DACH-Partner (job titles of the others stay English) |
| Partner text (M1) | Alexander Karl is your point of contact for projects in Germany, Austria and Switzerland. He handles communication with you in German and coordinates your requirements with our team, so nothing gets lost between your business and the people building the system. | Alexander Karl ist Ihr Ansprechpartner für Projekte in Deutschland, Österreich und der Schweiz. Er kommuniziert mit Ihnen auf Deutsch und stimmt Ihre Anforderungen mit unserem Team ab, damit zwischen Ihrem Unternehmen und den Menschen, die das System entwickeln, nichts verloren geht. |
| Partner bio (M1) | Berlin-based interim product owner and e-commerce consultant with 40+ completed digital projects, including Shopware to Shopify migrations with ERP integration. Lecturer in e-commerce at BHT Berlin. | Interim Product Owner und E-Commerce-Berater aus Berlin mit mehr als 40 abgeschlossenen Digitalprojekten, darunter Migrationen von Shopware zu Shopify mit ERP-Anbindung. Lehrbeauftragter für E-Commerce an der BHT Berlin. (Is "Lehrbeauftragter" your correct title?) |
| Systems strip | Custom ERP | Individuelles ERP |
| Capability card (M12) | Custom Apps | Custom Apps (Shopify's term; alternative "Individuelle Apps") |
| Reliability section (A52) | For one retailer, we send sold quantities to Xentral as individual stock movements instead of overwriting stock totals. Online orders keep their changes, and every adjustment can be traced. | Für einen Händler übermitteln wir verkaufte Mengen als einzelne Lagerbewegungen an Xentral, statt die Gesamtbestände zu überschreiben. Änderungen durch Onlinebestellungen bleiben erhalten, und jede Anpassung ist nachvollziehbar. |
| Diagram (A51) | Scales / Mettler Toledo | Waagen / Mettler Toledo |
| Diagram (A51) | products, barcodes · orders, sales | Produkte, Barcodes · Bestellungen, Verkäufe |
| Diagram (A51) | product data (XML) · weighed item barcodes | Produktdaten (XML) · Barcodes gewogener Artikel |
| Diagram (A51) | nightly sold quantities per store | nächtlich: verkaufte Mengen pro Filiale |
| Diagram description (screen readers) | Shopify (commerce platform, with Shopify POS in store) connects to the middleware … every night. | Shopify (Commerce-Plattform, mit Shopify POS im Laden) ist in beide Richtungen mit der Middleware (Integrationsschicht) verbunden: Produkte und Barcodes in die eine, Bestellungen und Verkäufe in die andere Richtung. Die Middleware tauscht Produktdaten (XML) und Barcodes gewogener Artikel mit den Mettler-Toledo-Waagen aus und übermittelt jede Nacht die verkauften Mengen pro Filiale an das ERP (Xentral). |
| Case title (A49) | German specialty food retailer | Deutscher Feinkost-Fachhändler (describes your client, please confirm the wording) |
| Case tags | Shopify POS · Mettler Toledo scales · Xentral ERP · Custom middleware | Shopify POS · Mettler-Toledo-Waagen · Xentral ERP · Individuelle Middleware |
| Case: Challenge | The retailer sells weighed goods across physical stores. Shopify had to become the single master system for products, barcodes and sales, including items sold by weight. The scales, the POS and the Xentral ERP each needed the same data, in their own format. | **Herausforderung:** Der Händler verkauft Waren nach Gewicht in mehreren Ladengeschäften. Shopify sollte zum zentralen führenden System für Produkte, Barcodes und Verkäufe werden, auch für Artikel, die nach Gewicht verkauft werden. Die Waagen, das Kassensystem und das Xentral-ERP benötigten jeweils dieselben Daten, jedes System in seinem eigenen Format. |
| Case: What we built | Middleware that generates barcodes … without overwriting stock changed by online orders. | **Was wir umgesetzt haben:** Eine Middleware, die Barcodes für gewogene Artikel und Stückware erzeugt und Produkte mit den Mettler-Toledo-Waagen synchronisiert. Eine Shopify-POS-Erweiterung, die den Barcode der Waage liest und den gewogenen Artikel automatisch in den Warenkorb legt. Ein Admin-Bereich für Barcode-Regeln mit vollständigem Änderungsprotokoll. Eine nächtliche Synchronisierung, die die verkauften Gewichte pro Filiale und pro Artikelnummer (SKU) als Lagerbewegungen an Xentral übermittelt, ohne Bestände zu überschreiben, die durch Onlinebestellungen geändert wurden. |
| Case: included 1 | Scale integration. Products reach the scales automatically, and scale barcodes are read at checkout. | Waagen-Anbindung. Produkte gelangen automatisch auf die Waagen, und die Barcodes der Waagen werden an der Kasse gelesen. |
| Case: included 2 | POS extension. Staff see and create barcodes directly on the POS terminal. | POS-Erweiterung. Das Personal sieht und erstellt Barcodes direkt am Kassenterminal. |
| Case: included 3 | Xentral stock sync. Sold weights move into the ERP every night, with every change traceable. | Xentral-Bestandsabgleich. Verkaufte Gewichte fließen jede Nacht ins ERP, und jede Änderung bleibt nachvollziehbar. |
| Case: included 4 | Multi-store. One setup serves every location and every future store. | Mehrere Filialen. Ein Setup für alle Standorte und jede künftige Filiale. |
| Case footer | In production. New modules for inventory counting, deposit handling and label printing are being scoped. | Im Produktivbetrieb. Neue Module für Inventur, Pfandabwicklung und Etikettendruck befinden sich in der Planung. |
| Blog card 1 (A50) | Custom Shopify Integrations: A UK Gifting Brand Rebuild | Individuelle Shopify-Integrationen: Neuaufbau für eine britische Geschenkmarke (post itself is English) |
| Blog card 2 (A50) | How to Migrate from a Custom Platform to Shopify — A custom-built ecommerce platform starts as an asset and slowly becomes a liability … | Von einer individuellen Plattform zu Shopify migrieren — Eine selbst entwickelte E-Commerce-Plattform beginnt als Vorteil und wird nach und nach zur Last: Die Wartung verschlingt das Entwicklungsbudget, und Updates fühlen sich riskant an. |
| Blog card 3 (A50) | How We Built a Custom Shopify Product Configurator for NAYA.TECH — NAYA.TECH sells a two-time CES Innovation Award-winning modular keyboard with 16 configurations. | Wie wir einen individuellen Shopify-Produktkonfigurator für NAYA.TECH entwickelt haben — NAYA.TECH verkauft eine zweifach mit dem CES Innovation Award ausgezeichnete modulare Tastatur in 16 Konfigurationen. |
| FAQ 1 (M2) | Who will we be talking to? Alexander Karl, our DACH partner, is your contact in German. Our team builds and supports the system. | Mit wem werden wir sprechen? Alexander Karl, unser DACH-Partner, ist Ihr Ansprechpartner auf Deutsch. Unser Team entwickelt und betreut das System. |
| FAQ 2 (M2) | Can you connect Shopify to our ERP? Yes. We have built integrations with Xentral, Odoo and custom ERPs. Other systems connect through their API, and where there is no usable API, we build the connector. | Können Sie Shopify an unser ERP anbinden? Ja. Wir haben Integrationen mit Xentral, Odoo und individuellen ERP-Systemen umgesetzt. Andere Systeme binden wir über ihre API an, und wo es keine brauchbare API gibt, entwickeln wir den Konnektor selbst. |
| FAQ 3 (M2) | Can Shopify POS work with scales and weighed goods? Yes. We connected Shopify POS to Mettler Toledo scales, so barcodes on weighed items are read at checkout and sold weights flow into the ERP. | Funktioniert Shopify POS mit Waagen und gewogener Ware? Ja. Wir haben Shopify POS an Mettler-Toledo-Waagen angebunden: Die Barcodes gewogener Artikel werden an der Kasse gelesen, und die verkauften Gewichte fließen ins ERP. |
| FAQ 4 (M2) | How long does an integration take? A single well-documented connection takes weeks. A multi-system build takes months, mostly in discovery. We scope it before quoting. | Wie lange dauert eine Integration? Eine einzelne, gut dokumentierte Anbindung dauert Wochen. Ein Projekt mit mehreren Systemen dauert Monate, vor allem wegen der Analysephase. Wir klären den Umfang, bevor wir ein Angebot erstellen. |
| FAQ 5 (M2) | What happens if something breaks after launch? We monitor the connections we build, alert on failures, and can take over maintenance when either side's API changes. | Was passiert, wenn nach dem Livegang etwas ausfällt? Wir überwachen die Verbindungen, die wir bauen, melden Störungen und können die Wartung übernehmen, wenn sich die API einer der beiden Seiten ändert. |
| FAQ 6 (M2) | Does our store need Shopify Plus? Not always. Plus matters for high API volume or custom checkout logic. We tell you during scoping. | Braucht unser Shop Shopify Plus? Nicht immer. Plus ist bei hohem API-Volumen oder individueller Checkout-Logik wichtig. Das sagen wir Ihnen bei der Klärung des Umfangs. |
