<script setup lang="ts" generic="T">
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

// A row of cards, ported from the Nuxt 2 pages' vue-awesome-swiper options. `resources` slides are auto-width with a
// 15px gutter at each end (news and resource rows); `programs` slides are the default width, `initiative` ones are the default width and centred.
const props = withDefaults(defineProps<{
  items: T[]
  preset?: 'resources' | 'programs' | 'initiative'
  slideClass?: string
  /** The dot row under the slides; the partners and how-to-apply rows have arrows only. */
  pagination?: boolean
}>(), { preset: 'resources', pagination: true, slideClass: 'flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8' })

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
// The initiative page's program row centres its one-per-view slide.
const initiative = {
  centeredSlides: true,
  spaceBetween: 30,
}
const options = computed(() => ({ resources, programs, initiative })[props.preset])
</script>

<template>
  <Swiper
    v-bind="options"
    :modules="[Navigation, Pagination]"
    :pagination="props.pagination ? { dynamicBullets: true } : false"
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
