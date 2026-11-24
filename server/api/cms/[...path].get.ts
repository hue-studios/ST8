// The only way pages read the CMS. During a server render the app calls this route in-process (no network hop); on
// client-side navigation the browser calls it on this site's own origin, so it never talks to the CMS directly (the
// CMS's CORS only allows the live origin, which broke previews and localhost). Answers come from the shared cache in
// server/utils/directus.ts. Read-only, public collections only.
const COLLECTIONS = new Set([
  'counties', 'events', 'home', 'housing_page', 'how_to_apply', 'initiatives', 'news', 'organization', 'partners',
  'people', 'programs', 'reporting', 'resources', 'services',
])

export default defineEventHandler(async (event) => {
  const path = '/' + (getRouterParam(event, 'path') || '')
  const match = /^\/items\/([a-z_]+)$/.exec(path)
  const query = new URL(event.path, 'http://localhost').search
  if (!match || !COLLECTIONS.has(match[1]!) || query.length > 4000) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  let result
  try {
    result = await cmsRead(path + query)
  }
  catch (error) {
    console.error('cms: read failed', path, error)
    throw createError({ statusCode: 504, statusMessage: 'The CMS did not answer' })
  }

  setResponseStatus(event, result.status)
  setResponseHeader(event, 'content-type', 'application/json')
  // Only good answers are shared by the CDN; the browser keeps nothing so a refresh after an edit is never stale for long.
  setResponseHeader(
    event,
    'cache-control',
    result.status === 200 ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' : 'no-store',
  )
  return result.body
})
