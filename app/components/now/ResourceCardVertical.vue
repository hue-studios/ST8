<script setup lang="ts">
import type { ResourceCardItem } from '#shared/types/st8'

const props = defineProps<{ item: ResourceCardItem | null }>()
const asset = useAsset()
const { ask } = useResourceRequest()
const tooLong = computed(() => (props.item?.title.length ?? 0) > 30)
// The type decides, not the file: a gated row arrives without its file (see cms/[...path].get.ts).
const isFile = computed(() => props.item?.type === 'Internal File / PDF')
// A gated file opens the request form first and has no href, so its address is not in the page for crawlers or a
// middle-click to open (the same rule as NowResourceCardData).
const gated = computed(() => isFile.value && !!props.item?.require_info)
const fileHref = computed(() => (isFile.value && !gated.value && props.item?.file ? asset(props.item.file.id) : undefined))

function onFileClick(event: MouseEvent) {
  if (!gated.value || !props.item) return
  event.preventDefault()
  ask({ id: props.item.id, title: props.item.title })
}
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
      v-if="isFile"
      :href="fileHref"
      class="w-full uppercase text-xs green bold tracking-widest px-4 md:px-6 resource-card__link"
      :target="fileHref ? '_blank' : undefined"
      :style="gated ? { cursor: 'pointer' } : undefined"
      @click="onFileClick"
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
