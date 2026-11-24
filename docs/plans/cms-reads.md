# CMS reads: what changed and why

Goal: fewer, smaller, cached reads from Directus (manage.southerntier8.org) with no change to what any page shows.
Measured on the production build (`nuxt build`, node-server preset) against the live CMS, one fresh server per route
for the cold numbers. Branch `perf/cms-reads`, cut from `upgrade/nuxt-4` (the Nuxt 4 cutover has not merged to master).

## Before and after

"Cold" is a render with an empty cache (first request after a deploy or on a new serverless instance). "Warm" is any
render inside the cache window. Requests and bytes are the CMS API calls the server made (images and `/assets` excluded;
that includes the organization and footer reads every page makes). HTML is the size of the page served.

| Route | Requests, cold (before → after) | CMS bytes, cold | Requests, warm | Server render, before (no cache) → after (warm) | HTML bytes |
|---|---|---|---|---|---|
| `/` | 9 → 8 | 77 KB → 40 KB | 0 | 1,548 ms¹ → 10 ms | 472 KB → 409 KB |
| `/economic-development-initiatives` | 3 → 3 | 3.8 KB | 0 | 294 → 6 ms | 245 KB |
| `/economic-development-initiatives/<slug>` | 4 → 4 | 13.6 KB | 0 | 417 → 6 ms | 271 KB |
| `/economic-development-programs` | 4 → 4 | 24.4 KB | 0 | 273 → 6 ms | 268 KB |
| `/economic-development-programs/<slug>` | 4 → 4 | 25.5 → 25.0 KB | 0 | 365 → 9 ms | 299 → 299 KB |
| `/economic-development-programs/housing` | 5 → 5 | 28.2 KB | 0 | 501 → 9 ms | 320 KB |
| `/economic-development-services` | 3 → 3 | 20.0 → 18.8 KB | 0 | 314 → 25 ms | 284 → 283 KB |
| `/how-to-apply` | 3 → 3 | 8.5 KB | 0 | 211 → 7 ms | 261 KB |
| `/regional-events` | 3 → 3 | 2.3 KB | 0 | 209 → 5 ms | 229 KB |
| `/regional-events/<slug>` | 3 → 3 | 2.3 KB | 0 | 166 → 5 ms | 235 KB |
| `/regional-news` | 3 → 3 | 148 KB | 0 | 350 → 9 ms | 465 → 338 KB |
| `/regional-news/resources` | 3 → 3 | 52.6 → 30.1 KB | 0 | 267 → 8 ms | 339 → 321 KB |
| `/regional-news/<slug>` | 3 → 3 | 2.1 KB | 0 | 219 → 5 ms | 233 KB |
| `/regional-organization` | 5 → 5 | 10.8 → 9.7 KB | 0 | 340 → 5 ms | 254 KB |
| `/regional-partnerships` | 3 → 3 | 12.6 KB | 0 | 204 → 27 ms | 269 KB |
| `/regional-profile` | 2 → 2 | 1.6 KB | 0 | 112 → 4 ms | 312 KB |
| `/reporting` | 3 → 3 | 1.8 KB | 0 | 199 → 5 ms | 227 KB |
| `/regional-housing-forecast` | 5 → 5 | 2.7 KB | 0 | 258 → 6 ms | 296 KB |
| `/regional-housing-forecast/<county>` | 3 → 3 | 16.4 KB | 0 | 621² → 6 ms | 302 KB |

¹ includes the process's first render. ² cold-start figure; the baseline warm figure was not taken for this route.

Reading the table honestly:

- **The big win is warm renders**: zero CMS requests, and a render drops from 0.1–0.5 s (CMS latency) to under 30 ms.
  Cold renders still make the same reads, because a cold render has an empty cache by definition; they are now at most
  one per cache window per instance.
- The cold request count only fell on the home page (the programs count is no longer a second request). Cold bytes fell
  where `*` was replaced with named fields (home, resources, services, organization).
- Page weight fell on `/regional-news` (the cards only show 120 characters of each article, so only 200 reach the page,
  not 150 KB of article HTML) and on the home page.
- Times are one run each on a laptop against the live CMS; treat them as orders of magnitude.
- Rendered output is identical: for every route above, the served HTML (markup, meta/share tags, JSON-LD) was compared
  before and after with the script tags, hashed asset names and signed card URLs normalised, and nothing differs.

## Caching approach

**One cached server route for every read, not `routeRules` swr/isr.**

- `server/api/cms/[...path].get.ts` answers `GET /api/cms/items/<collection>?<same query the SDK sends>`. It reads
  through `cmsRead()` in `server/utils/directus.ts`, a Nitro `defineCachedFunction` (key: hash of path+query, `maxAge`
  5 min, `swr`, stale entries kept up to a day).
- `useDirectus()` (`app/composables/useDirectus.ts`) points the SDK at that route. During a server render the call is
  made in-process (`event.fetch`, no network hop). In the browser it is a same-origin request. The browser therefore
  never talks to Directus for data, which fixes client-side navigation on previews and localhost (the CMS's CORS only
  allows the live origin). Verified in the browser pane: a click from `/` to `/regional-news` made one request to
  `/api/cms/items/news` and none to manage.southerntier8.org.
