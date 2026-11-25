// The Open Graph / Twitter card constants and text helpers (ported from config/share.js). The head tags themselves
// are set by app/composables/useShareMeta.ts.

// The canonical host. The site redirects to www, but every og:url has always been written without it and Facebook keys
// a URL's share history off og:url, so changing this would orphan the counts on everything already shared.
export const SITE_URL = 'https://southerntier8.org'

// 1.91:1, what Facebook, LinkedIn and X all lay out against.
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export const DEFAULT_CARD = `${SITE_URL}/images/st8-social.png`

// The 1200x630 render of a Directus file, served from this host by the share-image route. The CMS answers robots.txt
// with `Disallow: /`, and Facebook's crawler reads it before downloading an og:image, so a card linked straight to the
// CMS is never fetched.
export function shareCard(id: string) {
  return `${SITE_URL}/share-image/${id}.jpg`
}

// The Directus file id inside a shareCard() URL, or '' for any other image.
export function shareCardId(url?: string) {
  return url?.match(/\/share-image\/([0-9a-f-]{36})\.jpg$/i)?.[1] ?? ''
}

// A card that ships with the site, under public/images/social.
export function staticCard(file: string) {
  return `${SITE_URL}/images/social/${file}`
}

/**
 * Trims copy down to something a card will actually show, on a word boundary, with any markup from the CMS taken out
 * first. Facebook and X show roughly 200 characters, so 180 is a safe ceiling.
 */
export function cardText(value?: string | null, limit = 180) {
  if (!value) return ''
  const plain = String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&rsquo;/gi, '’')
    .replace(/&hellip;/gi, '…')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= limit) return plain
  const cut = plain.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

// Strips tags and the common entities, for card text that is shown rather than shared.
export function removeTags(value?: string | null) {
  if (!value) return ''
  return String(value).replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/(<([^>]+)>)/gi, '')
}

export function truncate(value: string | null | undefined, max: number) {
  const text = removeTags(value)
  return text.length <= max ? text : `${text.slice(0, max)}...`
}
