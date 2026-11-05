<template>
  <div id="program" class="relative housing">
    <div
      id="program__intro"
      class="flex flex-col justify-center items-center relative housing__hero"
    >
      <div
        id="program__intro-caption"
        class="flex items-center justify-center flex-col relative lg:py-8 max-w-4xl"
      >
        <div
          class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6"
        >
          <div
            class="w-1/2 flex items-center justify-center shadow-lg progam__image"
          >
            <img
              v-if="heroImage"
              :src="imageLocation + heroImage + '?width=1000&quality=80'"
              :alt="title"
            />
          </div>
          <div class="w-1/2 pl-4">
            <h1
              class="uppercase green text-left program__page-title"
              :class="{ 'text-xs': tooLong }"
            >
              <span class="navy">Program: </span>
              {{ title }}
            </h1>
            <p v-if="subtitle" class="navy housing__subtitle">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div
          v-if="program.counties.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.counties.length }} Count<span
                v-if="program.counties.length > 1"
                >ies</span
              ><span v-else>y</span> Served:
            </h4>
            <h5
              v-for="(county, index) in program.counties"
              :key="index"
              class="uppercase mr-1 mb-1"
            >
              {{ county.counties_id.title }}
              <span v-if="index + 1 < program.counties.length" class="green">
                /</span
              >
            </h5>
          </div>
        </div>
        <div
          v-if="program.initiatives.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.initiatives.length }} Initiative<span
                v-if="program.initiatives.length > 1"
                >s</span
              >
              Served:
            </h4>
            <h5
              v-for="(initiative, index) in program.initiatives"
              :key="index"
              class="uppercase mr-1 mb-1"
            >
              {{ initiative.initiatives_id.title }}
              <span v-if="index + 1 < program.initiatives.length" class="green">
                /</span
              >
            </h5>
          </div>
        </div>
      </div>
    </div>

    <div
      id="program__story"
      class="flex flex-col justify-start items-center relative program__story"
    >
      <pulse-icon icon-i-d="start-btn" class-name="button"></pulse-icon>
      <svg
        id="straightLineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 695.51"
      >
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
      <svg
        id="lineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 963 1479.58"
      >
        <path
          id="program-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M961.5,0V155.37H1.5V456.1h960V753.44H481.12v300.23H1.5v298.51H481.12v127.4"
        />
      </svg>

      <h3 id="purpose-title" class="uppercase green relative program__title">
        About the Program
      </h3>

      <div
        id="purpose-description"
        class="relative p-6 program__description"
        :class="{ tooLong: tooLongContent }"
        v-html="whatItIs"
      ></div>

      <h3
        id="accomplishes-title"
        class="uppercase green relative program__title"
      >
        What the Framework Delivers
      </h3>

      <div
        id="accomplishes-description"
        class="relative p-6 program__description"
      >
        <div
          :class="{ tooLong: tooLongContent }"
          v-html="whatItAccomplishes"
        ></div>
        <div
          v-if="program.accomplishes_links && program.accomplishes_links.length"
          class="mt-2"
        >
          <nuxt-link
            v-if="!program.accomplishes_links[0].external"
            :to="program.accomplishes_links[0].link"
            class="w-full absolute uppercase tracking-wider green bold text-center lg:text-left lg:px-0"
            >{{ program.accomplishes_links[0].title }}
            <link-icon class="ml-2"></link-icon
          ></nuxt-link>
          <a
            v-else
            :href="program.accomplishes_links[0].link"
            target="_blank"
            rel="noopener"
            class="w-full absolute uppercase tracking-wider green bold text-center lg:text-left lg:px-0"
            >{{ program.accomplishes_links[0].title }}
            <link-icon class="ml-2"></link-icon
          ></a>
        </div>
      </div>
      <pulse-icon icon-i-d="finish-btn" class-name="button"></pulse-icon>
    </div>
    <section
      v-if="intro || frameworkLinks.length"
      id="housing__framework"
      class="w-full flex flex-col items-center housing__framework"
    >
      <h2 class="uppercase green relative program__title">
        Explore the Framework Tools
      </h2>
      <div
        v-if="intro"
        class="navy housing__intro housing__rich-text"
        v-html="intro"
      ></div>
      <ul v-if="frameworkLinks.length" class="housing__links">
        <li
          v-for="(link, index) in frameworkLinks"
          :key="index"
          class="housing__link-card"
        >
          <component
            :is="icons[link.type] || 'external-link-icon'"
            class="green housing__link-icon"
            aria-hidden="true"
          />
          <h2 class="uppercase navy bold housing__link-title">
            {{ link.title }}
          </h2>
          <p v-if="link.description" class="navy housing__link-description">
            {{ link.description }}
          </p>
          <a
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="uppercase bold tracking-widest housing__link-button"
          >
            {{ link.buttonText }}
            <span class="sr-only">(opens in a new tab)</span>
            <external-link-icon
              size="1x"
              class="ml-2 housing__link-arrow"
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>
    </section>

    <section
      v-if="finalDocumentsIntro || finalDocuments.length"
      id="housing__final-documents"
      class="w-full flex flex-col items-center housing__section"
    >
      <h2 class="uppercase green relative program__title">Final Documents</h2>
      <div
        v-if="finalDocumentsIntro"
        class="navy housing__intro housing__rich-text"
        v-html="finalDocumentsIntro"
      ></div>
      <housing-link-list :links="finalDocuments" />
    </section>

    <section
      v-if="opportunitiesIntro || opportunities.length"
      id="housing__opportunities"
      class="w-full flex flex-col items-center housing__section"
    >
      <h2 class="uppercase green relative program__title">
        Opportunities to be Involved
      </h2>
      <div
        v-if="opportunitiesIntro"
        class="navy housing__intro housing__rich-text"
        v-html="opportunitiesIntro"
      ></div>
      <housing-link-list :links="opportunities" />
    </section>

    <div
      class="flex flex-col justify-center items-center relative program__related"
    >
      <template v-if="program.partners.length">
        <h3 class="uppercase green relative program__title">Partners</h3>
        <p class="px-4 text-center program__p">
          We have
          <span class="bold"
            >{{ program.partners.length }} partner<span
              v-if="program.partners.length > 1"
              >s</span
            ></span
          >
          for the {{ title }} program.
        </p>
        <div
          id="program__partners"
          class="w-full flex flex-row justify-center items-center flex-wrap mt-6 px-10 max-w-5xl"
        >
          <div
            v-for="(partner, index) in program.partners"
            :key="index"
            class="rounded-full flex items-center justify-center partners-badge"
          >
            <img
              v-if="partner.partners_id && partner.partners_id.logo"
              :src="
                imageLocation + partner.partners_id.logo.id + '?key=thumbnail'
              "
              :alt="partner.partners_id.title"
              :width="partner.partners_id.logo.width"
              :height="partner.partners_id.logo.height"
            />
          </div>
        </div>
      </template>
      <div
        v-if="resources.length"
        id="program__resources"
        class="w-full flex justify-center items-center flex-row flex-wrap relative"
      >
        <h2 class="uppercase green relative program__title">
          Related Resources
        </h2>
        <swiper
          :options="resourcesSwiperOption"
          class="swiper w-full flex flex-row items-center justify-center pt-4 pb-4"
        >
          <swiper-slide
            v-for="(item, index) in resources"
            :key="index"
            class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
          >
            <resource-card :item="item.resources_id"></resource-card>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination"></div>
          <div slot="button-next" class="swiper-button-next"></div>
          <div slot="button-prev" class="swiper-button-prev"></div>
        </swiper>
      </div>
      <div
        v-if="news.length"
        id="program__news"
        class="w-full flex justify-center items-center flex-row flex-wrap relative program__section"
      >
        <h2 class="uppercase green relative program__title">Related News</h2>
        <swiper
          :options="resourcesSwiperOption"
          class="swiper w-full flex flex-row pt-4 pb-4"
        >
          <swiper-slide
            v-for="(item, index) in news"
            :key="index"
            class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
          >
            <news-card-vertical :item="item.news_id"></news-card-vertical>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination"></div>
          <div slot="button-next" class="swiper-button-next"></div>
          <div slot="button-prev" class="swiper-button-prev"></div>
        </swiper>
      </div>
      <div
        id="program__programs"
        class="w-full flex justify-center items-center flex-row flex-wrap relative program__section"
      >
        <h2 class="uppercase green relative program__title">
          Explore Our Programs
        </h2>

        <swiper
          :options="programsSwiperOption"
          class="swiper w-full flex flex-row pt-4 pb-4"
        >
          <swiper-slide
            v-for="item in programs"
            :key="item.id"
            class="flex flex-col items-center justify-center px-3 sm:px-8"
          >
            <program-card :program="item"></program-card>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination"></div>
          <div slot="button-next" class="swiper-button-next"></div>
          <div slot="button-prev" class="swiper-button-prev"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
