import { readItems, readSingleton } from '@directus/sdk'

export interface OrganizationData {
  mission_statement?: string | null
  phone?: string | null
  fax?: string | null
  email?: string | null
  locations?: Array<{ title: string, address: string }> | null
  social_links?: Array<{ platform: 'Facebook' | 'Instagram' | 'Linkedin' | 'Twitter', link: string }> | null
  default_cover_image?: string | null
  default_person_image?: string | null
  ceds_document?: string | null
}

const FIELDS = [
  'mission_statement',
  'phone',
  'fax',
  'email',
  'locations',
  'social_links',
  'default_cover_image',
  'default_person_image',
  'ceds_document',
]

/** The organization singleton: footer, contact details, default images. Replaces the Vuex store's `organization`. */
export function useOrganization() {
  const organization = useState<OrganizationData>('st8-organization', () => ({}))
  const asset = useAsset()

  return {
    organization,
    /** Directus asset URL for an organization file field, e.g. orgAsset('default_cover_image', 'large'). */
    orgAsset: (field: keyof OrganizationData, key?: string) => asset(organization.value[field] as string | null, key),
    /** The raw asset id, so a caller can render it at whatever size it needs (a share card is not square). */
    orgFileId: (field: keyof OrganizationData) => (organization.value[field] as string | null) || '',
  }
}

/**
 * Called once per server render by plugins/site-data.server.ts. A CMS hiccup must not take the whole site down: on
 * failure the state stays empty and the footer renders without its details.
 */
export async function loadOrganization() {
  const { organization } = useOrganization()
  try {
    const data = await useDirectus().request(readSingleton('organization', { fields: FIELDS as never }))
    organization.value = (data as OrganizationData) || {}
  }
  catch (error) {
    console.error('organization: could not load from the CMS', error)
  }
}

/** Whether any "Rebuilding So-Tier" episode is published, so the header can offer the Podcast link. */
export const useHasPodcast = () => useState<boolean>('st8-has-podcast', () => false)

/** Called with loadOrganization. A failed read leaves the flag off, which only hides the header's Podcast link. */
export async function loadHasPodcast() {
  const hasPodcast = useHasPodcast()
  try {
    const rows = await useDirectus().request(readItems('podcast_episodes' as never, {
      fields: ['id'] as never,
      filter: { status: { _eq: 'published' } } as never,
      limit: 1,
    }))
    hasPodcast.value = (rows as unknown[]).length > 0
  }
  catch {
    hasPodcast.value = false
  }
}
