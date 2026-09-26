# Ukrainian proofread: content/pages/*.uk.json (2026-09-26)

An independent editor reviewed this copy. It did not write it. Scope: the nine `*.uk.json` files (shell, home, shopify-development, shopify-integrations, shopify-migration, shopify-apps, conversion-rate-optimization, web-design, complex-solutions) and `docs/review/2026-09-26-uk-glossary.md`. Each value was compared with its `*.en.json` twin.

## Verdict

**Good. Publishable once the changes below are in.** The translation is accurate and natural in most places. The terminology is consistent: застосунок, оформлення замовлення, картка товару, вітрина and тема are used on every page. I found no gross Russianisms of the «приймати участь», «на протязі», «являється», «вірний» or «співпадати» kind.

The recurring problems are these:

- **The calque «під X» ("designed for").** Examples: «під замовлення», «під ваші задачі», «під API», «під реальним трафіком», «під каталог». These now read «на замовлення», «для …» and «під реальним навантаженням».
- **Loose Russian-influenced verbs.** Examples: «справляється» (meaning "copes"), «займає тижні» / «зайняв», «перенос», «закриває потреби», «знімають роботу».
- **Missing non-breaking spaces** in «10 млн+», «1 млн», «3 млн $» and the budget bands.
- **Two small meaning losses in meta descriptions.** CRO had dropped "tracking". On Migration, "redirects … handled" had been rendered as "we keep the redirects".
- **Euphony (у/в, і/й, з/із)** and a few clumsy constructions.

I added no new claims, numbers or promises. Prices are unchanged and match EN: 1 999 $ on integrations and migration, 1 999 € on Complex.

## Checks that passed with no changes

- **Apostrophe:** ’ (U+2019) is used everywhere. There are no straight `'` or `ʼ` in the Ukrainian text. The straight quotes that remain are HTML attribute quotes.
- **Quotation marks:** «…» only. There are no “…” or „…“.
- **Dashes:** em dash with spaces. There are no spaced hyphens or spaced en dashes. En dash without spaces in ranges such as 5–15.
- **Spacing:** no double spaces.
- **Prices:** «1 999 $» and «1 999 €» already use NBSP.
- **Structure:** keys, array lengths, hrefs, image paths, `value`s, `_note`s, English testimonial quotes and names are all untouched. All nine files still parse as JSON.
- **Meta:** every title is ≤ 60 characters and every description ≤ 160. Every one contains its Ukrainian keyword. Figures after the fixes:

| Page | Title | Description |
|---|---|---|
| home | 55 | 148 |
| shopify-development | 51 | 149 |
| shopify-integrations | 50 | 147 |
| shopify-migration | 58 | 155 |
| shopify-apps | 59 | 153 |
| conversion-rate-optimization | 52 | 159 |
| web-design | 56 | 150 |
| complex-solutions | 56 | 149 |

- **CTAs:** consistent imperative or infinitive forms: «Обговорити проєкт», «Поговорімо», «Замовити аудит», «Читати кейс». Menu labels are short.

## Changes by type (106 in total)

| Type | Count |
|---|---|
| Русизм/калька | 37 |
| Стиль/синтаксис | 34 |
| Типографіка (NBSP, …) | 16 |
| Граматика/милозвучність | 11 |
| Термінологія/узгодженість | 5 |
| Відхилення від EN | 3 |

## Glossary changes

In `docs/review/2026-09-26-uk-glossary.md` I added these rows:

- **made-to-order → на замовлення.** «під замовлення» is a calque of «под заказ».
- **in-house platform → власна платформа.** «Самописна» is slang, and the glossary already chose «власна».
- **under real traffic → під реальним навантаженням.**
- **your contact → ваша контактна особа.**
- **duration → триває.** Not «займає».
- **growing catalogue → каталог, що зростає.** It had been «росте» on some pages and «зростає» on others.
- **art direction → арт-дирекція.**

I also flagged «Креативний напрям» for a decision (see the human-review list) and added the NBSP rule to the number-formatting notes. None of the existing glossary choices is wrong enough to overturn.

