<template>
  <div id="resources" class="flex flex-col items-center justify-center pb-32">
    <div
      id="resources__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font"
      >
        Resources
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-1/2">
        This is a collection of resources.
      </p>
    </div>
    <resource-card
      v-for="(item, index) in resources"
      :key="index"
      :item="item"
      class="mb-6 mx-6"
    ></resource-card>
  </div>
</template>

<script>
import moment from 'moment'
import resourceCard from '~/components/now/resourceCard'
export default {
  components: { resourceCard },
  async asyncData({ params, $axios }) {
    const resourcesReq = await $axios.get(
      process.env.apiUrl +
        '/items/resources?fields=*.*.*&filter[status]=published'
    )
    return {
      resources: resourcesReq.data.data,
    }
  },
  data() {
    return {}
  },
  head() {
    return {
      title: "Resources for the Southern Tier Region's Economy",
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: "Resources for the Southern Tier Region's Economy",
        },
        {
          hid: 'description',
          property: 'description',
          content:
            'Resources focused on the economic development for the Southern Tier region of New York.',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/regional-events/resources',
        },
      ],
    }
  },
  computed: {
    // project() {
    //   const vm = this
    //   return vm.resources.programs.map(function (item) {
    //     return item.programs_id.filter(function (program) {
    //       return program.title.includes('Project Development')
    //     })
    //   })
    // },
    // test() {
    //   const vm = this
    //   return vm.resources.filter(function (item) {
    //     if (item.programs) {
    //       return item.programs.map(function (program) {
    //         return program.programs_id.title.includes('Project Development')
    //       })
    //     } else {
    //       return item
    //     }
    //   })
    // },
    // project() {
    //   const vm = this
    //   return vm.resources.map((item) => {
    //     return {
    //       ...item,
    //       programs: item.programs.filter(function (program) {
    //         return program.programs_id.title.includes('Project Development')
    //       }),
    //     }
    //   })
    // },
    // regional() {
    //   const vm = this
    //   return vm.resources.map((item) => {
    //     return {
    //       ...item,
    //       programs: item.programs.filter(function (program) {
    //         return program.programs_id.title.includes('Regional Opportunity')
    //       }),
    //     }
    //   })
    // },
  },
  created() {
    this.resources.sort(this.sortFunction)
  },
  methods: {
    sortFunction(a, b) {
      if (a[0] === b[0]) {
        return 0
      }
      return a[1] < b[1] ? 1 : -1
    },
    formatTime(time) {
      const newTime = moment(time)
      return moment(newTime).format('h:mm a')
    },
    dayClicked(day) {
      this.selectedDay = day
    },
    checkDates(start, end) {
      let dates
      if (!end || start.dateTime === end.dateTime) {
        dates = start.dateTime
      } else if (end) {
        dates = {
          start: start.dateTime,
          end: end.dateTime,
        }
      }
      return dates
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/resources';
</style>
