<template>
  <div id="apply" class="flex items-center justify-center flex-col">
    <div
      id="apply-intro"
      class="pt-24 pb-12 md:py-24 flex flex-col justify-center items-center"
    >
      <h1
        class="uppercase navy pb-3 md:pb-0 md:mb-6 relative thin-font tracking-widest"
      >
        How to Apply
      </h1>
      <p v-if="apply.introduction">{{ apply.introduction }}</p>
    </div>
    <div
      id="apply-info"
      class="w-full flex items-center flex-col justify-center pt-20 relative"
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
      <div id="apply-info__container" class="flex flex-col items-start px-8">
        <h2
          class="w-full page-title uppercase tracking-widest mb-4 pt-2 pb-1 thin-font mb-10 relative text-center"
        >
          Steps
        </h2>
        <div
          class="whitespace-pre-wrap mb-0 pb-4 text-center"
          v-html="apply.steps"
        ></div>

        <h2
          class="w-full page-title uppercase tracking-widest mt-8 mb-4 thin-font pt-2 pb-1 mb-10 text-center relative"
        >
          What is ARC?
        </h2>
        <div
          class="whitespace-pre-wrap mb-10 pb-4 text-center"
          v-html="apply.arc_info"
        ></div>
      </div>
      <!-- <pulse-icon icon-i-d="finish-btn" class-name="button"></pulse-icon> -->
    </div>
    <div
      v-if="apply.resources.length"
      id="apply__resources"
      class="w-full flex relative justify-center items-center flex-col relative"
    >
      <h2 class="w-full uppercase green relative text-center apply__title">
        Resources
      </h2>
      <swiper :options="swiperOption" class="swiper w-full pt-4 pb-4">
        <swiper-slide
          v-for="(item, index) in apply.resources"
          :key="index"
          class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
        >
          <resource-card :item="item.resources_id"></resource-card>
        </swiper-slide>
        <!-- <div slot="pagination" class="swiper-pagination"></div> -->
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import resourceCard from '~/components/now/resourceCardVertical'
import pulseIcon from '~/components/universal/pulseIcon'
// import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    pulseIcon,
    Swiper,
    SwiperSlide,
    resourceCard,
    // linkIcon,
  },
  async asyncData({ $axios }) {
    const applyReq = await $axios.get(
      process.env.apiUrl + '/items/how_to_apply?fields=*.*.*&single=1'
    )
    return {
      apply: applyReq.data.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      swiperOption: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        centeredSlides: false,
        centerInsufficientSlides: true,
        spaceBetween: 30,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true,
        // },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true,
        },
      },
    }
  },
  head() {},
  beforeDestroy() {
    window.removeEventListener('scroll', this.lineFunction)
  },
  mounted() {
    // mobile line animation
    const straightLine = document.getElementById('straight-line')
    const straightLength = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = straightLength
    straightLine.style.strokeDashoffset = straightLength
    window.addEventListener('scroll', this.lineFunction)
  },
  methods: {
    smoothScroll(event) {
      console.log(event.target.getAttribute('data-section'))
      const href = event.target.getAttribute('data-section')
      const offsetTop = document.querySelector(href).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth',
      })
    },
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()
      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('apply-info')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 0.5
        if (scrollPercent < 1) {
          const drawStraight = straightLength * scrollPercent
          straightLine.style.strokeDashoffset = straightLength - drawStraight
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/apply';
</style>
