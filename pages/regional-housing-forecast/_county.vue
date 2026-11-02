<template>
  <div id="housing-forecast" class="flex flex-col items-center justify-center">
    <div id="housing-forecast__top" class="w-full">
      <div
        id="housing-forecast__intro"
        class="flex flex-col flex-wrap justify-center items-center relative w-full"
      >
        <nuxt-link
          to="/regional-housing-forecast"
          class="uppercase tracking-widest text-xs green mb-4 housing-forecast__back"
        >
          &larr; Regional housing forecast
        </nuxt-link>
        <h1
          class="navy uppercase tracking-wider sm:tracking-widest text-center mb-4 w-5/6 md:w-4/5 max-w-3xl thin-font"
        >
          {{ county.title }} County
        </h1>
        <p class="navy text-center w-5/6 md:w-4/5 max-w-2xl">
          Housing affordability, population, jobs and housing stock for
          {{ county.title }} County — the same measures as the regional
          forecast, narrowed to this one county.
        </p>
      </div>

      <section id="counties" class="w-full flex flex-col items-center">
        <div class="housing-forecast__measure housing-forecast__hero">
          <div class="housing-forecast__hero-map">
            <housing-county-map
              :counties="counties"
              :current-geoid="county.geoid"
            />
            <p class="housing-forecast__hero-caption">
              Pick another county to switch, or go back to the
              <nuxt-link to="/regional-housing-forecast" class="green"
                >regional forecast</nuxt-link
              >.
            </p>
          </div>
          <housing-county-programs
            v-if="programs.length"
            :programs="programs"
            :county-name="county.title"
          />
        </div>
      </section>
    </div>

    <housing-forecast-sections :sections="sections" :scope="scope" />

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
import { SECTIONS, CS_ORIGIN, CS_CITATION } from '~/config/housingForecast'
import housingCountyMap from '~/components/housing/countyMap'
import housingCountyPrograms from '~/components/housing/countyPrograms'
import housingForecastSections from '~/components/housing/forecastSections'

export default {
  components: {
    housingCountyMap,
    housingCountyPrograms,
    housingForecastSections,
  },
  async asyncData({ params, $axios, error }) {
    // One call for the whole collection: the page needs its own county, and the map needs the
    // others to label and link them.
    const counties = await $axios
      .$get(
        '/items/counties?sort=sort&filter[status][_eq]=published' +
          '&fields=title,url,geoid,programs.programs_id.title,programs.programs_id.url,' +
          'programs.programs_id.status'
      )
      .then((res) => res.data)
      .catch(() => [])

    const county = counties.find((c) => c.url === params.county && c.geoid)
    if (!county) {
      return error({ statusCode: 404, message: 'County not found' })
    }

    const programs = (county.programs || [])
      .map((p) => p.programs_id)
      .filter((p) => p && p.status === 'published')

    // Only the rows the map can actually draw and link.
    const mapCounties = counties
      .filter((c) => c.geoid)
      .map(({ title, url, geoid }) => ({ title, url, geoid }))

    return { county, programs, counties: mapCounties }
  },
  data() {
    return {
      sections: SECTIONS,
      csOrigin: CS_ORIGIN,
      citation: CS_CITATION,
    }
  },
  head() {
    const name = this.county.title
    const description =
      'Housing affordability, population, jobs and housing stock data for ' +
      name +
      ' County in the Southern Tier region of New York.'
    return {
      title:
        name + ' County Housing Forecast - Southern Tier Region of New York',
      meta: [
        { hid: 'description', name: 'description', content: description },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://southerntier8.org/regional-housing-forecast/' +
            this.county.url,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: name + ' County Housing Forecast',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: name + ' County Housing Forecast',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: description,
        },
      ],
      link: [
        { rel: 'preconnect', href: CS_ORIGIN, crossorigin: 'true' },
        {
          rel: 'canonical',
          href:
            'https://southerntier8.org/regional-housing-forecast/' +
            this.county.url,
        },
      ],
    }
  },
  computed: {
    // CommunityScale serves every card scoped to a county under this prefix.
    scope() {
      return '/county/' + this.county.geoid
    },
  },
}
</script>

<style lang="scss">
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pageStyles';
@use '~/assets/scss/pages/housingForecast';
</style>
