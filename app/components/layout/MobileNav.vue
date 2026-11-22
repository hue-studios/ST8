<script setup lang="ts">
// The phone menu: the same full-screen navy panel as before, now on the ST8 sheet wrapper. The burger button (fixed,
// bottom right) opens it; a tap anywhere on the panel, Escape or a route change closes it.
const open = defineModel<boolean>('open', { default: false })

// The staggered entrance in _mobileNav.scss runs on `.in-left`, so add it a frame after the panel mounts.
const shown = ref(false)
watch(open, (isOpen) => {
  shown.value = false
  if (isOpen) {
    nextTick(() => requestAnimationFrame(() => requestAnimationFrame(() => (shown.value = true))))
  }
})

const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <St8Sheet
    v-model:open="open"
    title="Menu"
    side="left"
    class="mobile-nav-sheet inset-0 h-screen w-full max-w-none border-0 bg-navy p-0 sm:max-w-none"
  >
    <nav id="nav-bar" :class="{ 'in-left': shown }" @click="open = false">
      <LayoutLogoName />
      <p><NuxtLink to="/economic-development-initiatives/" class="mobile-nav-link">Initiatives</NuxtLink></p>
      <p><NuxtLink to="/economic-development-programs/" class="mobile-nav-link">Programs</NuxtLink></p>
      <p><NuxtLink to="/economic-development-services/" class="mobile-nav-link">Services</NuxtLink></p>
      <p><NuxtLink to="/regional-partnerships" class="mobile-nav-link">Partnerships</NuxtLink></p>
      <p><NuxtLink to="/regional-profile" class="mobile-nav-link">Regional Profile</NuxtLink></p>
      <p><NuxtLink to="/regional-news" class="mobile-nav-link">News</NuxtLink></p>
      <p><NuxtLink to="/regional-events" class="mobile-nav-link">Events</NuxtLink></p>
      <p><NuxtLink to="/regional-news/resources" class="mobile-nav-link">Resources</NuxtLink></p>
      <p><NuxtLink to="/regional-organization" class="mobile-nav-link">Organization</NuxtLink></p>
      <p><NuxtLink to="/how-to-apply" class="mobile-nav-link">ARC Opportunities</NuxtLink></p>
      <div class="absolute tagline">
        <h4>Active</h4>
        <h4>Regional</h4>
        <h4>Now</h4>
      </div>
    </nav>
  </St8Sheet>
</template>

<style lang="scss">
@use '~/assets/scss/layout/mobileNav';

// The old panel positioned and slid itself (translateX); the sheet does that now, so the nav fills the sheet.
.mobile-nav-sheet nav#nav-bar,
.mobile-nav-sheet nav#nav-bar.in-left {
  position: relative;
  transform: none;
  height: 100%;
  min-height: 100vh;
}
// The sheet's own close button, on navy.
.mobile-nav-sheet > button {
  color: #fff;
  z-index: 1;
}
</style>
