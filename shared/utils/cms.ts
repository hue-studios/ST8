import { createDirectus, rest } from '@directus/sdk'
import type { Schema } from '#shared/directus/schema'

// Directus 12 returns linked items the visitor may not read (drafts, archived) as null,
// e.g. services.news = [{ id: 21, news_id: { … } }, { id: 22, news_id: null }]. Directus 8 exposed
// drafts publicly, so templates assume every link resolves. Drop those unresolved link rows: array
// entries made only of `id` / `sort` / `*_id` keys where a `*_id` is null.
function isUnresolvedLink(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  const keys = Object.keys(record)
  const linkKeys = keys.filter(k => k.endsWith('_id'))
  return (
    linkKeys.length > 0
    && keys.every(k => k === 'id' || k === 'sort' || k.endsWith('_id'))
    && linkKeys.some(k => record[k] === null)
  )
}

export function pruneUnresolvedLinks<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter(v => !isUnresolvedLink(v)).map(pruneUnresolvedLinks) as T
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of Object.keys(record)) record[key] = pruneUnresolvedLinks(record[key])
  }
  return value
}

/**
 * Set in the request context of the reads a server render makes in-process to /api/cms (app/composables/useDirectus.ts),
 * so the proxy can tell them from browser calls and leave them out of its rate limit. A context value, not a header:
 * no HTTP client can send it.
 */
export const RENDER_READ_MARK = 'st8RenderRead'

/**
 * The typed, public Directus client for the staff-managed CMS (manage.southerntier8.org). It carries no token: this
 * site reads only what the public role may read. `fetchImpl` replaces the global fetch (the cached
 * server path and the same-origin proxy both use it). Every response passes through pruneUnresolvedLinks.
 */
export function createCmsClient(url: string, fetchImpl?: typeof fetch) {
  return createDirectus<Schema>(url, fetchImpl ? { globals: { fetch: fetchImpl } } : undefined).with(
    rest({
      onResponse: (result: unknown) => pruneUnresolvedLinks(result),
    }),
  )
}
