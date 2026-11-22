// Browser-facing shapes for what the pages read from Directus. Nested paths such as 'counties.counties_id.title'
// come back as arrays of link rows, so these mirror the requested fields, not the raw collections.

export interface ProgramListItem {
  id: number
  title: string
  url: string
  what_is_it?: string | null
  counties: Array<{ counties_id: { title: string } }>
  initiatives: Array<{ initiatives_id: { title: string, url?: string } }>
  images: Array<{ directus_files_id: { id: string } }>
  partners: Array<{ partners_id: { title: string } | null }>
}

export interface ResourceCardItem {
  id: number
  title: string
  type: 'Internal File / PDF' | 'External Link' | string
  link?: string | null
  file?: { id: string } | null
}

export interface NewsCardItem {
  id?: number
  title: string
  url?: string | null
  article?: string | null
  link?: string | null
  type: 'ST8 Article' | 'External Article' | string
  tags: string[]
  date_published?: string | null
  date_created?: string | null
  date_updated?: string | null
  cover_image?: { id: string } | null
}

export interface ProgramDetail extends ProgramListItem {
  accomplishes_links?: Array<{ title: string, link: string, external: boolean }> | null
  what_it_accomplishes?: string | null
  partners: Array<{ partners_id: { title: string, logo?: { id: string, width: number, height: number } | null } | null }>
  resources: Array<{ resources_id: ResourceCardItem | null }>
  news: Array<{ news_id: NewsCardItem | null }>
}
