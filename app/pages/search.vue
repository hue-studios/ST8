<script setup lang="ts">
import type { SearchResponse } from '#shared/utils/search'
import { SEARCH_MIN_LENGTH } from '#shared/utils/search'

/**
 * /search?q=…, the full result list behind the search panel. Server-rendered so a search can be linked to and
 * bookmarked, and kept out of search engines (noindex here, disallowed in robots.txt, left out of the sitemap).
 */
const route = useRoute()
const query = computed(() => String(route.query.q ?? '').slice(0, 200))
const input = ref(query.value)
watch(query, v => (input.value = v))

const { data, pending, error } = await useFetch<SearchResponse>('/api/search', {
  query: { q: query, limit: 25 },
  default: () => ({ query: '', results: [] }),
})
const results = computed(() => data.value?.results ?? [])
const ready = computed(() => query.value.trim().length >= SEARCH_MIN_LENGTH)

// A getter: searching again from this page reuses the component, so a title read once would keep the first query.
useHead({ title: () => (query.value ? `Search: ${query.value} - Southern Tier 8` : 'Search - Southern Tier 8') })
useSeoMeta({
  description: 'Search Southern Tier 8 services, programs, news, events, resources and people.',
  robots: 'noindex, follow',
})

function submit() {
  const q = input.value.trim()
  if (q.length >= SEARCH_MIN_LENGTH) navigateTo({ path: '/search', query: { q } })
}
</script>

<template>
  <div id="search-page" class="mx-auto w-full max-w-3xl px-4 pt-24 pb-24 md:px-8">
    <h1 class="uppercase navy thin-font tracking-widest text-center mb-8">Search</h1>

    <form role="search" class="flex items-center gap-2" @submit.prevent="submit">
      <label for="search-page-input" class="sr-only">Search the site</label>
      <div class="relative min-w-0 flex-1">
        <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/50" />
        <St8Input
          id="search-page-input"
          v-model="input"
          type="search"
          name="q"
          autocomplete="off"
          maxlength="200"
          placeholder="Tell us what you need…"
          class="h-12 pl-9 text-base"
        />
      </div>
      <St8Button type="submit" class="h-12 shrink-0">
        Search
      </St8Button>
    </form>

    <div class="mt-8">
      <p v-if="!ready" class="text-navy/70">
        Type what you need in your own words, such as “we need help applying for a grant”, “broadband” or “CEDS”, or
        search for a person’s name.
      </p>
      <p v-else-if="pending" class="text-navy/70">
        Searching…
      </p>
      <p v-else-if="error" class="text-navy/70">
        Search is not available right now. Please try again in a moment.
      </p>
      <template v-else>
        <p class="mb-4 text-sm uppercase tracking-widest text-navy/60">
          {{ results.length }} result{{ results.length === 1 ? '' : 's' }} for “{{ query }}”
        </p>
        <template v-if="results.length">
          <SearchAnswer :query="query" />
          <SearchResultList :results="results" />
        </template>
        <div v-else class="rounded-lg border p-8 text-center">
          <p>Nothing matched “{{ query }}”.</p>
          <p class="mt-2 text-sm text-navy/70">
            Try fewer words, or <NuxtLink to="/economic-development-services" class="underline">browse our services</NuxtLink>.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
