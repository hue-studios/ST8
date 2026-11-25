<script setup lang="ts">
import { DEFAULT_CARD } from '#shared/utils/share'
const { organization } = useOrganization()

// The site card for any page that does not set its own (error pages, the catch-all). Pages that use useShareMeta set
// their own card, so the site card is not emitted next to it (a second og:image is ambiguous to crawlers).
useSeoMeta({ ogImage: DEFAULT_CARD, twitterImage: DEFAULT_CARD })

// Site-wide identity, so every page names who published it. The definition is one computed rather than a computed
// `sameAs`: nuxt-schema-org 7's types reject a ref on a single field.
useSchemaOrg([
  defineOrganization(computed(() => ({
    name: 'Southern Tier 8',
    logo: '/images/st8-social.png',
    sameAs: (organization.value.social_links || []).map(link => link.link),
  }))),
  defineWebSite({ name: 'Southern Tier 8' }),
])
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#1accb8" :height="10" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <St8Toaster />
  </div>
</template>
