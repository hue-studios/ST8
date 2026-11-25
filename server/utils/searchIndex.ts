/**
 * The search index behind /api/search. Ported from Greater Opportunities (server/utils/searchIndex.ts).
 *
 * Everything the site searches is a few hundred short rows, so it is pulled from the CMS in one read per collection and
 * ranked in memory. That buys two things a per-request `_icontains` filter cannot:
 *
 *  - `search_phrases` is a JSON list, which Directus cannot usefully filter on;
 *  - a visitor types a sentence ("we need help applying for a grant"), not a keyword, so matching has to be word by
 *    word and weighted, not one substring.
 *
 * The built index is kept in module scope for INDEX_TTL. Warm instances answer most searches without the CMS, and the
 * reads underneath go through the same cache as the pages (server/utils/directus.ts).
 */
import { readItems } from '@directus/sdk'
import type { SearchKind, SearchResult } from '#shared/utils/search'

export interface SearchEntry extends Omit<SearchResult, 'score'> {
  /** Everything searchable, already normalised, one bucket per weight. */
  haystacks: { text: string, weight: number }[]
}

const INDEX_TTL = 5 * 60 * 1000

let cache: { at: number, entries: SearchEntry[] } | null = null
let inflight: Promise<SearchEntry[]> | null = null

/** Words that carry no signal in "we need help applying for a grant". */
const STOPWORDS = new Set([
  'a', 'about', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can',
  'do', 'does', 'for', 'from', 'get', 'getting', 'have', 'help', 'how', 'i', 'if', 'im', 'in',
  'is', 'it', 'its', 'me', 'my', 'need', 'needs', 'of', 'on', 'or', 'our', 'out', 'so', 'some',
  'that', 'the', 'their', 'them', 'there', 'they', 'this', 'to', 'up', 'us', 'want', 'was', 'we',
  'what', 'when', 'where', 'which', 'who', 'will', 'with', 'you', 'your',
])

const norm = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export function tokenize(query: string): string[] {
  const words = norm(query).split(' ').filter(Boolean)
  // Numerals survive the length filter: a year or a route number is often the most specific word.
  const useful = words.filter(w => (w.length > 2 || /^\d+$/.test(w)) && !STOPWORDS.has(w))
  // An all-stopword query ("help") still deserves an attempt.
  return (useful.length ? useful : words).slice(0, 12)
}

/** How much a hit in each field is worth. */
const W = { need: 6, phrases: 5, title: 4, parent: 2, body: 1 }

