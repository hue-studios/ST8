import { createHash } from 'node:crypto'
import { createCmsClient } from '../../shared/utils/cms'

/** How long any one CMS or upstream request may take before it counts as failed (the same as an erroring CMS). */
export const UPSTREAM_TIMEOUT_MS = 5000

/** `fetch` that gives up after UPSTREAM_TIMEOUT_MS. Use it for every request to the CMS or another upstream. */
export function fetchWithTimeout(input: string | URL, init: RequestInit = {}) {
  return fetch(input, { ...init, signal: init.signal ?? AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) })
}

/** An error response from the CMS. Thrown (so Nitro does not cache it) and turned back into a response by cmsRead. */
class CmsStatusError extends Error {
  constructor(public status: number, public body: string) {
    super(`CMS answered ${status}`)
  }
}

// Empty answers ({"data":[]} for an unknown slug) are not worth a cache entry, and slug probing would fill the cache.
const EMPTY = /^\{"data":(\[\]|null)\}$/

// After a timeout or network failure, further uncached reads fail at once for a short while instead of each waiting
// out its own 5 seconds: a page makes several reads, and a hung CMS would otherwise cost it 5 seconds per step.
let unreachableUntil = 0
const BACK_OFF_MS = 15_000

const readUpstream = defineCachedFunction(
  async (pathAndQuery: string) => {
    if (Date.now() < unreachableUntil) throw new Error('The CMS did not answer a moment ago')
    const res = await fetchWithTimeout(`${useRuntimeConfig().public.directusUrl}${pathAndQuery}`, {
      headers: { accept: 'application/json' },
    }).catch((error) => {
      unreachableUntil = Date.now() + BACK_OFF_MS
      throw error
    })
    const body = await res.text()
    if (!res.ok) throw new CmsStatusError(res.status, body)
    return { status: res.status, body, cacheable: !EMPTY.test(body) }
  },
  {
    name: 'cms',
    // Nitro strips every non-word character from a key, so two queries that differ only in punctuation would share
    // an entry. A hash keeps each distinct request distinct.
    getKey: (pathAndQuery: string) => createHash('sha1').update(pathAndQuery).digest('hex'),
    // Editors' changes show up within about five minutes. Stale entries are served while the next read runs in the
    // background, and for up to a day if the CMS is down (a failed refresh keeps the stale entry).
    maxAge: 60 * 5,
    staleMaxAge: 60 * 60 * 24,
    swr: true,
    validate: entry => entry.value?.cacheable !== false,
  },
)

/** One cached, timed GET of a CMS path with its query string, e.g. `/items/news?limit=1`. Throws on timeout/network. */
export async function cmsRead(pathAndQuery: string): Promise<{ status: number, body: string }> {
  try {
    const { status, body } = await readUpstream(pathAndQuery)
    return { status, body }
  }
  catch (error) {
    if (error instanceof CmsStatusError) return { status: error.status, body: error.body }
    throw error
  }
}

/** A `fetch` for the SDK that answers from cmsRead, so server code shares the cache with the browser proxy. */
const cachedFetch: typeof fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
  if ((init?.method || 'GET').toUpperCase() !== 'GET') return fetchWithTimeout(url, init)
  const { status, body } = await cmsRead(url.pathname + url.search)
  return new Response(body, { status, headers: { 'content-type': 'application/json' } })
}

/**
 * Directus client for server routes (sitemap, search index, share cards later). Public and tokenless, like the
 * browser's: the site reads only what the public role may read. The admin DIRECTUS_TOKEN is for scripts/ only and is
 * never read by app or server code. Reads go through the same cache as pages.
 */
export function getDirectus() {
  return createCmsClient(useRuntimeConfig().public.directusUrl, cachedFetch)
}
