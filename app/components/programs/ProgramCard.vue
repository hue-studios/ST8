<script setup lang="ts">
import type { ProgramListItem } from '#shared/types/st8'

const props = defineProps<{ program: ProgramListItem }>()
const asset = useAsset()

const programInitiatives = computed(() => props.program.initiatives.map(i => i.initiatives_id.title))
const image = computed(() => {
  const id = props.program.images[0]?.directus_files_id.id
  return id ? asset(id, 'small') : ''
})
</script>

<template>
  <div
    :id="'program-card-' + program.id"
    class="w-full relative flex items-center justify-center flex-row mb-8 shadow-lg program-card"
    :data-initiatives="programInitiatives"
  >
    <div class="w-full h-full absolute program-card__background" />
    <div v-if="image" class="progam-card__image" :style="{ backgroundImage: `url(${image})` }" />
    <div v-else class="progam-card__image" />
    <div class="flex flex-col items-start justify-center program-card__content">
      <h2 class="uppercase w-full mb-1 md:mb-4 progam-card__title">
        {{ truncate(program.title, 65) }}
      </h2>
      <div class="w-full flex flex-row items-start justify-start text-xs progam-card__tags">
        <h5 v-if="program.initiatives.length > 0" class="uppercase navy">
          {{ program.initiatives.length }}
          <span class="green">Initiative<span v-if="program.initiatives.length > 1">s</span></span>
        </h5>
        <span v-if="program.counties.length > 0" class="ml-1 mr-1">/</span>
        <h5 v-if="program.counties.length > 0" class="uppercase navy">
          {{ program.counties.length }}
          <span class="green">Count<span v-if="program.counties.length > 1">ies</span><span v-else>y</span></span>
        </h5>
        <span v-if="program.counties.length > 0 && program.partners.length > 0" class="ml-1 mr-1">/</span>
        <h5 v-if="program.partners.length > 0" class="uppercase navy">
          {{ program.partners.length }}
          <span class="green">Partner<span v-if="program.partners.length > 1">s</span></span>
        </h5>
      </div>
      <p class="w-full mt-4 navy hidden md:inline-block progam-card__description">
        {{ truncate(program.what_is_it, 120) }}
      </p>
    </div>
    <NuxtLink
      :to="'/economic-development-programs/' + program.url"
      class="flex items-center justify-center progam-card__link"
    >
      <UniversalLinkIcon />
    </NuxtLink>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/components/programCard';
</style>
