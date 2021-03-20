<template>
  <div id="initiative">
    <div
      id="initiative__intro"
      class="w-full flex flex-col justify-center items-center relative"
    >
      <h2 id="initiative__bg-title" class="uppercase absolute">
        Ini tiati ves
      </h2>
      <div
        class="flex items-center justify-center flex-row flex-shrink-0 initiative__title-box"
      >
        <h3 class="navy thin-font initiative__sort">{{ initiative.sort }}</h3>
        <h1
          class="flex-shrink uppercase text-left green relative initiative__title"
        >
          {{ initiative.title }}
        </h1>
      </div>
    </div>
    <div
      id="initiative__story"
      class="flex flex-col justify-start items-center relative initiative__story"
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
        viewBox="0 0 963 2018.24"
      >
        <path
          id="initiative-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M961.5,0V396.94H1.5V697.67h960V995H481.12v300.22H1.5v595.59H481.12v127.41"
        />
      </svg>

      <h3 id="goal-title" class="uppercase green relative initiative__title">
        The Goal
      </h3>

      <div
        id="goal-description"
        class="relative p-6 text-justify initiative__description"
        v-html="initiative.goal"
      ></div>

      <h3
        id="opportunity-title"
        class="uppercase green relative initiative__title"
      >
        The Opportunity
      </h3>

      <div
        id="opportunity-description"
        class="relative p-6 text-justify initiative__description"
        v-html="initiative.opportunity"
      ></div>
      <pulse-icon icon-i-d="finish-btn" class-name="button"></pulse-icon>
    </div>
    <div
      class="flex flex-col justify-center items-center relative initiative__related"
    >
      <div
        id="program__programs"
        class="w-full flex relative justify-center items-center flex-row flex-wrap relative program__section"
      >
        <h2 class="uppercase green relative program__title">
          {{ initiative.title }} Programs
        </h2>

        <swiper
          :options="programsSwiperOption"
          class="swiper w-full flex flex-row pt-4 pb-4"
        >
          <swiper-slide
            v-for="program in programs"
            :key="program.sort"
            class="flex flex-col items-center justify-center px-3 sm:px-8"
          >
            <program-card :program="program"></program-card>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination"></div>
          <div slot="button-next" class="swiper-button-next"></div>
          <div slot="button-prev" class="swiper-button-prev"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import pulseIcon from '~/components/universal/pulseIcon'
import programCard from '~/components/programs/programCard'
export default {
  components: {
    pulseIcon,
    Swiper,
    SwiperSlide,
    programCard,
  },
  async asyncData({ params, $axios }) {
    const [initiativeReq, programsReq, newsReq] = await Promise.all([
      $axios.$get(
        '/items/initiatives?filter[url][eq]=' +
          params.slug +
          '&fields=*.*.*&single=1'
      ),
      $axios.$get(
        '/items/programs?filter[initiatives.initiative_id.url][eq]=' +
          params.slug +
          '&fields=*.*.*&limit=5'
      ),
      $axios.$get(
        '/items/news?filter[initiatives.initiative_id.url][eq]=' +
          params.slug +
          '&fields=*.*.*&limit=5'
      ),
    ])
    return {
      initiative: initiativeReq.data,
      programs: programsReq.data,
      news: newsReq.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      programsSwiperOption: {
        // freeMode: true,
        // freeModeSticky: true,
        // slidesPerView: 'auto',
        // slidesOffsetBefore: 15,
        centeredSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true,
        },
        breakpoints: {
          1024: {
            // slidesOffsetBefore: 24
          },
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true,
        },
      },
    }
  },
  head() {
    return {
      title:
        this.initiative.title +
        ' - Regional Initiative for the Southern Tier of New York',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.truncateString(this.initiative.goal, 120),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://southerntier8.org/economic-development-initiatives/' +
            this.initiative.url,
        },

        {
          hid: 'og:title',
          property: 'og:title',
          content:
            this.initiative.title +
            ' - Regional Initiative for the Southern Tier of New York',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.truncateString(this.initiative.goal, 120),
        },

        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content:
            this.initiative.title +
            ' - Regional Initiative for the Southern Tier of New York',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.truncateString(this.initiative.goal, 120),
        },

        {
          hid: 'twitter:image:alt',
          content:
            this.initiative.title +
            ' - Regional Initiative for the Southern Tier of New York',
        },
      ],
    }
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
    const longLine = document.getElementById('initiative-line')
    const length = longLine.getTotalLength()
    longLine.style.strokeDasharray = length
    longLine.style.strokeDashoffset = length
    window.addEventListener('scroll', this.lineFunction)
  },
  methods: {
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()
      const longLine = document.getElementById('initiative-line')
      const length = longLine.getTotalLength()
      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('initiative__story')
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
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/initiative';
#opportunity-description {
}
</style>
