<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { ProgramDetail, ProgramListItem } from '#shared/types/st8'
import { PROGRAM_CARD_FIELDS, PROGRAM_FIELDS } from '#shared/utils/programs'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const directus = useDirectus()

// The program and the "Explore Our Programs" row load together on the server. The row used to load in the browser after
// the page; that now needs no browser request to the CMS (which only allows requests from the live site's origin).
const { data, error } = await useAsyncData(
  () => `program-${slug.value}`,
  async () => {
    const [rows, others] = await Promise.all([
      directus.request(readItems('programs', {
        filter: { url: { _eq: slug.value } },
        fields: PROGRAM_FIELDS as never,
        limit: 1,
      })),
      directus.request(readItems('programs', {
        filter: { _and: [{ url: { _neq: slug.value } }, { status: { _eq: 'published' } }] },
        fields: PROGRAM_CARD_FIELDS as never,
        limit: -1,
      })),
    ])
    return {
      program: ((rows as unknown as ProgramDetail[])[0] ?? null),
      others: others as unknown as ProgramListItem[],
    }
  },
  { watch: [slug] },
)
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This program could not be loaded', fatal: true })
}
if (!data.value?.program) {
  throw createError({ statusCode: 404, statusMessage: 'Program not found', fatal: true })
}
const program = computed(() => data.value!.program!)
const otherPrograms = computed(() => data.value!.others)

// Related items may include drafts; the link pruning already drops unreadable ones, this guards the rest.
const news = computed(() => program.value.news.filter(n => n.news_id))
const resources = computed(() => program.value.resources.filter(r => r.resources_id))
const partners = computed(() => program.value.partners.filter(p => p.partners_id))
// The core services this program sits under, each linking to its section on the Services page.
const coreServices = computed(() => (program.value.core_services ?? []).flatMap(c => (c.core_services_id ? [c.core_services_id] : [])))

const tooLong = computed(() => program.value.title.length > 30)
const tooLongContent = computed(() => (program.value.what_is_it?.length ?? 0) > 30)
const heroImage = computed(() => program.value.images[0]?.directus_files_id.id)

const title = `${program.value.title} - Regional Program for the Southern Tier of New York`
useShareMeta({
  title,
  description: cardText(program.value.what_is_it, 160),
  path: `/economic-development-programs/${program.value.url}`,
  image: heroImage.value ? shareCard(heroImage.value) : DEFAULT_CARD,
  imageAlt: title,
})

// The line drawings trace themselves as the visitor scrolls.
useScrollLine({ paths: ['straight-line', 'program-line'] })
</script>

