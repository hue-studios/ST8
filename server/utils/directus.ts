import { createCmsClient } from '../../shared/utils/cms'

/**
 * Directus client for server routes (sitemap, search index, share cards later). Public and tokenless, like the
 * browser's: the site reads only what the public role may read. The admin DIRECTUS_TOKEN is for scripts/ only and is
 * never read by app or server code.
 */
export function getDirectus() {
  return createCmsClient(useRuntimeConfig().public.directusUrl)
}
