<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { ReportItem } from '#shared/types/st8'

const directus = useDirectus()

const { data, error } = await useAsyncData('reporting-index', () =>
  directus.request(readItems('reporting', {
    fields: ['id', 'title', 'date', 'date_created', 'date_updated', 'file.id'] as never,
    filter: { status: { _eq: 'published' } },
    sort: ['-date'],
    limit: -1,
  })) as unknown as Promise<ReportItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Reports could not be loaded', fatal: true })
}

const search = ref('')
const filteredReports = computed(() => {
  const term = search.value.trim().toLowerCase()
  return term ? data.value!.filter(item => item.title.toLowerCase().includes(term)) : data.value!
})

useShareMeta({
  title: 'Public Reporting and Documentation for Southern Tier 8 Regional Board',
  description:
    'The Southern Tier 8 organization partner\'s with member counties to identify and address multi-county issues in order to improve the quality of life within the region.',
  path: '/reporting/',
})
</script>

<template>
  <div id="reporting" class="flex flex-col items-center justify-center pb-32">
    <div id="reporting__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
      <h1 class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font">
        Reporting
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-3/5">
        This is a collection of our public documents published for reporting purposes and accessible to the public.
      </p>
    </div>
    <div id="reporting__reporting-cards" class="relative w-full flex items-center justify-center flex-col pb-20">
      <div class="w-full text-center px-8 mb-4 reporting__filters">
        <input
          v-model="search"
          class="condensed uppercase bg-white shadow-sm appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden search-input"
          type="text"
          placeholder="Search."
          aria-label="Search reports"
        >
      </div>

      <TransitionGroup name="list" tag="div" class="w-full flex flex-col items-center justify-center px-3 sm:px-8">
        <ReportingReportCard v-for="item in filteredReports" :key="item.id" :item="item" />
      </TransitionGroup>
      <p v-if="filteredReports.length < 1" class="uppercase text-xs tracking-widest mt-24 text-center">
        there were no results.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pageStyles';
#reporting {
  #reporting__intro {
    height: 200px;
    @media (min-width: $breakpoint-small) {
      height: 250px;
    }
    @media (min-width: $breakpoint-large) {
      height: 200px;
    }
    h1 {
      font-size: 42px;
      line-height: 1.2em;
      position: relative;
      margin-top: 70px;
      @media (min-width: $breakpoint-small) {
        font-size: 62px;
      }
      @media (min-width: $breakpoint-large) {
        margin-top: 0px;
      }
    }
    h1:after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 1px;
      background: $navy;
      @media (min-width: $breakpoint-small) {
        width: 120%;
        left: -10%;
      }
    }
    p {
      font-size: 14px;
      line-height: 1.2em;
    }
  }
}
#reporting__reporting-cards {
  .reporting__filters {
    input {
      max-width: 400px;
    }
  }
}
.list {
  transition: all 0.3s var(--curve);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.25s var(--curve);
}
.list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
</style>
