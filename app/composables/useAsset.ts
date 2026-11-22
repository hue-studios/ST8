/**
 * Directus asset URLs, with the CMS's own presets ('thumbnail', 'small', 'medium', 'large'), e.g.
 * `asset(id, 'medium')`. Hand-built URLs like these are replaced by <NuxtImg> in the images session; until then
 * they keep every crop exactly as the live site renders it.
 */
export function useAsset() {
  const base = `${useRuntimeConfig().public.directusUrl}/assets/`
  return (id?: string | null, key?: string) => (id ? base + id + (key ? `?key=${key}` : '') : '')
}
