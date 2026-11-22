# Upgrade porting notes (Nuxt 2 to Nuxt 4)

For sessions 3 and 4. Read this instead of working the pattern out again. The reference port is the Programs
listing and detail: `app/pages/economic-development-programs/index.vue` and `[slug].vue`. Old files wait in `legacy/`;
**delete each one as you port it.** Compare against live at 1024px and 375px wide.

## A page, before and after

| Nuxt 2 | Nuxt 4 |
|---|---|
| `pages/x/_slug.vue`, Options API | `app/pages/x/[slug].vue`, `<script setup lang="ts">` |
| `asyncData({ $axios, params })` | `await useAsyncData(() => key, () => directus.request(readItems(...)))` with `const directus = useDirectus()` |
| `/items/x?fields=a.b.c&filter[status][_eq]=published` | `readItems('x', { fields: [...] as never, filter: { status: { _eq: 'published' } }, limit: -1 })` (nested field paths need the `as never` cast) |
| `error({ statusCode: 404 })` | `throw createError({ statusCode: 404, statusMessage, fatal: true })` |
| `head()` + `shareMeta()` | `useShareMeta({ title, description, path, image, imageAlt })`, after the data is awaited |
| `$store.getters.orgAsset(f, key)` | `const { orgAsset } = useOrganization()` |
| `process.env.imageUrl + id + '?key=small'` | `const asset = useAsset()`, then `asset(id, 'small')` (becomes `<NuxtImg>` in session 5) |
| `$moment(d).format('dddd MMMM Do, YYYY')` | `formatDate(d, 'EEEE MMMM do, yyyy')` (date-fns tokens; New York wall time, same on server and browser) |
| `<nuxt-link>`, `components: { x }` | `<NuxtLink>`; components auto-register from their folder: `components/programs/ProgramCard.vue` is `<ProgramsProgramCard>` |
| `data()` / `mounted` / `beforeDestroy` | `ref`, `onMounted`; `useEventListener` from VueUse removes its own scroll listeners |
| `vue-awesome-swiper` | `<CardSwiper :items preset="resources" | "programs">` with an `#default="{ item }"` slot |
| `layout: 'error'`, Vuex `page` | the route name is a class on the container in `layouts/default.vue` |

`shared/utils/` auto-imports on both sides: `formatDate`, `truncate`, `removeTags`, `cardText`, `shareCard`,
`staticCard`, `DEFAULT_CARD`, `PROGRAM_FIELDS`, `pruneUnresolvedLinks`. `shared/types/st8.ts` holds the shapes the pages read.
The CMS client prunes unreadable (draft) link rows in every response, as `plugins/directus.js` did.

## Styles

- The Sass is unchanged: put `<style lang="scss">@use '~/assets/scss/pages/x';</style>` in the page, as before.
- In the Sass, `nuxt-link-*` is now `router-link-*` and `.x-enter` is `.x-enter-from` (done in `app/assets/scss`).
- **Cascade order is deliberate.** Tailwind utilities are unlayered and load before the Sass (see the top of
  `app/assets/css/main.css`), so they tie with the Sass exactly as on Tailwind 3. Do not switch to `@import 'tailwindcss'`.
  Swiper's own CSS is in a low `vendor` layer for the same reason; third-party CSS that sets `display` or `padding`
  on a class you also style with a utility belongs there too.
- Tailwind 3 to 4 renames to apply when a page uses them: `shadow` is `shadow-sm`, `shadow-sm` is `shadow-xs`,
  `rounded` is `rounded-sm`, `flex-shrink(-0)` is `shrink(-0)`, `focus:outline-none` is `focus:outline-hidden`,
  `focus:shadow-outline` is gone. The theme already restores the old palette, `xs` breakpoint, letter-spacing,
  border colour and font-size line-heights.

## Wrappers, never `ui/`

Pages and feature components never import from `components/ui/` (shadcn-vue output, never hand-edited; `pnpm check:ui`
verifies it). Use the ST8 wrappers in `app/components/st8/`, all auto-registered:
`St8Button` (`variant="brand"` is the green call to action), `St8Input`, `St8Textarea`, `St8Label`, `St8Field`
(label, control slot, description, `error`), `St8Dialog` (`v-model:open`, `title`), `St8Sheet`, `St8Accordion`
(`items` plus a slot per value), `St8Toaster` (mounted in `app.vue`; call `toast()` from `vue-sonner`). Need another
base component: `pnpm exec shadcn-vue add <name>`, then wrap it the same way.

## Things to know

- **The browser cannot call the CMS from the preview or localhost**: its CORS allows only the live origin. Fetch on the
  server (as the Programs "Explore" row now does). The resource request form posts to the `requests` collection, so
  give it a server route that forwards the post rather than a browser-to-CMS call.
- Routes not yet ported answer with a placeholder from `app/pages/[...slug].vue`; remove a prefix from its `PENDING`
  list when you add the page (a real page file wins automatically). `housing.vue` is a placeholder file because
  `economic-development-programs/[slug].vue` would otherwise treat `housing` as a program.
- The resource request overlay (`legacy/components/layout/resourceInfo.vue`) is not in the layout yet; session 3 rebuilds
  it with `St8Dialog` and `St8Field`.
- `vee-validate` takes zod 4 schemas directly (Standard Schema); there is no `@vee-validate/zod`.
