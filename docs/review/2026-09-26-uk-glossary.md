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
| carriers / labels / tracking | служби доставки / етикетки / відстеження посилок | Plain wording since 2026-09-26 (was «перевізники / трекінг») |
| middleware | middleware | Kept, as in the DE version |
| ERP / CRM / PIM / POS | ERP / CRM / PIM / POS | Feminine in agreement: "ваша ERP" |
| API | API (masculine: "через їхній API") | |
| redirects / canonical / hreflang | редиректи / canonical / hreflang | |
| staging build | тестова копія | |
| backlog | план змін / список наступних змін | Plain wording since 2026-09-26 (was «беклог») |
| quick wins | прості зміни з помітним ефектом / що виправити одразу | Since 2026-09-26 (was «швидкі перемоги», a calque) |
| impact, effort and confidence | ефект, зусилля та впевненість | |
| design system / wireframes / prototype / style guide | дизайн-система / схеми сторінок / прототип / посібник зі стилю | Since 2026-09-26 (was «вайрфрейми», «гайдлайн») |
| Depth over shortcuts | Ґрунтовно, а не нашвидкуруч | Home approach card (2026-09-26). Replaces «Глибина замість латок»: "shortcuts" are not "patches", and the idiom pair «ґрунтовно / нашвидкуруч» carries the contrast. Description: «…з розрахунком на роки зростання, а не на тимчасові виправлення» |
| Hardware startup | Стартап у сфері електроніки | Home project category (2026-09-26). Replaces «Hardware-стартап» |
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
- prices on UK pages are in euro only (owner, 2026-09-26): the fixed-price audit reads "1 999 €" on Integrations, Migration and Complex, with non-breaking spaces. The form budget bands are EUR too. The NAYA funding badge is a historical fact in dollars, so it is written out in words, «Залучено понад 3 млн доларів», with no "$" sign
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
- ~~**Currency.**~~ Decided 2026-09-26: euro only on UK pages (see number formatting above).
- ~~**People's names in Latin script.**~~ Decided 2026-09-26: Ukrainian team members in Cyrillic on UK pages (see "Owner decisions" below).

## Owner decisions applied 2026-09-26 (second pass)

- **Creative Direction → «Арт-дирекція»** (web-design card title, project tag, meta description).
- **UK Complex contact.** On `/uk/pages/complex-solutions/` the partner block names **Вадим-Марко Груден, CBDO, Base X Tech** as the Ukrainian-language contact for complex projects. Text-only (no `photo`), no in-person line, no bio: `partner.inPerson`, `bio`, `photo` and `photoAlt` are deliberately absent from `complex-solutions.uk.json` (the only intended key difference from the EN twin). The FAQ "Who will we be talking to?" names him too. The UK wrapper passes `teamDach: false`, so "З ким ви говоритимете" lists Sofiia and Vadym-Marko only. EN and DE keep Alexander Karl. The page still offers DACH integrations and keeps the German case study; the menu label «Складні системи (DACH)» is unchanged.
- **Plain Ukrainian instead of jargon (2026-09-26).** See the next section.

## Plain wording: what leading Ukrainian agencies do (research 2026-09-26)

I read the service pages of five Ukrainian digital / e-commerce agencies: Turum-burum (UX audit and CRO, turumburum.ua/services/audit), IWIS (Shopify development, iwis.io), Brainlab (web design, brainlab.com.ua), Sprava (Shopify development, sprava.ua) and Webstick (UX/UI, webstick.com.ua). What they have in common:

- **Work steps are described with plain verbs and nouns**: «дослідження», «прототип», «макети», «тестування», «запуск», «перенесення сайту з іншої CMS», «технічна підтримка після старту», «інструкції для розробників», «поетапно покращувати». Team slang (беклог, квік-віни, проганяти, продакшн) is rare on sales pages even though the same teams use it internally.
- **Established technical and market terms stay in English or as loanwords**: A/B-тестування, UX/UI, API, CRM/ERP, SKU, CMS, Core Web Vitals, WCAG, «гіпотези», «конверсія», «інтеграції», «кастомізація».
- **Platform words follow the platform**: «тема», «оформлення замовлення». IWIS writes «додаток»; we keep «застосунок» because that is Shopify's own Ukrainian UI.

### Replacements made

| Page | Before | After |
|---|---|---|
| CRO | Аудит і беклог | Аудит і план змін |
| CRO | обираємо швидкі перемоги й більші ставки | вирішуємо, що виправити одразу, а що потребує більшої роботи |
| CRO | оновлюємо беклог | оновлюємо список наступних змін |
| CRO | Швидкі перемоги йдуть першими | Прості зміни з помітним ефектом ідуть першими |
| CRO | Швидкі перемоги видно вже в першому звітному циклі | Результат простих змін видно вже в першому звітному циклі |
| CRO | оновити беклог, обрати наступне | оновити список змін, обрати наступну |
| Web design | Вайрфрейми й планування / робимо вайрфрейми | Структура й планування / робимо схеми всіх ключових сторінок |
| Web design | матеріали й гайдлайн | матеріали й посібник зі стилю |
| Web design | магазин не розповзається | магазин не втрачає цілісності |
| Web design | мультиринкові магазини | магазини для кількох ринків |
| Apps | навігації у форматі сторіс | навігація у форматі історій, як в Instagram (Instagram's own Ukrainian UI says «Історії») |
| Apps | Проганяємо застосунок через … крайні випадки | Перевіряємо застосунок на … нетипових випадках |
| Complex | Працює в продакшені | Система вже працює |
| Complex, Integrations | Перевізники, етикетки й трекінг, … а не прикручені збоку | Служби доставки, етикетки й відстеження посилок — частина обробки замовлень, а не окрема надбудова |
| Complex, Integrations, Migration | проганяємо (реальні сценарії / замовлення / магазин) | перевіряємо на … |
| Integrations | повертають трекінг у магазин | передають у магазин номери для відстеження |
| Migration | заміна банера — це тікет | для заміни банера треба ставити задачу розробникам |
| Development | нативний фронтенд магазину | вітрина магазину |
| Development | продаватимемо вам апгрейд | продаватимемо вам дорожчий тариф |
| Development | застосунок, прикручений збоку | окремий застосунок поверх магазину |
| Home | готовий до релізу | готовий до запуску |

### Kept on purpose (practitioners use them; a plain word would sound odd or lose meaning)

- **кастомний / кастомна розробка**: the standard market term on Ukrainian agency sites («кастомізація», «кастомна розробка»). «Індивідуальний» is used where it reads better, not everywhere.
- **headless, middleware, API, ERP/CRM/PIM/POS, SKU, Core Web Vitals, A/B-тести, UX/UI, CRO**: names of technologies or methods, with no Ukrainian equivalent that a buyer would search for.
- **фронтенд / бекенд** (Development headless card and FAQ only): in the headless context the split is the point, and every Ukrainian agency writes it this way.
- **фулфілмент, 3PL**: used by Ukrainian logistics operators themselves. «Виконання замовлень» is used in running text where it fits.
- **клікабельні прототипи, дизайн-система**: standard in Ukrainian design studios (Brainlab, Turum-burum).
- **Лайфстайл-бренд**: common in Ukrainian retail; «бренд стилю життя» sounds translated.
