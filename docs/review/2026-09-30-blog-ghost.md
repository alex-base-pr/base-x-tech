# Blog (Ghost) → design v2: research, 2026-09-30

Read-only. Evidence: `curl` of https://base-xtech.com/blog/*, public Content API, clone of `base-xtech/basex-ghost` (branch tips only), Figma REST `TbM2uNtTNxbejfVUUNvDVu`.

## 1. Setup
- **Ghost 6.43**, self-hosted. `<meta name="generator" content="Ghost 6.43">`, `x-powered-by: Express`. Root is shared hosting (`x-ray: wnp…`), so the two are separate origins behind Cloudflare. How `/blog/*` reaches Ghost (Worker or origin rule) is not visible from outside. The dev site 302s `/blog/` to prod.
- **Theme:** a fork of TryGhost **Source 1.6.1**, repo `base-xtech/basex-ghost`. Its GitHub Actions rsync the theme to a VPS and restart systemd `ghost_base-xtech-com`:
  - `main` → `/var/www/base-xtech-blog/content/themes/source/`
  - `develop` → `…/themes/develop-source/`
  - **The live theme is `develop`:** live `/blog/assets/js/scripts.js` is byte-identical to `origin/develop`, not to `main`. `develop` is 11 files ahead of `main`.
- The theme includes the **old** site shell: `partials/components/header-custom.hbs`, `footer-custom.hbs` and `assets/css/style.css`, which uses TWK Everett/Thunder with accent `#81a13f`. The v2 accent `#B5DC4A` is only set in the Ghost admin (`accent_color`).
- **Members are on:** Portal 2.68, `allow_external_signup: true`, `data-members-form`, Sodo search. Locale is `en` only. Admin is reachable at `/blog/ghost/`.
- **Security:** the repo README warns that 8 old commits carry the "NullReceiver" backdoor (`SECURITY-DANGEROUS-COMMITS.md`). Never check out old SHAs. The deploy step also pipes a sudo password from a secret.

## 2. Content and page types
- 21 posts, 1 page (`/blog/about/`), 3 authors (dmytro, oleksandr, marko), **50 tags, 33 of them with ≤1 post**.
- **Home/list:** H1 is the site description "…Europe and the Asia-Pacific region", title is "Base X Tech — Shopify development and AI tooling". Then featured cards, CTA and feed, with pagination (`/blog/page/2/`).
- **Post:** tag, title, meta (author, date, reading time), share, feature image, content, 4 related cards, and a sticky "discuss" button (`post.hbs` on develop). Content includes tables and `<code>` (Claude API post) and a FAQ. There is no TOC.
- **Tag/author:** archive header plus a card grid.
- **Nav:** points at 9 old `/pages/service/*` URLs plus `/#section-*` anchors (`header-custom.hbs`).
- **Lead capture:**
  - The old-design modal `.discuss-form` already POSTs to `https://clickup.base-xtech.com`. It sends a reduced payload: no source, site language, location, first touch, campaign history or summary.
  - Inline CTAs in post content are Cloudflare-obfuscated `mailto:` links, for example "contact us" in `custom-shopify-integrations-gifting-brand`.
  - Outbound `?ref=base-xtech.com` comes from the admin setting Outbound link tagging.
- **Structured data:** Article and FAQPage JSON-LD. Canonicals are self-referencing.

## 3. Figma
There are **no blog, article or insights frames.** The only related items:
- the "Insights" nav label (`349:30`, `877:1604`, `1:17`)
- the "More articles" button (`693:1527` / hover `693:1533`)
- the "Latest News" block in the early structure (`1:43`)

Blog layouts would be derived from the Ui-kit (`693:583`) and Modal-form (`825:33`).

## 4. Options
| | What | Effort | Trade-offs |
|---|---|---|---|
| **a. Rework the existing theme** | Port v2 header, nav, footer, modal, fonts and tokens into `basex-ghost` `.hbs`. Restyle list, post, tag and author pages. Replace the modal JS with a copy of `src/main.js` lead logic. | 4–6 dev-days + QA | Keeps Ghost editor, members, sitemap and SEO. Header/footer are duplicated across two repos. |
| b. Headless | Content API → Vite pages. Webhook triggers a rebuild. Cloudflare routing is changed. | 8–12 days | One codebase. You must rebuild sitemap, RSS, pagination, search, members and JSON-LD, and the routing change carries risk. |
| c. Code Injection CSS | Overrides only | 1–2 days | Can't change markup or nav, fragile, and the old modal stays. |

**Recommendation: (a).** Set the theme up as a v2-only branch, merge `develop` into `main`, and deploy to **one** theme folder.

**Needed from the owner:**
- Ghost **Administrator** (or Owner) role, to activate the theme and change settings: turn off outbound ref tagging, fix the site description/H1 and navigation, merge or cleanup tags.
- Confirmation that the Actions secrets and VPS SSH still work, and who merges and deploys.
- Cloudflare access, to document how `/blog` is routed.
- A decision on members/newsletter: keep or turn off.
- Whether Marko will provide blog frames in Figma, or we derive them.
- Access to edit posts to replace the mailto CTAs.

A Content API key is only needed for (b). The public one in the page's `data-key` is enough to read.

## 5. SEO and migration risks
- **Keep URLs as they are:** `/blog/<slug>/`, `/blog/tag/*`, `/blog/author/*`, `/blog/page/N/`. The `.htaccess` blog rule already avoids trailing-slash rewrites.
- Keep the `{{ghost_head}}` canonicals and JSON-LD. Keep `/blog/sitemap.xml`, which is listed in the root `robots.txt`. `/blog/robots.txt` has no effect because it is not at the root.
- Thin tags: prune or merge them and 301 through Ghost `redirects.yaml`, or noindex tags with one post.
- **hreflang:** the blog is EN only. Emit no hreflang, and keep the v2 language switcher off (or linked to `/`) on blog pages.
- **Leads:** send the same `{name, description}` JSON to `clickup.base-xtech.com`, using the same field list as `src/main.js`: Source, Site language `EN`, Location, Page, first-touch/campaign UTMs, and summary. `Page` should be the full `/blog/…` path.
  - The first-touch cookie/localStorage works because the blog is same-origin.
  - Add a dev guard: the theme has no `__DEPLOY_ENV__`, so check `location.hostname`.
  - Check that CORS on the ClickUp proxy allows `https://base-xtech.com`. It already does today.
