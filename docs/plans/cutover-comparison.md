# Cutover comparison: staging preview vs live

Comparison only. Nothing was fixed. Date: 2026-11-25.

- **Preview (Nuxt 4, upgrade/nuxt-4):** https://staging.southerntier8.org
- **Live (current site):** https://southerntier8.org

Live serves the older site. Its HTML carries `data-n-head` and `__NUXT__` markers, a static default `og:image`, and no per-page canonical, robots or Twitter card tags.

## What was checked, and how

1. **HTML crawl, all 108 routes on both hosts.** Routes came from the staging sitemap (93 URLs), plus redirect sources, the eight county housing pages, `/search`, `/regional-news/resources`, and three 404 probes. Per route: status, redirect target, `<title>`, description length, canonical, `og:title`, `og:image`, `twitter:card`, robots meta, GA ID, first `<h1>`, and a hash of visible text. Server-rendered HTML only.
2. **Width pass, 1024px and 375px, every route in the browser that could be reached.** Each route was loaded in a same-origin iframe at each width (the pane's own viewport did not hold 1024px). Checked: horizontal overflow, first `<h1>`, `og:image` tags after hydration, and form count.
3. **Gated resource cards**, checked against the three gated items in the public CMS.
4. **Client-side navigation requests** to `manage.southerntier8.org`, via the Resource Timing API during real client-side navigation.
5. **Analytics hits on client navigation**, via the same timing data.

## Redirects (all 301)

| Source | Staging → | Live → | Result |
|---|---|---|---|
| `/programs` | `/economic-development-programs` | `/economic-development-programs` | Same |
| `/programs/housing` | `/economic-development-programs/housing` | same | Same |
| `/economic-development-programs/southern-tier-s-capital-stack-for-workforce-housing` | `/economic-development-programs/housing` | same | Same |

Each redirect keeps its host, and the targets match.

## Status codes

| Route | Staging | Live | Difference |
|---|---|---|---|
| `/regional-news/workforce-housing-infrastructure-summit-november-18-2026` | 200 | **500** | **Live error.** Staging renders the article. |
| `/search`, `/nope-404-check`, `/regional-news/does-not-exist` | 404 | 404 | Same |

No other route differs in status.

## Width pass (1024px vs 375px)

No route overflowed horizontally at either width on either host (`scrollWidth > innerWidth` was false everywhere). Every route below was checked at both widths on both hosts unless noted.

| Route | Staging | Live |
|---|---|---|
| `/` (home) | pass | pass |
| `/regional-news` | pass | pass |
| `/regional-news/2025-eda-s-investment-priorities` (article) | pass | pass |
| `/regional-news/resources` | pass | pass |
| `/regional-events` | pass | pass |
| `/regional-events/workforce-housing-infrastructure-developers-summit` | pass | pass |
| `/economic-development-programs` | pass | pass |
| `/economic-development-programs/housing` | pass | pass |
| `/economic-development-initiatives` | pass | pass |
| `/economic-development-initiatives/critical-infrastructure-adaptation-and-expansion` | pass | not loaded in the browser (see crawl) |
| `/economic-development-services` | pass | pass |
| `/reporting` | pass | pass |
| `/regional-organization` | pass | pass |
| `/regional-partnerships` | pass | pass |
| `/regional-profile` | pass | pass |
| `/how-to-apply` | pass | pass |
| `/regional-housing-forecast` | pass | not loaded in the browser |
| `/regional-housing-forecast/broome-county` | pass | pass |

Not loaded in the browser on live: the initiative detail and the housing index. Both are in the HTML crawl. Within the live crawl, the initiative detail has the same title and `<h1>` on both hosts.

Two smaller notes, the same on both hosts:
- `/regional-partnerships` has no `<h1>`.
- The event and program detail `<h1>` has double spacing on staging (`Event:  Workforce…`) where live has a newline (`Event: \n   Workforce…`). The words match.

## Page content and SEO (server-rendered HTML)

Visible text differs on 105 of 108 routes. Most of that is whitespace and markup from the new renderer. The differences that matter:

- **Titles:** the only real title differences are on two news articles. The live one returns 500, so its title is blank there.
- **Canonical:** staging emits `<link rel="canonical">` on every page; live emits none.
- **Robots:** staging emits `index, follow, max-image-preview:large, …` on every page; live emits no robots meta. On staging, `/regional-housing-forecast/*` should carry `noindex`; the crawl recorded the robots value but did not check the noindex rule against the routeRules.
- **Twitter card:** staging has `summary_large_image` on detail pages (16 routes differ); live has no Twitter card tags.
- **Descriptions:** length differs on 27 routes. Live `/regional-events` has an empty `<meta name="description">`; staging has a 93-character one.

## Share cards (one per page type)

| Page type | Example | Staging `og:image` (SSR) | Live `og:image` (SSR) | Result |
|---|---|---|---|---|
| Home | `/` | `st8-social.png` (absolute, southerntier8.org) | `st8-social.png` | Same |
| News article | `/regional-news/2025-eda-s-investment-priorities` | `https://southerntier8.org/_og/…` | `https://southerntier8.org/share-image/….jpg` (200) | Different scheme |
| Event detail | `/regional-events/workforce-housing-infrastructure-developers-summit` | `…/_og/…` | `…/share-image/…` | Different scheme |
| Program detail | `/economic-development-programs/housing` | `…/_og/d/…` → **404** (application/json) | `…/share-image/111609d6….jpg` → 200 | **Staging share card is broken on the preview** |
| Initiative detail | `/economic-development-initiatives/critical-infrastructure-adaptation-and-expansion` | `st8-social.png` | `st8-social.png` | Same (no per-page card on either) |
| Resources | `/regional-news/resources` | `st8-social.png` | `st8-social.png` | Same |
| Events list | `/regional-events` | `st8-social.png` | `st8-social.png` | Same |
| Housing county | `/regional-housing-forecast/broome-county` | `/images/social/housing…` | same | Same |

**Duplicate `og:image` on staging detail pages.** After hydration, the program detail page on staging has two `og:image` tags: the page's card (`/_og/…`) and the site default (`st8-social.png`). Live has one. Crawlers may take either. The default comes from `app.head` in `nuxt.config.ts` and is not removed when a page sets its own card.

**Why the staging card is broken.** `site.url` is hard-coded to `https://southerntier8.org` in `nuxt.config.ts`, so the preview's card URLs point at the live host. The live host does not serve `/_og` yet, so the card 404s until the cutover moves that host. Cards should resolve after cutover.

## Gated resources and the request form

The CMS has **3 published gated file resources** (`require_info: true`):

| Item id | Title |
|---|---|
| 4 | The Region's 5-year Plan (Comprehensive Economic Development Strategy: CEDS) |
| 70 | Broadband Access Report |
| 73 | 2022 Report on the Availability, Reliability and Cost of High-Speed Broadband Services in NYS |

- **Staging `/regional-news/resources`, checked in the DOM:** all three gated titles render as plain `DIV` cards with **no `<a>` ancestor and no `href`**. Passes. The page has 39 asset links on the other cards.
- **Staging, hydration payload:** the three file ids (`bc3e18dc…`, `4ba37b46…`, `7c356ca0…`) appear in the `__NUXT_DATA__` payload, though not in any `href`. The file id is readable from page source, and the asset URL is one step away. This is a leak to decide on before cutover.
- **Live `/regional-news/resources`:** 41 cards, none with an `href`. Live does not expose file links at all, so no gated link leaks there.
- **Request form:** not submitted (it sends personal data). It opens from a gated card (`ResourceRequestDialog`, `POST /api/resource-requests`). The field set was read in the code only. Not verified on either host.

## Client-side navigation requests

On staging, during real client-side navigation (Resource Timing API):

- Home → `/regional-news`: 37 new requests. **0 non-asset requests to `manage.southerntier8.org`.** All requests that did go to `manage.` were image fetches under `/assets/`. Data calls go through `/api/cms` on the preview host.
- `/regional-news` → a news article: 1 `/api/cms/items/news` call on the preview host; **0** non-asset calls to `manage.`.

Pass.

## Analytics

- **Staging:** loads `gtag/js?id=G-2L5KBV6N3L` (GA4) and sends a hit on client navigation (confirmed to `/regional-events`).
- **Live:** loads `google-analytics.com/analytics.js` (Universal Analytics script) and sends hits on client navigation (confirmed to `/regional-events`). The UA property id was not visible. The site's config notes that UA stopped collecting in 2023, so the live property should be checked before cutover.
- **Live SSR HTML** has no `G-` or `UA-` id, so the script is injected client-side.

The GA4 property sent from staging is the one the config names. Confirm that this, not the UA property, is the one the team reads from.

## Summary of differences to act on

1. **Live 500** on `/regional-news/workforce-housing-infrastructure-summit-november-18-2026`. Staging renders it.
2. **Staging share cards point at the live host**, and the program card 404s there today. Cards should work after cutover.
3. **Duplicate `og:image`** on staging detail pages: the page card and the site default both appear.
4. **Gated resource file ids appear in the hydration payload** on staging. Titles and cards have no `href`, so this is the only leak.
5. **Staging adds canonical, robots and Twitter card tags** that live lacks. Confirm they are intended.
6. **Analytics:** staging sends GA4 hits; live sends UA hits from `analytics.js`. Confirm which property the team reads.
7. **Not verified:** the request form, and the live initiative detail and housing index in the browser. The HTML crawl covers them.

## Fix list

Proposed fixes, in priority order. Status is noted per item. Each item names the place to start; confirm the cause before changing code.

| # | Finding | Where to start | Proposed fix | Before cutover? |
|---|---|---|---|---|
| 1 | Live 500 on the workforce summit article | Live is the old site, so the fix is in the live app, not this branch. Check the record in the CMS (`news`, slug `workforce-housing-infrastructure-summit-november-18-2026`) for a field the old site cannot parse | Fix the record or the old site's handling of it. Staging already renders it, so the record itself is fine on the new app | Yes, if live keeps serving this URL at cutover |
| 2 | **Done (on this branch, not deployed).** Staging share cards point at `https://southerntier8.org/_og/…` and 404 today | `shared/utils/share.ts:6` (`SITE_URL`) and `nuxt.config.ts` `site.url` | Build preview card URLs from the request's own origin, or accept that cards work only after cutover. Decide which before testing previews | Yes, for preview sign-off |
| 3 | Staging detail pages emit two `og:image` tags (page card plus site default) | `nuxt.config.ts` `app.head.meta` (the default `og:image`) and `app/composables/useShareMeta.ts` (the page card, via `useSeoMeta`) | Drop the default `og:image` for pages that set their own card, or set the default only when a page sets none | Yes. Two images give crawlers a choice |
| 4 | Gated resource file ids appear in the hydration payload | `app/components/now/ResourceCardData.vue` and `ResourceCardVertical.vue` hide the href, but the payload still carries `file.id` | Strip `file` from gated rows in the server fetch, or fetch `file.id` only for non-gated rows, so the payload never holds a gated id | Decide before cutover. The leak is an id, not a link, so it is lower severity |
| 5 | Staging emits canonical, robots and Twitter tags that live lacks | `nuxt.config.ts` and `useShareMeta.ts` | No change if intended. Confirm with the team | Confirm only |
| 6 | Live sends Universal Analytics hits; staging sends GA4 | `nuxt.config.ts` `gtag.id` (`G-2L5KBV6N3L`) and the live app's analytics snippet (not in this repo) | Confirm which property the team reads. Keep GA4 on the new site and point reports at it | Yes, so traffic is not split across two properties at cutover |
| 7 | Request form not exercised in the browser | `app/components/layout/ResourceRequestDialog.vue` and `server/api/resource-requests.post.ts` | Test with a local dev build or a staging test record. Do not submit real personal data | Yes, before cutover |

### Share-card host fix (status: done on the branch)

- `nuxt.config.ts`: `site.url` and `runtimeConfig.public.siteUrl` come from `NUXT_PUBLIC_SITE_URL`, defaulting to `https://southerntier8.org`.
- `app/composables/useShareMeta.ts`: image URLs built on `SITE_URL` are rewritten to the configured origin. `og:url` still uses `SITE_URL`, so Facebook share history is not split.
- `.env.example`: documents the variable.

Verified: `pnpm typecheck` passes. A build with `NUXT_PUBLIC_SITE_URL=http://localhost:3010` puts the generated card (`/_og/…`), the static default and the twitter image on that origin, `og:url` stays on the live host, and the generated card returns 200 image/png. A build without the variable keeps every URL on `https://southerntier8.org`, so live output is unchanged.

**To deploy:** set `NUXT_PUBLIC_SITE_URL=https://staging.southerntier8.org` on the Vercel preview environment only, not production. It is read at build time, so redeploy the preview after setting it.

**Side effect to check:** with the variable set, the preview's canonical link, sitemap and robots output also use the preview origin (they read `site.url`). Confirm that a preview should be allowed to publish those, since a preview that is indexable would compete with the live site.

Not changed here: the duplicate `og:image` (item 3) and the gated file ids in the payload (item 4).
