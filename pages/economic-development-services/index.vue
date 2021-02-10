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
        <h3 class="w-full uppercase text-xs green text-left">
          Work Portfolio
        </h3>
        <!-- <program-card
          v-for="(program, index) in service.example_programs"
          :key="index"
          :program="program.program_id"
        >
        </program-card> -->
        <div>
          <ul class="list-disc list-inside">
            <li
              v-for="(program, index) in service.example_programs"
              :key="index"
            >
              {{ program.program_id.title }}
              <nuxt-link
                :to="'/economic-development-programs/' + program.program_id.url"
                ><arrow-right-icon
                  size="1x"
                  stroke-width="1"
                  class="inline-block"
                ></arrow-right-icon
              ></nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import programCard from '~/components/programs/programCard'
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  async asyncData({ params, $axios }) {
    const servicesReq = await $axios.get(
      process.env.apiUrl + '/items/services?fields=*.*.*.*.*'
    )
    return {
      services: servicesReq.data.data
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
