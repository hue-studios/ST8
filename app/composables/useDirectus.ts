/**
 * The typed, public Directus client (see shared/utils/cms.ts). Use inside useAsyncData / useFetch:
 *
 *   const directus = useDirectus()
 *   const { data } = await useAsyncData('programs', () => directus.request(readItems('programs', { ... })))
 *
 * Nested field paths ('counties.counties_id.title') are what the pages ask for; they go through `fields` cast as
 * `never`, because the SDK's deep-field types are far stricter than the string paths Directus accepts.
 */
export function useDirectus() {
  return createCmsClient(useRuntimeConfig().public.directusUrl)
}
