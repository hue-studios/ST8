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
  description?: string | null
  /** When true the download is gated by the resource request form. */
  require_info?: boolean | null
  category?: string | null
  file?: { id: string } | null
  programs?: Array<{ programs_id: { id?: number, title: string } | null }> | null
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
  core_services?: CoreServiceLink[]
  accomplishes_links?: Array<{ title: string, link: string, external: boolean }> | null
  what_it_accomplishes?: string | null
  partners: Array<{ partners_id: { title: string, logo?: { id: string, width: number, height: number } | null } | null }>
  resources: Array<{ resources_id: ResourceCardItem | null }>
  news: Array<{ news_id: NewsCardItem | null }>
}

export interface NewsDetail extends NewsCardItem {
  related_resources: Array<{ resources_id: ResourceCardItem | null }>
}

export interface EventListItem {
  id: number
  title: string
  url: string
  date: string
  time?: string | null
  description?: string | null
  location?: string | null
  image?: { id: string } | null
}

export interface EventDetail extends EventListItem {
  date_created?: string | null
  date_updated?: string | null
  link?: string | null
  link_title?: string | null
  initiatives: Array<{ initiatives_id: { title: string } }>
  resources: Array<{ resources_id: ResourceCardItem | null }>
}

export interface InitiativeItem {
  id: number
  title: string
  url: string
  sort: number
  goal?: string | null
  opportunity?: string | null
}

export interface ServiceItem {
  id: number
  title: string
  url?: string | null
  purpose?: string | null
  how_we_help?: string | null
  who_it_is_for?: string | null
  /** The id of the core service it sits under (services.core_service). */
  core_service?: number | null
  example_programs: Array<{
    programs_id: {
      id: number
      title: string
      url: string
      images: Array<{ directus_files_id: { id: string } }>
      counties: Array<{ counties_id: { title: string } }>
      initiatives: Array<{ initiatives_id: { title: string } }>
      partners: Array<{ partners_id: { title: string } | null }>
    }
  }>
  resources: Array<{ resources_id: ResourceCardItem | null }>
  news: Array<{ id: number, news_id: NewsCardItem | null }>
}

/** One of the five core services (Plan, Develop, Connect, Build Capacity, Invest) that group services and programs. */
export interface CoreServiceItem {
  id: number
  title: string
  /** The slug, also the section id on the Services page (#plan, #develop, …). */
  url: string
  summary?: string | null
  need?: string | null
  programs: Array<{ programs_id: { id: number, title: string, url: string } | null }>
}

/** A program's link to a core service, as the program page reads it. */
export interface CoreServiceLink {
  core_services_id: { title: string, url: string } | null
}

export interface PartnerItem {
  id: number
  title: string
  website?: string | null
  category?: string | null
  logo?: { id: string } | null
}

export interface ReportItem {
  id: number
  title: string
  date?: string | null
  date_created?: string | null
  date_updated?: string | null
  file?: { id: string } | null
}

export interface HowToApply {
  introduction?: string | null
  steps?: string | null
  arc_info?: string | null
  resources: Array<{ resources_id: ResourceCardItem | null }>
}

/** What the resource request form sends to /api/resource-requests (and on to the `requests` collection). */
export interface ResourceRequestBody {
  name: string
  email: string
  company?: string
  research: string
  resource: number
}

/** The parts of a Google Calendar event the events page reads. */
export interface CalendarEvent {
  id: string
  summary?: string
  location?: string
  start?: { dateTime?: string, date?: string }
  end?: { dateTime?: string, date?: string }
}
