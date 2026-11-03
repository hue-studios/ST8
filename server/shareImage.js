// Serves a page's share card from this host instead of pointing crawlers at the CMS.
//
// The Directus instance answers robots.txt with `Disallow: /` — its shipped default, which keeps
// the admin app out of search results — and Facebook's crawler reads robots.txt before it will
// download an og:image. So a card hosted there never gets fetched: the Sharing Debugger reports
// the image as still being "processed asynchronously" and the card goes out with no picture,
// however correct the tags are. This host has no robots.txt, so proxying the render through it
// puts the file somewhere crawlers will take it.
//
// Registered as serverMiddleware in nuxt.config.js, which Bridge turns into a real nitro route.

import {
  defineEventHandler,
  getRouterParam,
  sendRedirect,
  setResponseHeaders,
  setResponseStatus,
} from 'h3'
import { OG_WIDTH, OG_HEIGHT, DEFAULT_CARD } from '../config/share'

// nuxt.config's `env` is a build-time substitution for the app bundle and does not reach this
// handler, so read the CMS host the same way nuxt.config does.
const CMS_URL = (
  process.env.DIRECTUS_URL || 'https://manage.southerntier8.org'
).replace(/\/$/, '')

const ASSET_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, '_') || '').replace(/\.jpe?g$/i, '')

  // Asset ids only, so the route cannot be aimed at another host or used as a general resizer.
  if (!ASSET_ID.test(id)) {
    setResponseStatus(event, 404)
    return 'Not found'
  }

  const upstream =
    CMS_URL +
    '/assets/' +
    id +
    '?width=' +
    OG_WIDTH +
    '&height=' +
    OG_HEIGHT +
    '&fit=cover&format=jpg&quality=80'

  const res = await fetch(upstream).catch(() => null)
  // A deleted or broken file should still leave the page with a card rather than a blank space.
  if (!res || !res.ok) {
    return sendRedirect(event, DEFAULT_CARD, 302)
  }

  setResponseHeaders(event, {
    'content-type': 'image/jpeg',
    // The URL carries the asset id, so it changes whenever an editor uploads a different file.
    // s-maxage keeps the render on the CDN so crawler traffic does not re-run this handler.
    'cache-control': 'public, max-age=86400, s-maxage=2592000',
  })
  return Buffer.from(await res.arrayBuffer())
})
