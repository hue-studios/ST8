import type { H3Event } from 'h3'

// A small sliding-window limiter kept in this server instance's memory. On Vercel each instance counts on its own, so
// a limit here is "at most N per instance": enough to stop one client hammering a route, not a global quota. A hard
// site-wide limit belongs in a Vercel Firewall rate-limit rule.

const windows = new Map<string, number[]>()
// Past this many tracked keys, expired ones are swept; if that frees nothing the oldest are dropped, so the map can
// never grow without bound however many addresses or emails it sees.
const MAX_KEYS = 10_000

function sweep(now: number, windowMs: number) {
  for (const [key, hits] of windows) {
    if (!hits.length || now - hits[hits.length - 1]! >= windowMs) windows.delete(key)
  }
  if (windows.size < MAX_KEYS) return
  let excess = windows.size - MAX_KEYS + 1
  for (const key of windows.keys()) {
    if (excess-- <= 0) break
    windows.delete(key)
  }
}

/**
 * Records one hit for `key` and says whether it went over `limit` hits in the last `windowMs`. A refused hit is not
 * counted, so a client that backs off gets back in once its window clears.
 */
export function overRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const hits = (windows.get(key) || []).filter(t => now - t < windowMs)
  if (hits.length >= limit) {
    windows.set(key, hits)
    return true
  }
  hits.push(now)
  if (!windows.has(key) && windows.size >= MAX_KEYS) sweep(now, windowMs)
  windows.set(key, hits)
  return false
}

/**
 * The caller's address. On Vercel the edge sets x-forwarded-for itself (a client cannot forge the first entry).
 * Undefined when there is none (local tools), in which case callers skip the per-address limit.
 */
export function clientAddress(event: H3Event): string | undefined {
  return getRequestIP(event, { xForwardedFor: true }) || undefined
}

/** Throws 429 with a Retry-After when `key` is over its limit. */
export function enforceRateLimit(event: H3Event, key: string, limit: number, windowMs: number, message: string) {
  if (!overRateLimit(key, limit, windowMs)) return
  setResponseHeader(event, 'retry-after', Math.ceil(windowMs / 1000))
  throw createError({ statusCode: 429, statusMessage: message })
}
