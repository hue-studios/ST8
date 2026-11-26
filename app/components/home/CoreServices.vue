<script setup lang="ts">
// The compact five-tile version of the core services for the home page. Each tile is the core service's title and its
// need line, and leads to that core service's section on the Services page (#plan, #develop, …). Titles, need lines and
// order are edited in Directus (Core Services); the home page fetches them and passes them in.
import type { CoreServiceItem } from '#shared/types/st8'

defineProps<{
  cores: Array<Pick<CoreServiceItem, 'id' | 'title' | 'url' | 'need'>>
}>()
</script>

<template>
  <div
    v-if="cores.length"
    id="home__core-services"
    class="w-full flex relative justify-center items-center flex-col home__section"
  >
    <h2 class="uppercase thin-font grey relative w-full mb-2 pl-2 home__title">
      <span class="green small-title block tracking-widest bold">How We </span>Help
    </h2>
    <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 home__subtitle">
      <p>Five ways we work with the region. Start with the one that sounds like you.</p>
    </div>
    <nav aria-label="Core services" class="w-full grid gap-3 px-4 md:px-8 home__core-services">
      <NuxtLink
        v-for="core in cores"
        :key="core.id"
        :to="'/economic-development-services#' + core.url"
        class="flex flex-col p-4 shadow-lg home__core-service"
      >
        <span class="uppercase green bold tracking-widest home__core-service-title">{{ core.title }}</span>
        <span v-if="core.need" class="navy mt-2 home__core-service-need">“{{ core.need }}”</span>
      </NuxtLink>
    </nav>
    <NuxtLink to="/economic-development-services" class="green w-full text-center pt-8 tracking-widest uppercase link-font">
      View All Services <UniversalLinkIcon class="ml-2" />
    </NuxtLink>
  </div>
</template>
