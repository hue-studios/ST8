<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { InitiativeItem } from '#shared/types/st8'

const directus = useDirectus()

const { data, error } = await useAsyncData('initiatives-index', () =>
  directus.request(readItems('initiatives', {
    fields: ['id', 'title', 'url', 'sort', 'goal'] as never,
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
    limit: -1,
  })) as unknown as Promise<InitiativeItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Initiatives could not be loaded', fatal: true })
}
const initiatives = computed(() => data.value!)

useShareMeta({
  title: 'Economic Development Initiatives for the Southern Tier Region of New York',
  description:
    'Southern Tier 8 regional initiatives are goals based on the region\'s needs to support, sustain, and advance the economic growth of the Southern Tier 8 region.',
  path: '/economic-development-initiatives/',
})

// An intro card shows its back (the goal and a link) while the pointer is over it.
const shown = ref<number | null>(null)

function smoothScroll(target: string) {
  const element = document.querySelector<HTMLElement>(target)
  if (element) window.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
}

// The line drawings trace themselves as the visitor scrolls.
useScrollLine({ container: 'initiatives__story', paths: ['straight-line', 'initiatives-line'], factor: 0.8 })
</script>

<template>
  <div id="initiatives">
    <div
      id="initiatives__intro"
      class="flex flex-row flex-wrap justify-center md:justify-between lg:justify-center items-center relative"
    >
      <h2
        id="initiatives__page-title"
        class="w-full sm:w-5/6 md:w-full uppercase navy text-center tracking-widest relative thin-font mb-4 md:mb-0"
        @click="smoothScroll('#initiatives__story')"
      >
        Initiatives
        <span class="tracking-wider">
          Learn what initiatives are and how they are created
          <UniversalPulseIcon class-name="inline-block" />
        </span>
      </h2>
      <div
        v-for="initiative in initiatives"
        :id="'intro-card-' + initiative.sort"
        :key="initiative.sort"
        class="relative flex flex-row flex-wrap justify-start items-end w-full sm:w-5/6 md:w-1/5 mt-3 mb-3 md:mt-0 md:mb-0 px-12 md:px-4 lg:px-6 md:py-6 initiatives__intro-card"
        :class="{ show: shown === initiative.sort }"
        @mouseenter="shown = initiative.sort"
        @mouseleave="shown = null"
      >
        <h3 class="green initiatives__intro-card-sort">{{ initiative.sort }}</h3>
        <h1 class="uppercase tracking-wider navy text-sm bold ml-2 initiatives__intro-card-title">
          {{ initiative.title }}
        </h1>
        <div class="w-full md:absolute flex flex-col justify-center px-2 initiatives__intro-card-back">
          <p class="navy text-xs mt-2 mb-2 md:mt-0">{{ truncate(initiative.goal, 140) }}</p>
          <NuxtLink
            :to="'/economic-development-initiatives/' + initiative.url"
            class="uppercase tracking-wider navy bold text-xs w-full text-right md:text-center lg:mt-2 block initiatives__intro-card-link"
          >
            Learn More<span class="hidden"> about {{ initiative.title }}.</span>
            <UniversalLinkIcon class="ml-0" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div id="initiatives__story" class="flex flex-col justify-start items-center relative initiatives__story">
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
      <svg id="lineSVG" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 963 2098.97">
        <path
          id="initiatives-line"
          data-name="Path 6807"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M481.12,0V155.37L1.5,154.52V455.24h960V752.59H481.12v300.23H1.5v298.51l960-6.25V1643.6H481.12V2099"
        />
      </svg>
      <h3 id="what-title" class="uppercase green relative initiatives__title">WHAT ARE INITIATIVES?</h3>

      <div id="what-description" class="relative p-6 initiatives__description">
        <p>
          Southern Tier 8 regional goals. As an Eight County Regional Economic Development Organization, we've
          analyzed the region's needs and strategically outlined goals of core importance to support, sustain, and
          advance the economic growth of the Southern Tier 8 region. We refer to these goals as initiatives.
        </p>
      </div>

      <h3 id="where-title" class="uppercase green relative initiatives__title">How do these initiatives work?</h3>

      <div id="where-description" class="relative p-6 initiatives__description">
        <p>
          Our regional initiatives are designed to target the area's challenges with a holistic approach. Our process
          involves developing innovative ideas, aligning the right partnerships, and developing feasible and smart
          solutions to meet the region's current and future needs. Within these initiatives, we develop programs,
          assist with funding and grant writing, support projects from other organizations that further these goals,
          and continuously adapt our initiatives to meet the demands of the ever-changing economic forecast and growth
          of our region.
        </p>
        <NuxtLink
          to="/economic-development-programs"
          class="w-full absolute uppercase tracking-wider green text-center lg:text-left lg:px-0"
        >
          Learn about our programs <UniversalLinkIcon class="ml-2" />
        </NuxtLink>
      </div>
      <h3 id="how-title" class="uppercase green relative initiatives__title">Where do these initiatives come from?</h3>
      <div id="how-description" class="relative p-6 initiatives__description">
        <p>
          In 2023, the Southern Tier 8 Regional Board and community partners and stakeholders drafted the region's
          Comprehensive Economic Development Strategy (CEDS). The CEDS is designed to serve as our organization's
          guiding document to be used in directing and evaluating regional community and economic development progress
          over the next five years. The CEDS serves as a strong foundation to evaluate and access our regional needs,
          challenges and opportunities.
        </p>
      </div>
      <UniversalPulseIcon icon-i-d="finish-btn" class-name="button" />
    </div>

    <div id="initiatives__conclusion" class="w-full flex items-center justify-center flex-col py-20">
      <h3 class="green thin-font uppercase relative tracking-widest pb-8">SELECT AN INITIATIVE TO LEARN MORE:</h3>

      <NuxtLink
        v-for="initiative in initiatives"
        :key="initiative.id"
        :to="'/economic-development-initiatives/' + initiative.url"
        class="uppercase tracking-widest py-4 bold mb-6"
      >
        {{ initiative.title }} <UniversalLinkIcon />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/initiatives';
</style>
