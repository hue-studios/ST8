<script setup lang="ts">
// Every route that exists on the live site but is not ported yet answers with the placeholder, never an error. The
// porting sessions delete a prefix from this list when they add the page (a real page file wins over this catch-all).
// Anything not listed is a genuine 404.
const PENDING = [
  'economic-development-initiatives',
  'economic-development-services',
  'how-to-apply',
  'regional-partnerships',
  'regional-profile',
  'regional-events',
  'regional-housing-forecast',
  'regional-news',
  'regional-organization',
  'reporting',
]

const route = useRoute()
const first = String(Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug)
if (!PENDING.includes(first)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({ title: 'Southern Tier 8', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <PagePlaceholder />
</template>
