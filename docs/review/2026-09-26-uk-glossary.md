# Ukrainian localisation: glossary and adaptation notes (2026-09-26)

Scope: `content/pages/*.uk.json` for home, shopify-development, shopify-integrations, shopify-migration, shopify-apps, conversion-rate-optimization, web-design, complex-solutions, and shell. Each file mirrors its `.en.json` twin key for key, with the same array lengths. I checked this with a key-path diff script.

## Terminology (EN → UK)

| EN | UK | Note |
|---|---|---|
| Shopify Development | Розробка на Shopify | Main keyword. Page title uses "Розробка магазину на Shopify" |
| store | магазин (на Shopify) | |
| storefront | вітрина | |
| theme | тема | Matches Shopify's Ukrainian admin |
| app / Custom App / public app | застосунок / кастомний застосунок / публічний застосунок | Never "додаток", following Shopify's own UK UI |
| Custom Shopify Apps | Кастомні застосунки Shopify | |
| App Store | App Store / Shopify App Store | Kept as a proper name |
| integration / connector | інтеграція / конектор | |
| Shopify Integrations | Інтеграції Shopify | Page title: "Інтеграція Shopify з ERP, CRM та API" |
| migration / replatform | міграція (на Shopify) / зміна платформи | |
| checkout | оформлення замовлення | Used everywhere. "Чекаут" is not used |
| checkout (at a POS till) | каса | Complex page only, for the in-store till |
| Shopify Functions, checkout extensions | Shopify Functions, checkout extensions | Kept as Shopify API names in FAQ answers |
| conversion / CRO | конверсія / CRO, оптимізація конверсії (CRO) | |
| product page | картка товару | The common Ukrainian e-commerce term |
| cart | кошик | |
| configurator | конфігуратор | |
| variants / options | варіанти / опції | |
| made-to-order | на замовлення | Not «під замовлення» (a calque of «под заказ»). Added in proofread 2026-09-26 |
| in-house platform | власна платформа | Not «самописна» (slang). Added in proofread |
| under real traffic / volume | під реальним навантаженням | Not «під реальним трафіком». Added in proofread |
| your contact (person) | ваша контактна особа | Not «ваш контакт» (calque). Added in proofread |
| takes N weeks (duration) | триває | Not «займає» / «зайняв». Added in proofread |
| growing catalogue | каталог, що зростає | One form on every page. Added in proofread |
| headless | headless (headless-вітрина) | |
| wholesale / retail | опт / роздріб | |
| B2B company accounts | B2B-акаунти компаній | |
| price lists / payment terms | прайс-листи / умови оплати | |
| stock / inventory | залишки | |
| fulfilment / 3PL | фулфілмент / 3PL | |
| carriers / labels / tracking | перевізники / етикетки / трекінг | |
| middleware | middleware | Kept, as in the DE version |
| ERP / CRM / PIM / POS | ERP / CRM / PIM / POS | Feminine in agreement: "ваша ERP" |
| API | API (masculine: "через їхній API") | |
| redirects / canonical / hreflang | редиректи / canonical / hreflang | |
| staging build | тестова копія | |
| backlog | беклог | |
| quick wins | швидкі перемоги | |
| impact, effort and confidence | ефект, зусилля та впевненість | |
| design system / wireframes / prototype | дизайн-система / вайрфрейми / прототип | |
| Web Design | Вебдизайн | One word, per current orthography |
| Creative Direction | Арт-дирекція | DECIDED by the owner 2026-09-26 (was «Креативний напрям»). The service card's description then says «Бренд і візуальний стиль…» so «арт-дирекція» is not repeated |
| art direction | арт-дирекція | Not «арт-дирекшн». Added in proofread |
| e-commerce | е-комерція | Cyrillic "е" |
| AI | ШІ | |
| Discuss Your Project | Обговорити проєкт | |
| Let's Talk | Поговорімо | |
| Our Capabilities | Що ми робимо | |
| Recent Projects | Останні проєкти | |
| When We Can Help | Коли ми допоможемо | |
| Client Stories | Відгуки клієнтів | |
| FAQ | Часті запитання | |
| Related services | Суміжні послуги | |
| Numbers that matter | Наші результати в цифрах | |
| Upwork Reviews / Happy Clients / Projects Delivered | Оцінка на Upwork / Задоволених клієнтів / Реалізованих проєктів | |
| First step / fixed-price audit | Перший крок / аудит за фіксованою ціною | |
| UK gifting brand | Британський бренд подарунків | |
| Automotive / Homeware / Jewellery / Gifting | Автотовари / Товари для дому / Ювелірні вироби / Подарунки | |
| Store Build / Store Migration & Theme Customization | Створення магазину / Міграція магазину та доопрацювання теми | Testimonial context labels |

