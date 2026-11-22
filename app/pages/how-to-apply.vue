<script setup lang="ts">
import { readSingleton } from '@directus/sdk'
import type { HowToApply } from '#shared/types/st8'

const directus = useDirectus()

const { data, error } = await useAsyncData('how-to-apply', () =>
  directus.request(readSingleton('how_to_apply', {
    fields: [
      'introduction', 'steps', 'arc_info', 'resources.resources_id.id', 'resources.resources_id.title',
      'resources.resources_id.type', 'resources.resources_id.link', 'resources.resources_id.file.id',
    ] as never,
  })) as unknown as Promise<HowToApply>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'This page could not be loaded', fatal: true })
}
const apply = computed(() => data.value!)
const resources = computed(() => (apply.value.resources || []).filter(r => r.resources_id))

useShareMeta({
  title: 'Apply for Funding - Economic Development for the Southern Tier Region of New York',
  description: 'How to apply for funding to further the economy of the Southern Tier of New York.',
  path: '/how-to-apply/',
})

// The line draws as the visitor scrolls.
let straightLine: SVGPathElement | null = null
let straightLength = 0
onMounted(() => {
  straightLine = document.getElementById('straight-line') as unknown as SVGPathElement
  straightLength = straightLine.getTotalLength()
  straightLine.style.strokeDasharray = String(straightLength)
  straightLine.style.strokeDashoffset = String(straightLength)
})
useEventListener('scroll', () => {
  if (!straightLine) return
  requestAnimationFrame(() => {
    const info = document.getElementById('apply-info')
    if (!info || !straightLine) return
    const scrollPercent = (window.scrollY / info.getBoundingClientRect().height) * 0.5
    if (scrollPercent < 1) straightLine.style.strokeDashoffset = String(straightLength - straightLength * scrollPercent)
  })
})
</script>

<template>
  <div id="apply" class="flex items-center justify-center flex-col">
    <div id="apply-intro" class="pt-24 pb-12 md:py-24 flex flex-col justify-center items-center">
      <h1 class="uppercase navy pb-3 md:pb-0 md:mb-6 relative thin-font tracking-widest">ARC Opportunities</h1>
      <p v-if="apply.introduction" class="whitespace-pre-line">{{ apply.introduction.trim() }}</p>
    </div>
    <div id="apply-info" class="w-full flex items-center flex-col justify-center pt-20 relative px-8 mx-auto">
      <UniversalPulseIcon icon-i-d="start-btn" class-name="button" />
      <svg id="straightLineSVG" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 695.51">
        <path
          id="straight-line"
          data-name="Path 6808"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M.5,0V695.51"
        />
      </svg>
      <div id="apply-info__container" class="flex flex-col items-start px-8">
        <h2 class="w-full page-title uppercase tracking-widest mb-4 pt-2 pb-1 thin-font relative text-center hidden">
          Steps
        </h2>
        <div class="whitespace-pre-wrap mb-0 pb-4 text-justify" v-html="apply.steps" />

        <h2 class="w-full page-title uppercase tracking-widest mt-8 mb-4 thin-font pt-2 pb-1 text-center relative">
          What is ARC?
        </h2>
        <div class="whitespace-pre-wrap mb-10 pb-4 text-justify" v-html="apply.arc_info" />
      </div>
    </div>
    <div v-if="resources.length" id="apply__resources" class="w-full flex relative justify-center items-center flex-col">
      <h2 class="w-full uppercase green relative text-center apply__title">Resources</h2>
      <CardSwiper :items="resources" preset="resources" :pagination="false" class="w-full">
        <template #default="{ item }">
          <NowResourceCardVertical :item="item.resources_id" />
        </template>
      </CardSwiper>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/apply';
</style>
