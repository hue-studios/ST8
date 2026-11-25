/**
 * Whether the site search is open. The header's search button toggles it; the search panel in layouts/default.vue
 * reads it (an empty dialog until the real panel lands).
 */
export function useSearchOpen() {
  const open = useState('st8-search-open', () => false)

  function toggle() {
    open.value = !open.value
  }

  return { open, toggle }
}
