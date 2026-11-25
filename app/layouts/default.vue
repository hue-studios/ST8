<script setup lang="ts">
// The page's route name is a class on the container (`index`, `economic-development-programs`, …): the Sass keys page
// treatments off it. It replaces the Vuex store's `page`, set by the old `pages` middleware.
const route = useRoute()
const page = computed(() => String(route.name ?? ''))

const menuOpen = ref(false)
</script>

<template>
  <div class="container" :class="page">
    <LayoutPageHeader :class="{ home: page === 'index' }" />
    <div id="page-container" class="page-container">
      <slot />
      <LayoutPageFooter />
    </div>

    <LayoutMobileNav v-model:open="menuOpen" />
    <div id="nav-btn" :class="{ open: menuOpen }" @click.prevent="menuOpen = !menuOpen">
      <div id="nav-icon"><span /> <span /> <span /></div>
    </div>
    <div id="mobile-toolbar">
      <NuxtLink to="/regional-news/">News</NuxtLink>
      <NuxtLink to="/economic-development-initiatives/">Initiatives</NuxtLink>
    </div>
    <LayoutResourceRequestDialog />
    <LayoutSearchDialog />
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/layout/mobileNavBtn';
@use '~/assets/scss/layout/mobileToolbar';
</style>
