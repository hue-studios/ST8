<script setup lang="ts">
// The bar stays put. Scrolling down compacts it (shorter, smaller logo, the New York graphic folded away) and scrolling
// up, or getting back near the top, restores it. `.scrolled` (after 80px) still hands the home page's hero treatment
// over to the normal bar.
const SCROLLED_AT = 80
// How far the page must travel in one direction before the bar changes, so a jittery trackpad doesn't flicker it.
const TRAVEL = 12

const { y } = useWindowScroll()
// The server renders the top-of-page bar; reading the scroll only once mounted keeps hydration matching it.
const mounted = useMounted()
const top = computed(() => (mounted.value ? Math.max(y.value, 0) : 0))

const isScrolled = computed(() => top.value > SCROLLED_AT)
const compact = ref(false)
// The furthest point reached in the current direction: the lowest while full, the highest while compact.
let turn = 0

watch(top, (current) => {
  if (current <= SCROLLED_AT) {
    compact.value = false
    turn = current
    return
  }
  const travelled = current - turn
  if (compact.value ? travelled <= -TRAVEL : travelled >= TRAVEL) {
    compact.value = !compact.value
    turn = current
  }
  else if (compact.value ? current > turn : current < turn) {
    turn = current
  }
})

// Pages that pin things under the bar (sticky titles, a table of contents) read its current height from
// `--st8-header`, which this class switches to the compact value.
useHead({ htmlAttrs: { class: computed(() => (compact.value ? 'header-compact' : '')) } })

// Which dropdown (active / regional / now) the pointer is over.
const openDrop = ref<string | null>(null)
const hasPodcast = useHasPodcast()

const { open: searchOpen, toggle: toggleSearch } = useSearchOpen()
</script>

<template>
  <div id="page-header" :class="{ compact, scrolled: isScrolled }">
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
      <div
        id="organizationNavContainer"
        class="relative page-nav__drop-container"
        :class="{ showDropNav: openDrop === 'organization' }"
        @mouseover="openDrop = 'organization'"
        @mouseleave="openDrop = null"
      >
        <NuxtLink to="/regional-organization/">
          <h3 class="uppercase">Organization</h3>
        </NuxtLink>
        <div class="flex items-center justify-center flex-row page-nav__drop-links">
          <NuxtLink v-if="hasPodcast" to="/regional-organization/#podcast" class="uppercase">Podcast</NuxtLink>
          <NuxtLink to="/regional-organization/#staff-section" class="uppercase">Team</NuxtLink>
          <NuxtLink to="/regional-organization/#board-section" class="uppercase">Board</NuxtLink>
          <NuxtLink to="/regional-organization/#roi-section" class="uppercase">ROI</NuxtLink>
        </div>
      </div>
    </div>
    <St8Button
      variant="ghost"
      class="page-header__search"
      aria-label="Search"
      aria-haspopup="dialog"
      :aria-expanded="searchOpen"
      @click="toggleSearch"
    >
      <Icon name="lucide:search" class="page-header__search-icon" />
      <span class="page-header__search-label">Search</span>
    </St8Button>
    <LayoutNewYorkState />
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/layout/pageHeader';
@use '~/assets/scss/layout/pageNav';
</style>
