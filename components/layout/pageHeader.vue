<template>
  <div id="page-header" :class="{ hide: !showHeader }" class="">
    <nuxt-link to="/">
      <logo-name />
      <logo />
    </nuxt-link>
    <div id="page-nav" class="flex flex-row">
      <div
        id="activeNavContainer"
        class="relative page-nav__drop-container"
        @mouseover="toggleDropNav('active', true)"
        @mouseleave="toggleDropNav('active', false)"
      >
        <h3 class="uppercase">Active</h3>
        <div
          class="flex items-center justify-center flex-row page-nav__drop-links"
        >
          <nuxt-link to="/economic-development-initiatives" class="uppercase"
            >Initiatives</nuxt-link
          >
          <nuxt-link to="/economic-development-programs" class="uppercase"
            >Programs</nuxt-link
          >
          <nuxt-link to="/economic-development-services" class="uppercase"
            >Services</nuxt-link
          >
        </div>
      </div>
      <div id="regionalNavContainer" class="relative page-nav__drop-container">
        <nuxt-link to="/regional-profile"
          ><h3 class="uppercase">Regional</h3></nuxt-link
        >
      </div>
      <div
        id="nowNavContainer"
        class="relative page-nav__drop-container"
        @mouseover="toggleDropNav('now', true)"
        @mouseleave="toggleDropNav('now', false)"
      >
        <h3 class="uppercase">Now</h3>
        <div
          class="flex items-center justify-center flex-row page-nav__drop-links"
        >
          <nuxt-link to="/regional-news" class="uppercase">News</nuxt-link>
          <nuxt-link to="/regional-news/resources" class="uppercase"
            >Resources</nuxt-link
          >
          <nuxt-link to="/regional-news/events" class="uppercase"
            >Events</nuxt-link
          >
        </div>
      </div>
      <div
        id="organizationNavContainer"
        class="relative page-nav__drop-container"
      >
        <nuxt-link to="/regional-organization/"
          ><h3 class="uppercase">Organization</h3></nuxt-link
        >
      </div>
    </div>
    <new-york-state />
  </div>
</template>
<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '~/components/layout/logo.vue'
import newYorkState from '~/components/layout/newYorkState.vue'
import logoName from '~/components/layout/logoName.vue'
export default {
  components: {
    logo,
    newYorkState,
    logoName
  },
  data() {
    return {
      showHeader: true,
      lastScrollPosition: 0,
      scrollValue: 0
    }
  },
  beforeMount() {
    this.lastScrollPosition = window.pageYOffset
    window.addEventListener('scroll', this.toggleHeader)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.toggleHeader)
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger)
  },
  methods: {
    toggleHeader() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 20) {
        return
      }
      this.showHeader = currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
    },
    toggleDropNav(id, status) {
      if (status) {
        document
          .getElementById(id + 'NavContainer')
          .classList.add('showDropNav')
      } else {
        document
          .getElementById(id + 'NavContainer')
          .classList.remove('showDropNav')
      }
    }
  }
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/pageHeader';
@import './assets/scss/layout/pageNav';
</style>
