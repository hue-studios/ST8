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

// --- Query shape -------------------------------------------------------------------------------------------------

// The only query parameters the site's reads use (the SDK's readItems / readSingleton with fields, filter, sort, limit
// and the news count's aggregate), in the order the canonical form writes them.
const PARAMS = ['fields', 'filter', 'sort', 'limit', 'aggregate'] as const
const FIELD = /^[a-z0-9_]+(\.[a-z0-9_]+)*$/i
const SORT = /^-?[a-z0-9_]+(\.[a-z0-9_]+)*$/i
const LIMIT = /^(-1|[1-9]\d{0,3})$/

function jsonObject(value: string): string | null {
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? JSON.stringify(parsed) : null
  }
  catch {
    return null
  }
}

/**
 * The one spelling of a CMS read's query string, or null if it asks for anything the site never does. Unknown or
 * repeated parameters, `*` in fields, and malformed JSON are refused, and the rest is written in a fixed order with
 * fields sorted, so a query cannot be varied (a random extra parameter, a reshuffled field list) to dodge the cache.
 */
export function canonicalQuery(search: string): string | null {
  const params = new URLSearchParams(search)
  const out = new URLSearchParams()
  const seen = new Set<string>()
  for (const key of params.keys()) {
    if (seen.has(key) || !(PARAMS as readonly string[]).includes(key)) return null
    seen.add(key)
  }
  for (const key of PARAMS) {
    const value = params.get(key)
    if (value === null) continue
    let clean: string | null = null
    if (key === 'fields') {
      const fields = [...new Set(value.split(',').map(f => f.trim()))]
      clean = fields.length && fields.every(f => FIELD.test(f)) ? fields.sort().join(',') : null
    }
    else if (key === 'sort') {
      const fields = value.split(',').map(f => f.trim())
      clean = fields.every(f => SORT.test(f)) ? fields.join(',') : null
    }
    else if (key === 'limit') {
      clean = LIMIT.test(value) ? value : null
    }
    else {
      clean = jsonObject(value)
    }
    if (clean === null) return null
    out.set(key, clean)
  }
  const query = out.toString()
  return query ? `?${query}` : ''
}

// --- Upstream reads ----------------------------------------------------------------------------------------------

// Empty answers ({"data":[]} for an unknown slug) are not worth a cache entry, and slug probing would fill the cache.
const EMPTY = /^\{"data":(\[\]|null)\}$/

// After a few timeouts or network failures in a row, further uncached reads fail at once for a short while instead of
// each waiting out its own 5 seconds: a page makes several reads, and a hung CMS would otherwise cost it 5 seconds per
// step. One slow answer is not enough to trip it (a single heavy query must not take uncached pages down for every
// visitor), and any answer from the CMS resets the count.
const FAILURES_TO_BACK_OFF = 3
const BACK_OFF_MS = 15_000
let failuresInARow = 0
let unreachableUntil = 0

async function fetchUpstream(pathAndQuery: string) {
  if (Date.now() < unreachableUntil) throw new Error('The CMS did not answer a moment ago')
  const res = await fetchWithTimeout(`${useRuntimeConfig().public.directusUrl}${pathAndQuery}`, {
    headers: { accept: 'application/json' },
  }).catch((error) => {
    if (++failuresInARow >= FAILURES_TO_BACK_OFF) {
      unreachableUntil = Date.now() + BACK_OFF_MS
      failuresInARow = 0
    }
    throw error
  })
  failuresInARow = 0
  const body = await res.text()
  if (!res.ok) throw new CmsStatusError(res.status, body)
  return { status: res.status, body, cacheable: !EMPTY.test(body) }
}

const MAX_AGE_S = 60 * 5
const STALE_MAX_AGE_S = 60 * 60 * 24

const cacheKey = (pathAndQuery: string) => createHash('sha1').update(pathAndQuery).digest('hex')

const readCached = defineCachedFunction(fetchUpstream, {
  name: 'cms',
  // Nitro strips every non-word character from a key, so two queries that differ only in punctuation would share
  // an entry. A hash keeps each distinct request distinct.
  getKey: cacheKey,
  // Editors' changes show up within about five minutes. Stale entries are served while the next read runs in the
  // background, and for up to a day if the CMS is down (a failed refresh keeps the stale entry).
  maxAge: MAX_AGE_S,
  staleMaxAge: STALE_MAX_AGE_S,
  swr: true,
  validate: entry => entry.value?.cacheable !== false,
})

// The cache keys this instance has written, with when each was last used. The cache lives in the instance's memory, so
// the number of entries is capped: once MAX_ENTRIES distinct reads are held, a new read is answered straight from the
// CMS without being stored, and the pages' own reads (already cached) keep their entries.
const MAX_ENTRIES = 2000
const ENTRY_LIFETIME_MS = (MAX_AGE_S + STALE_MAX_AGE_S) * 1000
const entries = new Map<string, number>()

function mayCache(key: string): boolean {
  const now = Date.now()
  if (entries.has(key) || entries.size < MAX_ENTRIES) {
    entries.set(key, now)
    return true
  }
  for (const [k, used] of entries) {
    if (now - used >= ENTRY_LIFETIME_MS) entries.delete(k)
  }
  if (entries.size >= MAX_ENTRIES) return false
  entries.set(key, now)
  return true
}

/** One cached, timed GET of a CMS path with its query string, e.g. `/items/news?limit=1`. Throws on timeout/network. */
export async function cmsRead(pathAndQuery: string): Promise<{ status: number, body: string }> {
  try {
    const { status, body } = mayCache(cacheKey(pathAndQuery))
      ? await readCached(pathAndQuery)
      : await fetchUpstream(pathAndQuery)
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
  // The same spelling the proxy uses, so a server read and a page read of the same thing share one entry.
  const { status, body } = await cmsRead(url.pathname + (canonicalQuery(url.search) ?? url.search))
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
