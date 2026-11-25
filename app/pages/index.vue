<script setup lang="ts">
import { readItems, readSingleton } from '@directus/sdk'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { NewsCardItem, PartnerItem, ProgramListItem, ResourceCardItem } from '#shared/types/st8'
import { PROGRAM_CARD_FIELDS } from '#shared/utils/programs'

type Panel = 'home' | 'active' | 'regional' | 'now'

const directus = useDirectus()
const { organization } = useOrganization()

// The housing_page fields the home-page banner shows (Directus: Site Pages → Housing → 4. Home Page Banner), or null
// when it is switched off. With no banner image it uses the page image, and with neither it is a plain navy band. It
// deliberately skips the program's own image: that is a graphic with lettering of its own, which fights the text.
function bannerFrom(page: Record<string, unknown> | null) {
  if (!page || page.banner_show === false) return null
  const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
  return {
    image: ((page.banner_image || page.page_image) as string | undefined) || null,
    title: clean(page.banner_title) || clean(page.title) || 'Housing',
    text: clean(page.banner_text),
  }
}

// Directus returns a count as { id: "12" } with a field aggregate and as "12" with others; accept both.
async function countNews() {
  const rows = await directus.request(readItems('news', {
    aggregate: { count: 'id' },
    filter: { status: { _eq: 'published' } },
  } as never)) as unknown as Array<{ count: string | number | Record<string, string | number> }>
  const value = rows[0]?.count
  return Number(typeof value === 'object' && value ? Object.values(value)[0] : value)
}

const { data, error } = await useAsyncData('home', async () => {
  const [partners, news, allPrograms, home, newsCount, housingBanner] = await Promise.all([
    directus.request(readItems('partners', { fields: ['title', 'category'] as never, limit: -1 })),
    directus.request(readItems('news', {
      fields: [
        'title', 'url', 'cover_image.id', 'featured', 'date_published', 'date_created', 'date_updated',
        'type', 'link', 'tags',
      ] as never,
      filter: { _and: [{ featured: { _eq: true } }, { status: { _eq: 'published' } }] },
      sort: ['-date_published'],
      limit: -1,
    })),
    // One read of every published program: the featured ones fill the swiper and the length is the "View All N" count,
    // which replaces a second request for the count (there are only a dozen programs).
    directus.request(readItems('programs', {
      fields: [...PROGRAM_CARD_FIELDS, 'featured'] as never,
      filter: { status: { _eq: 'published' } },
      limit: -1,
    })),
    directus.request(readSingleton('home', {
      fields: ['introduction', ...resourceCardFields('featured_resource')] as never,
    })),
    countNews(),
    // The banner is an extra, so a CMS hiccup just leaves it off.
    directus.request(readSingleton('housing_page', {
      fields: ['banner_show', 'banner_image', 'banner_title', 'banner_text', 'title', 'page_image'] as never,
    })).then(row => bannerFrom(row as unknown as Record<string, unknown>)).catch(() => null),
  ])
  const featuredPrograms = (allPrograms as unknown as Array<ProgramListItem & { featured?: boolean | null }>)
    .filter(p => p.featured)
    .map(({ featured: _featured, ...program }) => program)
  return {
    housingBanner,
    partners: partners as unknown as PartnerItem[],
    news: news as unknown as NewsCardItem[],
    newsCount,
    programs: featuredPrograms as ProgramListItem[],
    programsCount: (allPrograms as unknown[]).length,
    home: home as unknown as { introduction?: string | null, featured_resource?: ResourceCardItem | null },
  }
})
if (error.value || !data.value) {
  throw createError({ statusCode: 503, statusMessage: 'The home page could not be loaded', fatal: true })
}
const partners = computed(() => data.value!.partners)
const news = computed(() => data.value!.news)
const programs = computed(() => data.value!.programs)
const homeData = computed(() => data.value!.home)
const withCategory = (term: string) => partners.value.filter(p => p.category?.includes(term))
const regionalPartners = computed(() => withCategory('Regional'))
const plannerPartners = computed(() => withCategory('Planner'))
const developerPartners = computed(() => withCategory('Economic Developer'))
const workforcePartners = computed(() => withCategory('Workforce'))
const partnerRows = computed(() => [
  { id: 'regional-total', label: 'Federal & State Partners', total: regionalPartners.value.length },
  { id: 'planner-total', label: 'County Planners', total: plannerPartners.value.length },
  { id: 'developer-total', label: 'Economic Development Agencies', total: developerPartners.value.length },
  { id: 'workforce-total', label: 'Workforce Partners', total: workforcePartners.value.length },
])
const today = formatDate(nowInNewYork(), 'MMMM do, yyyy')

