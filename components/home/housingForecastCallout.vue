<!--
  Not used at the moment. This was the home page's Housing Forecast callout (county map, the
  4,271 figure and a link to /regional-housing-forecast) until the forecast was taken out of the
  navigation; it is kept for possible reuse. To bring it back, render
  <home-housing-forecast-callout :counties="counties" /> on the home page and fetch `counties`
  there as before: /items/counties?sort=sort&filter[status][_eq]=published&fields=title,url,geoid,
  keeping only the rows that have a geoid. The 4,271 below is hardcoded; read it from the
  housing_page figures if this comes back.
-->
<template>
  <div
    id="home__housing"
    class="w-full flex justify-center items-center relative"
  >
    <div class="home__housing-inner flex flex-col lg:flex-row items-center">
      <div class="home__housing-map">
        <housing-county-map :counties="counties" />
      </div>
      <div class="home__housing-copy">
        <h2 class="uppercase thin-font navy mb-3">
          <span class="green small-title block tracking-widest bold"
            >Regional Data</span
          >Housing Forecast
        </h2>
        <p class="navy mb-4">
          Affordability, population, jobs and housing supply across the eight
          counties — and what the region needs to build next.
        </p>
        <p class="home__housing-stat navy mb-5">
          <strong>4,271</strong>
          <span>new units needed over the next five years</span>
        </p>
        <nuxt-link
          to="/regional-housing-forecast"
          class="uppercase green link-font"
        >
          Explore the forecast
          <link-icon class="ml-1" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import housingCountyMap from '~/components/housing/countyMap'
import linkIcon from '~/components/universal/linkIcon'

export default {
  components: {
    housingCountyMap,
    linkIcon,
  },
  props: {
    // Rows from the Directus `counties` collection, so the map can label and link them.
    counties: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
