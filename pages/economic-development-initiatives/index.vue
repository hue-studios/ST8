<template>
  <div id="initiatives">
    <div
      id="initiatives__intro"
      class="flex flex-row flex-wrap justify-center md:justify-between lg:justify-center items-center relative"
    >
      <h2
        id="initiatives__page-title"
        class="w-full sm:w-5/6 md:w-full uppercase navy text-center tracking-widest relative thin-font mb-4 md:mb-0 navy"
        @click="smoothScroll('#initiatives__story')"
      >
        Initiatives
        <span class="tracking-wider"
          >Learn what initiatives are and how they are created
          <pulse-icon class-name="inline-block"></pulse-icon
        ></span>
      </h2>
      <div
        v-for="initiative in initiatives"
        :key="initiative.sort"
        class="relative flex flex-row flex-wrap justify-start items-end w-full sm:w-5/6 md:w-1/5 mt-3 mb-3 md:mt-0 md:mb-0 px-12 md:px-4 lg:px-6 md:py-6 initiatives__intro-card"
      >
        <h3 class="green initiatives__intro-card-sort">
          {{ initiative.sort }}
        </h3>
        <h1
          class="uppercase tracking-wider navy text-sm bold ml-2 initiatives__intro-card-title"
        >
          {{ initiative.title }}
        </h1>
        <div class="w-full md:absolute w-full initiatives__intro-card-back">
          <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
            {{ truncateString(initiative.goal, 170) }}
          </div>
          <nuxt-link
            :to="'/economic-development-initiatives/' + initiative.url"
            class="uppercase tracking-wider navy bold text-xs w-full text-right block initiatives__intro-card-link"
            >Learn More<span class="hidden">
              about {{ initiative.title }}.</span
            >
            <link-icon class="ml-0"></link-icon
          ></nuxt-link>
        </div>
      </div>
    </div>
    <div
      id="initiatives__story"
      class="flex flex-col justify-start items-center relative initiatives__story"
    >
      <pulse-icon icon-i-d="start-btn" class-name="button"></pulse-icon>
      <svg
        id="straightLineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 695.51"
      >
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
      <svg
        id="lineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 963 2098.97"
      >
        <path
          id="initiatives-line"
          data-name="Path 6807"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M481.12,0V155.37L1.5,154.52V455.24h960V752.59H481.12v300.23H1.5v298.51l960-6.25V1643.6H481.12V2099"
        />
      </svg>
      <h3 id="what-title" class="uppercase green relative initiatives__title">
        WHAT ARE INITIATIVES?
      </h3>

      <div id="what-description" class="relative p-6 initiatives__description">
        <p>
          Southern Tier 8 regional goals. As an Eight County Regional Economic
          Development Organization, we’ve analyzed the region’s needs and
          strategically outlined goals of core importance to support, sustain,
          and advance the economic growth of the Southern Tier 8 region. We
          refer to these goals as initiatives.
        </p>
      </div>

      <h3 id="where-title" class="uppercase green relative initiatives__title">
        How do these initiatives work?
      </h3>

      <div id="where-description" class="relative p-6 initiatives__description">
        <p>
          Our 5 regional initiatives are designed to target the area’s
          challenges with a holistic approach. Our process involves developing
          innovative ideas, aligning the right partnerships, and developing
          feasible and smart solutions to meet the region’s current and future
          needs. Within these initiatives, we develop programs, assist with
          funding and grant writing, support projects from other organizations
          that further these goals, and continuously adapt our initiatives to
          meet the demands of the ever-changing economic forecast and growth of
          our region.
        </p>
        <nuxt-link
          to="/economic-development-programs"
          class="w-full absolute uppercase tracking-wider green text-center lg:text-left lg:px-6"
          >Learn about our programs <link-icon class="ml-2"></link-icon
        ></nuxt-link>
      </div>
      <h3 id="how-title" class="uppercase green relative initiatives__title">
        Where do these initiatives come from?
      </h3>
      <div id="how-description" class="relative p-6 initiatives__description">
        <p>
          In 2018, the Southern Tier 8 Regional Board re-structured the region’s
          Comprehensive Economic Development Strategy (CEDS) process. The CEDS
          is designed to serve as our organization’s guiding document to be used
          in directing and evaluating regional community and economic
          development progress over the next five years. Due to the COVID-19
          pandemic in 2020, we’ve focused on our resiliency goals to meet the
          current and pressing needs of our area. But, the CEDS still serves as
          a strong foundation to evaluate and access our regional needs,
          challenges and opportunities.
        </p>
      </div>
      <pulse-icon icon-i-d="finish-btn" class-name="button"></pulse-icon>
    </div>

    <div
      id="initiatives__conclusion"
      class="w-full flex items-center justify-center flex-col py-20"
    >
      <h3 class="green thin-font uppercase relative tracking-widest pb-8">
        SELECT AN INITIATIVE TO LEARN MORE:
      </h3>

      <nuxt-link
        v-for="(initiative, index) in initiatives"
        :key="index"
        :to="'/economic-development-initiatives/' + initiative.url"
        class="uppercase tracking-widest py-4 bold"
        >{{ initiative.title }} <link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>
  </div>
</template>

<script>
import pulseIcon from '~/components/universal/pulseIcon'
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    pulseIcon,
    linkIcon,
  },
  async asyncData({ params, $axios }) {
    const initiativesReq = await $axios.$get(
      '/items/initiatives?fields=*.*.*&filter[status]=published'
    )
    return {
      initiatives: initiativesReq.data,
    }
  },
  head() {},

  computed: {
    firstThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort < 4)
    },
    lastThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort > 3)
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.lineFunction)
  },
  mounted() {
    // mobile line animation
    const straightLine = document.getElementById('straight-line')
    const straightLength = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = straightLength
    straightLine.style.strokeDashoffset = straightLength
    // desktop line animation
    const longLine = document.getElementById('initiatives-line')
    const length = longLine.getTotalLength()
    longLine.style.strokeDasharray = length
    longLine.style.strokeDashoffset = length
    window.addEventListener('scroll', this.lineFunction)
  },
  methods: {
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()
      const longLine = document.getElementById('initiatives-line')
      const length = longLine.getTotalLength()
      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('initiatives__story')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 0.8
        if (scrollPercent < 1) {
          const draw = length * scrollPercent
          longLine.style.strokeDashoffset = length - draw
          const drawStraight = straightLength * scrollPercent
          straightLine.style.strokeDashoffset = straightLength - drawStraight
        }
      })
    },
    smoothScroll(target) {
      console.log(target)

      const offsetTop = document.querySelector(target).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth',
      })
    },

    removeTags(str) {
      if (str === null || str === '') return false
      else str = str.toString()
      const strOne = str.replace(/&nbsp;/gi, ' ')
      return strOne.replace(/(<([^>]+)>)/gi, '')
    },
    truncateString(str, num) {
      const newStr = this.removeTags(str)
      if (newStr.length <= num) {
        return newStr
      }
      return newStr.slice(0, num) + '...'
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/initiatives';
</style>
