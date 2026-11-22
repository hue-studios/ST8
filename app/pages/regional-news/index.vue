<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { NewsCardItem } from '#shared/types/st8'

const directus = useDirectus()

const { data, error } = await useAsyncData('news-index', () =>
  directus.request(readItems('news', {
    fields: [
      'id', 'title', 'article', 'url', 'cover_image.id', 'tags', 'type', 'featured',
      'date_published', 'date_created', 'date_updated', 'link',
    ] as never,
    filter: { status: { _eq: 'published' } },
    sort: ['-date_published', 'sort'],
    limit: -1,
  })) as unknown as Promise<NewsCardItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'News could not be loaded', fatal: true })
}

const search = ref('')
const filteredArticles = computed(() => {
  const term = search.value.trim().toLowerCase()
  return term ? data.value!.filter(item => item.title.toLowerCase().includes(term)) : data.value!
})

useShareMeta({
  title: 'Regional News for the Southern Tier Region\'s Economy',
  description: 'Regional news focused on the economic development for the Southern Tier region of New York.',
  // Trailing slash kept: it is the og:url everything already shared was keyed on.
  path: '/regional-news/',
  image: staticCard('regional-news.png'),
  imageAlt: 'Regional News - Southern Tier 8 Region',
})
</script>

<template>
  <div id="news" class="flex flex-col items-center justify-center pb-32">
    <div id="news__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
      <h1 class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font">
        News
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-3/5">
        The latest economic and community development news from the Southern Tier 8 region.
      </p>
    </div>
    <div id="news__news-cards" class="relative w-full flex items-center justify-center flex-col pb-20">
      <div class="w-full text-center px-8 mb-4 news__filters">
        <input
          v-model="search"
          class="condensed uppercase bg-white shadow-sm appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden search-input"
          type="text"
          placeholder="Search."
          aria-label="Search news"
        >
      </div>

      <TransitionGroup name="list" tag="div" class="w-full flex flex-col items-center justify-center px-3 sm:px-8">
        <NowNewsCard v-for="item in filteredArticles" :key="item.id" :item="item" />
      </TransitionGroup>
      <p v-if="filteredArticles.length < 1" class="uppercase text-xs tracking-widest mt-24 text-center">
        there were no results.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/news';
.list {
  transition: all 0.3s var(--curve);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.25s var(--curve);
}
.list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
</style>
