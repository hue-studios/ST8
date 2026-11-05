<template>
  <ul v-if="links.length" class="housing__link-list">
    <li v-for="(link, index) in links" :key="index">
      <a :href="link.url" target="_blank" rel="noopener" class="green bold">
        {{ link.title }}
        <span class="sr-only">(opens in a new tab)</span>
        <external-link-icon size="1x" class="ml-1" aria-hidden="true" />
      </a>
      <span v-if="link.description" class="navy">
        — {{ link.description }}</span
      >
    </li>
  </ul>
</template>

<script>
// A plain list of links for the Housing page's Final Documents and Opportunities sections.
// Each opens in a new tab: they are documents and forms, usually on other sites.
import { ExternalLinkIcon } from 'vue-feather-icons'

export default {
  components: { ExternalLinkIcon },
  props: {
    // [{ title, url, description }], already filtered to complete rows.
    links: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