/** Plain text for the line under a result. */
const blurb = (value: unknown, max = 160) => {
  const text = removeTags(String(value ?? '')).replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return text ? (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`) : undefined
}

const phrases = (value: unknown) => (Array.isArray(value) ? value.join(' ') : '')

const PUBLISHED = { status: { _eq: 'published' } }

type Row = Record<string, any>

async function read(collection: string, fields: string[], sort?: string[]): Promise<Row[]> {
  return await getDirectus().request(readItems(collection as never, {
    fields: fields as never,
    filter: PUBLISHED as never,
    ...(sort ? { sort: sort as never } : {}),
    limit: -1,
  })) as Row[]
}

const READS = {
  core_services: () => read('core_services', ['title', 'url', 'summary', 'need', 'search_phrases']),
  services: () => read('services', [
    'title', 'url', 'need', 'search_phrases', 'purpose', 'how_we_help', 'who_it_is_for', 'core_service.title',
  ], ['sort']),
  programs: () => read('programs', [
    'title', 'url', 'need', 'search_phrases', 'what_is_it', 'what_it_accomplishes', 'core_services.core_services_id.title',
  ]),
  initiatives: () => read('initiatives', ['title', 'url', 'need', 'search_phrases', 'caption', 'goal', 'opportunity']),
  news: () => read('news', ['title', 'url', 'type', 'link', 'article', 'date_published']),
  events: () => read('events', ['title', 'url', 'date', 'description']),
  resources: () => read('resources', ['title', 'type', 'link', 'file', 'require_info', 'category', 'description']),
  people: () => read('people', ['name', 'title', 'category']),
  partners: () => read('partners', ['title', 'category']),
  podcast_episodes: () => read('podcast_episodes', ['title', 'url', 'summary', 'guests.people_id.name']),
}

type Collection = keyof typeof READS

function entriesFrom(rows: Record<Collection, Row[]>): SearchEntry[] {
  const entries: SearchEntry[] = []
  const assets = `${useRuntimeConfig().public.directusUrl}/assets/`

  for (const c of rows.core_services) {
    if (!c.url || !c.title) continue
    entries.push({
      kind: 'core_service',
      title: c.title,
      // Session 11 gives each core service its own section on the Services page.
      url: `/economic-development-services#${c.url}`,
      need: c.need ?? undefined,
      summary: blurb(c.summary),
      haystacks: [
        { text: norm(c.need), weight: W.need },
        { text: norm(phrases(c.search_phrases)), weight: W.phrases },
        { text: norm(c.title), weight: W.title },
        { text: norm(c.summary), weight: W.body },
      ],
    })
  }

  // The Services page numbers its sections in sort order (#service-0, #service-1, …), as it reads them.
  rows.services.forEach((s, index) => {
    if (!s.title) return
    entries.push({
      kind: 'service',
      title: s.title,
      url: `/economic-development-services#service-${index}`,
      need: s.need ?? undefined,
      summary: blurb(s.purpose),
      parent: s.core_service?.title ?? undefined,
      haystacks: [
        { text: norm(s.need), weight: W.need },
        { text: norm(phrases(s.search_phrases)), weight: W.phrases },
        { text: norm(s.title), weight: W.title },
        { text: norm(s.core_service?.title), weight: W.parent },
        { text: norm(`${s.purpose ?? ''} ${s.how_we_help ?? ''} ${s.who_it_is_for ?? ''}`), weight: W.body },
      ],
    })
  })

  for (const p of rows.programs) {
    if (!p.url || !p.title) continue
    const parents = ((p.core_services ?? []) as Row[]).map(l => l.core_services_id?.title).filter(Boolean).join(', ')
    entries.push({
      kind: 'program',
      title: p.title,
      url: `/economic-development-programs/${p.url}`,
      need: p.need ?? undefined,
      summary: blurb(p.what_is_it),
      parent: parents || undefined,
      haystacks: [
        { text: norm(p.need), weight: W.need },
        { text: norm(phrases(p.search_phrases)), weight: W.phrases },
        { text: norm(p.title), weight: W.title },
        { text: norm(parents), weight: W.parent },
        { text: norm(`${p.what_is_it ?? ''} ${p.what_it_accomplishes ?? ''}`), weight: W.body },
      ],
    })
  }

  for (const i of rows.initiatives) {
    if (!i.url || !i.title) continue
    entries.push({
      kind: 'initiative',
      title: i.title,
      url: `/economic-development-initiatives/${i.url}`,
      need: i.need ?? undefined,
      summary: blurb(i.caption),
      haystacks: [
        { text: norm(i.need), weight: W.need },
        { text: norm(phrases(i.search_phrases)), weight: W.phrases },
        { text: norm(i.title), weight: W.title },
        { text: norm(`${i.caption ?? ''} ${i.goal ?? ''} ${i.opportunity ?? ''}`), weight: W.body },
      ],
    })
  }

  for (const n of rows.news) {
    if (!n.title) continue
    // An outside article has no page here: the listing links straight to it, and so does search.
    const external = n.type === 'External Article'
    const url = external ? n.link : n.url ? `/regional-news/${n.url}` : null
    if (!url) continue
    entries.push({
      kind: 'news',
      title: n.title,
      url,
      external: external || undefined,
      summary: [n.date_published ? formatDate(n.date_published, 'MMMM d, yyyy') : '', blurb(n.article, 120)]
        .filter(Boolean).join(' · ') || undefined,
      haystacks: [
        { text: norm(n.title), weight: W.title },
        { text: norm(n.article), weight: W.body },
      ],
    })
  }

  for (const e of rows.events) {
    if (!e.url || !e.title) continue
    entries.push({
      kind: 'event',
      title: e.title,
      url: `/regional-events/${e.url}`,
      summary: [e.date ? formatDate(e.date, 'MMMM d, yyyy') : '', blurb(e.description, 120)]
        .filter(Boolean).join(' · ') || undefined,
      haystacks: [
        { text: norm(e.title), weight: W.title },
        { text: norm(e.description), weight: W.body },
      ],
    })
  }

  for (const r of rows.resources) {
    if (!r.title) continue
    // A gated file is only handed out through the request form, so its result goes to the Resources page, where the
    // card opens that form. Its file id never leaves the server.
    const file = r.type === 'Internal File / PDF'
    const url = file
      ? (r.require_info || !r.file ? '/regional-news/resources' : `${assets}${r.file}`)
      : r.link || '/regional-news/resources'
    entries.push({
      kind: 'resource',
      title: r.title,
      url,
      external: /^https?:/.test(url) || undefined,
      summary: blurb(r.description),
      parent: r.category ?? undefined,
      haystacks: [
        { text: norm(r.title), weight: W.title },
        { text: norm(r.category), weight: W.parent },
        { text: norm(r.description), weight: W.body },
      ],
    })
  }

  for (const p of rows.people) {
    if (!p.name) continue
    const board = p.category === 'Board'
    entries.push({
      kind: 'person',
      title: p.name,
      url: board ? '/regional-organization#board-section' : '/regional-organization#staff-section',
      summary: blurb(p.title),
      parent: board ? 'Board of Directors' : 'Team',
      haystacks: [
        { text: norm(p.name), weight: W.title },
        { text: norm(p.title), weight: W.body },
      ],
    })
  }

  for (const p of rows.partners) {
    if (!p.title) continue
    const categories = Array.isArray(p.category) ? p.category.join(', ') : ''
    entries.push({
      kind: 'partner',
      title: p.title,
      url: '/regional-partnerships',
      summary: categories || undefined,
      haystacks: [
        { text: norm(p.title), weight: W.title },
        { text: norm(categories), weight: W.body },
      ],
    })
  }

  for (const e of rows.podcast_episodes) {
    if (!e.title) continue
    const guests = ((e.guests ?? []) as Row[]).map(g => g.people_id?.name).filter(Boolean).join(', ')
    entries.push({
      kind: 'podcast',
      title: e.title,
      // The Organization page's podcast section (session 8).
      url: '/regional-organization#podcast',
      summary: blurb(e.summary),
      parent: guests ? `With ${guests}` : undefined,
      haystacks: [
        { text: norm(e.title), weight: W.title },
        { text: norm(guests), weight: W.parent },
        { text: norm(e.summary), weight: W.body },
      ],
    })
  }

  return entries
}

