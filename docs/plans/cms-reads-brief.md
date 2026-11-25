# Brief: make the CMS reads more efficient

Paste this into a fresh session. Model: Sonnet 5.5. Start it in its own worktree, from `master` after the Nuxt 4
cutover (or from `upgrade/nuxt-4` if cutover has not happened yet). If the caching changes turn out large, run one
Opus `/code-review` on the result.

```text
Make the ST8 site's reads from Directus more efficient. Repo: /Users/peterhoffman/Sites/ST8/ST8 (Nuxt 4, Directus SDK, deployed on Vercel). Start from master if the Nuxt 4 cutover has merged, otherwise from upgrade/nuxt-4. Work on your own branch and commit at the end; do not push or merge.

Context
- The site is small but every page is built from Directus data at manage.southerntier8.org (staff-managed content; the site reads it with the public role, no token). Content changes a few times a week, not by the minute.
- Read first: docs/plans/upgrade-porting-notes.md and the "Keeping token use down" section of docs/plans/search-services-podcast-updates.md. Do not read the whole plan.
- The CMS client is shared/utils/cms.ts (createCmsClient, prunes unreadable link rows). The browser uses app/composables/useDirectus.ts, server routes use server/utils/directus.ts.
- app/plugins/site-data.server.ts makes two CMS reads (organization singleton, footer initiatives) before every server render, on every route.
- Pages read with useAsyncData + readItems/readSingleton in app/pages/**. The home page (app/pages/index.vue) makes seven reads, including two count aggregates. Detail pages ([slug].vue) read one record plus related rows.
- On client-side navigation, useAsyncData runs in the browser and calls Directus directly. The CMS's CORS only allows the live origin, so this fails on previews and localhost.
- server/api/__sitemap__/urls.ts, server/api/calendar.get.ts (already cached 10 min), server/routes/share-image/[...path].ts and nuxt-og-image cards also call the CMS.
- No CMS call has a timeout. A hung CMS holds every render until Vercel's function limit runs out.

Goal
Fewer, smaller, cached CMS reads, with no change to what any page shows. In order of value:
1. Measure first. List every CMS request a cold render of each route makes (count, fields, payload size, time). Report the baseline before changing anything.
2. Cache on the server. Pick one approach and justify it: Nitro cached server routes that pages call through useFetch (the browser then never talks to Directus, which also fixes the CORS problem on previews), and/or routeRules swr/isr for pages. Organization and footer data should be read about once per cache window, not once per request. Note how editors' changes show up: a short TTL is acceptable; a Directus Flow webhook that purges the cache is a bonus, so describe it, but do not build anything in Directus.
3. Trim fields. Replace '*' and 'x.*' (for example organization fields ['*'] on regional-organization, featured_resource.* on home, resources '*') with the fields the templates actually use. Check each template before removing a field.
4. Merge reads where it is safe (for example, one request plus a count instead of separate aggregates), and keep the payload Nuxt serialises into the page small.
5. Add a timeout of about 5 seconds to every CMS and upstream fetch, so a hung CMS falls back the same way an erroring one already does.

Constraints
- Same output: every route renders the same HTML content and the same share/SEO tags as before. Compare a few pages before and after (home, a news article, a program, events, the housing page).
- Keep the existing failure behaviour: optional sections fall back quietly, required data gives the 503/404 error page.
- Gated resources (require_info) must not expose their file URL in an href.
- Never use or read DIRECTUS_TOKEN in app or server code. Don't touch components/ui (shadcn output) or the Sass.
- pnpm typecheck passes today. Keep it passing.

Done when
- A short before/after table (requests per cold render, total payload, server render time) for the main routes is in docs/plans/cms-reads.md, along with the caching approach and how editors' changes reach the site.
- Changes are committed on your branch with a clear message, and you report anything you chose not to do and why.
```
