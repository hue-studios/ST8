<template>
  <nav id="nav-bar" @click.prevent="closeSideMenu()">
    <logo-name> </logo-name>
    <p class="mobile-nav-title">
      Active
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Initiatives</nuxt-link
      >
    </p>

    <p>
      <nuxt-link
        to="/creative-services/web-design-app-development/"
        class="mobile-nav-link"
        >Programs</nuxt-link
      >
    </p>
    <p>
      <nuxt-link to="/economic-development-services/" class="mobile-nav-link"
        >Services</nuxt-link
      >
    </p>
    <p class="mobile-nav-title">
      Regional
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Data</nuxt-link
      >
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Counties</nuxt-link
      >
    </p>
    <p class="mobile-nav-title">
      Now
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >News</nuxt-link
      >
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Events</nuxt-link
      >
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Resources</nuxt-link
      >
    </p>
    <p class="mobile-nav-title">
      Organization
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Mission</nuxt-link
      >
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Leadership</nuxt-link
      >
    </p>
    <p>
      <nuxt-link
        to="/creative-services/branding-agency/"
        class="mobile-nav-link"
        >Contact</nuxt-link
      >
    </p>
    <div id="social-links">
      <a href="https://twitter.com/hue_studios" target="_blank"
        ><i class="fa fa-twitter" aria-hidden="true"></i
      ></a>
      <a href="https://facebook.com/huestudios" target="_blank"
        ><i class="fa fa-facebook" aria-hidden="true"></i
      ></a>
      <a href="https://instagram.com/huestudios" target="_blank"
        ><i class="fa fa-instagram" aria-hidden="true"></i
      ></a>
    </div>
  </nav>
</template>
<script>
import logoName from '~/components/layout/logoName.vue'
export default {
  components: {
    logoName
  },
  methods: {
    sideMenuToggle() {
      const element = document.getElementById('nav-bar')
      const element2 = document.getElementById('nav-btn')
      const element3 = document.getElementById('page-container')
      element.classList.toggle('in-left')
      element2.classList.toggle('open')
      element3.classList.toggle('open')
    },
    closeSideMenu() {
      const element = document.getElementById('nav-bar')
      const element2 = document.getElementById('nav-btn')
      const element3 = document.getElementById('page-container')
      element.classList.remove('in-left')
      element2.classList.remove('open')
      element3.classList.remove('open')
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/mobileNav';
@import './assets/scss/layout/mobileNavBtn';
</style>
