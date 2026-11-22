import { readItems } from '@directus/sdk'

// Every published record that has a page of its own, for @nuxtjs/sitemap. Static routes come from app/pages. Each
// collection is read on its own so one failing read leaves the rest of the sitemap in place.
const COLLECTIONS = [
  { collection: 'news', base: '/regional-news', modified: 'date_updated' },
  { collection: 'events', base: '/regional-events', modified: 'date_updated' },
  { collection: 'initiatives', base: '/economic-development-initiatives', modified: 'date_updated' },
  { collection: 'programs', base: '/economic-development-programs', modified: 'date_updated' },
] as const

export default defineSitemapEventHandler(async () => {
  const directus = getDirectus()
  const groups = await Promise.all(COLLECTIONS.map(async ({ collection, base, modified }) => {
    try {
      const rows = await directus.request(readItems(collection as never, {
        fields: ['url', modified] as never,
        filter: { status: { _eq: 'published' } } as never,
        limit: -1,
      })) as unknown as Array<Record<string, string | null>>
      return rows
        .filter(row => row.url)
        .map(row => ({ loc: `${base}/${row.url}`, lastmod: row[modified] || undefined }))
    }
    catch {
      return []
    }
  }))
  return groups.flat()
})