<template>
  <div v-if="program" id="program" class="relative">
    <div id="program__intro" class="flex flex-col justify-center items-center relative">
      <div
        id="program__intro-caption"
        class="flex items-center justify-center flex-col relative lg:py-8 max-w-4xl"
      >
        <div class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6">
          <div class="w-1/2 flex items-center justify-center shadow-lg progam__image">
            <NuxtImg v-if="heroImage" :src="heroImage" :modifiers="{ key: 'medium' }" :alt="program.title" />
          </div>
          <h1 class="w-1/2 uppercase green pl-4 text-left program__page-title" :class="{ 'text-xs': tooLong }">
            <span class="navy">Program: </span>
            {{ program.title }}
          </h1>
        </div>
        <div
          v-if="coreServices.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div class="w-full flex flex-row flex-wrap items-center justify-start">
            <h4 class="uppercase green mr-2 mb-1 bold">
              Core service<span v-if="coreServices.length > 1">s</span>:
            </h4>
            <h5 v-for="(core, index) in coreServices" :key="core.url" class="uppercase mr-1 mb-1">
              <NuxtLink :to="'/economic-development-services#' + core.url" class="hover:underline">{{ core.title }}</NuxtLink>
              <span v-if="index + 1 < coreServices.length" class="green"> /</span>
            </h5>
          </div>
        </div>
        <div
          v-if="program.counties.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div class="w-full flex flex-row flex-wrap items-center justify-start">
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.counties.length }} Count<span v-if="program.counties.length > 1">ies</span><span v-else>y</span> Served:
            </h4>
            <h5 v-for="(county, index) in program.counties" :key="index" class="uppercase mr-1 mb-1">
              {{ county.counties_id.title }}
              <span v-if="index + 1 < program.counties.length" class="green"> /</span>
            </h5>
          </div>
        </div>
        <div
          v-if="program.initiatives.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div class="w-full flex flex-row flex-wrap items-center justify-start">
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.initiatives.length }} Initiative<span v-if="program.initiatives.length > 1">s</span> Served:
            </h4>
            <h5 v-for="(initiative, index) in program.initiatives" :key="index" class="uppercase mr-1 mb-1">
              {{ initiative.initiatives_id.title }}
              <span v-if="index + 1 < program.initiatives.length" class="green"> /</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div id="program__story" class="flex flex-col justify-start items-center relative program__story">
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
      <svg id="lineSVG" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 963 1479.58">
        <path
          id="program-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M961.5,0V155.37H1.5V456.1h960V753.44H481.12v300.23H1.5v298.51H481.12v127.4"
        />
      </svg>

      <h3 id="purpose-title" class="uppercase green relative program__title">What it is.</h3>

      <div
        id="purpose-description"
        class="relative p-6 program__description"
        :class="{ tooLong: tooLongContent }"
        v-html="program.what_is_it"
      />

      <h3 id="accomplishes-title" class="uppercase green relative program__title">What it accomplishes.</h3>

      <div id="accomplishes-description" class="relative p-6 program__description">
        <div :class="{ tooLong: tooLongContent }" v-html="program.what_it_accomplishes" />
        <div v-if="program.accomplishes_links && program.accomplishes_links.length" class="mt-2">
          <NuxtLink
            v-if="!program.accomplishes_links[0]!.external"
            :to="program.accomplishes_links[0]!.link"
            class="w-full absolute uppercase tracking-wider green bold text-center lg:text-left lg:px-0"
          >
            {{ program.accomplishes_links[0]!.title }}
            <UniversalLinkIcon class="ml-2" />
          </NuxtLink>
          <a
            v-else
            :href="program.accomplishes_links[0]!.link"
            target="_blank"
            rel="noreferrer"
            class="w-full absolute uppercase tracking-wider green bold text-center lg:text-left lg:px-0"
          >
            {{ program.accomplishes_links[0]!.title }}
            <UniversalLinkIcon class="ml-2" />
          </a>
        </div>
      </div>
      <UniversalPulseIcon icon-i-d="finish-btn" class-name="button" />
    </div>
    <div class="flex flex-col justify-center items-center relative program__related">
      <h3 class="uppercase green relative program__title">Partners</h3>
      <p class="px-4 text-center program__p">
        We have
        <span class="bold">{{ program.partners.length }} partner<span v-if="program.partners.length > 1">s</span></span>
        for the {{ program.title }} program.
      </p>
      <div
        id="program__partners"
        class="w-full flex flex-row justify-center items-center flex-wrap mt-6 px-10 max-w-5xl"
      >
        <div
          v-for="(partner, index) in partners"
          :key="index"
          class="rounded-full flex items-center justify-center partners-badge"
        >
          <NuxtImg
            v-if="partner.partners_id?.logo"
            :src="partner.partners_id.logo.id"
            :modifiers="{ key: 'thumbnail' }"
            :alt="partner.partners_id.title"
            width="80"
            height="80"
          />
        </div>
      </div>
      <div
        v-if="resources.length"
        id="program__resources"
        class="w-full flex justify-center items-center flex-row flex-wrap relative"
      >
        <h2 class="uppercase green relative program__title">Resources</h2>
        <CardSwiper :items="resources" preset="resources">
          <template #default="{ item }">
            <NowResourceCardVertical :item="item.resources_id" />
          </template>
        </CardSwiper>
      </div>
      <div
        v-if="news.length"
        id="program__news"
        class="w-full flex justify-center items-center flex-row flex-wrap relative program__section"
      >
        <h2 class="uppercase green relative program__title">Related News</h2>
        <CardSwiper :items="news" preset="resources">
          <template #default="{ item }">
            <NowNewsCardVertical :item="item.news_id!" />
          </template>
        </CardSwiper>
      </div>
      <div
        id="program__programs"
        class="w-full flex justify-center items-center flex-row flex-wrap relative program__section"
      >
        <h2 class="uppercase green relative program__title">Explore Our Programs</h2>
        <CardSwiper :items="otherPrograms" preset="programs" slide-class="flex flex-col items-center justify-center px-3 sm:px-8">
          <template #default="{ item }">
            <ProgramsProgramCard :program="item" />
          </template>
        </CardSwiper>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/program';
</style>
