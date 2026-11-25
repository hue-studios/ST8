<script setup lang="ts">
// A plain list of links for the Housing page's Final Documents and Opportunities sections. Each opens in a new tab:
// they are documents and forms, usually on other sites.
withDefaults(defineProps<{
  /** Already filtered to complete rows. */
  links?: Array<{ title: string, url: string, description: string }>
}>(), { links: () => [] })
</script>

<template>
  <ul v-if="links.length" class="housing__link-list">
    <li v-for="(link, index) in links" :key="index">
      <a :href="link.url" target="_blank" rel="noopener" class="green bold">
        {{ link.title }}
        <span class="sr-only">(opens in a new tab)</span>
        <Icon name="lucide:external-link" size="1em" class="ml-1" aria-hidden="true" />
      </a>
      <span v-if="link.description" class="navy"> — {{ link.description }}</span>
    </li>
  </ul>
</template>
