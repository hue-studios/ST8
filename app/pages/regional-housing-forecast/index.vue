<script setup lang="ts">
import { readItems, readSingleton } from '@directus/sdk'

const directus = useDirectus()

// None of the three is load-bearing for the charts, so a CMS hiccup costs the cross-link, the map's labels or the
// headline figures (which fall back to the config) rather than the page.
const { data } = await useAsyncData('housing-forecast', async () => {
  const [program, counties, page] = await Promise.all([
    directus.request(readItems('programs', {
      fields: ['id', 'title', 'url'] as never,
      filter: { _and: [{ url: { _eq: PROGRAM_SLUG } }, { status: { _eq: 'published' } }] },
      limit: 1,
    })).then(rows => ((rows as unknown as Array<{ title: string, url: string }>)[0] ?? null)).catch(() => null),
    directus.request(readItems('counties', {
      fields: ['title', 'url', 'geoid'] as never,
      filter: { status: { _eq: 'published' } },
      sort: ['sort'],
      limit: -1,
    }))
      // The region-wide row has no geoid and no shape on the map.
      .then(rows => (rows as unknown as Array<{ title: string, url: string, geoid: string }>).filter(c => c.geoid))
      .catch(() => [] as Array<{ title: string, url: string, geoid: string }>),
    directus.request(readSingleton('housing_page', {
      fields: ['figures_as_of', 'headline_figures', 'need_total', 'need_replacement', 'need_shortage'] as never,
    })).then(row => row as unknown as HousingPageFigures).catch(() => null),
  ])
  const { heroStats, supplyNeed } = forecastFigures(page)
  return { program, counties, heroStats, supplyNeed }
})

const program = computed(() => data.value?.program ?? null)
const counties = computed(() => data.value?.counties ?? [])
const heroStats = computed(() => data.value?.heroStats ?? HERO_STATS)
const supplyNeed = computed(() => data.value!.supplyNeed)

useShareMeta({
  title: 'Housing Forecast - Southern Tier 8 Region',
  description:
    'Housing affordability, population, jobs and housing supply data for the eight counties of the Southern Tier 8 Region of New York.',
  path: '/regional-housing-forecast',
  image: staticCard('housing-forecast.png'),
  imageAlt: `The eight counties of the Southern Tier 8 Region, and the ${supplyNeed.value.total} new homes the region needs by 2031`,
})
useHead({
  title: 'Housing Forecast - Housing Data for the Southern Tier Region of New York',
  link: [
    { rel: 'preconnect', href: CS_ORIGIN, crossorigin: 'anonymous' },
    { rel: 'canonical', href: `${SITE_URL}/regional-housing-forecast` },
  ],
})
</script>

<template>
  <div id="housing-forecast" class="flex flex-col items-center justify-center">
    <div id="housing-forecast__top" class="w-full">
      <div id="housing-forecast__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
        <h1 class="navy uppercase tracking-wider sm:tracking-widest text-center mb-4 w-5/6 md:w-4/5 max-w-3xl thin-font">
          Housing Forecast
        </h1>
        <p class="navy text-center w-5/6 md:w-4/5 max-w-2xl">
          Housing data for the eight counties of the Southern Tier 8 Region — affordability, population, jobs,
          households and the housing stock itself — brought together to show how much new housing the region needs and
          who it needs to reach.
        </p>
        <NuxtLink
          v-if="program"
          :to="`/economic-development-programs/${program.url}`"
          class="uppercase tracking-widest text-xs green mt-6 housing-forecast__program-link"
        >
          Part of {{ program.title }}
        </NuxtLink>
      </div>

      <section id="counties" class="w-full flex flex-col items-center">
        <div class="housing-forecast__measure housing-forecast__hero">
          <div class="housing-forecast__hero-map">
            <HousingCountyMap :counties="counties" />
            <p class="housing-forecast__hero-caption">
              Every figure on this page is also broken out by county. Pick one to see it on its own page.
            </p>
          </div>
          <dl class="housing-forecast__stats">
            <div v-for="stat in heroStats" :key="stat.label">
              <dt>{{ stat.value }}</dt>
              <dd>
                {{ stat.label }}
                <span v-if="stat.source" class="housing-forecast__stat-source">({{ stat.source }})</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>

    <HousingForecastSections :sections="SECTIONS" :supply-need="supplyNeed" />

    <div id="housing-forecast__sources" class="housing-forecast__measure mb-24 pt-8">
      <h4 class="uppercase tracking-widest green bold mb-3">About this data</h4>
      <p class="navy mb-2">
        These charts are produced and hosted by CommunityScale and update automatically as their data pipelines
        refresh. The underlying figures come from public sources including the Census Bureau and American Community
        Survey, HUD, the Bureau of Labor Statistics, LEHD LODES and the Building Permit Survey, alongside commercial
        listing data.
      </p>
      <p class="navy">
        {{ CS_CITATION }}
        <a :href="`${CS_ORIGIN}/dashboard`" target="_blank" rel="noopener noreferrer" class="green">View the full dashboard</a>
        for methodology and per-chart data sources.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pageStyles';
@use '~/assets/scss/pages/housingForecast';
</style>
