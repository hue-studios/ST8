<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { ProgramListItem } from '#shared/types/st8'
import { PROGRAM_CARD_FIELDS } from '#shared/utils/programs'

const directus = useDirectus()

// The listing's own fields: a program card shows its initiatives, counties and partners as counts.
const { data, error } = await useAsyncData('programs-index', async () => {
  const [programs, initiatives] = await Promise.all([
    directus.request(readItems('programs', {
      fields: PROGRAM_CARD_FIELDS as never,
      filter: { status: { _eq: 'published' } },
      limit: -1,
    })),
    directus.request(readItems('initiatives', {
      fields: ['id', 'title', 'url'] as never,
      filter: { status: { _eq: 'published' } },
      sort: ['sort'],
      limit: -1,
    })),
  ])
  return {
    programs: programs as unknown as ProgramListItem[],
    initiatives: initiatives as unknown as Array<{ id: number, title: string, url: string }>,
  }
})
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Programs could not be loaded', fatal: true })
}
const programs = computed(() => data.value!.programs)
const initiatives = computed(() => data.value!.initiatives)
const today = formatDate(nowInNewYork(), 'MMM do yyyy')

const title = 'Economic Development Programs for the Southern Tier Region of New York'
useShareMeta({
  title,
  description:
    'Southern Tier 8 regional programs are designed to create innovative ideas, develop practical solutions, and align strategic partnerships to meet the challenges and advance economic growth in the Southern Tier 8 Region.',
  // The trailing slash is what has always been shared, and Facebook keys a URL's share history off og:url.
  path: '/economic-development-programs/',
  image: staticCard('economic-development-programs.png'),
  imageAlt: 'Economic Development Programs - Southern Tier 8 Region',
})

// The line draws down the page as the visitor scrolls.
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
    const container = document.getElementById('programs__program-cards')
    if (!container || !straightLine) return
    const scrollPercent = (window.scrollY / container.getBoundingClientRect().height) * 0.8
    if (scrollPercent < 1) straightLine.style.strokeDashoffset = String(straightLength - straightLength * scrollPercent)
  })
})
</script>

<template>
  <div id="programs">
    <div id="programs__intro" class="flex flex-col justify-center items-center relative">
      <div class="w-full absolute background text-left">
        <h3 v-for="initiative in initiatives" :key="initiative.id" class="uppercase bold">
          {{ initiative.title }}
        </h3>
      </div>
      <h1 id="programs__page-title" class="navy uppercase tracking-widest w-5/6 thin-font text-center mb-4">
        Programs
      </h1>
      <p class="navy w-5/6 md:w-3/5 font-normal text-center">
        Our programs are designed to implement our five core initiatives. Each program is designed to create innovative
        ideas, develop practical solutions, and align strategic partnerships to meet the challenges and advance economic
        growth in the Southern Tier 8 Region.
      </p>
      <div id="programs__total" class="mt-6">
        <h5 class="uppercase tracking-widest bold px-8 py-6">
          <span class="green mr-1">{{ programs.length }}</span>Programs /
          <span class="thin-font">{{ today }}</span>
        </h5>
      </div>
    </div>
    <div
      id="programs__program-cards"
      class="relative w-full flex items-center justify-center flex-col pb-60 mb-20 pt-20"
    >
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
      <div class="w-full flex flex-col items-center justify-center px-3 sm:px-8">
        <ProgramsProgramCard v-for="program in programs" :key="program.id" :program="program" class="blur-bg" />
        <div>
          <UniversalPulseIcon icon-i-d="finish-btn" class-name="button" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/programs';
</style>
