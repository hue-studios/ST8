<template>
  <nuxt-link
    v-if="banner"
    id="home__housing-banner"
    to="/economic-development-programs/housing"
    class="w-full flex items-center relative"
  >
    <img
      v-if="banner.image"
      class="home__housing-banner-image"
      :src="
        imageLocation +
        banner.image +
        '?width=1600&height=600&fit=cover&quality=80'
      "
      alt=""
    />
    <div class="home__housing-banner-copy">
      <span class="uppercase green tracking-widest bold small-title block"
        >Housing</span
      >
      <h2 class="uppercase thin-font white">{{ banner.title }}</h2>
      <p v-if="banner.text" class="white">{{ banner.text }}</p>
      <span class="uppercase green link-font home__housing-banner-cta">
        Learn more
        <link-icon class="ml-1" />
      </span>
    </div>
  </nuxt-link>
</template>

<script>
// The Housing banner on the home page. Everything on it (image, title, text, and whether it shows
// at all) is edited in Directus under Housing Page → 4. Home Page Banner; the home page fetches it
// and passes it in, or passes null to leave the banner off.
import linkIcon from '~/components/universal/linkIcon'

export default {
  components: { linkIcon },
  props: {
    // { image, title, text }, or null to leave the banner off.
    banner: {
      type: Object,
      default: null,
    },
  },
  data() {
    return { imageLocation: process.env.imageUrl }
  },
}
</script>
