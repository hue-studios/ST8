/**
 * The shape of a /api/search result. Shared because the server route builds it and the search panel and /search page
 * show it. Ported from Greater Opportunities' shared/search.ts.
 */
export type SearchKind =
  | 'core_service'
  | 'service'
  | 'program'
  | 'initiative'
  | 'podcast'
  | 'person'
  | 'partner'
  | 'resource'
  | 'news'
  | 'event'

export interface SearchResult {
  kind: SearchKind
  title: string
  /** A site path, or a full URL when `external` (an outside article or link, or a resource file). */
  url: string
  external?: boolean
  /** The "need" line in the visitor's own words, when the row has one. */
  need?: string
  /** Short plain-text line shown under the title. */
  summary?: string
  /** What the row sits under: a program's core services, a service's core service, a person's group. */
  parent?: string
  score: number
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
}

export const SEARCH_KIND_LABEL: Record<SearchKind, string> = {
  core_service: 'Core service',
  service: 'Service',
  program: 'Program',
  initiative: 'Initiative',
  podcast: 'Podcast',
  person: 'Person',
  partner: 'Partner',
  resource: 'Resource',
  news: 'News',
  event: 'Event',
}

export const SEARCH_KIND_ICON: Record<SearchKind, string> = {
  core_service: 'lucide:layout-grid',
  service: 'lucide:briefcase',
  program: 'lucide:file-text',
  initiative: 'lucide:flag',
  podcast: 'lucide:mic',
  person: 'lucide:user',
  partner: 'lucide:handshake',
  resource: 'lucide:book-open',
  news: 'lucide:newspaper',
  event: 'lucide:calendar',
}

/** The shortest query worth sending. */
export const SEARCH_MIN_LENGTH = 2
