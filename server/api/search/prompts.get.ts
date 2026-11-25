/**
 * GET /api/search/prompts
 *
 * The five core services' "need" lines, in their CMS order, for the empty state of the search panel. Read from the
 * search index, so it costs no extra CMS request and changes when staff edit the lines in Directus.
 */
import type { SearchPrompt } from '#shared/utils/search'

export default defineEventHandler(async (): Promise<SearchPrompt[]> => {
  const entries = await getSearchIndex()
  return entries
    .filter(e => e.kind === 'core_service' && e.need)
    .map(e => ({ title: e.title, need: e.need! }))
})
