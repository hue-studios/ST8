/**
 * The typed, public Directus client (see shared/utils/cms.ts). Use inside useAsyncData / useFetch:
 *
 *   const directus = useDirectus()
 *   const { data } = await useAsyncData('programs', () => directus.request(readItems('programs', { ... })))
 *
 * Reads never go straight to the CMS. They go to this site's own /api/cms route (server/api/cms), which answers from
 * a cache and gives up on a hung CMS after 5 seconds. During a server render that route is called in-process; in the
 * browser it is a same-origin request, so client-side navigation also works on previews and localhost, where the
 * CMS's CORS rules would refuse the browser.
 *
 * Nested field paths ('counties.counties_id.title') are what the pages ask for; they go through `fields` cast as
 * `never`, because the SDK's deep-field types are far stricter than the string paths Directus accepts.
 */
export function useDirectus() {
  const origin = useRequestURL().origin
  const event = import.meta.server ? useRequestEvent() : undefined

  const viaSite: typeof fetch = (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
    const local = url.pathname + url.search
    if (event) return (event as unknown as { fetch: typeof fetch }).fetch(local, init)
    return fetch(local, { ...init, signal: init?.signal ?? AbortSignal.timeout(8000) })
  }
  return createCmsClient(`${origin}/api/cms`, viaSite)
}
