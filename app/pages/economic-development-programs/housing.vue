<script setup lang="ts">
// The Housing program page: the hub for the Southern Tier Workforce Housing Investment Framework.
//
// Its own copy, framework links and share card come from the `housing_page` singleton in Directus. Counties, "what it
// is", partners, resources and news come from the program record that singleton points at, exactly as on any program
// page. Videos and Events joins the singleton's `videos` list with the published events linked to the program
// (events.programs). This file sits ahead of [slug].vue so /economic-development-programs/housing is not treated as a program slug;
// /programs/housing and the program's old slug redirect here from nuxt.config.ts.
import { readItems, readSingleton } from '@directus/sdk'
import type { EventListItem, ProgramDetail, ProgramListItem } from '#shared/types/st8'
import { PROGRAM_CARD_FIELDS, PROGRAM_FIELDS } from '#shared/utils/programs'

const PAGE_PATH = '/economic-development-programs/housing'
// The program's url in Directus; used if the singleton is unreadable or not linked to a program.
const PROGRAM_URL = 'housing'
const PAGE_FIELDS = [
  'title',
  'subtitle',
  'intro',
  'page_image',
  'share_description',
  'framework_links',
  'final_documents_intro',
  'final_documents',
  'opportunities_intro',
  'opportunities',
  'videos',
  'program',
]
const EVENT_FIELDS = ['id', 'title', 'url', 'date', 'time', 'description', 'image.id']

// Card icon for each link type; anything else gets the generic external-link icon. Literal names so the icon bundle
// scan finds them.
const ICONS: Record<string, string> = {
  overview: 'lucide:compass',
  dashboard: 'lucide:bar-chart-2',
  map: 'lucide:map',
  library: 'lucide:book-open',
  report: 'lucide:file-text',
  involved: 'lucide:users',
}

interface Row { title?: string, url?: string, description?: string, button_text?: string, type?: string }
interface VideoRow { title?: string, video_url?: string, description?: string }
const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isHttp = (value: unknown) => /^https?:\/\//i.test(String(value))

const directus = useDirectus()

const { data, error } = await useAsyncData('housing-program', async () => {
  // The page still works from the program record alone if the singleton can't be read.
  const page = await directus.request(readSingleton('housing_page', { fields: PAGE_FIELDS as never }))
    .then(row => (row || {}) as unknown as Record<string, unknown>)
    .catch(() => ({} as Record<string, unknown>))

  const programFilter = page.program
    ? { id: { _eq: page.program as number } }
    : { url: { _eq: PROGRAM_URL } }
  const programs = await directus.request(readItems('programs', {
    filter: programFilter as never,
    fields: PROGRAM_FIELDS as never,
    limit: 1,
  })) as unknown as ProgramDetail[]
  const program = programs[0] ?? null
  const others = program
    ? await directus.request(readItems('programs', {
      filter: { _and: [{ url: { _neq: program.url } }, { status: { _eq: 'published' } }] },
      fields: PROGRAM_CARD_FIELDS as never,
      limit: -1,
    })) as unknown as ProgramListItem[]
    : []
  // Events attached to the program in Directus (an event's Programs list). A failed read only hides them.
  const events = program
    ? await directus.request(readItems('events', {
      filter: { _and: [
        { status: { _eq: 'published' } },
        { date: { _nnull: true } },
        { programs: { programs_id: { _eq: program.id } } },
      ] } as never,
      fields: EVENT_FIELDS as never,
      sort: ['date'],
      limit: -1,
    })).catch(() => []) as unknown as EventListItem[]
    : []
  return { page, program, others, events }
})
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This program could not be loaded', fatal: true })
}
if (!data.value?.program) {
  throw createError({ statusCode: 404, statusMessage: 'Program not found', fatal: true })
}

const page = computed(() => data.value!.page)
const program = computed(() => data.value!.program!)
const otherPrograms = computed(() => data.value!.others)
// The core services this program sits under, each linking to its section on the Services page.
const coreServices = computed(() => (program.value.core_services ?? []).flatMap(c => (c.core_services_id ? [c.core_services_id] : [])))

const news = computed(() => program.value.news.filter(n => n.news_id))
const resources = computed(() => program.value.resources.filter(r => r.resources_id))
const partners = computed(() => program.value.partners.filter(p => p.partners_id))

const title = computed(() => clean(page.value.title) || 'Housing')
const subtitle = computed(() => clean(page.value.subtitle))
const intro = computed(() => openExternalLinksInNewTab(page.value.intro as string))
const finalDocumentsIntro = computed(() => openExternalLinksInNewTab(page.value.final_documents_intro as string))
const opportunitiesIntro = computed(() => openExternalLinksInNewTab(page.value.opportunities_intro as string))
const whatItIs = computed(() => openExternalLinksInNewTab(program.value.what_is_it))
const whatItAccomplishes = computed(() => openExternalLinksInNewTab(program.value.what_it_accomplishes))

