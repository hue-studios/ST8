<template>
  <div id="programs">
    <div
      id="programs__intro"
      class="flex flex-row flex-wrap justify-center lg:justify-between items-center relative"
    >
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-2 lg:order-1 programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          {{ initiativeProgramsCount(6) }}
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-2 lg:order-1 middle programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          3
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-2 lg:order-1 programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          3
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <h2
        id="programs__page-title"
        class="w-full sm:w-5/6 lg:w-full uppercase navy text-center tracking-widest order-1 lg:order-2"
      >
        Programs
      </h2>
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-3 bottomRow programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          3
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-3 bottomRow middleBottom programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          3
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
      <div
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-3 bottomRow programs__intro-card"
      >
        <h3 class="green-two absolute programs__intro-card-sort">
          3
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          <strong>Regionalism</strong> Programs
        </h1>
        <div class="navy text-xs mt-2 mb-2 md:mb-4 text-justify">
          Programs developed to promote regionalism throughout the Southern
          Tier.
        </div>
        <nuxt-link
          to="/economic-development-programs/regionalism"
          class="uppercase tracking-wider navy text-xs initiatives__intro-card-link"
          >Learn More
          <arrow-right-icon
            size="1.5x"
            stroke-width="1"
            class="inline-block"
          ></arrow-right-icon
        ></nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  computed: {
    workforcePrograms() {
      return this.programs.filter(
        (program) => program.initiatives[0].initiative_id.id === 1
      )
    },

    economicDevelopmentPrograms() {
      return this.programs.filter(
        (program) => program.initiatives[0].initiative_id.id === 6
      )
    }
  },
  async asyncData({ params, $axios }) {
    const programsReq = await $axios.$get('/items/programs?fields=*.*.*')
    return {
      programs: programsReq.data
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {},
  created() {
    console.log(this.workforcePrograms)
  },
  methods: {
    initiativeProgramsCount(initiative) {
      const filteredPrograms = this.programs.filter(
        (program) => program.initiatives[0].initiative_id.id === initiative
      )
      return filteredPrograms.length
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/programs';
</style>
