# Skill: Add a new service landing page

Use when: a new service offering needs an SEO landing page on the marketing site.

## Steps
1. Pick an existing similar service page as a template, e.g. `pages/service/seo-promotion.html`.
2. Create `pages/service/<new-slug>.html`. Update:
   - `<title>`, meta description, OG tags, canonical URL.
   - Hero copy, body copy, CTAs.
   - `<link rel="alternate" hreflang="uk" href="..."/>` and `hreflang="en"` if both languages will exist.
3. Duplicate to `uk/pages/service/<new-slug>.html` with Ukrainian translation (or confirm with user that EN-only is intentional).
4. Add an internal link from the home page, services nav, and footer.
5. Open [generate-sitemap.js](../../generate-sitemap.js) — confirm the new URL is included (either via glob or by adding it explicitly).
6. `npm run dev` — verify the page renders, the EJS partials resolve, and the lang-switcher works.
7. `npm run build` — confirm it builds without warnings.
8. PR to `staging` → verify on staging server → PR to `live`.

## Anti-patterns
- Skipping the UK variant when the rest of the site is bilingual.
- Forgetting to update the sitemap source (page exists but isn't indexed).
- Hardcoding the canonical URL to the staging domain.
- Copy-pasting a service page without changing the OG image / canonical — duplicate content + wrong social preview.
