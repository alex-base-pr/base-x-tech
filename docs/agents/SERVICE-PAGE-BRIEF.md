# Brief: put Marko's approved copy on one service page

Read first: `CLAUDE.md` (bottom section), spec `docs/discovery/2026-09-24-quick-en-site.md` §3 REQ-002…005, §5 D8.

## Reference implementation — copy it

`pages/service/custom-shopify-integrations.html` (copy from `content/source/03-shopify-integrations.txt`)
and its fixture `content/expect/custom-shopify-integrations.json`. Your page must follow the same section order,
the same partials and the same parameters.

| Marko slot | Partial + params |
|---|---|
| SEO title, meta description | `head-alt.ejs` `title`, `description` (keep `hrefLang*` as they are) |
| hero.eyebrow / hero.h1 / hero.lead / hero.cta | `hero-type-two.ejs`: `subtitle`, `title` (line breaks from Marko as `<br>`), `description`, `button_text`, `title_size: "long"` |
| cap.label / cap.h2 / 6 × cap title + desc | `split.ejs` `semantic: true`, `title`, `subtitle` (one `<span class='accent'>` on the last words, like the reference), `cards` (keep the existing `background_image` of the page's current cards) |
| proj.label / 3 × client, desc, tags | `works.ejs` `semantic: true`, `title`, `stat`, `description`, `items` (`title`, `text`, `tags`, `icons`; `link` + `background_image` **only** if that exact project already has one in the repo — grep `public/images` and existing pages; never reuse another project's image) |
| stats | `works.ejs` `stat` = first figure, `description` = the stats sentence built only from Marko's figures |
| help.label / help.h2 / 3 conditions | `split.ejs` `semantic: true`, `content_cards` with the rhombus `subtitle`, `title` only |
| 3 quotes + author + tag | `info.ejs` `semantic: true`, `reviews` (`text`, `name` = author, `post` = tag), no avatar |
| process.label / h2 / 4 steps | `faq.ejs` `semantic: true`, `button` |
| FAQ h2 + pairs | `faq.ejs` `semantic: true, schema: true, numbered: false, extra_class: 'faq-list'`, id `service-questions`. FAQ source: the page's own file; if it has none, `content/source/07-faq-web-design-shopify-development.txt` |
| cta.h2 / cta.body / cta.button | `cta.ejs` with `cta: { label, title, body, button }` |
| — | keep `approach.ejs` and the page's existing scripts |

## Rules

- **Copy verbatim** from the source file. Don't invent, shorten or "improve" text, clients, numbers, quotes.
  Marko's notes/comments in the file ("Leads the section…", "Open", "Voice check") are not page copy.
- Where Marko marks something open/missing (e.g. no project cards identified), use the default from
  `docs/OPEN-QUESTIONS.md` (Q-6: NAYA.TECH, Prime EVA, Gunia with existing images/links) and list it in your report.
- Keep the page's current URL/file and `<main id="…">`. Do not touch other pages, `/uk/**`, partials, SCSS, site map,
  STATUS or tests — if a partial can't express something, stop and report it instead.
- No team photos, no new images.
- Create `content/expect/<file-name>.json` like the reference (title, description, h1, the six capability H3s,
  `faq_count`).

## Verify before you finish

```bash
npm ci && npx playwright install chromium
npm run build && npm run qa:build
npx playwright test --project=chromium --reporter=line qa/tests/copy.spec.js qa/tests/pages.spec.js -g "<your path>"
npm run qa:links
```

All must pass (the only accepted failure is `T-042 … FAQPage` on a page whose `faq` flag you could not set, because
`json/site-map.json` is owned by the lead). Then take 1440 px and 375 px screenshots of hero, capabilities, projects,
FAQ with `npm run preview` running and `node qa/el-shot.mjs <path> <selector> <out.png> <width>` and look at them: no text overflowing cards, no giant FAQ titles, H1 on
≤ 3–4 lines at 1440.

Commit on your branch: `page: <name> — Marko copy (REQ-002)` + the `Co-Authored-By` trailer.

## Report back

Path, commit hash, test output summary, every deviation from the copy and why, anything Marko marked open.
