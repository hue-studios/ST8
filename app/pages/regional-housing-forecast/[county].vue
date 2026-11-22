<script setup lang="ts">
import { readItems } from '@directus/sdk'

interface CountyRow {
  title: string
  url: string
  geoid: string
  programs?: Array<{ programs_id: { title: string, url: string, status: string } | null }>
}

const route = useRoute()
const slug = computed(() => String(route.params.county))
const directus = useDirectus()

// One call for the whole collection: the page needs its own county, and the map needs the others to label and link them.
const { data, error } = await useAsyncData(
  () => `housing-forecast-${slug.value}`,
  () => directus.request(readItems('counties', {
    fields: ['title', 'url', 'geoid', 'programs.programs_id.title', 'programs.programs_id.url', 'programs.programs_id.status'] as never,
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
    limit: -1,
  })) as unknown as Promise<CountyRow[]>,
  { watch: [slug] },
)
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This county could not be loaded', fatal: true })
}
const county = computed(() => data.value?.find(c => c.url === slug.value && c.geoid))
if (!county.value) {
  throw createError({ statusCode: 404, statusMessage: 'County not found', fatal: true })
}

const programs = computed(() => (county.value?.programs ?? [])
  .map(p => p.programs_id)
  .filter((p): p is { title: string, url: string, status: string } => !!p && p.status === 'published'))
// Only the rows the map can actually draw and link.
const mapCounties = computed(() => (data.value ?? []).filter(c => c.geoid).map(({ title, url, geoid }) => ({ title, url, geoid })))
// CommunityScale serves every card scoped to a county under this prefix.
const scope = computed(() => `/county/${county.value?.geoid}`)
// One share card per county, keyed on the FIPS code rather than the CMS slug, so renaming a county's URL cannot point
// this at a file that was never drawn; a county with no card of its own falls back to the regional one.
const shareImage = computed(() => {
  const shape = COUNTY_SHAPES.find(c => c.geoid === county.value?.geoid)
  return staticCard(shape ? `housing-forecast-${shape.name.toLowerCase()}.png` : 'housing-forecast.png')
})

useShareMeta(() => ({
  title: `${county.value?.title} County Housing Forecast`,
  description: `Housing affordability, population, jobs and housing stock data for ${county.value?.title} County in the Southern Tier region of New York.`,
  path: `/regional-housing-forecast/${county.value?.url}`,
  image: shareImage.value,
  imageAlt: `${county.value?.title} County picked out of the eight Southern Tier 8 counties`,
}))
useHead(() => ({
  title: `${county.value?.title} County Housing Forecast - Southern Tier Region of New York`,
  link: [
    { rel: 'preconnect', href: CS_ORIGIN, crossorigin: 'anonymous' },
    { rel: 'canonical', href: `${SITE_URL}/regional-housing-forecast/${county.value?.url}` },
  ],
}))
</script>

<template>
  <div v-if="county" id="housing-forecast" class="flex flex-col items-center justify-center">
    <div id="housing-forecast__top" class="w-full">
      <div id="housing-forecast__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
        <NuxtLink to="/regional-housing-forecast" class="uppercase tracking-widest text-xs green mb-4 housing-forecast__back">
          &larr; Regional housing forecast
        </NuxtLink>
        <h1 class="navy uppercase tracking-wider sm:tracking-widest text-center mb-4 w-5/6 md:w-4/5 max-w-3xl thin-font">
          {{ county.title }} County
        </h1>
        <p class="navy text-center w-5/6 md:w-4/5 max-w-2xl">
          Housing affordability, population, jobs and housing stock for {{ county.title }} County — the same measures
          as the regional forecast, narrowed to this one county.
        </p>
      </div>

      <section id="counties" class="w-full flex flex-col items-center">
        <div class="housing-forecast__measure housing-forecast__hero">
          <div class="housing-forecast__hero-map">
            <HousingCountyMap :counties="mapCounties" :current-geoid="county.geoid" />
            <p class="housing-forecast__hero-caption">
              Pick another county to switch, or go back to the
              <NuxtLink to="/regional-housing-forecast" class="green">regional forecast</NuxtLink>.
            </p>
          </div>
          <HousingCountyPrograms v-if="programs.length" :programs="programs" :county-name="county.title" />
        </div>
      </section>
    </div>

    <HousingForecastSections :sections="SECTIONS" :scope="scope" />

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