## All changes

Commits: `5dae619`, `ee1ee8f`, `6d53e18`, `dcd8fd9`, `3bd0101` (content) and one docs commit for this report and the glossary. In the table, `·` stands for a non-breaking space (U+00A0). Where only part of a string changed, the column shows just that fragment.

| File | Key | Before | After | Reason |
|---|---|---|---|---|
| shell | `team.dach.note` | ваш контакт німецькою мовою | спілкування німецькою мовою | Русизм/калька |
| shell | `form.budgets[0].label` | До 5 тис. € | До 5·тис.·€ | Типографіка |
| shell | `form.budgets[1].label` | 5–15 тис. € | 5–15·тис.·€ | Типографіка |
| shell | `form.budgets[2].label` | 15–40 тис. € | 15–40·тис.·€ | Типографіка |
| shell | `form.budgets[3].label` | Понад 40 тис. € | Понад 40·тис.·€ | Типографіка |
| home | `projects.items[0].text` | конфігуратор, спроєктований під дуже модульний пристрій | конфігуратор, спроєктований для дуже модульного пристрою | Русизм/калька |
| home | `projects.items[0].badges[1]` | Залучено понад 3 млн $ | Залучено понад 3·млн·$ | Типографіка |
| home | `projects.items[1].text` | з повною інтеграцією з ERP, яка підтримує мільйони можливих комбінацій товару | повністю інтегрований з ERP, щоб підтримувати мільйони можливих комбінацій товару | Стиль/синтаксис |
| home | `projects.items[1].badges[0]` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| home | `projects.items[2].linkLabel` | Перейти в магазин Gunia | Перейти до магазину Gunia | Русизм/калька |
| home | `articles.items[0].excerpt` | Більшість із них можуть зачекати | Більшість із них може зачекати | Граматика/милозвучність |
| home | `articles.items[0].excerpt` | про відмову від покупки, ... | про відмову від покупки… | Типографіка |
| home | `articles.items[1].excerpt` | по одній... | по одній… | Типографіка |
| shopify-development | `meta.title` | Розробка магазину на Shopify під ваші задачі \| Base X Tech | Кастомна розробка магазину на Shopify \| Base X Tech | Русизм/калька |
| shopify-development | `hero.lead` | Якщо найскладніше в проєкті — сама розробка, саме | Якщо найскладніше в проєкті — розробка, саме | Стиль/синтаксис |
| shopify-development | `capabilities.items[3].description` | асортименту під замовлення. | асортименту на замовлення. | Русизм/калька |
| shopify-development | `help.items[1].title` | має обслуговувати і опт, і роздріб | має обслуговувати й опт, і роздріб | Граматика/милозвучність |
| shopify-development | `process.steps[0].description` | потрібно проєкту і скільки | потрібно проєкту й скільки | Граматика/милозвучність |
| shopify-development | `process.steps[1].description` | Визначаємо модель даних, інтеграції та де кастомний код | Визначаємо модель даних, інтеграції та місця, де кастомний код | Стиль/синтаксис |
| shopify-development | `process.steps[3].description` | стежимо за магазином під реальним трафіком і залишаємося | стежимо за магазином під реальним навантаженням і залишаємося | Русизм/калька |
| shopify-development | `projects.items[0].badge` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| shopify-development | `faq.items[2].a` | асортиментом під замовлення | асортиментом на замовлення | Русизм/калька |
| shopify-development | `faq.items[3].q` | обслуговувати і опт, і роздріб? | обслуговувати й опт, і роздріб? | Граматика/милозвучність |
| shopify-development | `faq.items[4].a` | якщо з задачею впорається | якщо із задачею впорається | Граматика/милозвучність |
| shopify-development | `faq.items[6].a` | тож терміни узгоджуються на старті | тож терміни ми узгоджуємо на старті | Стиль/синтаксис |
| shopify-development | `faq.items[7].a` | Стежимо за магазином під реальним трафіком, виправляємо | Стежимо за магазином під реальним навантаженням, виправляємо | Русизм/калька |
| shopify-integrations | `hero.lead` | Коли в кожному замовленні магазин має збігатися із системами | Коли в кожному замовленні дані магазину мають збігатися із системами | Стиль/синтаксис |
| shopify-integrations | `capabilities.items[2].description` | Одне джерело даних про товари, звідки вони надходять у Shopify, замість подвійного ведення. | Єдине джерело даних про товари: вони надходять у Shopify, а не ведуться двічі. | Стиль/синтаксис |
| shopify-integrations | `projects.items[1].badge` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| shopify-integrations | `help.items[2].description` | Відсутність застосунку в магазині застосунків не означає, що інтеграції не буде. Ми будуємо конектор на API вашої ERP | Якщо в App Store немає застосунку, це ще не означає, що інтеграції не буде. Ми будуємо конектор до API вашої ERP | Стиль/синтаксис |
| shopify-integrations | `process.steps[1].description` | яка система має пріоритет, коли дві розходяться | яка система має пріоритет, коли дані двох систем розходяться | Стиль/синтаксис |
| shopify-integrations | `offer.text` | вартість аудиту зарахуємо в рахунок розробки | вартість аудиту відрахуємо від ціни розробки | Стиль/синтаксис |
| shopify-integrations | `faq.items[1].a` | який стоїть між ними | що працює як проміжна ланка | Стиль/синтаксис |
| shopify-integrations | `faq.items[2].a` | яка система є власником цієї цифри | яка система відповідає за це число | Стиль/синтаксис |
| shopify-integrations | `faq.items[4].a` | конектори під конкретне завдання | конектори для конкретного завдання | Русизм/калька |
| shopify-integrations | `faq.items[5].a` | зайняв від чотирьох | тривав від чотирьох | Русизм/калька |
| shopify-migration | `meta.description` | редиректи й позиції зберігаємо | редиректи й позиції — під контролем | Відхилення від EN |
| shopify-migration | `capabilities.items[0].description` | Переносимо магазини на Magento 1 і 2, не забираючи з собою витрати на підтримку. | Переносимо магазини з Magento 1 і 2 без старих витрат на підтримку. | Стиль/синтаксис |
| shopify-migration | `capabilities.items[1].description` | Переносимо магазини на WordPress і WooCommerce та назавжди позбавляємо залежності від плагінів. | Переносимо магазини з WordPress і WooCommerce та назавжди позбавляємо їх залежності від плагінів. | Стиль/синтаксис |
| shopify-migration | `capabilities.items[3].description` | Переносимо самописні платформи на Shopify | Переносимо на Shopify магазини з власних платформ | Термінологія/узгодженість |
| shopify-migration | `capabilities.items[5].description` | щоб позиції пережили перехід | щоб позиції в пошуку збереглися після переходу | Русизм/калька |
| shopify-migration | `projects.items[0].text` | понад 1 млн профілів клієнтів. | понад 1·млн профілів клієнтів. | Типографіка |
| shopify-migration | `projects.items[1].badge` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| shopify-migration | `process.label` | Як ми мігруємо | Як проходить міграція | Русизм/калька |
| shopify-migration | `process.steps[2].description` | а потім тестуємо магазин на тестовій копії, доки він не працюватиме як слід | а потім проганяємо магазин на тестовій копії, доки все не працюватиме як слід | Стиль/синтаксис |
| shopify-migration | `stats.items[0].value` | 1 млн+ | 1·млн+ | Типографіка |
| shopify-migration | `offer.text` | вартість зарахуємо в рахунок міграції | вартість оцінки відрахуємо від ціни міграції | Стиль/синтаксис |
| shopify-migration | `faq.items[0].a` | Простий перенос каталогу займає тижні | Просте перенесення каталогу триває кілька тижнів | Русизм/калька |
| shopify-migration | `faq.items[0].a` | понад 1 млн профілів клієнтів і тринадцять років історії — зайняв | понад 1·млн профілів клієнтів і тринадцять років історії — тривав | Русизм/калька |
| shopify-migration | `faq.items[2].a` | понад 1 млн профілів і | понад 1·млн профілів і | Типографіка |
| shopify-migration | `faq.items[3].q` | Чи можете ви мігрувати з кастомної платформи? | Чи можете ви перенести магазин із кастомної платформи? | Русизм/калька |
| shopify-migration | `faq.items[3].a` | а самописні мають логіку | а власні мають логіку | Термінологія/узгодженість |
| shopify-migration | `faq.items[5].a` | написані під API старої платформи | написані для API старої платформи | Русизм/калька |
| shopify-migration | `faq.items[7].a` | перевіряємо на живих відповідях сервера | перевіряємо за фактичними відповідями сервера | Стиль/синтаксис |
| shopify-apps | `hero.title[1]` | під ваші реальні | для ваших реальних | Русизм/калька |
| shopify-apps | `hero.title[2]` | робочі процеси | робочих процесів | Русизм/калька |
| shopify-apps | `hero.lead` | автоматизації, що знімають роботу, яку ніхто не мав би робити вручну | автоматизації, що беруть на себе роботу, якої ніхто не мав би виконувати вручну | Русизм/калька |
| shopify-apps | `capabilities.items[1].description` | які роблять те, з чим не справляється жоден публічний | які роблять те, чого як слід не робить жоден публічний | Русизм/калька |
| shopify-apps | `capabilities.items[3].description` | доставки на власних точках розширення Shopify | доставки через власні точки розширення Shopify | Стиль/синтаксис |
| shopify-apps | `help.items[1].description` | App Store закриває типові потреби | App Store покриває типові потреби | Русизм/калька |
| shopify-apps | `faq.items[3].q` | Скільки часу займає розробка застосунку Shopify? | Скільки триває розробка застосунку Shopify? | Русизм/калька |
| shopify-apps | `faq.items[3].a` | чи перевірка App Store, довше | чи перевірка App Store, розробка триває довше | Стиль/синтаксис |
| shopify-apps | `faq.items[3].a` | зайняв від чотирьох | тривав від чотирьох | Русизм/калька |
| shopify-apps | `faq.items[7].a` | — це спосіб успадкувати чужі проблеми | — так і успадковують чужі проблеми | Стиль/синтаксис |
| conversion-rate-optimization | `meta.description` | мобільна версія, швидкість. | мобільна версія, швидкість, аналітика. | Відхилення від EN |
| conversion-rate-optimization | `capabilities.items[1].description` | навколо питань покупців | навколо запитань покупців | Русизм/калька |
| conversion-rate-optimization | `projects.items[2].text` | Картки товару, перебудовані під каталог, що постійно росте. | Картки товару, перебудовані для каталогу, що постійно зростає. | Русизм/калька |
| conversion-rate-optimization | `projects.items[2].badge` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| conversion-rate-optimization | `help.items[0].description` | де і чому вони відпадають | де й чому вони залишають сайт | Стиль/синтаксис |
| conversion-rate-optimization | `help.items[1].title` | Оформлення замовлення втрачає більше, ніж мало б | На оформленні замовлення ви втрачаєте більше, ніж мали б | Стиль/синтаксис |
| conversion-rate-optimization | `help.items[1].description` | зупиняє людей на оформленні замовлення | зупиняє людей під час оформлення замовлення | Стиль/синтаксис |
| conversion-rate-optimization | `help.items[2].description` | Зміни виходять без базових показників | Зміни запускають без базових показників | Стиль/синтаксис |
| conversion-rate-optimization | `process.steps[1].description` | та визначаємо, як виглядає успіх, ще до старту | та ще до старту визначаємо критерії успіху | Русизм/калька |
| conversion-rate-optimization | `process.steps[3].description` | Звітуємо, що дала кожна зміна, й оновлюємо | Звітуємо про те, що дала кожна зміна, і оновлюємо | Граматика/милозвучність |
| conversion-rate-optimization | `faq.items[0].q` | Що входить в аудит CRO? | Що входить до аудиту CRO? | Граматика/милозвучність |
| conversion-rate-optimization | `faq.items[0].a` | Кожну проблему ви отримуєте згрупованою за розділом і оціненою за ефектом, зусиллями та впевненістю — тобто впорядкований список, а не набір спостережень. | Усі проблеми ми групуємо за розділами й оцінюємо за ефектом, зусиллями та впевненістю, тож ви отримуєте впорядкований список, а не набір спостережень. | Стиль/синтаксис |
| conversion-rate-optimization | `faq.items[1].a` | з аудитом, під який вам потім треба шукати розробника | з аудитом, для якого вам потім треба шукати розробника | Русизм/калька |
| conversion-rate-optimization | `faq.items[4].a` | Ми визначаємо, як виглядає успіх, ще до старту. | Критерії успіху ми визначаємо ще до старту. | Русизм/калька |
| conversion-rate-optimization | `faq.items[6].a` | вимірювати покращення на поганих даних | вимірювати покращення за неякісними даними | Русизм/калька |
| conversion-rate-optimization | `cta.body` | Розкажіть, де відпадають покупці | Розкажіть, на якому етапі йдуть покупці | Стиль/синтаксис |
| web-design | `hero.title[0]` | Дизайн на Shopify | Дизайн магазинів Shopify | Стиль/синтаксис |
| web-design | `capabilities.items[3].description` | які команда використовує повторно | які команда може використовувати повторно | Відхилення від EN |
| web-design | `capabilities.items[5].description` | Бренд і арт-дирекшн | Брендинг і арт-дирекція | Термінологія/узгодженість |
| web-design | `projects.items[1].text` | каталогу, що постійно росте. | каталогу, що постійно зростає. | Термінологія/узгодженість |
| web-design | `projects.items[1].badge` | 10 млн+ можливих | 10·млн+ можливих | Типографіка |
| web-design | `faq.items[3].a` | які не витягне один шаблон картки товару. Ми це й розробляємо | з якими не впорається один шаблон картки товару. Ми їх і розробляємо | Стиль/синтаксис |
| web-design | `faq.items[4].a` | Для каталогу, що росте | Для каталогу, що зростає | Термінологія/узгодженість |
| web-design | `faq.items[5].a` | Тексти німецькою пише носій мови, а не ми перекладаємо. | Тексти німецькою пише носій мови — ми їх не перекладаємо. | Стиль/синтаксис |
| web-design | `faq.items[6].a` | зазвичай займає від 3 до 8 тижнів | зазвичай триває від 3 до 8·тижнів | Русизм/калька |
| web-design | `faq.items[6].a` | вам потрібно і скільки раундів | вам потрібно й скільки раундів | Граматика/милозвучність |
| complex-solutions | `hero.title` | з’єднані навколо того,&lt;br&gt; як працює ваш бізнес. | з’єднані так,&lt;br&gt; як працює ваш бізнес. | Русизм/калька |
| complex-solutions | `partner.label` | Ваш контакт у регіоні DACH | Ваша контактна особа в регіоні DACH | Русизм/калька |
| complex-solutions | `partner.bio` | з Берліна, понад 40 завершених | з Берліна; за плечима понад 40 завершених | Стиль/синтаксис |
| complex-solutions | `capabilities.cards[3].description` | які роблять те, з чим не справляється жоден публічний | які роблять те, чого як слід не робить жоден публічний | Русизм/калька |
| complex-solutions | `reliable.paragraphs[1]` | Якщо під процес підходить готовий конектор | Якщо готовий конектор підходить для процесу | Русизм/калька |
| complex-solutions | `reliable.paragraphs[2]` | ми передаємо продані кількості в Xentral | ми передаємо обсяги продажів у Xentral | Стиль/синтаксис |
| complex-solutions | `architecture.paragraphs[0]` | Shopify, ERP і POS мають кожна свою роль. | Кожна із систем — Shopify, ERP і POS — має свою роль. | Граматика/милозвучність |
| complex-solutions | `architecture.diagram.svgDesc` | продані кількості по кожному магазину | обсяги продажів окремо для кожного магазину | Русизм/калька |
| complex-solutions | `architecture.diagram.flowErp[0]` | щоночі: продані обсяги | щоночі: обсяги продажів | Стиль/синтаксис |
| complex-solutions | `architecture.diagram.flowErp[1]` | по кожному магазину | для кожного магазину | Русизм/калька |
| complex-solutions | `case.built[0]` | Нічну синхронізацію, яка передає в Xentral продану вагу по кожному магазину | Нічна синхронізація, яка передає в Xentral продану вагу окремо для кожного магазину | Граматика/милозвучність |
| complex-solutions | `case.outcomes[1].text` | прямо на POS-терміналі | безпосередньо на POS-терміналі | Стиль/синтаксис |
| complex-solutions | `posts.text` | для реальних бізнесів у е-комерції | для реальних компаній в е-комерції | Граматика/милозвучність |
| complex-solutions | `posts.items[1].excerpt` | спершу є активом, а згодом поступово стає тягарем | спершу — актив, а згодом повільно перетворюється на тягар | Стиль/синтаксис |
| complex-solutions | `offer.text` | вартість аудиту зарахуємо в рахунок розробки | вартість аудиту відрахуємо від ціни розробки | Стиль/синтаксис |
| complex-solutions | `faq.items[0].a` | — ваш контакт німецькою мовою | — ваша контактна особа для спілкування німецькою | Русизм/калька |