async function build(): Promise<SearchEntry[]> {
  const names = Object.keys(READS) as Collection[]
  // Each collection is read on its own, so one refused read (a field the public role cannot see) does not take
  // search down. While a previous index is held, a partial build is refused instead, and the stale one is served.
  const settled = await Promise.allSettled(names.map(name => READS[name]()))
  const failed = names.filter((_, i) => settled[i]!.status === 'rejected')
  if (failed.length === names.length || (failed.length && cache)) {
    throw new Error(`Search index: could not read ${failed.join(', ')}`)
  }
  if (failed.length) console.warn(`[search] building without ${failed.join(', ')}`)
  const rows = Object.fromEntries(names.map((name, i) => {
    const result = settled[i]!
    return [name, result.status === 'fulfilled' ? result.value : []]
  })) as Record<Collection, Row[]>
  return entriesFrom(rows)
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  if (cache && Date.now() - cache.at < INDEX_TTL) return cache.entries
  // Concurrent misses share one build.
  inflight ??= build()
    .then((entries) => {
      cache = { at: Date.now(), entries }
      return entries
    })
    .finally(() => {
      inflight = null
    })
  try {
    return await inflight
  }
  catch (error) {
    // Serve the stale index rather than an error when the CMS is down.
    if (cache) return cache.entries
    throw error
  }
}

/**
 * Core services and services are the "start here" answer to a vague need, so they are lifted above the programs that
 * happen to share a word with the query, and programs above news and events.
 */
const KIND_WEIGHT: Record<SearchKind, number> = {
  core_service: 1.7,
  service: 1.6,
  program: 1.1,
  initiative: 1,
  podcast: 0.95,
  person: 0.95,
  partner: 0.9,
  resource: 0.9,
  news: 0.85,
  event: 0.85,
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function rank(entries: SearchEntry[], query: string, limit: number): SearchResult[] {
  const tokens = tokenize(query)
  if (!tokens.length) return []
  const phrase = norm(query)
  const wholeWord = new Map(tokens.map(t => [t, new RegExp(`\\b${escape(t)}\\b`)]))

  const scored: SearchResult[] = []
  for (const { haystacks, ...entry } of entries) {
    let score = 0
    for (const { text, weight } of haystacks) {
      if (!text) continue
      for (const token of tokens) {
        if (!text.includes(token)) continue
        // Whole-word hits beat hits inside a longer word ("plan" in "planet").
        score += weight * (wholeWord.get(token)!.test(text) ? 1 : 0.4)
      }
      // The whole query appearing as it was typed is a strong signal.
      if (phrase.length > 6 && text.includes(phrase)) score += weight * 2
    }
    if (score > 0) scored.push({ ...entry, score: Math.round(score * KIND_WEIGHT[entry.kind] * 100) / 100 })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
}