useShareMeta({
  title: 'Southern Tier 8 Economic Development Organization for the Southern Tier Region of New York',
  description:
    'Southern Tier 8 is a vibrant, multi-facet planning and development agency proudly serving eight counties in the Southern Tier region of Upstate New York. Our focus is to sustain and grow our region’s economy through collaborating with partners throughout our region.',
  path: '',
})

// The intro's Active / Regional / Now panels. Moving to a higher-numbered panel slides the new one in from the right.
const LINK_CLASS =
  'green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font'
const ACTIVE_LINKS = [
  { to: '/economic-development-initiatives', label: 'Initiatives' },
  { to: '/economic-development-programs', label: 'Programs' },
  { to: '/economic-development-services', label: 'Services' },
]
const REGIONAL_LINKS = [
  { to: '/regional-partnerships', label: 'Partnerships' },
  { to: '/regional-profile', label: 'Profile' },
  { to: '/regional-organization', label: 'Organization' },
]
const NOW_LINKS = [
  { to: '/regional-news', label: 'News' },
  { to: '/regional-events', label: 'Events' },
  { to: '/regional-news/resources', label: 'Resources' },
]
const SLIDE_FORWARD = ['uk-animation-slide-right-medium uk-animation-fast', 'uk-animation-slide-left-medium uk-animation-reverse uk-animation-fast'] as const
const SLIDE_BACK = ['uk-animation-slide-left-medium uk-animation-fast', 'uk-animation-slide-right-medium uk-animation-reverse uk-animation-fast'] as const

const panel = ref<Panel>('home')
const hideMessage = ref(false)
const previousPanelKey = ref(1)
const [initialIn, initialOut] = SLIDE_FORWARD
const animateIn = ref<string>(initialIn)
const animateOut = ref<string>(initialOut)

function slide(forward: boolean) {
  const [enter, leave] = forward ? SLIDE_FORWARD : SLIDE_BACK
  animateIn.value = enter
  animateOut.value = leave
}
function changePanel(next: Panel, key: number) {
  hideMessage.value = true
  slide(previousPanelKey.value < key)
  previousPanelKey.value = key
  panel.value = next
}
function changePanelTwo() {
  hideMessage.value = true
  if (panel.value === 'home') {
    slide(false)
    panel.value = 'active'
    previousPanelKey.value = 1
  }
  else {
    slide(true)
    panel.value = 'home'
    previousPanelKey.value = 0
    hideMessage.value = false
  }
}

// The partner totals count up from 0 the first time each row is fully on screen.
const counters = new Map<string, ReturnType<typeof setInterval>>()
function animateValue(id: string, end: number, duration: number) {
  const el = document.getElementById(id)
  if (!el || end <= 0) return
  clearInterval(counters.get(id))
  let current = 0
  const stepTime = Math.abs(Math.floor(duration / end))
  counters.set(id, setInterval(() => {
    current += 1
    el.textContent = String(current)
    if (current >= end) clearInterval(counters.get(id))
  }, stepTime))
}

