<template>
  <div id="housing-forecast" class="flex flex-col items-center justify-center">
    <div id="housing-forecast__top" class="w-full">
      <div
        id="housing-forecast__intro"
        class="flex flex-col flex-wrap justify-center items-center relative w-full"
      >
        <h1
          class="navy uppercase tracking-wider sm:tracking-widest text-center mb-4 w-5/6 md:w-4/5 max-w-3xl thin-font"
        >
          Housing Forecast
        </h1>
        <p class="navy text-center w-5/6 md:w-4/5 max-w-2xl">
          Housing data for the eight counties of the Southern Tier 8 Region —
          affordability, population, jobs, households and the housing stock
          itself — brought together to show how much new housing the region
          needs and who it needs to reach.
        </p>
        <nuxt-link
          v-if="program"
          :to="'/economic-development-programs/' + program.url"
          class="uppercase tracking-widest text-xs green mt-6 housing-forecast__program-link"
        >
          Part of {{ program.title }}
        </nuxt-link>
      </div>

      <section id="counties" class="w-full flex flex-col items-center">
        <div class="housing-forecast__measure housing-forecast__hero">
          <div class="housing-forecast__hero-map">
            <housing-county-map :counties="counties" />
            <p class="housing-forecast__hero-caption">
              Every figure on this page is also broken out by county. Pick one
              to see it on its own page.
            </p>
          </div>
          <dl class="housing-forecast__stats">
            <div v-for="stat in heroStats" :key="stat.label">
              <dt>{{ stat.value }}</dt>
              <dd>
                {{ stat.label }}
                <span class="housing-forecast__stat-source"
                  >({{ stat.source }})</span
                >
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>

    <housing-forecast-sections :sections="sections" :supply-need="supplyNeed" />

    <div
      id="housing-forecast__sources"
      class="housing-forecast__measure mb-24 pt-8"
    >
      <h4 class="uppercase tracking-widest green bold mb-3">About this data</h4>
      <p class="navy mb-2">
        These charts are produced and hosted by CommunityScale and update
        automatically as their data pipelines refresh. The underlying figures
        come from public sources including the Census Bureau and American
        Community Survey, HUD, the Bureau of Labor Statistics, LEHD LODES and
        the Building Permit Survey, alongside commercial listing data.
      </p>
      <p class="navy">
        {{ citation }}
        <a
          :href="csOrigin + '/dashboard'"
          target="_blank"
          rel="noopener noreferrer"
          class="green"
          >View the full dashboard</a
        >
        for methodology and per-chart data sources.
      </p>
    </div>
  </div>
</template>

<script>
import {
  SECTIONS,
  CS_ORIGIN,
  CS_CITATION,
  PROGRAM_SLUG,
  HERO_STATS,
  SUPPLY_NEED,
} from '~/config/housingForecast'
import { shareMeta, staticCard } from '~/config/share'
import housingCountyMap from '~/components/housing/countyMap'
import housingForecastSections from '~/components/housing/forecastSections'

export default {
  components: {
    housingCountyMap,
    housingForecastSections,
  },
  async asyncData({ $axios }) {
    // Neither call is load-bearing for the charts, so a CMS hiccup costs us the cross-link or
    // the map's labels rather than the page.
    const [program, counties] = await Promise.all([
      $axios
        .$get(
          '/items/programs?fields=id,title,url&filter[url][_eq]=' +
            encodeURIComponent(PROGRAM_SLUG) +
            '&filter[status][_eq]=published&limit=1'
        )
        .then((res) => res.data[0] || null)
        .catch(() => null),
      $axios
        .$get(
          '/items/counties?sort=sort&filter[status][_eq]=published' +
            '&fields=title,url,geoid'
        )
        // The region-wide row has no geoid and no shape on the map.
        .then((res) => res.data.filter((c) => c.geoid))
        .catch(() => []),
    ])

    return { program, counties }
  },
  data() {
    return {
      sections: SECTIONS,
      supplyNeed: SUPPLY_NEED,
      csOrigin: CS_ORIGIN,
      citation: CS_CITATION,
      heroStats: HERO_STATS,
    }
  },
  head() {
    const title = 'Housing Forecast - Southern Tier 8 Region'
    const description =
      'Housing affordability, population, jobs and housing supply data for the eight counties of the Southern Tier 8 Region of New York.'
    return {
      title:
        'Housing Forecast - Housing Data for the Southern Tier Region of New York',
      meta: shareMeta({
        title,
        description,
        path: '/regional-housing-forecast',
        image: staticCard('housing-forecast.png'),
        imageAlt:
          'The eight counties of the Southern Tier 8 Region, and the 4,271 new homes the region needs by 2031',
      }),
      link: [
        { rel: 'preconnect', href: CS_ORIGIN, crossorigin: 'true' },
        {
          rel: 'canonical',
          href: 'https://southerntier8.org/regional-housing-forecast',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pageStyles';
@use '~/assets/scss/pages/housingForecast';
</style>
