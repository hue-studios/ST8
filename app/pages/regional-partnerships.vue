<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { PartnerItem } from '#shared/types/st8'

const directus = useDirectus()
const asset = useAsset()

const { data, error } = await useAsyncData('partners-index', () =>
  directus.request(readItems('partners', {
    fields: ['id', 'title', 'website', 'category', 'logo.id'] as never,
    limit: -1,
  })) as unknown as Promise<PartnerItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Partners could not be loaded', fatal: true })
}

const withCategory = (term: string) =>
  data.value!.filter(partner => partner.logo && partner.category?.includes(term))
const regionalPartners = computed(() => withCategory('Regional'))
const plannerPartners = computed(() => withCategory('Planner'))
const workforcePartners = computed(() => withCategory('Workforce'))
const developerPartners = computed(() => withCategory('Economic Developer'))

const county = computed(() => [
  { items: plannerPartners.value, title: 'County Planners', cover: true },
  { items: workforcePartners.value, title: 'Workforce Partners', cover: false },
  { items: developerPartners.value, title: 'Economic Development Agencies', cover: true },
])
const count = (n: number) => String(n).padStart(2, '0')

useShareMeta({
  title: 'Southern Tier Economic Development Partners',
  description: 'The Southern Tier 8 organization collaborates with many partners across the region.',
  path: '/regional-partnerships/',
})
</script>

<template>
  <div id="partnerships" class="flex flex-col items-center justify-center">
    <div id="partnerships__intro" class="relative flex flex-col items-center justify-center w-full">
      <h3 class="w-full text-center navy lowercase thin-font mb-8">
        [ <span class="green">pahrt</span>-ner-ship ]
      </h3>
      <p class="navy uppercase tracking-wider w-5/6 text-center">
        <span class="bold font-black">Def:</span> the state or condition of being a partner; participation;
        association; joint interest.
      </p>
      <h5 class="absolute green uppercase tracking-widest w-5/6 text-center">
        Our joint interest is the Southern Tier 8 region.
      </h5>
    </div>
    <div id="partnerships__everything" class="w-full flex flex-col items-center justify-center partnerships__section">
      <h2 class="w-full text-center uppercase thin-font mb-2 partnerships__title">Collaboration is Everything</h2>
      <p>
        One of the main goals of our organization at Southern Tier 8, is to encourage and promote partnerships in all
        that we do, or anything we get involved with. We believe that only in this manner can we accomplish things more
        effectively, smoothly, and creatively.
      </p>
      <p>
        As a regional organization for the Southern Tier, we have the task of assisting 8 counties in Upstate NY, hence
        why we strongly believe that only by working together with our partners we’ll find the best solutions for any
        community challenge at hand.
      </p>
      <p>
        We work with our County representatives to assess community challenges, design innovative strategies,
        collaborate with partners to support ecosystems that encourage economic growth in the Southern Tier.
      </p>
    </div>
    <div id="partnerships__sliders" class="w-full flex flex-col items-center justify-center partnerships__section">
      <h2 class="w-full text-center uppercase thin-font partnerships__title">OUR FEDERAL AND STATE PARTNERS</h2>
      <div class="w-full flex items-center justify-center flex-col partnerships__partner-category">
        <h3 class="green thin-font mt-5 mb-1 number">{{ count(regionalPartners.length) }}</h3>
        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <CardSwiper :items="regionalPartners" :pagination="false" slide-class="partnerships__partner">
            <template #default="{ item }">
              <a
                :href="item.website || undefined"
                target="_blank"
                rel="noopener"
                :aria-label="item.title"
                class="shadow-lg border-gray-100 rounded-full bg-cover bg-no-repeat mx-4"
                :style="{ backgroundImage: `url(${asset(item.logo!.id)})` }"
              />
            </template>
          </CardSwiper>
        </div>
      </div>

      <h2 class="w-full text-center uppercase thin-font mt-8 partnerships__title">OUR COUNTY PARTNERS</h2>

      <div
        v-for="group in county"
        :key="group.title"
        class="w-full flex items-center justify-center flex-col partnerships__partner-category"
      >
        <h3 class="green thin-font mt-5 number">{{ count(group.items.length) }}</h3>
        <h5 class="uppercase grey tracking-widest bold mt-1 mb-1 title">{{ group.title }}</h5>
        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <CardSwiper :items="group.items" :pagination="false" slide-class="partnerships__partner">
            <template #default="{ item }">
              <a
                :href="item.website || undefined"
                target="_blank"
                rel="noopener"
                :aria-label="item.title"
                class="shadow-lg border-gray-100 rounded-full bg-no-repeat mx-4"
                :class="{ 'bg-cover': group.cover }"
                :style="{ backgroundImage: `url(${asset(item.logo!.id)})` }"
              />
            </template>
          </CardSwiper>
        </div>
      </div>
    </div>
    <div id="partnerships__initiatives" class="w-full flex flex-col items-center justify-center partnerships__section">
      <h2 class="w-full text-center uppercase thin-font partnerships__title" />
      <img id="partnerships-graphic" src="/images/partnerships-graphic@2x.png" alt="Partnerships Graphic">
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/partnerships';
</style>
