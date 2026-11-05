<template>
  <div
    id="page-header"
    :class="{ hide: !showHeader, scrolled: isScrolled }"
    class=""
  >
    <nuxt-link to="/">
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
      <div
        id="regionalNavContainer"
        class="relative page-nav__drop-container"
        @mouseover="toggleDropNav('regional', true)"
        @mouseleave="toggleDropNav('regional', false)"
      >
        <h3 class="uppercase">Regional</h3>
        <div
          class="flex items-center justify-center flex-row page-nav__drop-links"
        >
          <nuxt-link to="/regional-partnerships" class="uppercase"
            >Partnerships</nuxt-link
          >
          <nuxt-link to="/regional-profile" class="uppercase"
            >Profile</nuxt-link
          >
        </div>
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
          <nuxt-link to="/regional-events" class="uppercase">Events</nuxt-link>
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
import logo from '~/components/layout/logo.vue'
import newYorkState from '~/components/layout/newYorkState.vue'
export default {
  components: {
    logo,
    newYorkState,
  },
  data() {
    return {
      showHeader: true,
      isScrolled: false,
      lastScrollPosition: 0,
      scrollValue: 0,
    }
  },
  beforeMount() {
    this.lastScrollPosition = window.pageYOffset
    this.isScrolled = window.pageYOffset > 80
    window.addEventListener('scroll', this.toggleHeader, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.toggleHeader)
  },
  mounted() {},
  methods: {
    toggleHeader() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      // Set before the threshold below bails out, otherwise a slow scroll past the top never
      // registers. On the home page this is what brings the bar out of its hero treatment.
      this.isScrolled = currentScrollPosition > 80
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
    },
  },
}
</script>
<style lang="scss">
@use '~/assets/scss/layout/pageHeader';
@use '~/assets/scss/layout/pageNav';
</style>
