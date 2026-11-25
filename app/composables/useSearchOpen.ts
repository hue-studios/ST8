/**
 * Whether the site search panel (components/layout/SearchDialog.vue, mounted in layouts/default.vue) is open. The
 * header's search button toggles it; the panel itself also opens on Cmd/Ctrl+K and `/`.
 */
export function useSearchOpen() {
  const open = useState('st8-search-open', () => false)

  function toggle() {
    open.value = !open.value
  }

  return { open, toggle }
}
