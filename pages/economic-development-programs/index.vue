<template>
  <div id="programs">
    <div
      id="programs__intro"
      class="flex flex-col flex-wrap justify-center items-center relative"
    >
      <h1 class="uppercase tracking-widest mb-2 w-5/6 sm:w-3/5 md:w-1/2">
        Programs
      </h1>
      <p class="w-5/6 sm:w-3/5 md:w-1/2">
        We are always looking to partner with organizations and businesses to
        achieve the greater goal of growing our region.
      </p>
      <div class="w-full absolute background text-right">
        <h3
          v-for="initiative in initiatives"
          :key="initiative.id"
          class="uppercase bold"
        >
          {{ initiative.title }}
        </h3>
      </div>
    </div>
    <div
      id="programs__program-cards"
      class="w-full flex items-center justify-center flex-col pb-20"
    >
      <!-- <div class="w-full text-center programs__filters">
        <a
          v-for="(initiative, index) in initiatives"
          :key="index"
          class="uppercase mx-4"
          @click.prevent="setFilter(initiative.title)"
          >{{ initiative.title }}</a
        >
      </div> -->
      <div
        class="w-full md:w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-x-8 gap-y-8 px-8"
      >
        <program-card
          v-for="(program, index) in programs"
          :key="index"
          :program="program"
        ></program-card>
      </div>
    </div>
  </div>
</template>

<script>
import programCard from '~/components/programs/programCard'
export default {
  components: {
    programCard
  },
  async asyncData({ params, $axios }) {
    const [programsReq, initiativesReq] = await Promise.all([
      $axios.$get(
        '/items/programs?fields=id,title,what_is_it,url,collaboration,what_it_accomplishes,website,url,activity.activity_id.*,counties.county_id.title,images.file_id.private_hash,initiatives.initiative_id.title,initiatives.initiative_id.url,partners.partner_id.title,resources.resources_id.*'
      ),
      $axios.$get('/items/initiatives?fields=*.*.*')
    ])
    return {
      programs: programsReq.data,
      initiatives: initiativesReq.data
    }
  },
  data() {
    return {
      programFilters: []
    }
  },
  head() {},
  computed: {
    filteredPrograms() {
      const app = this
      // const itemFilters = []
      if (app.programFilters.length < 1) {
        return app.programs
      } else {
        return app.programs.filter((item) => {
          return item.initiatives.forEach(function(initiative, index) {
            return app.programFilters.includes(initiative.intiative_id.title)
          })
          // return app.programFilters.includes(
          //   item.initiatives.initiative_id.title
          // )
        })
      }
    }
  },
  created() {
    this.checkInitiative()
  },
  methods: {
    checkInitiative() {
      if (this.programFilters.includes('Workforce Development')) {
        console.log('Yes')
      }
    },
    removeFilter(value) {
      const app = this
      const index = app.programFilters.indexOf(value)
      if (index > -1) {
        app.programFilters.splice(index, 1)
      }
      return app.programFilters
    },
    setFilter(filter) {
      const app = this
      console.log(filter)
      if (app.programFilters.includes(filter)) {
        app.removeFilter(filter)
      } else {
        app.programFilters.push(filter)
      }

      console.log(app.programFilters)
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/programs';
</style>
