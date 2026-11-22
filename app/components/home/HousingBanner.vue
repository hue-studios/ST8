<script setup lang="ts">
// The Housing banner on the home page. Everything on it (image, title, text, and whether it shows at all) is edited in
// Directus under Site Pages → Housing → 4. Home Page Banner; the home page fetches it and passes it in, or passes null
// to leave the banner off.
defineProps<{
  banner: { image: string | null, title: string, text: string } | null
}>()
const asset = useAsset()
</script>

<template>
  <NuxtLink
    v-if="banner"
    id="home__housing-banner"
    to="/economic-development-programs/housing"
    class="w-full flex items-center relative"
  >
    <img
      v-if="banner.image"
      class="home__housing-banner-image"
      :src="`${asset(banner.image)}?width=1600&height=600&fit=cover&quality=80`"
      alt=""
    >
    <div class="home__housing-banner-copy">
      <span class="uppercase green tracking-widest bold small-title block">Housing</span>
      <h2 class="uppercase thin-font white">{{ banner.title }}</h2>
      <p v-if="banner.text" class="white">{{ banner.text }}</p>
      <span class="uppercase green link-font home__housing-banner-cta">
        Learn more
        <UniversalLinkIcon class="ml-1" />
      </span>
    </div>
  </NuxtLink>
</template>
