<script setup lang="ts">
import type { SearchPrompt, SearchResponse, SearchResult } from '#shared/utils/search'
import { SEARCH_MIN_LENGTH } from '#shared/utils/search'

/**
 * The site search panel. It opens from the header's search button, Cmd/Ctrl+K, and `/` when the visitor is not typing
 * in a field. Results come from /api/search as the visitor types; Enter (or "See all results") goes to /search, the
 * server-rendered list that can be linked to. Before anything is typed it offers the five core services' "need" lines as
 * example prompts. Ported from Greater Opportunities' SiteSearch and SearchBar.
 */
const { open } = useSearchOpen()

const query = ref('')
const results = ref<SearchResult[]>([])
const pending = ref(false)
const failed = ref(false)
const searched = ref('')

// Debounced so a sentence typed at speed is one request, not twenty.
const debounced = refDebounced(query, 220)

watch(debounced, async (value) => {
  const q = value.trim()
  if (q.length < SEARCH_MIN_LENGTH) {
    results.value = []
    searched.value = ''
    failed.value = false
    return
  }
  pending.value = true
  try {
    const data = await $fetch<SearchResponse>('/api/search', { query: { q, limit: 8 } })
    // A slower earlier request must not overwrite a newer query's results.
    if (debounced.value.trim() !== q) return
    results.value = data.results
    searched.value = q
    failed.value = false
  }
  catch {
    if (debounced.value.trim() !== q) return
    results.value = []
    searched.value = q
    failed.value = true
  }
  finally {
    if (debounced.value.trim() === q) pending.value = false
  }
})

const panel = useTemplateRef<HTMLElement>('panel')

const focusInput = () => panel.value?.querySelector<HTMLInputElement>('input')?.focus()

// The example prompts load once, on the first open, from the server (the browser cannot call the CMS). If they fail the
// panel simply shows the hint without them.
const prompts = ref<SearchPrompt[]>([])
let promptsAsked = false
async function loadPrompts() {
  if (promptsAsked) return
  promptsAsked = true
  try {
    prompts.value = await $fetch<SearchPrompt[]>('/api/search/prompts')
  }
  catch {
    promptsAsked = false
  }
}

/** Choosing a prompt fills the field; the debounced watch above runs the search. */
function choosePrompt(prompt: SearchPrompt) {
  query.value = prompt.need
  focusInput()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    loadPrompts()
    await nextTick()
    focusInput()
  }
  else {
    // A stale query would bring back the last visit's results on reopen.
    query.value = ''
  }
})

// A result navigates; the panel must not outlive the route change. (The dialog returns focus to the button itself.)
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))

// Closing the panel during a link's click cancels the router's navigation, so a site link is left to the route watch
// above. Only a link that does not change the route (an outside page in a new tab, or the page already shown) closes it.
const router = useRouter()
function chose(result: Pick<SearchResult, 'url' | 'external'>) {
  if (result.external || router.resolve(result.url).fullPath === route.fullPath) open.value = false
}

function submit() {
  const q = query.value.trim()
  if (q.length < SEARCH_MIN_LENGTH) return
  open.value = false
  navigateTo({ path: '/search', query: { q } })
}

/** Cmd/Ctrl+K anywhere; "/" when the visitor is not already typing somewhere. */
useEventListener(import.meta.client ? window : null, 'keydown', (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
    return
  }
  if (e.key === '/' && !open.value && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const el = e.target as HTMLElement | null
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
    e.preventDefault()
    open.value = true
  }
})

const showResults = computed(() => !!searched.value && searched.value === query.value.trim())
</script>

<template>
  <St8Dialog
    v-model:open="open"
    title="Search"
    description="Search services, programs, news, events, resources and people."
    hide-title
    class="search-dialog top-[6vh] flex max-h-[88vh] translate-y-0 flex-col gap-3 p-4 sm:top-[10vh] sm:max-w-2xl sm:p-5"
  >
    <div ref="panel" class="flex min-h-0 flex-1 flex-col gap-3">
      <form role="search" class="flex items-center gap-2 pr-8" @submit.prevent="submit">
        <label for="site-search-input" class="sr-only">Search the site</label>
        <div class="relative min-w-0 flex-1">
          <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/50" />
          <St8Input
            id="site-search-input"
            v-model="query"
            type="search"
            name="q"
            autocomplete="off"
            maxlength="200"
            placeholder="Tell us what you need…"
            class="h-11 pl-9 text-base"
          />
        </div>
        <St8Button type="submit" class="h-11 shrink-0" aria-label="See all results">
          <span class="hidden sm:inline">Search</span>
          <Icon name="lucide:corner-down-left" class="size-4" />
        </St8Button>
      </form>

      <div class="min-h-0 flex-1 overflow-y-auto" aria-live="polite">
        <!-- Kept mounted while the visitor types: it waits for the query to settle before asking. -->
        <SearchAnswer :query="showResults && !failed && results.length ? searched : ''" @choose="chose" />
        <template v-if="showResults">
          <p v-if="failed" class="px-3 py-6 text-center text-sm text-navy/70">
            Search is not available right now. Please try again in a moment.
          </p>
          <template v-else-if="results.length">
            <SearchResultList :results="results" @choose="chose" />
            <NuxtLink
              :to="{ path: '/search', query: { q: searched } }"
              class="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-navy hover:bg-navy/5"
            >
              <Icon name="lucide:list" class="size-4 text-navy/50" />
              See all results for “{{ searched }}”
            </NuxtLink>
          </template>
          <div v-else class="px-3 py-6 text-center text-sm text-navy/70">
            <p>Nothing matched “{{ searched }}”.</p>
            <p class="mt-1">
              Try fewer words, or
              <NuxtLink to="/economic-development-services" class="underline">browse our services</NuxtLink>.
            </p>
          </div>
        </template>
        <div v-else-if="!pending" class="px-3 py-2">
          <p class="text-sm text-navy/70">
            Ask in your own words, or search for a program, a county or a person’s name.
          </p>
          <template v-if="prompts.length">
            <p id="search-prompts-label" class="mt-4 mb-1 text-xs tracking-widest text-navy/60 uppercase">
              Try one of these
            </p>
            <ul aria-labelledby="search-prompts-label" class="-mx-3">
              <li v-for="prompt in prompts" :key="prompt.title">
                <button
                  type="button"
                  class="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm text-navy hover:bg-navy/5 focus-visible:bg-navy/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand"
                  @click="choosePrompt(prompt)"
                >
                  <Icon name="lucide:message-circle" class="mt-0.5 size-4 shrink-0 text-navy/50" />
                  <span class="min-w-0 flex-1">
                    “{{ prompt.need }}”
                    <span class="block text-xs text-navy/50">{{ prompt.title }}</span>
                  </span>
                </button>
              </li>
            </ul>
          </template>
        </div>
      </div>

      <p class="hidden items-center justify-end gap-3 text-xs text-navy/50 sm:flex">
        <span><kbd class="rounded border px-1">Enter</kbd> all results</span>
        <span><kbd class="rounded border px-1">Esc</kbd> to close</span>
      </p>
    </div>
  </St8Dialog>
</template>
