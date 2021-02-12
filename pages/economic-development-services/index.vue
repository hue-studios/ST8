<template>
  <div id="services" class="flex items-center justify-center flex-col">
    <div
      id="services-intro"
      class="pt-24 pb-12 md:py-24 flex flex-col justify-center items-center"
    >
      <h1 class="uppercase navy pb-3 md:pb-0 md:mb-6 relative tracking-widest">
        Services
      </h1>
      <div
        class="w-full flex items-center flex-col md:flex-row flex-wrap justify-center"
      >
        <h2
          v-for="(service, index) in services"
          :key="index"
          :data-section="'#service-' + index"
          class="uppercase relative my-3 md:my-0 md:py-10 services-intro__link"
          @click.prevent="smoothScroll($event)"
        >
          <span v-if="index === 1 || index === 3" class="dot"></span>
          {{ service.title }}
          <span v-if="index === 0 || index === 2" class="dot"></span>
          <arrow-right-icon
            :data-section="'#service-' + index"
            size="1x"
            stroke-width="1"
          ></arrow-right-icon>
        </h2>
      </div>
    </div>

    <div
      v-for="(service, index) in services"
      :id="'service-' + index"
      :key="service.id"
      :class="{ dark: index % 2 == 0 }"
      class=" w-full flex items-start justify-start flex-col relative py-12 md:py-0 services-section"
    >
      <h2 class="uppercase green md:sticky">
        {{ service.title }}
      </h2>

      <div
        v-if="service.purpose"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left">
          Purpose
        </h3>
        <div v-html="service.purpose"></div>
      </div>
      <div
        v-if="service.how_we_help"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left">
          How we help
        </h3>
        <div v-html="service.how_we_help"></div>
      </div>
      <div
        v-if="service.who_it_is_for"
        class="w-full md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left">
          Who is this for?
        </h3>
        <div v-html="service.who_it_is_for"></div>
      </div>
      <div
        v-if="service.example_programs.length > 0"
        class="md:w-1/2 services-section__content"
      >
        <h3 class="w-full uppercase text-xs green text-left ">
          Work Portfolio
        </h3>
        <div class="w-full flex flex-col items-center justify-start mt-4">
          <nuxt-link
            v-for="(program, index) in service.example_programs"
            :key="index"
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
                  class="uppercase navy"
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
                  class="uppercase navy"
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
                  class="uppercase navy "
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
              <arrow-right-icon size="1x" stroke-width="1.5"></arrow-right-icon>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  async asyncData({ params, $axios }) {
    const servicesReq = await $axios.get(
      process.env.apiUrl +
        '/items/services?fields=*.*.*.*.*&filter[status]=published'
    )
    return {
      services: servicesReq.data.data
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {},
  methods: {
    smoothScroll(event) {
      console.log(event.target.getAttribute('data-section'))
      const href = event.target.getAttribute('data-section')
      const offsetTop = document.querySelector(href).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/services';
</style>
