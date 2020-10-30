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
        <h3 class="green-two absolute initiatives__intro-card-sort">
          {{ initiative.sort }}
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          {{ initiative.title }}
        </h1>
        <div
          v-html="initiative.goal"
          class="navy text-xs mt-2 mb-2 md:mb-4 text-justify"
        ></div>
        <nuxt-link
          :to="'/economic-development-initiatives/' + initiative.url"
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
        id="initiatives__page-title"
        class="w-full sm:w-5/6 lg:w-full uppercase navy text-center tracking-widest order-1 lg:order-2"
      >
        Initiatives
      </h2>
      <div
        v-for="(initiative, index) in lastThreeInitiatives"
        :key="initiative.sort"
        :class="{ middleBottom: index === 1 }"
        class="w-full sm:w-5/6 lg:w-1/3 lg:pr-8 mt-8 mb-8 relative flex flex-col justify-start order-3 bottomRow initiatives__intro-card"
      >
        <h3 class="green-two absolute initiatives__intro-card-sort">
          {{ initiative.sort }}
        </h3>
        <h1 class="uppercase tracking-wider navy text-sm bold leading-none">
          {{ initiative.title }}
        </h1>
        <div
          v-html="initiative.goal"
          class="navy text-xs mt-2 mb-2 md:mb-4 text-justify"
        ></div>
        <nuxt-link
          :to="'/economic-development-initiatives/' + initiative.url"
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
    <div class="horizontal-scroll-story">
      <div id="one" class="panel-container">
        <div
          class="flex relative justify-center items-center flex-col relative panel-section"
        >
          <h3 class="green-two uppercase">
            WHAT ARE INITIATIVES?
          </h3>
          <div class="w-5/6 sm:w-1/2 relative  initiatives__description">
            <p>
              To showcase our region in a concise way encompassing regional
              assets, businesses, organizations, news, events, with the goal to
              educate, inspire, and build interest in our region. This focus is
              for both current ST8 residents as well as for people looking to
              relocate and to find a place with opportunities and the lifestyle
              they are looking for.
            </p>
          </div>
        </div>
      </div>
      <div id="two" class="panel-container">
        <div
          class="flex relative justify-center items-end flex-col relative panel-section"
        >
          <h3 class="green-two uppercase">WHERE DO THEY COME FROM?</h3>
          <div class="w-5/6 sm:w-1/2 relative  initiatives__description">
            <p>
              To showcase our region in a concise way encompassing regional
              assets, businesses, organizations, news, events, with the goal to
              educate, inspire, and build interest in our region. This focus is
              for both current ST8 residents as well as for people looking to
              relocate and to find a place with opportunities and the lifestyle
              they are looking for.
            </p>
          </div>
        </div>
      </div>

      <div id="three" class="panel-container">
        <div
          class="flex relative justify-center items-start flex-col relative panel-section"
        >
          <h3 class="green-two uppercase">HOW DO THEY WORK?</h3>
          <div class="w-5/6 sm:w-1/2 relative initiatives__description">
            <p>
              To showcase our region in a concise way encompassing regional
              assets, businesses, organizations, news, events, with the goal to
              educate, inspire, and build interest in our region. This focus is
              for both current ST8 residents as well as for people looking to
              relocate and to find a place with opportunities and the lifestyle
              they are looking for.
            </p>
          </div>
        </div>
      </div>
      <div id="four" class="panel-container">
        <div
          class="flex relative justify-center items-center flex-col relative panel-section"
        >
          <h3 class="green-two uppercase relative">
            SELECT AN INITIATIVE TO LEARN MORE:
          </h3>
          <div class="w-5/6 sm:w-1/2 relative initiatives__description">
            <ul>
              <li
                v-for="initiative in initiatives"
                :key="initiative.sort"
                class="pt-2 pb-2"
              >
                <nuxt-link
                  :to="'/economic-development-initiatives/' + initiative.url"
                  class="uppercase "
                  >{{ initiative.title }}
                  <arrow-right-icon
                    size="1x"
                    stroke-width="1"
                    class="inline-block"
                  ></arrow-right-icon
                ></nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRightIcon } from 'vue-feather-icons'

export default {
  components: {
    ArrowRightIcon
  },

  computed: {
    firstThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort < 4)
    },
    lastThreeInitiatives() {
      return this.initiatives.filter((initiative) => initiative.sort > 3)
    }
  },
  async asyncData({ params, $axios }) {
    const initiativesReq = await $axios.get(
      process.env.apiUrl + '/items/initiatives?fields=*.*.*'
    )
    return {
      initiatives: initiativesReq.data.data
    }
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger)

    const container = document.querySelector('.horizontal-scroll-story')
    const tl = gsap.timeline({
      scrollTrigger: {
        pin: true,
        pinSpacing: true,
        scrub: 1,
        trigger: container,
        end: () => '+=' + (container.scrollWidth - container.clientWidth)
      },
      defaults: { ease: 'none', duration: 1 }
    })

    tl.to('.panel-section', {
      x: () => -(container.scrollWidth - container.clientWidth)
    })

    tl.to(
      '.panel-section',
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: {
          amount: 0.8
        }
      },
      0
    )
  },
  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/initiatives';
</style>
