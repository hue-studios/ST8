<script setup lang="ts" generic="T">
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

// A row of cards, ported from the Nuxt 2 pages' vue-awesome-swiper options. `resources` slides are auto-width with a
// 15px gutter at each end (news and resource rows); `programs` slides are the default width.
const props = withDefaults(defineProps<{
  items: T[]
  preset?: 'resources' | 'programs'
  slideClass?: string
}>(), { preset: 'resources', slideClass: 'flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8' })

const resources = {
  slidesPerView: 'auto' as const,
  slidesOffsetBefore: 15,
  slidesOffsetAfter: 15,
  centeredSlides: false,
  centerInsufficientSlides: true,
  spaceBetween: 30,
}
const programs = {
  centeredSlides: false,
  centerInsufficientSlides: true,
  spaceBetween: 30,
}
const options = computed(() => (props.preset === 'resources' ? resources : programs))
</script>

<template>
  <Swiper
    v-bind="options"
    :modules="[Navigation, Pagination]"
    :pagination="{ dynamicBullets: true }"
    :navigation="{ hideOnClick: true }"
    class="swiper swiper-container w-full flex flex-row items-center justify-center pt-4 pb-4"
  >
    <SwiperSlide v-for="(item, index) in props.items" :key="index" :class="props.slideClass">
      <slot :item="item" :index="index" />
    </SwiperSlide>
  </Swiper>
</template>

<style lang="scss">
// Swiper's own CSS is imported in assets/css/main.css, in a low layer, so the site's Sass and utilities beat it.
@use '~/assets/scss/layout/swiper';

// Swiper 12 draws its arrows as inline SVG; the site's Sass draws them with an icon font's :after (the look on the
// live site), so hide the SVG and let that stand.
.swiper-button-prev > svg,
.swiper-button-next > svg {
  display: none;
}
</style>
