import { readItems } from '@directus/sdk'

export interface FooterInitiative {
  id: number
  title: string
  url: string
  sort?: number | null
}

/** The initiatives listed in the footer. Replaces the Vuex store's `footerInitiatives`. */
export function useFooterInitiatives() {
  return useState<FooterInitiative[]>('st8-footer-initiatives', () => [])
}

/** Called once per server render by plugins/site-data.server.ts; stays empty if the CMS is down. */
export async function loadFooterInitiatives() {
  const initiatives = useFooterInitiatives()
  try {
    const data = await useDirectus().request(
      readItems('initiatives', {
        fields: ['id', 'title', 'url', 'sort'] as never,
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        limit: -1,
      }),
    )
    initiatives.value = (data as unknown as FooterInitiative[]) || []
  }
  catch (error) {
    console.error('footer initiatives: could not load from the CMS', error)
  }
}
