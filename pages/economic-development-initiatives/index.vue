<template>
  <div id="initiatives">
    <div
      id="initiatives__intro"
      class="flex flex-row flex-wrap justify-center lg:justify-between items-center relative"
    >
      <div
        v-for="(initiative, index) in firstThreeInitiatives"
        :key="initiative.sort"
        :class="{ middle: index === 1 }"
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-2 lg:order-1 initiatives__intro-card"
      >
        <h3 class="green absolute initiatives__intro-card-sort">
          {{ initiative.sort }}
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          {{ initiative.title }}
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          {{ truncateString(initiative.goal, 170) }}
        </div>
        <nuxt-link
          :to="'/economic-development-initiatives/' + initiative.url"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More<span class="hidden"> about {{ initiative.title }}.</span>
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <h2
        id="initiatives__page-title"
        class="w-full sm:w-5/6 lg:w-full uppercase navy text-center tracking-widest order-1 lg:order-2 relative"
        @click="smoothScroll('#initiatives__story')"
      >
        Initiatives
        <span class="tracking-wider"
          >Learn what initiatives are and how they are created<arrow-down-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-down-icon
        ></span>
      </h2>
      <div
        v-for="initiative in lastThreeInitiatives"
        :key="initiative.sort"
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-3 bottomRow initiatives__intro-card"
      >
        <h3 class="green absolute initiatives__intro-card-sort">
          {{ initiative.sort }}
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          {{ initiative.title }}
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          {{ truncateString(initiative.goal, 170) }}
        </div>
        <nuxt-link
          :to="'/economic-development-initiatives/' + initiative.url"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More<span class="hidden"> about {{ initiative.title }}.</span>
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
    </div>
    <div
      id="initiatives__story"
      class="flex flex-col justify-start items-center relative initiatives__story"
    >
      <svg
        id="start-btn"
        class="button"
        expanded="true"
        height="41px"
        width="41px"
      >
        <circle fill="#1accb8" cx="50%" cy="50%" r="7px"></circle>
        <circle class="pulse" cx="50%" cy="50%" r="10px"></circle>
        <circle class="pulse2" cx="50%" cy="50%" r="10px"></circle>
      </svg>
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
          To showcase our region in a concise way encompassing regional assets,
          businesses, organizations, news, events, with the goal to educate,
          inspire, and build interest in our region. This focus is for both
          current ST8 residents as well as for people looking to relocate and to
          find a place with opportunities and the lifestyle they are looking
          for.
        </p>
      </div>

      <h3 id="where-title" class="uppercase green relative initiatives__title">
        WHERE DO THEY COME FROM?
      </h3>

      <div id="where-description" class="relative p-6 initiatives__description">
        <p>
          To showcase our region in a concise way encompassing regional assets,
          businesses, organizations, news, events, with the goal to educate,
          inspire, and build interest in our region. This focus is for both
          current ST8 residents as well as for people looking to relocate and to
          find a place with opportunities and the lifestyle they are looking
          for.
        </p>
      </div>
      <h3 id="how-title" class="uppercase green relative initiatives__title">
        HOW DO THEY WORK?
      </h3>
      <div id="how-description" class="relative p-6 initiatives__description">
        <p>
          To showcase our region in a concise way encompassing regional assets,
          businesses, organizations, news, events, with the goal to educate,
          inspire, and build interest in our region. This focus is for both
          current ST8 residents as well as for people looking to relocate and to
          find a place with opportunities and the lifestyle they are looking
          for.
        </p>
      </div>
      <svg
        id="finish-btn"
        class="button"
        expanded="true"
        height="41px"
        width="41px"
      >
        <circle fill="#1accb8" cx="50%" cy="50%" r="7px"></circle>
        <circle class="pulse" cx="50%" cy="50%" r="10px"></circle>
        <circle class="pulse2" cx="50%" cy="50%" r="10px"></circle>
      </svg>
    </div>

    <div
      id="initiatives__conclusion"
      class="w-full flex items-center justify-center flex-col py-20"
    >
      <h3
        class="green bold sm:thin-font uppercase relative tracking-widest pb-8"
      >
        SELECT AN INITIATIVE TO LEARN MORE:
      </h3>

      <nuxt-link
        v-for="(initiative, index) in initiatives"
        :key="index"
        :to="'/economic-development-initiatives/' + initiative.url"
        class="uppercase tracking-widest py-4"
        >{{ initiative.title }}
        <arrow-right-icon
          size="1x"
          stroke-width="1"
          class="inline-block"
        ></arrow-right-icon
      ></nuxt-link>
    </div>
  </div>
</template>

<script>
import { ArrowRightIcon, ArrowDownIcon } from 'vue-feather-icons'

export default {
  components: {
    ArrowRightIcon,
    ArrowDownIcon
  },
  async asyncData({ params, $axios }) {
    const initiativesReq = await $axios.$get(
      '/items/initiatives?fields=*.*.*&filter[status]=published'
    )
    return {
      initiatives: initiativesReq.data
    }
  },
  head() {},

  computed: {
    firstThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort < 4)
    },
    lastThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort > 3)
    }
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
    window.addEventListener('scroll', lineFunction)
    function lineFunction() {
      requestAnimationFrame(function() {
        const svgContainer = document.getElementById('initiatives__story')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 0.75
        if (scrollPercent < 1) {
          const draw = length * scrollPercent
          longLine.style.strokeDashoffset = length - draw
          const drawStraight = straightLength * scrollPercent
          straightLine.style.strokeDashoffset = straightLength - drawStraight
        }
      })
    }
  },
  methods: {
    smoothScroll(target) {
      console.log(target)

      const offsetTop = document.querySelector(target).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth'
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
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/initiatives';
</style>