Note on `shopify-migration` `meta.description`: the first version of the fix read «налаштовуємо редиректи, зберігаємо позиції», which came to 162 characters. The committed text is «редиректи й позиції — під контролем» (155 characters).

## ⚠️ FOR HUMAN REVIEW (Ukrainian team)

I did not change these. Each one is a judgement call, a matter of brand voice, or needs a business decision.

1. **⚠️ «Креативний напрям» (Creative Direction).** Used in web-design `capabilities.items[5].title`, `projects.items[0].tags[0]` and the glossary. «Напрям» reads as a "trend" or "area" rather than a service. Options: «Креативна дирекція», «Креативна концепція», «Арт-дирекція».
2. **⚠️ «Інтерим-продакт-оунер».** Complex, `partner.bio`. This is a heavy anglicism. Options: «тимчасовий продакт-оунер (interim)», or keep it if that is how the DACH partner presents himself.
3. **⚠️ «Hardware-стартап».** Home, `projects.items[0].category`. The alternative is «Стартап у сфері електроніки». The hybrid is common in the IT scene, but it is a question of voice.
4. **⚠️ «Глибина замість латок».** Home, `approach.items[0].title`, for "Depth over shortcuts". «Латки» means "patches" rather than "shortcuts". Options: «Глибина замість швидких рішень», or keep it for the imagery.
5. **⚠️ Jargon kept on purpose.** Check that it fits the brand voice:
   - «беклог», «швидкі перемоги», «вайрфрейми», «гайдлайн», «сторіс», «продакшн»
   - «прикручені збоку», «розповзається», «проганяємо»

   All of them are understood in the Ukrainian IT and e-commerce community.
6. **⚠️ «Оберіть» / «обрати».** Used in the form placeholder and in «обираємо». This is a normative variant, but some editors prefer «виберіть» because «обрати» also means "to elect". Only the team can make this consistency call.
7. **⚠️ «події електронної торгівлі в GA4».** CRO, `faq.items[6].a`. This follows the Ukrainian GA4 interface and deliberately differs from «е-комерція» elsewhere. Confirm.
8. **⚠️ NAYA and CES wording across pages.** Home says «Відзнака CES Innovation Awards» ("Honoree"). The Complex blog card says «двічі отримала CES Innovation Award» ("two-time … Award-winning"). Both match their EN sources, but the EN itself is inconsistent. Someone should confirm the facts.
9. **⚠️ Integrations `hero.lead`.** I added «дані магазину» ("the store's data") so that "the store has to agree with the systems" reads naturally. It is a small interpretation, not a new claim.
10. **⚠️ Open points already listed in the glossary, still open:**
    - the UK hrefs point to EN pages
    - there is no `privacyHref`
    - which currency to show: $ or €, or UAH
    - whether to write team members' names in Cyrillic
