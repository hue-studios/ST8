<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { CoreServiceItem, ServiceItem } from '#shared/types/st8'

const directus = useDirectus()
const asset = useAsset()
const { ask } = useResourceRequest()

// A gated file opens the request form first and has no href (the same rule as the resource cards).
function askForFile(event: MouseEvent, resource: { id: number, title: string, require_info?: boolean | null, file?: { id: string } | null }) {
  if (!resource.require_info) return
  event.preventDefault()
  ask({ id: resource.id, title: resource.title })
}

// The five core services are the top level; each existing service sits under the one its `core_service` names.
const { data, error } = await useAsyncData('services-index', async () => {
  const [services, cores] = await Promise.all([
    directus.request(readItems('services', {
      fields: [
        'id', 'title', 'url', 'purpose', 'how_we_help', 'who_it_is_for', 'core_service',
        'example_programs.programs_id.id', 'example_programs.programs_id.title', 'example_programs.programs_id.url',
        'example_programs.programs_id.images.directus_files_id.id',
        'example_programs.programs_id.counties.counties_id.title',
        'example_programs.programs_id.initiatives.initiatives_id.title',
        'example_programs.programs_id.partners.partners_id.title',
        ...resourceFields('resources.resources_id'), 'resources.resources_id.description',
        'news.id', 'news.news_id.id', 'news.news_id.title', 'news.news_id.url', 'news.news_id.date_published',
        'news.news_id.date_created', 'news.news_id.date_updated', 'news.news_id.cover_image.id',
      ] as never,
      filter: { status: { _eq: 'published' } },
      sort: ['sort'],
      limit: -1,
    })) as unknown as Promise<ServiceItem[]>,
    // Not yet in the generated schema types (pnpm generate:types), so the name is cast, as in server/utils/searchIndex.ts.
    directus.request(readItems('core_services' as never, {
      fields: [
        'id', 'title', 'url', 'summary', 'need',
        'programs.programs_id.id', 'programs.programs_id.title', 'programs.programs_id.url',
      ] as never,
      filter: { status: { _eq: 'published' } } as never,
      sort: ['sort'] as never,
      limit: -1,
    })) as unknown as Promise<CoreServiceItem[]>,
  ])
  return { services, cores }
})
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Services could not be loaded', fatal: true })
}
// `anchor` keeps each service's old section id (#service-0, #service-1, … in sort order), which search and older links
// still use. `dark` alternates down the page as before, now counted across the groups.
const services = computed(() => data.value!.services.map((service, index) => ({
  ...service,
  anchor: 'service-' + index,
  example_programs: service.example_programs.filter(p => p.programs_id),
  news: service.news.filter(n => n.news_id),
  resources: service.resources.filter(r => r.resources_id),
})))
type Service = (typeof services.value)[number]

const groups = computed(() => {
  const coreIds = new Set(data.value!.cores.map(core => core.id))
  const list: Array<{ core: CoreServiceItem | null, services: Array<Service & { dark: boolean }> }> = []
  let count = 0
  const withShade = (items: Service[]) => items.map(service => ({ ...service, dark: count++ % 2 === 0 }))
  for (const core of data.value!.cores) {
    list.push({
      core: { ...core, programs: core.programs.filter(p => p.programs_id) },
      services: withShade(services.value.filter(service => service.core_service === core.id)),
    })
  }
  // A service with no core service (or an unpublished one) still shows, after the five.
  const loose = services.value.filter(service => !service.core_service || !coreIds.has(service.core_service))
  if (loose.length) list.push({ core: null, services: withShade(loose) })
  return list
})

useShareMeta({
  title: 'Economic Development Services for the Southern Tier Region of New York',
  description:
    'Southern Tier 8 helps the region plan, develop projects, connect partners, build capacity and invest, through funding and project development, planning, networking and reducing municipal costs.',
  path: '/economic-development-services/',
})

const published = (news: { date_published?: string | null, date_updated?: string | null, date_created?: string | null }) => {
  const value = news.date_published || news.date_updated || news.date_created
  return value ? formatDate(value, 'EEEE MMMM do, yyyy') : ''
}
</script>

