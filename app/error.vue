<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
</script>

<template>
  <div id="error" class="container flex h-screen justify-center items-center">
    <div class="flex flex-col justify-center items-center mb-20">
      <h1 v-if="props.error.statusCode === 404">Uh oh...page not found.</h1>
      <h1 v-else>Uh oh...an error occurred.</h1>
      <NuxtLink to="/" class="uppercase mt-8 text-center tracking-widest bold" @click="clearError()">
        Home page <UniversalLinkIcon />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/layout/mobileNav';
@use '~/assets/scss/layout/mobileNavBtn';
@use '~/assets/scss/layout/mobileToolbar';
#error {
  .link-icon {
    transform: scale(0.8);
  }
}
</style>
