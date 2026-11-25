<script setup lang="ts">
import { readItems } from '@directus/sdk'
import { parseISO, subYears } from 'date-fns'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { CalendarEvent, EventListItem } from '#shared/types/st8'

const directus = useDirectus()
const asset = useAsset()

// Featured events: everything from a year back, as before.
const oneYearAgo = formatDate(subYears(nowInNewYork(), 1), 'yyyy-MM-dd')
const { data, error } = await useAsyncData('events-index', () =>
  directus.request(readItems('events', {
    fields: ['id', 'title', 'url', 'date', 'time', 'description', 'image.id'] as never,
    filter: { _and: [{ status: { _eq: 'published' } }, { date: { _gte: oneYearAgo } }] } as never,
    sort: ['date'],
    limit: -1,
  })) as unknown as Promise<EventListItem[]>)
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'Events could not be loaded', fatal: true })
}
const featuredEvents = computed(() => data.value!)

// The organizational calendar (Google Calendar, through the server route). It fills in after the page; a failure
// leaves the featured events and an empty calendar.
const calendarLoading = ref(true)
const googleEvents = ref<CalendarEvent[]>([])
onMounted(async () => {
  try {
    googleEvents.value = (await $fetch<{ items: CalendarEvent[] }>('/api/calendar')).items
  }
  catch {
    googleEvents.value = []
  }
  finally {
    calendarLoading.value = false
  }
})

const time = (value: string) => formatDate(value, 'h:mm a').toLowerCase()

interface DayEvent {
  summary: string
  /** "3:00 pm" or "3:00 pm - 4:00 pm"; a featured event shows the time its record carries. */
  when: string
  location: string
}

const attributes = computed(() => {
  const google = googleEvents.value
    .filter(event => event.start?.dateTime)
    .map(event => ({
      key: `google-event.${event.id}`,
      dates: new Date(event.start!.dateTime!),
      highlight: { style: { backgroundColor: '#eeeeee' } },
      dot: { style: { backgroundColor: '#1effbc' } },
      popover: { label: `${event.summary} @ ${time(event.start!.dateTime!)}` },
      customData: {
        summary: event.summary ?? '',
        when: event.end?.dateTime ? `${time(event.start!.dateTime!)} - ${time(event.end.dateTime)}` : time(event.start!.dateTime!),
        location: event.location ?? '',
      } satisfies DayEvent,
    }))
  const featured = featuredEvents.value.map(event => ({
    key: `featured-event.${event.id}`,
    // A date-only value is local midnight here, so it lands on its own day in any time zone.
    dates: parseISO(event.date.slice(0, 10)),
    highlight: { style: { backgroundColor: '#f7f7f7' } },
    dot: { style: { backgroundColor: '#ff5050' } },
    popover: { label: event.title + (event.time ? ` @ ${event.time}` : '') },
    customData: { summary: event.title, when: event.time ?? '', location: event.location ?? '' } satisfies DayEvent,
  }))
  return [...google, ...featured]
})

// Open on the current month (New York time), whichever events the calendar holds.
const thisMonth = nowInNewYork()
const initialPage = { month: thisMonth.getMonth() + 1, year: thisMonth.getFullYear() }

interface CalendarDay {
  date: Date
  attributes: Array<{ key: string, customData: DayEvent }>
}
const selectedDay = ref<CalendarDay | null>(null)
const dayClicked = (day: CalendarDay) => {
  selectedDay.value = day
}

useShareMeta({
  title: 'Regional Events for the Southern Tier Region\'s Economy',
  description: 'Regional events focused on the economic development for the Southern Tier region of New York.',
  path: '/regional-events/',
})
</script>

