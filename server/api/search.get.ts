/**
 * GET /api/search?q=…&limit=…
 *
 * Plain-language search across core services, services, programs, initiatives, news, events, resources, people,
 * partners and podcast episodes. See server/utils/searchIndex.ts for how the index is built and ranked.
 */
import type { SearchResponse } from '#shared/utils/search'
import { SEARCH_MIN_LENGTH } from '#shared/utils/search'

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const { q, limit } = getQuery(event)
  const query = typeof q === 'string' ? q.slice(0, 200) : ''
  const max = Math.min(Math.max(Number(limit) || 8, 1), 25)

  if (query.trim().length < SEARCH_MIN_LENGTH) return { query, results: [] }

  const entries = await getSearchIndex()
  return { query, results: rank(entries, query, max) }
})