// The Housing program page: the hub for the Southern Tier Workforce Housing Investment Framework.
//
// Its own copy, framework links and share card come from the `housing_page` singleton in Directus
// (set up by scripts/directus/housing-setup.mjs). Counties, "what it is", partners, resources and
// news come from the program record that singleton points at, exactly as on any program page.
//
// This file takes priority over _slug.vue for /economic-development-programs/housing and borrows
// its behaviour (the swipers, the scroll-drawn line, the "other programs" list) by extending it,
// so only the template and the data loading live here. /programs/housing and the program's old
// slug redirect here from nuxt.config.js.
import {
  BarChart2Icon,
  MapIcon,
  BookOpenIcon,
  FileTextIcon,
  CompassIcon,
  UsersIcon,
  ExternalLinkIcon,
} from 'vue-feather-icons'
import programPage from './_slug.vue'
import housingLinkList from '~/components/housing/linkList'
import { PROGRAM_FIELDS } from '~/config/programs'
import {
  shareMeta,
  cardText,
  shareCard,
  DEFAULT_CARD,
  SITE_URL,
} from '~/config/share'
import { openExternalLinksInNewTab } from '~/utils/links'

const PAGE_PATH = '/economic-development-programs/housing'

// The program's url in Directus; used if the singleton is unreadable or not linked to a program.
const PROGRAM_SLUG = 'housing'

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
  'program',
].join(',')