<template>
  <div id="events" class="flex flex-col items-center justify-center">
    <div id="events__intro" class="flex flex-col flex-wrap justify-center items-center relative w-full">
      <h1 class="navy uppercase tracking-widest mb-2 w-5/6 sm:w-3/5 md:w-1/2 text-center thin-font">Events</h1>
      <p class="navy w-5/6 sm:w-3/5 md:w-1/2 text-center">View our featured events and organizational calendar.</p>
    </div>
    <div class="w-full flex items-center lg:items-start justify-center flex-col lg:flex-row h-full">
      <div id="events__featured-container" class="w-full lg:w-2/5 flex item-center justify-center flex-col">
        <div id="events__featured">
          <h3 id="title" class="uppercase navy w-full text-center mt-3">Featured Events</h3>

          <Swiper
            :modules="[Pagination]"
            :slides-per-view="1"
            centered-slides
            center-insufficient-slides
            :pagination="{ clickable: true }"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <SwiperSlide v-for="item in featuredEvents" :key="item.id">
              <div class="shadow-lg mx-4 events__event">
                <div class="w-full flex items-center justify-center flex-row">
                  <div
                    class="bg-cover bg-no-repeat bg-center events__event-image"
                    :style="item.image ? { backgroundImage: `url(${asset(item.image.id, 'small')})` } : undefined"
                  />
                  <div class="events__event-description">
                    <h3 class="uppercase tracking-wider bold mb-2">{{ truncate(item.title, 100) }}</h3>
                    <h4 class="uppercase tracking-wider bold">
                      <span class="opacity-50">Date: </span>{{ formatDate(item.date, 'MMMM do yyyy') }}
                    </h4>
                    <h4 v-if="item.time" class="uppercase tracking-wider bold mb-2">
                      <span class="opacity-50">Time: </span> {{ item.time }}
                    </h4>
                    <p class="w-full hidden md:inline-block">{{ truncate(item.description, 80) }}</p>
                  </div>
                  <NuxtLink
                    :to="'/regional-events/' + item.url"
                    class="flex items-center justify-center events__event-link"
                    :aria-label="item.title"
                  >
                    <UniversalLinkIcon />
                  </NuxtLink>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <Transition
          enter-active-class="uk-animation-slide-left uk-animation-fast"
          leave-active-class="uk-animation-slide-left-small uk-animation-reverse uk-animation-fast"
          mode="out-in"
        >
          <div v-if="selectedDay" :key="selectedDay.date.toISOString()" class="hidden lg:inline-block p-8 selected-day">
            <h5 class="green mb-3 uppercase tracking-widest">{{ selectedDay.date.toDateString() }}</h5>
            <ul v-if="selectedDay.attributes.length > 0">
              <li v-for="attr in selectedDay.attributes" :key="attr.key" class="flex justify-start items-start selected-day-event">
                <div class="selected-day-event-header">
                  <h5 class="uppercase bold">
                    {{ attr.customData.summary }}<template v-if="attr.customData.when"> @ {{ attr.customData.when }}</template>
                  </h5>
                  <div v-if="attr.customData.location"><p>{{ attr.customData.location }}</p></div>
                </div>
              </li>
            </ul>
            <p v-else class="navy uppercase text-xs">There are no events scheduled for this day.</p>
          </div>
          <div v-else class="hidden lg:inline-block p-8 selected-day">
            <p class="text-center navy uppercase text-xs">
              Select a day on the calendar to view scheduled events for that day.
            </p>
          </div>
        </Transition>
      </div>
      <div id="events__calendar" class="w-full lg:w-3/5 relative">
        <Transition enter-active-class="uk-animation-fade" leave-active-class="uk-animation-fade uk-animation-reverse">
          <div v-if="calendarLoading" id="calendar-loader" class="flex items-center justify-center">
            <img src="/images/loader.gif" alt="Loading calendar">
          </div>
        </Transition>
        <ClientOnly>
          <VCalendar class="flex flex-col items-center justify-center" :attributes="attributes" :initial-page="initialPage" is-expanded @dayclick="dayClicked" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/pages/events';
#events {
  .vc-container {
    max-width: 700px;
    border-radius: 0px;
    border: none !important;
    border-color: $white !important;
    font-family: $body-font;
    background: none;
    width: 100%;
    .vc-pane-container {
      display: flex;
      justify-content: center;
      .vc-pane-layout {
        width: 100%;
        max-width: 1200px;
        @media (min-width: $breakpoint-medium) {
          height: 600px !important;
        }
        .vc-weeks {
          height: 400px !important;
          @media (min-width: $breakpoint-medium) {
            height: 450px !important;
          }
        }
      }
      .vc-header {
        margin-bottom: 30px;
      }
      .vc-grid-container {
        width: 100%;
      }
    }
    .vc-arrows-container {
      max-width: 500px;
    }
    .vc-day {
      height: 60px !important;
    }
    .vc-title {
      text-transform: uppercase;
      letter-spacing: 0.35em;
      font-weight: 400;
    }
    .vc-popover {
      .vc-bar {
        background-color: red;
      }
    }
    .vc-dots {
      @for $i from 1 through 10 {
        .vc-dot:nth-of-type(#{$i}) {
          opacity: 1 - ($i - 1) * 0.05;
        }
      }
    }
  }
  .selected-day {
    max-width: 600px;
    ul {
      list-style: disc;
      .selected-day-event {
        list-style-type: disc;
        h5 {
          position: relative;
          font-size: 13px;
          padding-left: 12px;
          margin-bottom: 5px;
        }
        h5:before {
          content: '';
          width: 5px;
          position: absolute;
          left: 0px;
          top: 5px;
          height: 10px;
          background: $navy;
        }
      }
    }
  }
}
</style>
