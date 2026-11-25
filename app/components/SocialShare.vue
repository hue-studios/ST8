<script setup lang="ts">
import { SITE_URL } from '#shared/utils/share'

// LinkedIn, X and Facebook share links, replacing vue-social-sharing's <ShareNetwork>. Plain links, so they work
// without JavaScript and open in a new tab. `path` is the page's own path with a leading slash.
const props = defineProps<{ path: string, title: string }>()

const url = computed(() => encodeURIComponent(SITE_URL + props.path))
const title = computed(() => encodeURIComponent(props.title))

const networks = computed(() => [
  { name: 'LinkedIn', icon: 'simple-icons:linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url.value}` },
  { name: 'X', icon: 'simple-icons:x', href: `https://twitter.com/intent/tweet?url=${url.value}&text=${title.value}&hashtags=southernTier` },
  { name: 'Facebook', icon: 'simple-icons:facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url.value}&quote=${title.value}&hashtag=%23southernTier` },
])
</script>

<template>
  <div id="sharing" class="flex flex-row items-center justify-center flex-wrap">
    <h5 class="uppercase grey script mb-4 md:mb-0 md:mr-2 tracking-wider">Share:</h5>
    <a
      v-for="network in networks"
      :key="network.name"
      :href="network.href"
      target="_blank"
      rel="noopener"
      :aria-label="`Share on ${network.name}`"
    >
      <Icon :name="network.icon" size="1.15em" class="share-icon block" />
    </a>
  </div>
</template>
