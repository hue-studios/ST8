/**
 * The resource request overlay's state, replacing the Vuex store's UPDATE_RESOURCE / UPDATE_RESOURCE_INFO. A card for
 * a gated resource calls `ask()`; the dialog in layouts/default.vue shows the form and, once the request is saved,
 * the link to the file.
 */
export interface ResourceRequestTarget {
  id: number
  title: string
}

export function useResourceRequest() {
  const open = useState('st8-resource-request-open', () => false)
  const target = useState<ResourceRequestTarget>('st8-resource-request-target', () => ({ id: 0, title: '' }))

  function ask(next: ResourceRequestTarget) {
    target.value = next
    open.value = true
  }

  return { open, target, ask }
}
