<script setup lang="ts">
import type { ResourceCardItem } from '#shared/types/st8'

const props = defineProps<{ item: ResourceCardItem | null }>()
const asset = useAsset()
const tooLong = computed(() => (props.item?.title.length ?? 0) > 30)
</script>

<template>
  <div
    v-if="item"
    :id="'resource-card-' + item.id"
    class="flex items-center justify-center flex-col py-12 shadow-lg resource-card-vertical"
  >
    <h2
      class="uppercase tracking-widest w-full mb-4 px-4 md:px-6 resource-card__title"
      :class="{ 'text-xs': tooLong }"
    >
      {{ item.title }}
    </h2>

    <a
      v-if="item.type === 'Internal File / PDF' && item.file"
      :href="asset(item.file.id)"
      class="w-full uppercase text-xs green bold tracking-widest px-4 md:px-6 resource-card__link"
      target="_blank"
    >
      View File
      <UniversalLinkIcon class="ml-2" />
    </a>
    <a
      v-if="item.type === 'External Link'"
      :href="item.link || undefined"
      target="_blank"
      rel="noreferrer"
      class="w-full uppercase text-xs green bold tracking-widest px-4 md:px-6 resource-card__link"
    >
      Go to Resource
      <UniversalLinkIcon class="ml-2" />
    </a>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/components/resourceCardVertical';
</style>
