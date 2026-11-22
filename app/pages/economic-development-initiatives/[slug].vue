<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { InitiativeItem, ProgramListItem } from '#shared/types/st8'
import { PROGRAM_CARD_FIELDS } from '#shared/utils/programs'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const directus = useDirectus()

const { data, error } = await useAsyncData(
  () => `initiative-${slug.value}`,
  async () => {
    const [rows, programs] = await Promise.all([
      directus.request(readItems('initiatives', {
        filter: { url: { _eq: slug.value } },
        fields: ['id', 'title', 'url', 'sort', 'goal', 'opportunity'] as never,
        limit: 1,
      })),
      directus.request(readItems('programs', {
        filter: {
          _and: [
            { initiatives: { initiatives_id: { url: { _eq: slug.value } } } },
            { status: { _eq: 'published' } },
          ],
        } as never,
        fields: [...PROGRAM_CARD_FIELDS, 'sort'] as never,
        limit: 5,
      })),
    ])
    return {
      initiative: (rows as unknown as InitiativeItem[])[0] ?? null,
      programs: programs as unknown as ProgramListItem[],
    }
  },
  { watch: [slug] },
)
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This initiative could not be loaded', fatal: true })
}
if (!data.value?.initiative) {
  throw createError({ statusCode: 404, statusMessage: 'Initiative not found', fatal: true })
}
const initiative = computed(() => data.value!.initiative!)
const programs = computed(() => data.value!.programs)

const title = `${initiative.value.title} - Regional Initiative for the Southern Tier of New York`
useShareMeta({
  title,
  description: cardText(initiative.value.goal, 120),
  path: `/economic-development-initiatives/${initiative.value.url}`,
})

// Both story lines draw as the visitor scrolls.
let straightLine: SVGPathElement | null = null
let longLine: SVGPathElement | null = null
let straightLength = 0
let longLength = 0
onMounted(() => {
  straightLine = document.getElementById('straight-line') as unknown as SVGPathElement
  longLine = document.getElementById('initiative-line') as unknown as SVGPathElement
  straightLength = straightLine.getTotalLength()
  straightLine.style.strokeDasharray = String(straightLength)
  straightLine.style.strokeDashoffset = String(straightLength)
  longLength = longLine.getTotalLength()
  longLine.style.strokeDasharray = String(longLength)
  longLine.style.strokeDashoffset = String(longLength)
})
useEventListener('scroll', () => {
  if (!straightLine || !longLine) return
  requestAnimationFrame(() => {
    const story = document.getElementById('initiative__story')
    if (!story || !straightLine || !longLine) return
    const scrollPercent = (window.scrollY / story.getBoundingClientRect().height) * 0.8
    if (scrollPercent < 1) {
      longLine.style.strokeDashoffset = String(longLength - longLength * scrollPercent)
      straightLine.style.strokeDashoffset = String(straightLength - straightLength * scrollPercent)
    }
  })
})
</script>

<template>
  <div id="initiative">
    <div id="initiative__intro" class="w-full flex flex-col justify-center items-center relative">
      <h2 id="initiative__bg-title" class="uppercase absolute">Ini tiati ves</h2>
      <div class="flex items-center justify-center flex-row shrink-0 initiative__title-box">
        <h3 class="navy thin-font initiative__sort">{{ initiative.sort }}</h3>
        <h1 class="shrink uppercase text-left green relative initiative__title">{{ initiative.title }}</h1>
      </div>
    </div>
    <div id="initiative__story" class="flex flex-col justify-start items-center relative initiative__story">
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
      <svg id="lineSVG" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 963 2018.24">
        <path
          id="initiative-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M961.5,0V396.94H1.5V697.67h960V995H481.12v300.22H1.5v595.59H481.12v127.41"
        />
      </svg>

      <h3 id="goal-title" class="uppercase green relative initiative__title">The Goal</h3>
      <div id="goal-description" class="relative p-6 text-justify initiative__description" v-html="initiative.goal" />

      <h3 id="opportunity-title" class="uppercase green relative initiative__title">The Opportunity</h3>
      <div
        id="opportunity-description"
        class="relative p-6 text-justify initiative__description"
        v-html="initiative.opportunity"
      />
      <UniversalPulseIcon icon-i-d="finish-btn" class-name="button" />
    </div>
    <div class="flex flex-col justify-center items-center relative initiative__related">
      <div
        id="program__programs"
        class="w-full flex relative justify-center items-center flex-row flex-wrap program__section"
      >
        <h2 class="uppercase green relative program__title">{{ initiative.title }} Programs</h2>
        <CardSwiper :items="programs" preset="initiative" slide-class="flex flex-col items-center justify-center px-3 sm:px-8">
          <template #default="{ item }">
            <ProgramsProgramCard :program="item" />
          </template>
        </CardSwiper>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/initiative';
</style>
