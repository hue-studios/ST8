<template>
  <div class="container" :class="$store.state.page">
    <transition name="fade" mode="out-in">
      <page-header
        :class="{ 'opacity-0': $store.state.page === 'index' }"
      ></page-header>
    </transition>
    <div id="page-container" class="page-container" @click="closeSideMenu()">
      <nuxt />
      <page-footer></page-footer>
    </div>

    <nav id="nav-bar" @click.prevent="closeSideMenu()">
      <logo-name> </logo-name>

      <p>
        <nuxt-link
          to="/economic-development-initiatives/"
          class="mobile-nav-link"
          >Initiatives</nuxt-link
        >
      </p>

      <p>
        <nuxt-link to="/economic-development-programs/" class="mobile-nav-link"
          >Programs</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/economic-development-services/" class="mobile-nav-link"
          >Services</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/regional-partnerships" class="mobile-nav-link"
          >Partnerships</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/regional-profile" class="mobile-nav-link"
          >Regional Profile</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/regional-news" class="mobile-nav-link">News</nuxt-link>
      </p>
      <p>
        <nuxt-link to="/regional-events" class="mobile-nav-link"
          >Events</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/regional-news/resources" class="mobile-nav-link"
          >Resources</nuxt-link
        >
      </p>
      <p>
        <nuxt-link to="/regional-organization" class="mobile-nav-link">
          Organization
        </nuxt-link>
      </p>
      <p>
        <nuxt-link to="/how-to-apply" class="mobile-nav-link">
          How To Apply
        </nuxt-link>
      </p>
      <div class="absolute tagline">
        <h4>Active</h4>
        <h4>Regional</h4>
        <h4>Now</h4>
      </div>
    </nav>
    <div id="nav-btn" @click.prevent="sideMenuToggle()">
      <div id="nav-icon"><span></span> <span></span> <span></span></div>
    </div>
    <div id="mobile-toolbar">
      <nuxt-link to="/regional-news/">News</nuxt-link>
      <nuxt-link to="/economic-development-initiatives/">Initiatives</nuxt-link>
    </div>
  </div>
</template>
<script>
import pageHeader from '~/components/layout/pageHeader'
// import pagePartners from '~/components/layout/pagePartners'
import pageFooter from '~/components/layout/pageFooter'
import logoName from '~/components/layout/logoName.vue'
export default {
  components: {
    pageHeader,
    // pagePartners,
    pageFooter,
    logoName,
  },
  data() {
    return {
      imageUrl: process.env.imageUrl,
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
    },
  },
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/mobileNav';
@import './assets/scss/layout/mobileNavBtn';
@import './assets/scss/layout/mobileToolbar';
</style>
