// One place to build the Open Graph / Twitter block every page shares.
//
// Two things were wrong before this existed. Pages that set their own og:image pointed it at a
// Directus square preset (`?key=medium` is 800x800, `?key=large` is 1000x1000), so the pages with
// the most to show — the forecast, programs, news, events — were the ones whose cards came out
// cropped or blank, while every page that fell through to the site default got a proper 1200x630
// card. And no page declared the image's size, so crawlers had to fetch it before they could lay
// a card out, which is why a first share often appeared with no picture at all.

// The canonical host. The site redirects to www, but every og:url has always been written without
// it and Facebook keys a URL's share history off og:url, so changing this would orphan the counts
// on everything already shared. Left as-is deliberately; change it here if that trade is ever worth
// making, and re-scrape afterwards.
export const SITE_URL = 'https://southerntier8.org'

// 1.91:1, what Facebook, LinkedIn and X all lay out against.
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

// Directus renders on request, so ask it for the card size instead of a square preset. `fit=cover`
// crops to fill rather than letterboxing, which is what a cover photo wants.
export function directusCard(id) {
  return (
    process.env.imageUrl +
    id +
    '?width=' +
    OG_WIDTH +
    '&height=' +
    OG_HEIGHT +
    '&fit=cover&format=jpg&quality=80'
  )
}

// A card that ships with the site, under /static/images/social.
export function staticCard(file) {
  return SITE_URL + '/images/social/' + file
}

export const DEFAULT_CARD = SITE_URL + '/images/st8-social.png'

/**
 * The full share block for a page.
 *
 * Returns a vue-meta array, so a page's head() can spread it and add anything of its own. Every
 * entry carries a `hid` so a page-level tag replaces the matching default from nuxt.config rather
 * than emitting a second copy of it.
 *
 * @param {string}  title       Shown on the card. Usually shorter than the <title>.
 * @param {string}  description One or two sentences.
 * @param {string}  path        Page path, leading slash, no host.
 * @param {string}  [image]     Absolute image URL; the site card if omitted.
 * @param {string}  [imageAlt]  Describes the image for screen readers on X.
 * @param {string}  [type]      og:type — 'article' for news and events.
 * @param {string}  [published] ISO date, articles only.
 * @param {string}  [modified]  ISO date, articles only.
 */
export function shareMeta({
  title,
  description,
  path = '',
  image = DEFAULT_CARD,
  imageAlt = '',
  type = 'website',
  published = '',
  modified = '',
} = {}) {
  const url = SITE_URL + path

  const meta = [
    { hid: 'description', name: 'description', content: description },

    { hid: 'og:type', property: 'og:type', content: type },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: 'Southern Tier 8',
    },
    { hid: 'og:url', property: 'og:url', content: url },
    { hid: 'og:title', property: 'og:title', content: title },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'og:image', property: 'og:image', content: image },
    // Everything is served over TLS, so this is the same URL — but older Facebook crawlers only
    // look at secure_url, and without it they fall back to no image at all.
    {
      hid: 'og:image:secure_url',
      property: 'og:image:secure_url',
      content: image,
    },
    {
      hid: 'og:image:width',
      property: 'og:image:width',
      content: String(OG_WIDTH),
    },
    {
      hid: 'og:image:height',
      property: 'og:image:height',
      content: String(OG_HEIGHT),
    },
    {
      hid: 'og:image:alt',
      property: 'og:image:alt',
      content: imageAlt || title,
    },

    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    { hid: 'twitter:title', name: 'twitter:title', content: title },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description,
    },
    { hid: 'twitter:image', name: 'twitter:image', content: image },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: imageAlt || title,
    },
  ]

  if (type === 'article' && published) {
    meta.push({
      hid: 'article:published_time',
      property: 'article:published_time',
      content: published,
    })
  }
  if (type === 'article' && modified) {
    meta.push({
      hid: 'article:modified_time',
      property: 'article:modified_time',
      content: modified,
    })
  }

  return meta
}

/**
 * Trims copy down to something a card will actually show, on a word boundary, with any markup
 * from the CMS taken out first. Facebook shows roughly 200 characters and X about 200, so 180 is
 * a safe ceiling that rarely gets clipped mid-thought.
 */
export function cardText(value, limit = 180) {
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
  return (lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}