- `getDirectus()` (sitemap and future server code) uses the same cache.
- The route only serves a short list of collections (`counties events home housing_page how_to_apply initiatives news
  organization partners people programs reporting resources services`), only `/items/<collection>`, GET only.
- Good answers carry `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` so the Vercel CDN also shares
  browser-side reads. Errors are `no-store`.
- Organization and footer initiatives are read through the same cache, so about once per window per instance instead of
  once per request.
- Empty answers (an unknown slug returns `{"data":[]}`) and errors are not cached, so probing random slugs cannot fill
  the cache or pin a 404.

Why this and not page-level `routeRules` swr/isr: it caches at the read, so every page, the browser path, the sitemap
and the plugin all benefit and the 503/404 behaviour is untouched. Caching whole pages on the CDN would also cache a
503 render if the CMS blipped during a revalidation, and pages are cheap once the reads are cached (under 30 ms). It
can still be added later on top (for example `'/': { swr: 300 }`) without changing anything here.

Limit to know: the Nitro cache is in memory per serverless instance on Vercel, so each instance warms its own copy.
That is fine at this traffic. If it ever matters, point the `cache` storage at Vercel Runtime Cache or KV in
`nitro.storage`/`nitro.devStorage`; no other code changes.

### How editors' changes reach the site

A change in Directus shows up within about 5 minutes (the cache window), and within 5 minutes plus one visit if an
instance had gone quiet (the first visitor after the window gets the old copy while it refreshes in the background;
the next gets the new one). Editors who want to check a change sooner can wait a few minutes or load the page twice.

**Bonus, not built:** a Directus Flow on `items.create/update/delete` for the content collections can call a small
`POST /api/cms-purge` route (guarded by a shared secret in an env var, `NUXT_CMS_PURGE_SECRET`) that does
`useStorage('cache').clear('nitro:functions:cms')`. Add an `s-maxage`-aware purge (Vercel `revalidateTag`/purge API)
only if the CDN header above is lengthened. Per-instance memory means the purge reaches only the instance that gets
the webhook, so pair it with Runtime Cache/KV storage (above) before relying on it. Nothing was built in Directus.

## Timeouts and failure behaviour

- Every CMS and upstream fetch now gives up after 5 s (`fetchWithTimeout` in `server/utils/directus.ts`): CMS reads,
  the Google Calendar read, the share-image proxy and the resource-request post. The browser's request to `/api/cms`
  has an 8 s limit.
- A timeout is an error exactly like a failing CMS: optional reads (housing banner, calendar, footer) fall back
  quietly, required reads give the 503, an unknown slug the 404. Tested with the CMS pointed at a black hole: `/` gave a
  503 in 5.9 s, `/regional-profile` rendered with an empty footer in 5 s, and the next requests answered in ~10 ms.
- After one timeout the server fails further uncached reads immediately for 15 s (otherwise a page with three
  sequential reads waits 5 s for each). A stale cached entry, if any, is still served.

## Fields trimmed

| Where | Before | After |
|---|---|---|
| Home, featured resource | `featured_resource.*`, `programs.programs_id.*` | the card's fields (`resourceCardFields`) |
| Home, news | included `article` | dropped (the swiper card never shows it) |
| Home, programs + count | featured programs read plus a second count aggregate | one read of published programs; the featured ones are filtered in the page and the length is the count |
| Resources page | `*`, `cover_image.id`, `programs.programs_id.id` | card fields plus `category` |
| Services, News article | `resources.resources_id.*` | the cards' fields (`resourceFields`) |
| Organization page | `*` | `mission_statement`, `who_we_are`, `our_role`, `our_history` |
| Program pages | `news.news_id.article` | dropped (the news card never shows it) |
| News list | whole `article` in the page payload | first 200 characters of its text |

`require_info` is kept on every read that had it. Field lists live in `shared/utils/resources.ts` and
`shared/utils/programs.ts`.

## Not done, and why

- **No page-level `routeRules` swr/isr** (see above).
- **No batching of the home reads** (partners, news, housing banner, home, news count) into one request: Directus has
  no batch endpoint for REST and GraphQL would change every response shape. The news count stays an aggregate because
  it counts all published news, which a featured-only read cannot give.
- **`app/pages/regional-organization`** still makes its own read of four text fields; they are long and not worth
  carrying in the footer state on every page.
- **Detail pages** still read their related rows nested; trimming them further would change what they show.
- **nuxt-og-image** fetches the cover image it renders from the CMS's `/assets`; that is the module's own fetch, not a
  data read, so it has no timeout from this change.
- **Gated resources everywhere (done afterwards):** `ResourceCardVertical` and the Services page's resource cards now
  follow `ResourceCardData`: a gated file has no href and opens the request form. This needed `require_info` and the
  resource `id` on the program, housing and how-to-apply reads, so those cards' DOM ids now carry the real id instead of
  `undefined`. The gated file's id is still inside the page's serialised data, as it was for the existing card.
- **Purge webhook** described above, not built.
