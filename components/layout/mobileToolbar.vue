<template>
  <div id="mobile-toolbar">
    <nuxt-link to="/creative-design-portfolio/">work</nuxt-link>
    <nuxt-link to="/creative-services/">services</nuxt-link>
    <div id="nav-btn" @click.prevent="sideMenuToggle()">
      <div id="nav-icon"><span></span> <span></span> <span></span></div>
    </div>
  </div>
</template>
<script>
export default {
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
@import './assets/scss/layout/mobileToolbar';
</style>