Number and price formatting follows Ukrainian style:
- "4.8*" is written "4,8*"
- "10M+" is written "10 млн+"
- "$1,999" is written "1 999 $" and "€1,999" is written "1 999 €", with non-breaking spaces
- the budget bands read "до 5 тис. €", "5–15 тис. €" and so on
- non-breaking spaces go between the number and "млн" / "тис." and before the currency sign. The proofread on 2026-09-26 added these, because they were missing in "10 млн+", "1 млн", "3 млн $" and the budget bands

The `value` fields of form options stay in English.

## Kept in English on purpose

- Client testimonial quotes (real quotes). Only the `context` labels are translated.
- Brand, product and system names, company names, people's names (in Latin script), `_note`, `_budgets` and `_source`.
- URLs, image paths and icons.
- Blog `href`s. The linked articles are English, but their titles and excerpts are translated on the cards.

## Adapted rather than translated

1. **Home hero.** "Building the systems behind modern commerce" became "Будуємо системи / для сучасної е-комерції". A literal "behind" ("на яких тримається") made the lines too long for the four-line hero.
2. **"Our Capabilities" became "Що ми робимо".** "Наші можливості" reads as a calque in a section label.
3. **Service page H1s.** These were rephrased so each hero starts with the Ukrainian keyword:
   - "…for stores that need more than a theme" became "…для магазинів, яким замало готової теми"
   - the CRO page became "CRO для магазинів, де проблему розв’язує розробка"
4. **Help section headlines** were rewritten as idioms with the same meaning:
   - "The theme stopped being the answer a while ago" became "Готова тема вже давно не розв’язує ваших задач"
   - "Traffic arrives. Very little converts" became "Трафік приходить. У замовлення перетворюється мало"
5. **"What it’s like to work with us"** became "Як це — працювати з нами".
6. **Meta titles.** These lead with the Ukrainian search keyword rather than mirroring the EN title:
   - Complex: "Інтеграція Shopify з ERP, POS і middleware"
   - Web design: "Дизайн магазину Shopify: UX/UI і вебдизайн"
7. **Home project badges.**
   - "CES Innovation Awards Honoree" became "Відзнака CES Innovation Awards". "Honoree" is not "winner", so I did not use "переможець".
   - "$3M+ raised" became "Залучено понад 3 млн $".
8. **Nova Poshta.** The article title uses the Ukrainian brand name "Нова пошта" and "ТТН", because a Ukrainian merchant searches for those. The app name "Nova Poshta Connect" stays as it is.
9. **Complex case study.**
   - "deposit handling" (German Pfand) became "облік застави за тару".
   - "stock movements" became "операції руху товару".
   - "checkout" on the POS became "каса".
10. **Shell labels.**
    - "Insights" became "Статті". "Інсайти" is jargon.
    - "Connect" (the Upwork/LinkedIn/Behance column) became "Наші профілі".
    - "Business Development Manager" became "Менеджерка з розвитку бізнесу" (feminine, for Sofiia). "CBDO" is kept.
11. **Team location.** Kyiv, Lviv and Kraków become "Київ, Львів, Краків", which is standard Ukrainian. "CET hours" became "за центральноєвропейським часом (CET)".
12. **CRO stats text.** "We find the leaks…" became "Знаходимо, де магазин втрачає гроші…". A literal "витоки" is unclear in Ukrainian.

## Open points for the owner

- **Links go to EN pages.** The shell keeps EN `href`s, as the brief asks. The DE shell points Complex to `/de/pages/complex-solutions/`. If UK pages get their own `/uk/…` routes, the menu, related links and FAQ inline links need `/uk/` hrefs.
- **Privacy link goes to the EN page.** `shell.uk.json` has no `footer.privacyHref` or `form.privacyHref`, because the EN twin has none. As a result the "Політика конфіденційності" link opens the EN privacy page. `uk/pages/privacy-policy.html` exists; adding `privacyHref: "/uk/pages/privacy-policy/"` (like DE) is a one-line follow-up.
- **Currency.** The offer price keeps the currency from EN: $ on integrations and migration, € on Complex. A Ukrainian audience might be better served by one currency, or by UAH. That is a business call and I have not changed it.
- **People's names in Latin script.** Alexander Karl, Sofiia Zabrodska and the others stay in Latin inside Ukrainian sentences, per the brief. The Ukrainian team members could be written in Cyrillic (Софія Забродська, Вадим-Марко Груден, Олександр Руденко) if preferred.
