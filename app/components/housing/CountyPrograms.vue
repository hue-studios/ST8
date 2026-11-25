<script setup lang="ts">
const props = withDefaults(defineProps<{
  programs: Array<{ title: string, url: string }>
  countyName: string
  /** How many to show in the column before the toggle takes over. */
  cap?: number
}>(), { cap: 6 })

const expanded = ref(false)
// The cap is a large-screen idea; the carousel scrolls, so it shows everything. Server and first browser render agree
// (everything), then the media query takes over after mount.
const isWide = ref(false)
const shown = computed(() => (!isWide.value || expanded.value ? props.programs : props.programs.slice(0, props.cap)))

onMounted(() => {
  const query = window.matchMedia('(min-width: 1024px)')
  isWide.value = query.matches
  const onChange = (e: MediaQueryListEvent) => { isWide.value = e.matches }
  query.addEventListener('change', onChange)
  onBeforeUnmount(() => query.removeEventListener('change', onChange))
})
</script>

<template>
  <div class="county-programs">
    <h4 class="uppercase tracking-widest green bold mb-3">ST8 programs serving {{ countyName }}</h4>

    <!-- One list, read two ways: a capped column beside the map on large screens, and a horizontal swipe of cards
         below it on smaller ones, where a column this long would push the charts off the page. -->
    <ul class="county-programs__list">
      <li v-for="item in shown" :key="item.url" class="county-programs__item">
        <NuxtLink :to="`/economic-development-programs/${item.url}`">{{ item.title }}</NuxtLink>
      </li>
    </ul>

    <button
      v-if="programs.length > cap"
      type="button"
      class="county-programs__more uppercase tracking-widest"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show fewer' : `Show all ${programs.length}` }}
    </button>
  </div>
</template>
