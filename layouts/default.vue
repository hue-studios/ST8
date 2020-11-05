<template>
  <div class="container">
    <page-header></page-header>
    <div
      id="page-container"
      @click.prevent="closeSideMenu()"
      class="page-container"
    >
      <nuxt />
      <page-partners :imageLocation="imageUrl"></page-partners>
      <page-footer></page-footer>
    </div>

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
    </nav>
    <div id="nav-btn" @click.prevent="sideMenuToggle()">
      <div id="nav-icon"><span></span> <span></span> <span></span></div>
    </div>
    <div id="mobile-toolbar">
      <nuxt-link to="/creative-design-portfolio/">News</nuxt-link>
      <nuxt-link to="/creative-services/">Incentives</nuxt-link>
    </div>
  </div>
</template>
<script>
import pageHeader from '~/components/layout/pageHeader'
import pagePartners from '~/components/layout/pagePartners'
import pageFooter from '~/components/layout/pageFooter'
import logoName from '~/components/layout/logoName.vue'
export default {
  components: {
    pageHeader,
    pagePartners,
    pageFooter,
    logoName
  },
  data() {
    return {
      imageUrl: process.env.imageUrl
    }
  },
  created() {},
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
@import './assets/scss/layout/mobileToolbar';
</style>
