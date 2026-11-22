<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { ResourceCardItem } from '#shared/types/st8'

const directus = useDirectus()

const { data, error } = await useAsyncData('resources-index', () =>
  directus.request(readItems('resources', {
    fields: ['*', 'file.id', 'cover_image.id', 'programs.programs_id.id', 'programs.programs_id.title'] as never,
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
    limit: -1,
  })) as unknown as Promise<ResourceCardItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Resources could not be loaded', fatal: true })
}

// The sections, in the order the page shows them. `contained` is false for Investment & Development, which the live
// page has always laid out without the left-aligned title container the others sit in.
const sections = [
  { title: 'Community Plans & Strategies', category: 'Community Plans & Strategies', contained: true },
  { title: 'Grant Writing', category: 'Grant Writing', contained: true },
  { title: 'Health & Wellness', category: 'Health & Wellness', contained: true },
  { title: 'Investment & Development', category: 'Investment & Development', contained: false },
  { title: 'Infrastructure', category: 'Infrastructure', contained: true },
  { title: 'Environmental', category: 'Environmental & Geospatial', contained: true },
]
const grouped = computed(() =>
  sections.map(section => ({ ...section, items: data.value!.filter(r => r.category === section.category) })))

useShareMeta({
  title: 'Resources for the Southern Tier Region\'s Economy',
  description: 'Resources focused on the economic development for the Southern Tier region of New York.',
  path: '/regional-news/resources',
})
</script>

<template>
  <div id="resources" class="flex flex-col items-center justify-center pb-32 w-full overflow-hidden">
    <div id="resources__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
      <h1 class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font">
        Resources
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-1/2">This is a collection of resources.</p>
    </div>
    <div v-for="(section, index) in grouped" :key="section.category" class="w-full flex items-center justify-center flex-col">
      <div v-if="section.contained" class="w-full flex items-start justify-center flex-col resources__title-container">
        <h2
          class="uppercase font-bold relative mb-4 md:mb-8 tracking-wider resources__title"
          :class="index === 0 ? 'mt-8' : 'mt-20 md:mt-28'"
        >
          {{ section.title }}
          <span class="flex items-center justify-center badge">{{ section.items.length }}</span>
        </h2>
      </div>
      <h2 v-else class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title">
        {{ section.title }}
        <span class="flex items-center justify-center badge">{{ section.items.length }}</span>
      </h2>
      <div class="w-full resources__title-border" />
      <NowResourceCardData v-for="resource in section.items" :key="resource.id" :item="resource" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pages/resources';

.resources__title-container {
  max-width: 800px;
}
.resources__title {
  font-size: 28px;
  line-height: 24px;
  padding-left: 5px;
  padding-right: 15px;
  border-left: 10px solid $navy;
  @media (min-width: $breakpoint-medium) {
    font-size: 46px;
    line-height: 36px;
    border-left: 15px solid $navy;
  }
  .badge {
    position: absolute;
    right: -10px;
    top: -15px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: $navy;
    color: $green;
    font-size: 10px;
    font-family: $bold-font;
    border-radius: 50%;
    letter-spacing: normal;
  }
}
.resources__title-border {
  height: 0px;
  background: rgba($grey, 0.5);
}
.resource-card-data:nth-of-type(even) {
  background: #eeeeee;
}
</style>