<template>
  <div id="services" class="flex items-center justify-center flex-col">
    <div id="services-intro" class="pt-24 pb-12 md:py-24 flex flex-col justify-center items-center">
      <h1 class="uppercase navy pb-3 md:pb-0 md:mb-6 relative thin-font tracking-widest">Services</h1>
      <p class="navy text-center px-6 mb-8 md:mt-10 max-w-xl services-intro__lede">
        Five ways we work with the region. Start with the one that sounds like you.
      </p>
      <nav aria-label="Core services" class="w-full grid gap-3 px-4 md:px-8 services-intro__cores">
        <a
          v-for="group in groups.filter(g => g.core)"
          :key="group.core!.id"
          :href="'#' + group.core!.url"
          class="flex flex-col p-4 shadow-lg services-intro__core"
          @click.prevent="scrollToSection('#' + group.core!.url)"
        >
          <span class="uppercase green bold tracking-widest services-intro__core-title">{{ group.core!.title }}</span>
          <span v-if="group.core!.need" class="navy mt-2 services-intro__core-need">“{{ group.core!.need }}”</span>
        </a>
      </nav>
    </div>

    <section
      v-for="group in groups"
      :id="group.core?.url"
      :key="group.core?.id ?? 'more'"
      :aria-labelledby="group.core ? 'core-' + group.core.url : undefined"
      class="w-full core-section"
    >
      <div v-if="group.core" class="w-full flex flex-col md:flex-row md:items-start px-4 py-10 md:px-8 md:py-16 core-section__header">
        <div class="md:w-1/2 md:pr-8">
          <p class="uppercase text-xs green bold tracking-widest mb-2">Core service</p>
          <h2 :id="'core-' + group.core.url" class="uppercase navy thin-font core-section__title">{{ group.core.title }}</h2>
          <p v-if="group.core.summary" class="navy mt-4 core-section__summary">{{ group.core.summary }}</p>
          <p v-if="group.core.need" class="navy mt-3 italic core-section__need">“{{ group.core.need }}”</p>
        </div>
        <div class="md:w-1/2 mt-6 md:mt-0">
          <template v-if="group.services.length">
            <h3 class="uppercase text-xs green bold tracking-widest mb-2">Services</h3>
            <ul class="mb-5 core-section__list">
              <li v-for="service in group.services" :key="service.id">
                <a :href="'#' + service.anchor" class="navy" @click.prevent="scrollToSection('#' + service.anchor)">
                  {{ service.title }}
                </a>
              </li>
            </ul>
          </template>
          <template v-if="group.core.programs.length">
            <h3 class="uppercase text-xs green bold tracking-widest mb-2">Programs</h3>
            <ul class="core-section__list">
              <li v-for="program in group.core.programs" :key="program.programs_id!.id">
                <NuxtLink :to="'/economic-development-programs/' + program.programs_id!.url" class="navy">
                  {{ program.programs_id!.title }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <div v-else class="w-full px-4 py-10 md:px-8 core-section__header">
        <h2 class="uppercase navy thin-font core-section__title">More services</h2>
      </div>
      <div
        v-for="service in group.services"
        :id="service.anchor"
        :key="service.id"
        :class="{ dark: service.dark }"
        class="w-full flex items-start justify-start flex-col relative py-12 md:py-0 services-section"
      >
        <h3 class="uppercase green thin-font md:sticky services-section__title">{{ service.title }}</h3>

        <div v-if="service.purpose" class="w-full md:w-1/2 services-section__content">
          <h3 class="w-full uppercase text-xs green text-left bold">Purpose</h3>
          <div v-html="service.purpose" />
        </div>
        <div v-if="service.how_we_help" class="w-full md:w-1/2 services-section__content">
          <h3 class="w-full uppercase text-xs green text-left bold">How we help</h3>
          <div v-html="service.how_we_help" />
          <!-- The live page's relative link resolved to /economic-development-services/how-to-apply, which does not exist. -->
          <NuxtLink
            v-if="service.title.includes('Funding')"
            to="/how-to-apply"
            class="green bold tracking-widest uppercase button-link"
          >
            How to Apply <UniversalLinkIcon class="ml-2" />
          </NuxtLink>
        </div>
        <div v-if="service.who_it_is_for" class="w-full md:w-1/2 services-section__content">
          <h3 class="w-full uppercase text-xs green text-left bold">Who is this for?</h3>
          <div v-html="service.who_it_is_for" />
        </div>
        <div
          v-if="service.example_programs.length > 0 || service.news.length > 0"
          class="w-full md:w-1/2 services-section__content"
        >
          <h3 class="w-full uppercase text-xs green text-left bold">Recent Investment</h3>
          <div class="w-full flex flex-col items-center justify-start mt-4">
            <NuxtLink
              v-for="program in service.example_programs"
              :key="program.programs_id.id"
              :to="'/economic-development-programs/' + program.programs_id.url"
              class="flex flex-row items-center justify-start mb-6 shadow-lg services-section__program"
            >
              <div
                v-if="program.programs_id.images.length > 0"
                class="services-section__program-image"
                :style="{ backgroundImage: `url(${asset(program.programs_id.images[0]!.directus_files_id.id)})` }"
              />
              <div class="flex flex-col services-section__program-content">
                <h4 class="uppercase mb-2">{{ program.programs_id.title }}</h4>
                <div class="w-full flex flex-row items-start justify-start text-xs services-section__program-tags">
                  <h5 v-if="program.programs_id.initiatives.length > 0" class="uppercase navy bold">
                    {{ program.programs_id.initiatives.length }}
                    <span class="green">Initiative<span v-if="program.programs_id.initiatives.length > 1">s</span> </span>
                  </h5>
                  <span v-if="program.programs_id.counties.length > 0" class="ml-1 mr-1">/</span>
                  <h5 v-if="program.programs_id.counties.length > 0" class="uppercase navy bold">
                    {{ program.programs_id.counties.length }}
                    <span class="green">Count<span v-if="program.programs_id.counties.length > 1">ies</span><span v-else>y</span> </span>
                  </h5>
                  <span
                    v-if="program.programs_id.counties.length > 0 && program.programs_id.partners.length > 0"
                    class="ml-1 mr-1"
                  >/</span>
                  <h5 v-if="program.programs_id.partners.length > 0" class="uppercase navy bold">
                    {{ program.programs_id.partners.length }}
                    <span class="green">Partner<span v-if="program.programs_id.partners.length > 1">s</span> </span>
                  </h5>
                </div>
              </div>
              <div class="flex items-center justify-center services-section__program-link">
                <UniversalLinkIcon />
              </div>
            </NuxtLink>
            <NuxtLink
              v-for="article in service.news"
              :key="article.id"
              :to="'/regional-news/' + article.news_id!.url"
              class="flex flex-row items-center justify-start mb-6 shadow-lg services-section__program"
            >
              <div
                v-if="article.news_id!.cover_image"
                class="services-section__program-image"
                :style="{ backgroundImage: `url(${asset(article.news_id!.cover_image.id)})` }"
              />
              <div class="flex flex-col services-section__program-content">
                <h4 class="uppercase mb-2">{{ article.news_id!.title }}</h4>
                <div class="w-full flex flex-row items-start justify-start text-xs services-section__program-tags">
                  <h5 class="uppercase navy bold">
                    <span class="green">Published </span>
                    {{ published(article.news_id!) }}
                  </h5>
                </div>
              </div>
              <div class="flex items-center justify-center services-section__program-link">
                <UniversalLinkIcon />
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-if="service.resources.length > 0" class="w-full md:w-1/2 services-section__content">
          <h3 class="w-full uppercase text-xs green text-left bold">Resources</h3>
          <div class="w-full flex flex-col items-center justify-start mt-4">
            <div
              v-for="resource in service.resources"
              :key="resource.resources_id!.id"
              class="w-full flex items-center justify-center flex-col mb-10 p-4 md:p-6 shadow-lg services-section__resource-card"
            >
              <h5 class="uppercase tracking-widest w-full mb-4 pb-4 navy services-section__resource-card-title">
                {{ resource.resources_id!.title }}
              </h5>
              <p v-if="resource.resources_id!.description" class="navy services-section__resource-card-description">
                {{ resource.resources_id!.description }}
              </p>
              <a
                v-if="resource.resources_id!.type === 'Internal File / PDF' && resource.resources_id!.file"
                :href="resource.resources_id!.require_info ? undefined : asset(resource.resources_id!.file.id)"
                class="w-full uppercase text-xs green bold tracking-widest text-right services-section__resource-card-link"
                :target="resource.resources_id!.require_info ? undefined : '_blank'"
                :style="resource.resources_id!.require_info ? { cursor: 'pointer' } : undefined"
                @click="askForFile($event, resource.resources_id!)"
              >
                View File
                <UniversalLinkIcon class="ml-2" />
              </a>
              <a
                v-if="resource.resources_id!.type === 'External Link'"
                :href="resource.resources_id!.link || undefined"
                target="_blank"
                rel="noreferrer"
                class="w-full uppercase text-xs green bold tracking-widest text-right services-section__resource-card-link"
              >
                Go to Resource
                <UniversalLinkIcon class="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/services';
</style>
