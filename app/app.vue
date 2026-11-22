<script setup lang="ts">
const { organization } = useOrganization()

// Site-wide identity, so every page names who published it.
useSchemaOrg([
  defineOrganization({
    name: 'Southern Tier 8',
    logo: '/images/st8-social.png',
    sameAs: () => (organization.value.social_links || []).map(link => link.link),
  }),
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
