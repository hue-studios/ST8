<template>
  <div id="services" class="flex items-center justify-center flex-col">
    <h3 class="green bold text-sm uppercase tracking-widest">Coming soon.</h3>
    <!-- <div class="mt-20 pt-24 flex flex-col justify-center items-center">
      <h1 v-for="(service, index) in services" :key="index">
        {{ service.title }}
      </h1>
    </div>

    <div
      v-for="(service, index) in services"
      :key="service.id"
      :class="{ dark: index % 2 == 0 }"
      class="flex items-center justify-center flex-col w-full"
    >
      <h2 class="w-full uppercase green text-4xl tracking-widest text-center">
        {{ service.title }}
      </h2>
      <div v-if="service.purpose" class="w-full">
        <h3 class="w-full uppercase bold text-xs green text-center">Purpose</h3>
        <div v-html="service.purpose"></div>
      </div>
      <div v-if="service.how_we_help" class="w-full">
        <h3 class="w-full uppercase bold text-xs green text-center">
          How we help
        </h3>
        <div v-html="service.how_we_help"></div>
      </div>
      <div v-if="service.who_it_is_for" class="w-full">
        <h3
          class="w-full uppercase bold text-xs blue tracking-wider text-center"
        >
          Who is this for?
        </h3>
        <div v-html="service.who_it_is_for"></div>
      </div>
      <div v-if="service.example_programs.length > 0" class="">
        <h3
          class="w-full uppercase bold text-xs blue tracking-wider text-center"
        >
          {{ service.title }} Work Portfolio
        </h3>
        <program-card
          v-for="(program, index) in service.example_programs"
          :key="index"
          :program="program.program_id"
        >
        </program-card>
      </div>
    </div> -->
  </div>
</template>

<script>
// import programCard from '~/components/programs/programCard'
export default {
  components: {
    // programCard
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
  head() {}
}
</script>

<style lang="scss">
#services {
  height: 60vh;
}
</style>
