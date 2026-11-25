<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { EventDetail } from '#shared/types/st8'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const directus = useDirectus()
const { orgFileId } = useOrganization()

const { data, error } = await useAsyncData(
  () => `event-${slug.value}`,
  async () => {
    const rows = await directus.request(readItems('events', {
      filter: { url: { _eq: slug.value } },
      fields: [
        'id', 'title', 'url', 'date', 'time', 'date_created', 'date_updated', 'description', 'link', 'link_title',
        'image.id', 'initiatives.initiatives_id.title',
        'resources.resources_id.id', 'resources.resources_id.title', 'resources.resources_id.type',
        'resources.resources_id.link', 'resources.resources_id.description', 'resources.resources_id.require_info',
        'resources.resources_id.file.id', 'resources.resources_id.programs.programs_id.title',
      ] as never,
      limit: 1,
    }))
    return (rows as unknown as EventDetail[])[0] ?? null
  },
  { watch: [slug] },
)
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This event could not be loaded', fatal: true })
}
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
}
const item = computed(() => data.value!)
const resources = computed(() => item.value.resources.filter(r => r.resources_id))
const tooLong = computed(() => item.value.title.length > 30)

const imageId = item.value.image?.id || orgFileId('default_cover_image')
const title = `${item.value.title} - Featured Southern Tier Event`
useShareMeta({
  title,
  description: cardText(item.value.description, 160) || 'A featured event in the Southern Tier 8 Region of New York.',
  path: `/regional-events/${item.value.url}`,
  image: imageId ? shareCard(imageId) : DEFAULT_CARD,
  imageAlt: item.value.title,
  type: 'article',
  // When the listing went up, not when the event happens: article:published_time is about the page, and an event's own
  // date is often still in the future.
  published: item.value.date_created || undefined,
  modified: item.value.date_updated || undefined,
})
useSchemaOrg([
  defineEvent({
    name: item.value.title,
    description: cardText(item.value.description, 160) || undefined,
    startDate: item.value.date,
    image: imageId ? shareCard(imageId) : DEFAULT_CARD,
    location: { '@type': 'Place', 'name': 'Southern Tier 8 Region, New York' },
  }),
])
</script>

<template>
  <div id="event" class="flex flex-col justify-center items-center relative">
    <h2 id="event__bg-title" class="uppercase absolute">Event</h2>
    <div id="event__intro" class="flex flex-col justify-center items-center relative">
      <div id="event__intro-caption" class="flex items-center justify-center flex-col relative lg:py-8">
        <div class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6">
          <div class="w-1/2 flex items-center justify-center shadow-lg event__image">
            <NuxtImg v-if="item.image" :src="item.image.id" :modifiers="{ key: 'medium' }" :alt="item.title" />
          </div>
          <div class="w-1/2 flex items-center justify-center flex-col">
            <h1 class="w-full uppercase green pl-4 text-left event__page-title" :class="{ 'text-xs': tooLong }">
              <span class="navy">Event: </span>
              {{ item.title }}
            </h1>
            <h3 class="w-full pl-4 mt-4 tracking-widest bold uppercase event__date">
              <span class="opacity-50">Date: </span>{{ formatDate(item.date, 'MMMM do yyyy') }}
            </h3>
            <h3 v-if="item.time" class="w-full pl-4 tracking-widest bold uppercase event__date">
              <span class="opacity-50">Time: </span>{{ item.time }}
            </h3>
          </div>
        </div>

        <div
          v-if="item.initiatives.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 pb-6 mb-4 event__stats"
        >
          <div class="w-full flex flex-row flex-wrap items-center justify-start">
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ item.initiatives.length }} Initiative<span v-if="item.initiatives.length > 1">s</span> Served:
            </h4>
            <h5 v-for="(initiative, index) in item.initiatives" :key="index" class="uppercase mr-1 mb-1">
              {{ initiative.initiatives_id.title }}
              <span v-if="index + 1 < item.initiatives.length" class="green"> /</span>
            </h5>
          </div>
        </div>
      </div>
      <div id="event__description" class="w-5/6 lg:w-full" v-html="item.description" />
    </div>
    <div v-if="item.link" class="w-full mt-8 mb-8 px-4 md:px-12 flex items-center justify-center event__links">
      <a :href="item.link" target="_blank" rel="noreferrer">
        <span class="mr-1 uppercase tracking-wider">{{ item.link_title || 'Event Link' }}</span>
        <UniversalLinkIcon />
      </a>
    </div>
    <div
      v-if="resources.length"
      id="event__resources"
      class="w-full flex relative justify-center items-center flex-row flex-wrap"
    >
      <h2 class="uppercase green relative event__title">Event Resources</h2>
      <CardSwiper :items="resources" preset="resources">
        <template #default="{ item: resource }">
          <NowResourceCardVertical :item="resource.resources_id" />
        </template>
      </CardSwiper>
    </div>
    <div class="w-full px-4 md:px-12 pb-12 mt-12 flex event__share-section">
      <div class="w-full mb-4 flex justify-center items-center flex-col text-center">
        <!-- The live page's share links pointed at /regional-news/<event>, which does not exist; they point at the event. -->
        <SocialShare :path="`/regional-events/${item.url}`" :title="item.title" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/event';
#event .event__links .link-icon {
  margin-left: 4px;
}
</style>
