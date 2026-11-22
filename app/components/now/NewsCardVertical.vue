<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/st8'

const props = defineProps<{ item: NewsCardItem }>()
const asset = useAsset()
const { orgAsset } = useOrganization()

// The article's cover, or the organization's default cover.
const cover = computed(() => (props.item.cover_image ? asset(props.item.cover_image.id, 'medium') : orgAsset('default_cover_image', 'medium')))
const date = computed(() => {
  const value = props.item.date_published || props.item.date_updated || props.item.date_created
  return value ? formatDate(value, 'EEEE MMMM do, yyyy') : ''
})
const tags = computed(() => props.item.tags || [])
</script>

<template>
  <div
    :id="'news-card-vertical-' + item.id"
    class="flex items-center justify-start flex-col shadow-lg news-card-vertical"
  >
    <div
      class="w-full news-card-vertical__image"
      :class="item.cover_image ? 'mb-8' : 'mb-4'"
      :style="{ backgroundImage: `url(${cover})` }"
    />

    <div
      v-if="tags.length > 0"
      class="w-full flex flex-row items-start justify-start flex-wrap text-xs mb-4 px-4 md:px-6 news-card-vertical__tags"
    >
      <h5 v-for="(tag, index) in tags" :key="index" class="uppercase white mr-2 mb-2 bold">
        {{ tag }}
      </h5>
    </div>
    <h2 class="uppercase w-full px-4 news-card-vertical__title">
      {{ truncate(item.title, 55) }}
    </h2>

    <h5
      v-if="date"
      class="w-full uppercase navy tracking-widest mb-4 px-4 news-card-vertical__date"
      :class="item.date_published ? 'mt-4' : ''"
    >
      {{ date }}
    </h5>

    <NuxtLink
      v-if="item.type === 'ST8 Article'"
      :to="'/regional-news/' + item.url"
      class="w-full uppercase text-xs green bold tracking-widest pb-8 px-4"
    >
      Read Article
      <UniversalLinkIcon class="ml-2" />
    </NuxtLink>
    <a
      v-if="item.type === 'External Article'"
      :href="item.link || undefined"
      target="_blank"
      rel="noreferrer"
      class="w-full uppercase text-xs green bold tracking-widest pb-8 px-4"
    >
      Visit Article Link
      <UniversalLinkIcon class="ml-2" />
    </a>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/components/newsCardVertical';
</style>