let observer: IntersectionObserver | undefined
let media: gsap.MatchMedia | undefined
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const row = partnerRows.value.find(r => r.id === (entry.target as HTMLElement).dataset.counter)
      if (row) animateValue(row.id, row.total, row.total * 75)
    }
  }, { rootMargin: '0px', threshold: 1.0 })
  document.querySelectorAll('[data-counter]').forEach(el => observer!.observe(el))

  // The mission statement and its cropped overlay drift apart as the section scrolls into view.
  gsap.registerPlugin(ScrollTrigger)
  media = gsap.matchMedia()
  const drift = (overlayX: string, missionX: string) => {
    const scrollTrigger = { trigger: '#home__mission', start: 'top bottom-=100px', end: '+=200%', scrub: 0.6 }
    gsap.to('#cropped-overlay', { scrollTrigger, x: overlayX })
    gsap.to('#mission', { scrollTrigger, x: missionX })
  }
  media.add('(max-width: 1279px)', () => drift('100px', '-100px'))
  media.add('(min-width: 1280px)', () => drift('-100px', '100px'))
})
// Leaving the page reverts every tween and kills its ScrollTrigger, so nothing survives navigation.
onBeforeUnmount(() => {
  media?.revert()
  observer?.disconnect()
  counters.forEach(timer => clearInterval(timer))
  counters.clear()
})
</script>