// Card icon for each link type; anything else gets the generic external-link icon. Names, not
// components, because asyncData's result is serialised into the page for the browser.
const ICONS = {
  overview: 'compass-icon',
  dashboard: 'bar-chart2-icon',
  map: 'map-icon',
  library: 'book-open-icon',
  report: 'file-text-icon',
  involved: 'users-icon',
}

const clean = (value) => (typeof value === 'string' ? value.trim() : '')

// A row staff left half-filled is skipped rather than shown as a broken card.
function frameworkLinks(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && clean(row.title) && /^https?:\/\//i.test(row.url))
    .map((row) => ({
      title: clean(row.title),
      description: clean(row.description),
      url: clean(row.url),
      buttonText: clean(row.button_text) || 'Open',
      type: clean(row.type),
    }))
}

// The Final Documents and Opportunities lists: title, URL and an optional line of description.
function plainLinks(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && clean(row.title) && /^https?:\/\//i.test(row.url))
    .map((row) => ({
      title: clean(row.title),
      url: clean(row.url),
      description: clean(row.description),
    }))
}

export default {
  components: {
    BarChart2Icon,
    MapIcon,
    BookOpenIcon,
    FileTextIcon,
    CompassIcon,
    UsersIcon,
    ExternalLinkIcon,
    housingLinkList,
  },
  extends: programPage,
  async asyncData({ $axios, error }) {
    // The page still works from the program record alone if the singleton can't be read.
    const page = await $axios
      .$get('/items/housing_page?fields=' + PAGE_FIELDS)
      .then((res) => res.data || {})
      .catch(() => ({}))

    const programFilter = page.program
      ? 'filter[id][_eq]=' + page.program
      : 'filter[url][_eq]=' + PROGRAM_SLUG
    const programReq = await $axios.$get(
      '/items/programs?' +
        programFilter +
        '&fields=' +
        PROGRAM_FIELDS +
        '&limit=1'
    )
    const program = programReq.data[0]
    if (!program) {
      return error({ statusCode: 404, message: 'Program not found' })
    }

    const programImage = program.images.length
      ? program.images[0].directus_files_id.id
      : ''

    return {
      program,
      news: program.news.filter((n) => n.news_id),
      resources: program.resources.filter((r) => r.resources_id),
      title: clean(page.title) || 'Housing',
      subtitle: clean(page.subtitle),
      intro: openExternalLinksInNewTab(page.intro),
      frameworkLinks: frameworkLinks(page.framework_links),
      finalDocumentsIntro: openExternalLinksInNewTab(
        page.final_documents_intro
      ),
      finalDocuments: plainLinks(page.final_documents),
      opportunitiesIntro: openExternalLinksInNewTab(page.opportunities_intro),
      opportunities: plainLinks(page.opportunities),
      heroImage: page.page_image || programImage,
      shareDescription:
        clean(page.share_description) ||
        cardText(page.intro, 160) ||
        cardText(program.what_is_it, 160),
      whatItIs: openExternalLinksInNewTab(program.what_is_it),
      whatItAccomplishes: openExternalLinksInNewTab(
        program.what_it_accomplishes
      ),
    }
  },
  data() {
    return { icons: ICONS }
  },
  head() {
    const title = this.subtitle
      ? this.title + ' - ' + this.subtitle
      : this.title + ' - Regional Program for the Southern Tier of New York'
    return {
      title,
      meta: shareMeta({
        title,
        description: this.shareDescription,
        path: PAGE_PATH,
        image: this.shareImage,
        imageAlt: title,
      }),
      link: [
        { hid: 'canonical', rel: 'canonical', href: SITE_URL + PAGE_PATH },
      ],
    }
  },
  // Runs after _slug.vue's created(), which works these out from the program record; the page's
  // own title and image take over here.
  created() {
    this.countTitle(this.title)
    this.shareImage = this.heroImage ? shareCard(this.heroImage) : DEFAULT_CARD
  },
}
</script>

<style lang="scss">
@use '~/assets/scss/layout/swiper';
@use '~/assets/scss/pages/program';
@use '~/assets/scss/pages/housing';
</style>
