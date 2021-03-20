<template>
  <div id="services" class="flex items-center justify-center flex-col">
    <div
      id="services-intro"
      class="pt-24 pb-12 md:py-24 flex flex-col justify-center items-center"
    >
      <h1
        class="uppercase navy pb-3 md:pb-0 md:mb-6 relative thin-font tracking-widest"
      >
        Services
      </h1>
      <div
        class="w-full flex items-center flex-col md:flex-row flex-wrap justify-center"
      >
        <h2
          v-for="(service, index) in services"
          :key="index"
          :data-section="'#service-' + index"
          class="uppercase relative my-3 md:my-0 md:py-10 bold services-intro__link"
          @click.prevent="smoothScroll($event)"
        >
          {{ service.title }}

          <pulse-icon
            icon-i-d="start-btn"
            class-name="inline-block button"
          ></pulse-icon>
        </h2>
      </div>
    </div>

    <div
      v-for="(service, index1) in services"
      :id="'service-' + index1"
      :key="service.id"
      :class="{ dark: index1 % 2 == 0 }"
      class="w-full flex items-start justify-start flex-col relative py-12 md:py-0 services-section"
    >
      <h2 class="uppercase green thin-font md:sticky">
        {{ service.title }}
      </h2>

      <div
        v-if="service.purpose"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left bold">Purpose</h3>
        <div v-html="service.purpose"></div>
      </div>
      <div
        v-if="service.how_we_help"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left bold">
          How we help
        </h3>
        <div v-html="service.how_we_help"></div>
        <nuxt-link
          v-if="service.title.includes('Funding')"
          to="how-to-apply"
          class="green bold tracking-widest uppercase button-link"
          >How to Apply <link-icon class="ml-2"></link-icon
        ></nuxt-link>
      </div>
      <div
        v-if="service.who_it_is_for"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left bold">
          Who is this for?
        </h3>
        <div v-html="service.who_it_is_for"></div>
      </div>
      <div
        v-if="service.example_programs.length > 0"
        class="md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left bold">
          Recent Investment
        </h3>
        <div class="w-full flex flex-col items-center justify-start mt-4">
          <nuxt-link
            v-for="(program, index2) in service.example_programs"
            :key="index2"
            :to="'/economic-development-programs/' + program.program_id.url"
            class="flex flex-row items-center justify-start mb-6 shadow-lg services-section__program"
          >
            <div
              v-if="program.program_id.images.length > 0"
              class="services-section__program-image"
              :style="
                'background-image: url(' +
                imageLocation +
                program.program_id.images[0].file_id.private_hash +
                ')'
              "
            ></div>
            <div class="flex flex-col services-section__program-content">
              <h4 class="uppercase mb-2">{{ program.program_id.title }}</h4>
              <div
                class="w-full flex flex-row items-start justify-start text-xs services-section__program-tags"
              >
                <h5
                  v-if="program.program_id.initiatives.length > 0"
                  class="uppercase navy bold"
                >
                  {{ program.program_id.initiatives.length }}
                  <span class="green"
                    >Initiative<span
                      v-if="program.program_id.initiatives.length > 1"
                      >s</span
                    >
                  </span>
                </h5>
                <span
                  v-if="program.program_id.counties.length > 0"
                  class="ml-1 mr-1"
                  >/</span
                >
                <h5
                  v-if="program.program_id.counties.length > 0"
                  class="uppercase navy bold"
                >
                  {{ program.program_id.counties.length }}
                  <span class="green"
                    >Count<span v-if="program.program_id.counties.length > 1"
                      >ies</span
                    ><span v-else>y</span>
                  </span>
                </h5>
                <span
                  v-if="
                    program.program_id.counties.length > 0 &&
                    program.program_id.partners.length > 0
                  "
                  class="ml-1 mr-1"
                  >/</span
                >
                <h5
                  v-if="program.program_id.partners.length > 0"
                  class="uppercase navy bold"
                >
                  {{ program.program_id.partners.length }}
                  <span class="green"
                    >Partner<span v-if="program.program_id.partners.length > 1"
                      >s</span
                    >
                  </span>
                </h5>
              </div>
            </div>
            <div
              class="flex items-center justify-center services-section__program-link"
            >
              <link-icon></link-icon>
            </div>
          </nuxt-link>

          <nuxt-link
            v-for="article in service.news_programs"
            :key="article.id"
            :to="'/regional-news/' + article.news_id.url"
            class="flex flex-row items-center justify-start mb-6 shadow-lg services-section__program"
          >
            <div
              v-if="article.news_id.cover_image"
              class="services-section__program-image"
              :style="
                'background-image: url(' +
                imageLocation +
                article.news_id.cover_image.private_hash +
                ')'
              "
            ></div>
            <div class="flex flex-col services-section__program-content">
              <h4 class="uppercase mb-2">{{ article.news_id.title }}</h4>
              <div
                class="w-full flex flex-row items-start justify-start text-xs services-section__program-tags"
              >
                <h5
                  v-if="article.news_id.date_published"
                  class="uppercase navy bold"
                >
                  <span class="green">Published </span>
                  {{
                    $moment(article.news_id.date_published).format(
                      'dddd MMMM Do, YYYY'
                    )
                  }}
                </h5>
                <h5 v-else class="uppercase navy bold">
                  <span class="green">Published </span>
                  {{
                    $moment(article.news_id.modified_on).format(
                      'dddd MMMM Do, YYYY'
                    )
                  }}
                </h5>
              </div>
            </div>
            <div
              class="flex items-center justify-center services-section__program-link"
            >
              <link-icon></link-icon>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div
        v-if="service.resources.length > 0"
        class="md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left bold">Resources</h3>
        <div class="w-full flex flex-col items-center justify-start mt-4">
          <div
            v-for="(resource, index3) in service.resources"
            :key="index3"
            class="w-full flex items-center justify-center flex-col mb-10 p-4 md:p-6 shadow-lg services-section__resource-card"
          >
            <h5
              class="uppercase tracking-widest w-full mb-4 pb-4 navy services-section__resource-card-title"
            >
              {{ resource.resources_id.title }}
            </h5>
            <p
              v-if="resource.resources_id.description"
              class="navy services-section__resource-card-description"
            >
              {{ resource.resources_id.description }}
            </p>
            <a
              v-if="
                resource.resources_id.type === 'Internal File / PDF' &&
                resource.resources_id.file
              "
              :href="imageLocation + resource.resources_id.file.private_hash"
              class="w-full uppercase text-xs green bold tracking-widest text-right services-section__resource-card-link"
              target="_blank"
              >View File
              <link-icon class="ml-2"></link-icon>
            </a>
            <a
              v-if="resource.resources_id.type === 'External Link'"
              :href="resource.resources_id.link"
              target="_blank"
              rel="noreferrer"
              class="w-full uppercase text-xs green bold tracking-widest text-right services-section__resource-card-link"
              >Go to Resource
              <link-icon class="ml-2"></link-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pulseIcon from '~/components/universal/pulseIcon'
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    pulseIcon,
    linkIcon,
  },
  async asyncData({ params, $axios }) {
    const servicesReq = await $axios.get(
      process.env.apiUrl +
        '/items/services?fields=id,title,url,purpose,how_we_help,who_it_is_for,activity,example_programs.program_id.*,example_programs.program_id.images.file_id.private_hash,resources.resources_id.*,news_programs.news_id.*,news_programs.news_id.cover_image.private_hash,&filter[status]=published'
    )
    return {
      services: servicesReq.data.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {
    return {
      title:
        'Economic Development Services for the Southern Tier Region of New York',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            'Economic Development Services for the Southern Tier Region of New York',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Southern Tier 8 regional services are funding and project develoment, planning, networking, and reducing municipal cost.',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/economic-development-services/',
        },
      ],
    }
  },
  methods: {
    smoothScroll(event) {
      console.log(event.target.getAttribute('data-section'))
      const href = event.target.getAttribute('data-section')
      const offsetTop = document.querySelector(href).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/services';
</style>