// A row staff left half-filled is skipped rather than shown as a broken card.
const rows = (value: unknown) => (Array.isArray(value) ? value as Row[] : []).filter(row => row && clean(row.title) && isHttp(row.url))
const frameworkLinks = computed(() => rows(page.value.framework_links).map(row => ({
  title: clean(row.title),
  description: clean(row.description),
  url: clean(row.url),
  buttonText: clean(row.button_text) || 'Open',
  type: clean(row.type),
})))
const plainLinks = (value: unknown) => rows(value).map(row => ({
  title: clean(row.title),
  url: clean(row.url),
  description: clean(row.description),
}))
const finalDocuments = computed(() => plainLinks(page.value.final_documents))
const opportunities = computed(() => plainLinks(page.value.opportunities))

// Videos and Events. An event is upcoming through its own day (New York time); upcoming run soonest first, past ones
// most recent first. A video row missing its title or link is skipped.
const today = formatDate(nowInNewYork(), 'yyyy-MM-dd')
const events = computed(() => data.value!.events ?? [])
const upcomingEvents = computed(() => events.value.filter(e => e.date.slice(0, 10) >= today))
const pastEvents = computed(() => events.value.filter(e => e.date.slice(0, 10) < today).reverse())
const videos = computed(() => (Array.isArray(page.value.videos) ? page.value.videos as VideoRow[] : [])
  .filter(row => row && clean(row.title) && isHttp(clean(row.video_url)))
  .map(row => ({ title: clean(row.title), url: clean(row.video_url), description: clean(row.description) })))

const heroImage = computed(() => (page.value.page_image as string) || program.value.images[0]?.directus_files_id.id || '')
const tooLong = computed(() => title.value.length > 30)
const tooLongContent = computed(() => (program.value.what_is_it?.length ?? 0) > 30)
const shareDescription = computed(() =>
  clean(page.value.share_description) || cardText(page.value.intro as string, 160) || cardText(program.value.what_is_it, 160))
const fullTitle = computed(() => subtitle.value
  ? `${title.value} - ${subtitle.value}`
  : `${title.value} - Regional Program for the Southern Tier of New York`)

useShareMeta(() => ({
  title: fullTitle.value,
  description: shareDescription.value,
  path: PAGE_PATH,
  image: heroImage.value ? shareCard(heroImage.value) : DEFAULT_CARD,
  imageAlt: fullTitle.value,
}))
useHead({ link: [{ rel: 'canonical', href: SITE_URL + PAGE_PATH }] })

// Both story lines draw as the visitor scrolls.
useScrollLine({ paths: ['straight-line', 'program-line'] })
</script>

