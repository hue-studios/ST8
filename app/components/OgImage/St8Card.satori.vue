<script setup lang="ts">
// The share card for pages with a cover picture: the picture full-bleed, a navy band along the bottom with the page
// title and the Southern Tier 8 name. Satori reads inline styles only (no Tailwind classes) and needs flex on every
// container with more than one child.
defineProps<{
  title: string
  /** Absolute URL of the cover picture, already cropped to 1200x630 by the CMS. */
  image?: string
  label?: string
}>()
</script>

<template>
  <div :style="{ display: 'flex', width: '100%', height: '100%', position: 'relative', backgroundColor: '#1d3557' }">
    <img
      v-if="image"
      :src="image"
      :style="{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }"
    >
    <div
      :style="{
        position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column',
        padding: '36px 56px 40px', backgroundColor: 'rgba(29, 53, 87, 0.92)', color: '#ffffff',
      }"
    >
      <div :style="{ display: 'flex', fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: '#1accb8' }">
        {{ label || 'Southern Tier 8' }}
      </div>
      <div :style="{ display: 'flex', marginTop: 10, fontSize: 52, fontWeight: 700, lineHeight: 1.15 }">
        {{ title }}
      </div>
    </div>
  </div>
</template>
