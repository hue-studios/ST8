<script setup lang="ts">
import { readItems, readSingleton } from '@directus/sdk'

interface Person {
  id: number
  name: string
  title?: string | null
  phone?: string | null
  email?: string | null
  category: string
  image?: { id: string } | null
  county?: { title: string } | null
}
interface CountyRow { id: number, title: string, roi?: { id: string } | null }

const directus = useDirectus()
const asset = useAsset()
const { orgAsset } = useOrganization()

const { data, error } = await useAsyncData('regional-organization', async () => {
  const [organization, people, counties] = await Promise.all([
    directus.request(readSingleton('organization', { fields: ['mission_statement', 'who_we_are', 'our_role', 'our_history'] as never })),
    directus.request(readItems('people', {
      fields: ['id', 'name', 'title', 'phone', 'email', 'category', 'sort', 'image.id', 'county.title'] as never,
      filter: { status: { _eq: 'published' } },
      sort: ['sort'],
      limit: -1,
    })),
    directus.request(readItems('counties', {
      fields: ['id', 'title', 'sort', 'roi.id'] as never,
      filter: { status: { _eq: 'published' } },
      sort: ['sort'],
      limit: -1,
    })),
  ])
  return {
    organization: organization as unknown as Record<string, string | null>,
    people: people as unknown as Person[],
    counties: counties as unknown as CountyRow[],
  }
})
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'The organization page could not be loaded', fatal: true })
}

const organization = computed(() => data.value!.organization)
const staff = computed(() => data.value!.people.filter(p => p.category === 'Staff'))
const board = computed(() => data.value!.people.filter(p => p.category === 'Board'))
const filteredCounties = computed(() => data.value!.counties.filter(c => c.title !== 'Regional'))
const regional = computed(() => data.value!.counties.find(c => c.title === 'Regional'))
const boardFor = (county: string) => board.value.filter(p => p.county?.title === county)
const BOARD_COUNTIES = ['Broome', 'Chenango', 'Cortland', 'Delaware', 'Otsego', 'Schoharie', 'Tioga', 'Tompkins']
const text = (value?: string | null) => (value || '').trim()

useShareMeta({
  title: 'Regional Economic Development Organization for the Southern Tier of New York',
  description:
    'The Southern Tier 8 organization partner\'s with member counties to identify and address multi-county issues in order to improve the quality of life within the region.',
  path: '/regional-organization/',
})

useScrollLine({ paths: ['straight-line'] })
</script>