<template>
  <div id="program" class="relative housing">
    <div id="program__intro" class="flex flex-col justify-center items-center relative housing__hero">
      <div id="program__intro-caption" class="flex items-center justify-center flex-col relative lg:py-8 max-w-4xl">
        <div class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6">
          <div class="w-1/2 flex items-center justify-center shadow-lg progam__image">
            <NuxtImg v-if="heroImage" :src="heroImage" width="1000" quality="80" sizes="(min-width: 1024px) 40vw, 80vw" :alt="title" />
          </div>
          <div class="w-1/2 pl-4">
            <h1 class="uppercase green text-left program__page-title" :class="{ 'text-xs': tooLong }">
              <span class="navy">Program: </span>
              {{ title }}
            </h1>
            <p v-if="subtitle" class="navy housing__subtitle">{{ subtitle }}</p>
          </div>
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

      <h3 id="purpose-title" class="uppercase green relative program__title">About the Program</h3>
      <div
        id="purpose-description"
        class="relative p-6 program__description"
        :class="{ tooLong: tooLongContent }"
        v-html="whatItIs"
      />

      <h3 id="accomplishes-title" class="uppercase green relative program__title">What the Framework Delivers</h3>
      <div id="accomplishes-description" class="relative p-6 program__description">
        <div :class="{ tooLong: tooLongContent }" v-html="whatItAccomplishes" />
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
            rel="noopener"
            class="w-full absolute uppercase tracking-wider green bold text-center lg:text-left lg:px-0"
          >
            {{ program.accomplishes_links[0]!.title }}
            <UniversalLinkIcon class="ml-2" />
          </a>
        </div>
      </div>
      <UniversalPulseIcon icon-i-d="finish-btn" class-name="button" />
    </div>

    <section v-if="intro || frameworkLinks.length" id="housing__framework" class="w-full flex flex-col items-center housing__framework">
      <h2 class="uppercase green relative program__title">Explore the Framework Tools</h2>
      <div v-if="intro" class="navy housing__intro housing__rich-text" v-html="intro" />
      <ul v-if="frameworkLinks.length" class="housing__links">
        <li v-for="(link, index) in frameworkLinks" :key="index" class="housing__link-card">
          <Icon :name="ICONS[link.type] || 'lucide:external-link'" size="32" class="green housing__link-icon" aria-hidden="true" />
          <h2 class="uppercase navy bold housing__link-title">{{ link.title }}</h2>
          <p v-if="link.description" class="navy housing__link-description">{{ link.description }}</p>
          <a :href="link.url" target="_blank" rel="noopener" class="uppercase bold tracking-widest housing__link-button">
            {{ link.buttonText }}
            <span class="sr-only">(opens in a new tab)</span>
            <Icon name="lucide:external-link" size="1em" class="ml-2 housing__link-arrow" aria-hidden="true" />
          </a>
        </li>
      </ul>
    </section>

    <section
      v-if="upcomingEvents.length || pastEvents.length || videos.length"
      id="housing__videos-events"
      class="w-full flex flex-col items-center housing__section housing__media"
    >
      <h2 class="uppercase green relative program__title">Videos and Events</h2>
      <template v-if="upcomingEvents.length">
        <h3 class="uppercase navy bold housing__media-heading">Upcoming Events</h3>
        <ul class="housing__events">
          <li v-for="event in upcomingEvents" :key="event.id">
            <EventsEventCard :event="event" />
          </li>
        </ul>
      </template>
      <template v-if="pastEvents.length || videos.length">
        <h3 class="uppercase navy bold housing__media-heading">
          {{ pastEvents.length ? 'Past Events and Recordings' : 'Recordings' }}
        </h3>
        <ul v-if="pastEvents.length" class="housing__events">
          <li v-for="event in pastEvents" :key="event.id">
            <EventsEventCard :event="event" />
          </li>
        </ul>
        <ul v-if="videos.length" class="housing__videos">
          <li v-for="(video, index) in videos" :key="index" class="housing__video">
            <MediaVideoEmbed :url="video.url" :title="video.title" />
            <h4 class="uppercase navy bold housing__video-title">{{ video.title }}</h4>
            <p v-if="video.description" class="navy housing__video-description">{{ video.description }}</p>
          </li>
        </ul>
      </template>
    </section>

    <section
      v-if="finalDocumentsIntro || finalDocuments.length"
      id="housing__final-documents"
      class="w-full flex flex-col items-center housing__section"
    >
      <h2 class="uppercase green relative program__title">Final Documents</h2>
      <div v-if="finalDocumentsIntro" class="navy housing__intro housing__rich-text" v-html="finalDocumentsIntro" />
      <HousingLinkList :links="finalDocuments" />
    </section>

    <section
      v-if="opportunitiesIntro || opportunities.length"
      id="housing__opportunities"
      class="w-full flex flex-col items-center housing__section"
    >
      <h2 class="uppercase green relative program__title">Opportunities to be Involved</h2>
      <div v-if="opportunitiesIntro" class="navy housing__intro housing__rich-text" v-html="opportunitiesIntro" />
      <HousingLinkList :links="opportunities" />
    </section>

    <div class="flex flex-col justify-center items-center relative program__related">
      <template v-if="program.partners.length">
        <h3 class="uppercase green relative program__title">Partners</h3>
        <p class="px-4 text-center program__p">
          We have
          <span class="bold">{{ program.partners.length }} partner<span v-if="program.partners.length > 1">s</span></span>
          for the {{ title }} program.
        </p>
        <div id="program__partners" class="w-full flex flex-row justify-center items-center flex-wrap mt-6 px-10 max-w-5xl">
          <div v-for="(partner, index) in partners" :key="index" class="rounded-full flex items-center justify-center partners-badge">
            <NuxtImg
              v-if="partner.partners_id?.logo"
              :src="partner.partners_id.logo.id"
              :modifiers="{ key: 'thumbnail' }"
              :alt="partner.partners_id.title"
              :width="partner.partners_id.logo.width"
              :height="partner.partners_id.logo.height"
            />
          </div>
        </div>
      </template>
      <div v-if="resources.length" id="program__resources" class="w-full flex justify-center items-center flex-row flex-wrap relative">
        <h2 class="uppercase green relative program__title">Related Resources</h2>
        <CardSwiper :items="resources" preset="resources">
          <template #default="{ item }">
            <NowResourceCardVertical :item="item.resources_id!" />
          </template>
        </CardSwiper>
      </div>
      <div v-if="news.length" id="program__news" class="w-full flex justify-center items-center flex-row flex-wrap relative program__section">
        <h2 class="uppercase green relative program__title">Related News</h2>
        <CardSwiper :items="news" preset="resources">
          <template #default="{ item }">
            <NowNewsCardVertical :item="item.news_id!" />
          </template>
        </CardSwiper>
      </div>
      <div id="program__programs" class="w-full flex justify-center items-center flex-row flex-wrap relative program__section">
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
@use '~/assets/scss/pages/housing';
</style>
