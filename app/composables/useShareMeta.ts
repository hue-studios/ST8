import { DEFAULT_CARD, OG_HEIGHT, OG_WIDTH, SITE_URL } from '#shared/utils/share'

export interface ShareMeta {
  /** Shown on the card. Usually shorter than the <title>. */
  title: string
  description: string
  /** Page path, leading slash, no host. */
  path?: string
  /** Absolute image URL; the site card if omitted. */
  image?: string
  imageAlt?: string
  /** 'article' for news and events. */
  type?: 'website' | 'article'
  published?: string
  modified?: string
}

/**
 * The full share block for a page: <title>, description, Open Graph and Twitter tags, including the secure_url, size
 * and alt tags crawlers want so a first share is not sent without its picture. Replaces `shareMeta()` in
 * config/share.js. Pass getter-style values from asyncData results; call it after the data is awaited so the tags are
 * on the server-rendered page.
 */
export function useShareMeta(meta: ShareMeta | (() => ShareMeta)) {
  const read = () => (typeof meta === 'function' ? meta() : meta)
  const resolved = () => {
    const m = read()
    return { ...m, image: m.image || DEFAULT_CARD, imageAlt: m.imageAlt || m.title, type: m.type || 'website' }
  }

  useHead(() => ({ title: resolved().title }))

  useSeoMeta({
    description: () => resolved().description,
    ogType: () => resolved().type,
    ogSiteName: 'Southern Tier 8',
    ogUrl: () => SITE_URL + (resolved().path || ''),
    ogTitle: () => resolved().title,
    ogDescription: () => resolved().description,
    ogImage: () => resolved().image,
    ogImageSecureUrl: () => resolved().image,
    ogImageWidth: String(OG_WIDTH),
    ogImageHeight: String(OG_HEIGHT),
    ogImageAlt: () => resolved().imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolved().title,
    twitterDescription: () => resolved().description,
    twitterImage: () => resolved().image,
    twitterImageAlt: () => resolved().imageAlt,
    articlePublishedTime: () => (resolved().type === 'article' ? resolved().published : undefined),
    articleModifiedTime: () => (resolved().type === 'article' ? resolved().modified : undefined),
  })
}