<template>
  <div id="organization">
    <div id="mission-section" class="w-full flex items-center justify-center flex-col relative">
      <div id="mission-section__counties" class="absolute left-0">
        <h1 v-for="county in filteredCounties" :key="county.id" class="uppercase grey block md:opacity-25 bold">
          {{ county.title }}
        </h1>
      </div>
      <div class="flex flex-col justify-center items-start statement">
        <h2 class="uppercase green tracking-widest thin-font">Mission</h2>
        <!-- Plain text from the CMS: keep staff's line breaks. -->
        <p class="navy whitespace-pre-line" v-text="text(organization.mission_statement)" />
      </div>
    </div>
    <div id="organization-info" class="w-full flex items-center flex-col justify-center py-20 relative">
      <UniversalPulseIcon icon-i-d="start-btn" class-name="button" />
      <svg id="straightLineSVG" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 695.51">
        <path
          id="straight-line"
          data-name="Path 6808"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M.5,0V695.51"
        />
      </svg>
      <div id="organization-info__container" class="flex flex-col items-start px-8">
        <h2 class="w-full page-title uppercase tracking-widest pt-2 pb-1 thin-font mb-20 relative text-center">Our Vision</h2>
        <div class="mb-20 pb-4 text-justify whitespace-pre-line" v-text="text(organization.who_we_are)" />

        <h2 class="w-full page-title uppercase tracking-widest mt-8 thin-font pt-2 pb-1 mb-20 text-center relative">Our Approach</h2>
        <div class="mb-20 pb-4 text-justify whitespace-pre-line" v-text="text(organization.our_role)" />

        <h2 class="w-full page-title uppercase text-center tracking-widest thin-font mt-8 pt-2 pb-1 mb-20 relative">Our History</h2>
        <div class="mb-20 pb-4 text-justify whitespace-pre-line" v-text="text(organization.our_history)" />

        <p class="w-full text-center mb-20 py-4 tracking-widest uppercase bold text-xs">View our 5 year plan 2023-2028:</p>
        <div class="w-full text-center bg-transparent">
          <a
            class="inline-block px-12 py-6 uppercase green bold tracking-widest font-medium"
            :href="orgAsset('ceds_document')"
            target="_blank"
            rel="noreferrer"
          >CEDS</a>
        </div>
      </div>
    </div>
    <div id="staff-section" class="w-full flex flex-col justify-center items-center py-20">
      <h2 class="uppercase navy thin-font w-full text-center page-title tracking-widest">Team</h2>
      <div
        v-for="person in staff"
        :key="person.id"
        class="flex flex-row justify-between items-center w-full md:w-5/6 people-card"
      >
        <div
          v-if="person.image"
          :style="{ backgroundImage: `url(${asset(person.image.id, 'small')})` }"
          class="bg-cover bg-center bg-no-repeat people-card__image"
        />
        <div
          v-else
          :style="{ backgroundImage: `url(${orgAsset('default_person_image', 'small')})`, backgroundSize: '100% auto' }"
          class="bg-center bg-no-repeat people-card__image"
        />
        <div class="people-card__info">
          <div class="flex flex-row justify-between items-center tracking-widest bold people-card__name">
            <h3 class="uppercase">{{ person.name }}</h3>
            <div class="flex flex-col justify-end items-end people-card__links">
              <a :href="`tel:${person.phone}`" class="uppercase" target="_blank">{{ person.phone }}</a>
              <a :href="`mailto:${person.email}`" class="uppercase" target="_blank">{{ person.email }}</a>
            </div>
          </div>
          <h5 v-if="person.title" class="uppercase bold people-card__title">{{ person.title }}</h5>
        </div>
      </div>
    </div>

    <div id="board-section" class="w-full flex justify-center items-start flex-row flex-wrap py-20">
      <h2 class="uppercase w-full text-center page-title tracking-widest thin-font white mb-6">Board of Directors</h2>
      <div v-for="county in BOARD_COUNTIES" :key="county" class="text-center board-card">
        <h3 class="uppercase">{{ county }} County</h3>
        <h5 v-for="person in boardFor(county)" :key="person.id" class="uppercase">
          {{ person.name }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
    </div>
    <div id="roi-section" class="w-full flex justify-center items-center flex-col py-20">
      <h2 class="uppercase w-full text-center page-title tracking-widest thin-font mb-8 navy">Return on Investment</h2>
      <a
        v-if="regional?.roi"
        :href="asset(regional.roi.id)"
        target="_blank"
        rel="noreferrer"
        class="flex items-center justify-center flex-col relative py-12 mb-8 roi-card"
      >
        <h5 class="absolute uppercase thin-font">ROI</h5>
        <h3 class="green uppercase tracking-widest bold">Regional</h3>
      </a>
      <p class="w-full px-8 mb-8">
        Southern Tier 8 Regional Board represents eight counties as the 6th largest Local Development District for the
        Appalachian Regional Commission (ARC), and five counties as an Economic Development District under the US
        Economic Development Administration (EDA). Federal partners, ARC and EDA offer investments to leverage private
        sector dollars that increase job opportunities, raise per capita income, promote infrastructure improvements and
        strengthen the capacity of our people to compete in global economies. County participation and investments make
        these programs possible, with an average annual return of $5,500 per $1 of local investment.
      </p>
      <div class="flex flex-row flex-wrap items-center justify-center max-w-3xl">
        <div v-for="county in filteredCounties" :key="county.id">
          <a
            v-if="county.roi"
            :href="asset(county.roi.id)"
            target="_blank"
            rel="noreferrer"
            class="flex items-center justify-center flex-col relative py-12 mx-2 mb-4 roi-card"
          >
            <h5 class="absolute uppercase thin-font">ROI</h5>
            <h3 class="green uppercase tracking-widest bold">{{ county.title }}</h3>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pageStyles';
@use '~/assets/scss/pages/organization';
</style>
