<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/st8'

const props = defineProps<{ item: NewsCardItem }>()
const asset = useAsset()
const { orgAsset } = useOrganization()

const cover = computed(() => (props.item.cover_image ? asset(props.item.cover_image.id, 'medium') : orgAsset('default_cover_image', 'medium')))
// The card's description has always turned the curly-quote entities into plain apostrophes before cutting.
const short = (value: string | null | undefined, max: number) => {
  const text = removeTags(value).replace(/&[lr]squo;/gi, '\'')
  return text.length <= max ? text : `${text.slice(0, max)}...`
}
const date = computed(() => {
  const value = props.item.date_published || props.item.date_updated || props.item.date_created
  return value ? formatDate(value, 'EEEE MMMM do, yyyy') : ''
})
</script>

<template>
  <div
    :id="'news-card-' + item.id"
    class="w-full flex items-center justify-start flex-row mb-6 shadow-lg relative news-card"
  >
    <div class="w-full news-card__image" :style="{ backgroundImage: `url(${cover})` }" />
    <div class="w-full flex flex-col items-start justify-center news-card__content">
      <h2 class="uppercase tracking-wider w-full mb-2 news-card__title">
        {{ short(item.title, 65) }}
      </h2>
      <h5 v-if="date" class="w-full uppercase navy tracking-widest mb-2 news-card__date">
        {{ date }}
      </h5>
      <p class="w-full navy news-card__description">
        {{ short(item.article, 120) }}
      </p>
    </div>

    <NuxtLink
      v-if="item.type === 'ST8 Article'"
      :to="'/regional-news/' + item.url"
      class="flex items-center justify-center news-card__link"
      :aria-label="item.title"
    >
      <UniversalLinkIcon />
    </NuxtLink>
    <a
      v-if="item.type === 'External Article'"
      :href="item.link || undefined"
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-center news-card__link"
      :aria-label="item.title"
    >
      <UniversalLinkIcon />
    </a>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/components/newsCard';
</style>
