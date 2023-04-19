<template>
  <div
    id="regional"
    class="w-full flex flex-col justify-center items-center relative"
  >
    <div
      id="regional-intro"
      class="w-full flex flex-col justify-center items-center relative"
    >
      <!-- <logo-name id="logo-name-2"></logo-name> -->

      <logo-name></logo-name>

      <h2 id="tag" class="bold uppercase mt-6 tracking-wider">
        <span class="green">8</span> Counties.
        <span class="green">1</span> Region.
      </h2>
    </div>
    <div
      id="regional-info"
      class="w-full flex flex-col justify-center items-center relative py-20 px-4 text-justify"
    >
      <h1 class="green uppercase page-title tracking-widest mb-4">
        The Region
      </h1>
      <p class="mb-4 page-paragraph">
        The Southern Tier 8 Region is consists of 8 unique counties in rural
        Upstate New York: Broome, Tioga, Tompkins, Otsego, Cortland, Delaware,
        Schoharie, and Chenango. And across 8 counties, we encourage
        collaboration as one region.
      </p>
      <p class="mb-4 page-paragraph">
        Our 8 counties offer so many unique experiences for growth, business
        expansion, entrepreneurism, and overall a great work/life quality. The
        vast beauty and natural resources provide a healthy, active, and
        peaceful lifestyle.
      </p>
    </div>
    <div
      id="regional-counties"
      class="w-full flex flex-col items-center justify-center py-20 px-4 text-justify"
    >
      <h1 class="uppercase green page-title tracking-widest mb-4">
        Our Counties
      </h1>
      <p class="mb-4 page-paragraph">
        All of our 8 counties are unique in many aspects offering the an array
        of lifestyles, career and work opportunities, culture, and more.
      </p>
      <div id="regional-counties-image"></div>
    </div>
    <div
      id="regional-map"
      class="w-full flex flex-col items-center justify-center py-20 px-4 text-justify"
    >
      <h1 class="uppercase green page-title tracking-widest mb-4">
        Downtown / Urban Areas
      </h1>
      <p class="mb-4 page-paragraph">
        Our region has exceptional small towns and cities full of quaint
        restaurant, entrepreneurial minds, amazing real estate, a great
        work/life balance, and lots of opportunity.
      </p>
      <div id="regional-map-image"></div>
    </div>
    <div
      id="regional-industry"
      class="w-full flex flex-col justify-center items-center py-20 px-4 text-justify"
    >
      <h1 class="uppercase green page-title tracking-widest mb-4">Industry</h1>
      <p class="mb-4 page-paragraph">
        The Southern Tier 8 region has been the home for strong industries such
        as Healthcare, Advanced Manufacturing, Education, and Engineering to
        name a few. Our workforce is tried and tested, loyal, and hard-working.
        And we have many industries on the rise such as Agriculture, Smart
        Energy, and Communications.
      </p>
      <industry-chart class="flex items-center justify-center"></industry-chart>
    </div>
    <iframe
      src="https://ceds.southerntier8.org/"
      scrolling="no"
      style="min-height: 100vh; height: 4400px; overflow: hidden"
      class="w-full h-full overflow-hidden"
    ></iframe>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import industryChart from '~/components/industryChart'
import logoName from '~/components/layout/logoName'

export default {
  components: {
    logoName,
    industryChart,
  },

  data() {
    return {
      imageLocation: process.env.imageUrl,
    }
  },
  head() {
    return {
      title: 'Southern Tier of New York Regional and Economic Profile',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Southern Tier of New York Regional and Economic Profile',
        },
        {
          hid: 'description',
          name: 'description',
          content: "A comprehensive profile of the Southern Tier's economy.",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/regional-profile/',
        },
      ],
    }
  },
  computed: {},
  created() {},
  mounted() {
    gsap.registerPlugin(ScrollTrigger)
    // gsap.to('#cropped-overlay', {
    //   scrollTrigger: {
    //     trigger: '#mission-section', // this is the element that will trigger the animation
    //     start: 'top center', // this string defines the trigger and scroller start
    //     end: 'bottom center', // this string defines the trigger and scroller end
    //     scrub: true // this tells GSAP to link animation progress to scroll progress
    //   },
    //   x: '50px'
    // })
  },
  methods: {
    filteredBoard(county) {
      return this.board.filter((person) => person.county.title === county)
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pageStyles';
@import './assets/scss/pages/regional';
iframe {
  height: 2000px;
  @apply min-h-screen;
  body {
    overflow: hidden;
  }
}
</style>