<template>
  <div id="home" class="index">
    <div id="home__intro" class="flex flex-col justify-center items-center relative" :class="{ show: panel !== 'home' }">
      <a id="home-intro__logo" @click.prevent="changePanelTwo()">
        <LayoutLogoName />
        <h5 class="uppercase absolute">Regional Board</h5>
        <UniversalPulseIcon icon-i-d="" class-name="block button" />
      </a>

      <div id="home-intro__navigation" class="w-full flex justify-around items-center absolute home-intro__navigation">
        <a
          :class="[panel === 'active' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('active', 1)"
        >Active</a>
        <a
          :class="[panel === 'regional' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('regional', 2)"
        >Regional</a>
        <a
          :class="[panel === 'now' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('now', 3)"
        >Now</a>
      </div>
      <!-- Plain text from the CMS, run together as one paragraph. Unlike the other plain-text fields this one ignores
           line breaks: it is pinned to the bottom of the intro panel and grows upward, and the current text already
           reaches the Active / Regional / Now row on a phone, so every extra line would push it over them. -->
      <h4
        v-if="homeData.introduction"
        :class="{ hide: hideMessage }"
        class="bold navy tracking-wider absolute home-intro__intro"
        v-text="homeData.introduction.trim()"
      />
      <h4 v-else :class="{ hide: hideMessage }" class="bold navy uppercase tracking-widest absolute home-intro__intro">
        Welcome to our digital experience.
      </h4>

      <Transition :enter-active-class="animateIn" :leave-active-class="animateOut" mode="out-in">

        <div v-if="panel === 'home'" key="0" />
        <div v-else-if="panel === 'active'" id="active-caption" key="1" class="home-intro__navigation-description show">
          <h5 class="text-center uppercase grey tracking-widest mb-4">Active</h5>
          <p>
            Our <strong>Initiatives</strong>, <strong>Programs</strong>, and <strong>Services</strong> are designed to
            serve and adapt to the region’s economic, workforce, infrastructure, rural, and quality of life needs. We
            are <strong>ACTIVE</strong> because we are always evolving and partnering with organizations throughout the
            region to create innovative, practical, and timely solutions with vision, dedication, and commitment to our
            region’s growth and success.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <NuxtLink v-for="link in ACTIVE_LINKS" :key="link.to" :to="link.to" :class="LINK_CLASS">
              {{ link.label }}
              <UniversalPulseIcon icon-i-d="" class-name="inline-block button" />
            </NuxtLink>
          </div>
        </div>
        <div v-else-if="panel === 'regional'" id="regional-caption" key="2" class="home-intro__navigation-description show">
          <h5 class="uppercase grey tracking-widest mb-4 text-center">Regional</h5>
          <p>
            We are an 8 County Organization so we are not one place, one county, we cover a large portion of Upstate NY.
            Every county that is part of our organization is unique with its own natural, economic, and business assets.
            We are committed to evaluating and innovating for each, while still looking at the strength of our region as
            a whole. We believe that as one <strong>united region</strong>, we are stronger, we build a more
            <strong>powerful economy</strong>, and create the best opportunities for <strong>growth</strong>.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <NuxtLink v-for="link in REGIONAL_LINKS" :key="link.to" :to="link.to" :class="LINK_CLASS">
              {{ link.label }}
              <UniversalPulseIcon icon-i-d="" class-name="inline-block button" />
            </NuxtLink>
          </div>
        </div>
        <div v-else-if="panel === 'now'" id="now-caption" key="3" class="home-intro__navigation-description show">
          <h5 class="uppercase grey tracking-widest mb-4 text-center">Now</h5>
          <p>
            Our <strong>News</strong>, <strong>Resources</strong>, and <strong>Events</strong> are published to share
            progress of our organization’s initiatives, programs, and services. We also focus on gathering and
            announcing funding opportunities to help county legislatures and organizations benefit from every
            opportunity that is available to them in order to continually strengthen the economic growth of our region.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <NuxtLink v-for="link in NOW_LINKS" :key="link.to" :to="link.to" :class="LINK_CLASS">
              {{ link.label }}
              <UniversalPulseIcon icon-i-d="" class-name="block button" />
            </NuxtLink>
          </div>
        </div>
      </Transition>
      <div class="absolute home-intro__scroll-icon" data-section="#home__mission" @click.prevent="scrollToSection('#home__mission')">
        <Icon name="lucide:chevron-down" size="1.5em" />
      </div>
    </div>
    <HomeHousingBanner :banner="data!.housingBanner" />

    <div id="home__mission" class="w-full flex items-start justify-end flex-col relative">
      <div
        id="mission"
        class="flex flex-col lg:flex-row justify-center items-start mb-20 md:mb-24 lg:mb-32 xl:mb-40 statement"
      >
        <h2 class="uppercase white tracking-wider thin-font mb-2 lg:mb-0">Mission Statement</h2>
        <!-- Plain text from the CMS: keep staff's line breaks, trimmed so a trailing one leaves no gap. -->
        <p class="white whitespace-pre-line xl:ml-2" v-text="(organization.mission_statement || '').trim()" />
      </div>
      <NuxtLink to="/regional-organization" class="uppercase green pt-2 link-font">
        Learn More<span class="hidden md:inline-block ml-2"> About Southern Tier 8</span>
        <UniversalLinkIcon class="ml-1" />
      </NuxtLink>
      <div id="cropped-overlay" class="absolute" />
    </div>
    <div
      v-if="homeData.featured_resource"
      id="home__resource"
      class="w-full flex justify-center items-center flex-row flex-wrap relative shadow-lg home__section"
    >
      <h2 class="uppercase green relative thin-font grey w-full mb-2 pl-2 home__title">
        <span class="green small-title block tracking-widest bold">Featured </span>Resource
      </h2>
      <NowResourceCardData :item="homeData.featured_resource" class="inline-block" />
    </div>
    <div
      v-if="news.length"
      id="home__news"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative shadow-lg home__section"
    >
      <h2 class="uppercase green relative thin-font grey w-full mb-2 pl-2 home__title">
        <span class="green small-title block tracking-widest bold">Featured </span>News
      </h2>
      <div class="w-full pl-3 pr-3 mb-2 lg:pl-5 lg:pr-5 home__subtitle">
        <p>Read the latest news from the Southern Tier region focused on economic development, workforce initiatives, and all things regional.</p>
      </div>
      <CardSwiper :items="news" preset="resources">
        <template #default="{ item }">
          <NowNewsCardVertical :item="item" />
        </template>
      </CardSwiper>
      <NuxtLink to="/regional-news" class="green w-full text-center pt-8 tracking-widest uppercase link-font">
        View All {{ data!.newsCount }} Articles <UniversalLinkIcon class="ml-2" />
      </NuxtLink>
    </div>
    <div id="home__funding" class="w-full flex relative justify-center items-center flex-col flex-wrap relative home__section">
      <h2 class="uppercase thin-font w-full relative mb-2 pl-2 green home__title">Looking for funding?</h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 white home__subtitle">
        <p>
          Our team will assist applicants with questions about program development, partner engagement, grant writing,
          match support requirements and budgets.
        </p>
      </div>
      <NuxtLink to="/how-to-apply" class="mt-4 sm:mt-8 uppercase py-4 px-12">
        ARC Opportunities<UniversalLinkIcon class="ml-2" />
      </NuxtLink>
    </div>

    <div
      id="home__partners"
      class="w-full flex justify-center items-center md:items-end flex-col flex-wrap relative shadow-lg home__section"
    >
      <h2 class="uppercase thin-font grey w-full relative mb-2 pl-2 home__title">
        Partnerships
        <span class="absolute right-0 tracking-widest navy pr-1 date">{{ today }}</span>
      </h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 home__subtitle">
        <p>We partner with numerous organizations to collaborate on programs that support our mission.</p>
      </div>
      <template v-for="row in partnerRows" :key="row.id">
        <h3
          v-if="row.total"
          :data-counter="row.id"
          class="uppercase w-5/6 md:w-1/2 flex items-center justify-start flex-row py-4"
        >
          <span :id="row.id" class="green thin-font number">{{ row.total }}</span>
          {{ row.label }}
        </h3>
      </template>

      <NuxtLink to="/regional-partnerships" class="green w-full text-center pt-8 link-font">
        LEARN MORE<span class="hidden sm:inline-block ml-2"> ABOUT PARTNERSHIPS</span><span class="hidden md:inline-block ml-2"> AND HOW YOU CAN BE INVOLVED</span>
        <UniversalLinkIcon class="ml-2" />
      </NuxtLink>
    </div>

    <div id="home__programs" class="w-full flex relative justify-center items-center flex-row flex-wrap relative home__section">
      <h2 class="uppercase green relative thin-font grey mb-2 pl-2 w-full home__title">
        <span class="green small-title block tracking-widest bold">Featured </span>Programs
      </h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 home__subtitle">
        <p>
          Our programs are designed to help grow our region. Select a program below to learn the what it is, who we
          partnered with, and what it accomplishes.
        </p>
      </div>
      <CardSwiper :items="programs" preset="initiative" slide-class="flex flex-col items-center justify-center px-3 sm:px-8">
        <template #default="{ item }">
          <ProgramsProgramCard :program="item" />
        </template>
      </CardSwiper>
      <NuxtLink to="/economic-development-programs" class="green w-full text-center pt-8 tracking-widest uppercase link-font">
        View All {{ data!.programsCount }} Programs <UniversalLinkIcon class="ml-2" />
      </NuxtLink>
    </div>
    <div id="home__data" class="w-full flex relative justify-center items-center flex-col relative shadow-lg home__section">
      <h2 class="uppercase green relative thin-font grey mb-2 pl-2 pr-2 w-full text-center home__title">
        <span class="green small-title block tracking-widest bold">Featured Regional </span>Data
      </h2>
      <div class="pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 text-center home__subtitle">
        <p>The Southern Tier region features 10 major industry sectors.</p>
      </div>
      <IndustryChart />
      <NuxtLink to="/regional-profile" class="green w-full text-center pt-16 tracking-widest uppercase link-font">
        View Regional Profile <UniversalLinkIcon class="ml-2" />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/home';
</style>
