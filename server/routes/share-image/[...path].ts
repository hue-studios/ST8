// Serves a page's share card from this host instead of pointing crawlers at the CMS.
//
// The Directus instance answers robots.txt with `Disallow: /`, which keeps the admin app out of search results, and
// Facebook's crawler reads robots.txt before it downloads an og:image, so a card hosted there is never fetched: the
// Sharing Debugger reports the image as "processed asynchronously" and the card goes out with no picture. This host
// has no such robots rule for /share-image, so proxying the render through it puts the file where crawlers will take
// it. The images session replaces this with nuxt-og-image and keeps this path as a redirect.
import { DEFAULT_CARD, OG_HEIGHT, OG_WIDTH } from '../../../shared/utils/share'

const ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'path') || '').replace(/\.jpe?g$/i, '')

  // Asset ids only, so the route cannot be aimed at another host or used as a general resizer.
  if (!ASSET_ID.test(id)) {
    setResponseStatus(event, 404)
    return 'Not found'
  }

  const upstream = `${useRuntimeConfig().public.directusUrl}/assets/${id}?width=${OG_WIDTH}&height=${OG_HEIGHT}&fit=cover&format=jpg&quality=80`

  const res = await fetchWithTimeout(upstream).catch(() => null)
  // A deleted or broken file should still leave the page with a card rather than a blank space.
  if (!res || !res.ok) {
    return sendRedirect(event, DEFAULT_CARD, 302)
  }

  setResponseHeaders(event, {
    'content-type': 'image/jpeg',
    // The URL carries the asset id, so it changes whenever an editor uploads a different file. s-maxage keeps the
    // render on the CDN so crawler traffic does not re-run this handler.
    'cache-control': 'public, max-age=86400, s-maxage=2592000',
  })
  return Buffer.from(await res.arrayBuffer())
})
