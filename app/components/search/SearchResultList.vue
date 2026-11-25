<script setup lang="ts">
import type { SearchResult } from '#shared/utils/search'
import { SEARCH_KIND_ICON, SEARCH_KIND_LABEL } from '#shared/utils/search'

// The ranked results, as the search panel and the /search page both show them. Site pages are router links; an outside
// article, link or document opens in a new tab.
defineProps<{ results: SearchResult[] }>()
const emit = defineEmits<{ choose: [result: SearchResult] }>()

const meta = (r: SearchResult) => [SEARCH_KIND_LABEL[r.kind], r.parent].filter(Boolean).join(' · ')
</script>

<template>
  <ul class="search-results flex flex-col gap-1">
    <!-- Position in the key: two records can share a title and a link (two people of the same name). -->
    <li v-for="(r, i) in results" :key="`${i}:${r.kind}:${r.url}`" @click="emit('choose', r)">
      <NuxtLink
        :to="r.url"
        :external="r.external"
        :target="r.external ? '_blank' : undefined"
        :rel="r.external ? 'noreferrer' : undefined"
        class="group flex items-start gap-3 rounded-md px-3 py-2.5 text-navy no-underline outline-hidden transition-colors hover:bg-navy/5 focus-visible:bg-navy/5 focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy">
          <Icon :name="SEARCH_KIND_ICON[r.kind]" class="size-4" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-bold leading-snug">{{ r.title }}</span>
          <span class="mt-0.5 block text-xs uppercase tracking-widest text-navy/60">{{ meta(r) }}</span>
          <span v-if="r.need" class="mt-1 block text-sm italic text-navy/80">“{{ r.need }}”</span>
          <span v-else-if="r.summary" class="mt-1 line-clamp-2 block text-sm text-navy/80">{{ r.summary }}</span>
        </span>
        <Icon
          :name="r.external ? 'lucide:external-link' : 'lucide:arrow-right'"
          class="mt-1 size-4 shrink-0 text-navy/40 transition-colors group-hover:text-brand"
          :aria-label="r.external ? 'Opens in a new tab' : undefined"
        />
      </NuxtLink>
    </li>
  </ul>
</template>
