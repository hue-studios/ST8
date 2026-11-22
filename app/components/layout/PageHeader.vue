<script setup lang="ts">
// Ported as it is today, hide-on-scroll included: the bar slides away on scroll down and returns on scroll up, and
// `.scrolled` (after 80px) hands the home page's hero treatment over to the normal bar.
const showHeader = ref(true)
const isScrolled = ref(false)
let lastScrollPosition = 0

// Which dropdown (active / regional / now) the pointer is over.
const openDrop = ref<string | null>(null)

onBeforeMount(() => {
  lastScrollPosition = window.scrollY
  isScrolled.value = window.scrollY > 80
})

useEventListener('scroll', () => {
  const current = window.scrollY || document.documentElement.scrollTop
  if (current < 0) return
  // Set before the threshold below bails out, otherwise a slow scroll past the top never registers. On the home page
  // this is what brings the bar out of its hero treatment.
  isScrolled.value = current > 80
  if (Math.abs(current - lastScrollPosition) < 20) return
  showHeader.value = current < lastScrollPosition
  lastScrollPosition = current
}, { passive: true })
</script>

<template>
  <div id="page-header" :class="{ hide: !showHeader, scrolled: isScrolled }">
    <NuxtLink to="/">
      <LayoutLogo />
    </NuxtLink>
    <div id="page-nav" class="flex flex-row">
      <div
        id="activeNavContainer"
        class="relative page-nav__drop-container"
        :class="{ showDropNav: openDrop === 'active' }"
        @mouseover="openDrop = 'active'"
        @mouseleave="openDrop = null"
      >
        <h3 class="uppercase">Active</h3>
        <div class="flex items-center justify-center flex-row page-nav__drop-links">
          <NuxtLink to="/economic-development-initiatives" class="uppercase">Initiatives</NuxtLink>
          <NuxtLink to="/economic-development-programs" class="uppercase">Programs</NuxtLink>
          <NuxtLink to="/economic-development-services" class="uppercase">Services</NuxtLink>
        </div>
      </div>
      <div
        id="regionalNavContainer"
        class="relative page-nav__drop-container"
        :class="{ showDropNav: openDrop === 'regional' }"
        @mouseover="openDrop = 'regional'"
        @mouseleave="openDrop = null"
      >
        <h3 class="uppercase">Regional</h3>
        <div class="flex items-center justify-center flex-row page-nav__drop-links">
          <NuxtLink to="/regional-partnerships" class="uppercase">Partnerships</NuxtLink>
          <NuxtLink to="/regional-profile" class="uppercase">Profile</NuxtLink>
          <NuxtLink to="/economic-development-programs/housing" class="uppercase">Housing</NuxtLink>
        </div>
      </div>
      <div
        id="nowNavContainer"
        class="relative page-nav__drop-container"
        :class="{ showDropNav: openDrop === 'now' }"
        @mouseover="openDrop = 'now'"
        @mouseleave="openDrop = null"
      >
        <h3 class="uppercase">Now</h3>
        <div class="flex items-center justify-center flex-row page-nav__drop-links">
          <NuxtLink to="/regional-news" class="uppercase">News</NuxtLink>
          <NuxtLink to="/regional-news/resources" class="uppercase">Resources</NuxtLink>
          <NuxtLink to="/regional-events" class="uppercase">Events</NuxtLink>
        </div>
      </div>
      <div id="organizationNavContainer" class="relative page-nav__drop-container">
        <NuxtLink to="/regional-organization/">
          <h3 class="uppercase">Organization</h3>
        </NuxtLink>
      </div>
    </div>
    <LayoutNewYorkState />
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/layout/pageHeader';
@use '~/assets/scss/layout/pageNav';
</style>
