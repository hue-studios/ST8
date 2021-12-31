<template>
  <div
    id="resources"
    class="flex flex-col items-center justify-center pb-32 w-full overflow-hidden"
  >
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
    <div class="w-full flex items-center justify-center flex-col">
      <div
        class="w-full flex items-start justify-center flex-col resources__title-container"
      >
        <h2
          class="uppercase font-bold relative mt-8 mb-4 md:mb-8 tracking-wider resources__title"
        >
          Community Plans &amp; Strategies
          <span class="flex items-center justify-center badge">{{
            plans.length
          }}</span>
        </h2>
      </div>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in plans"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
    <div class="w-full flex items-center justify-center flex-col">
      <div
        class="w-full flex items-start justify-center flex-col resources__title-container"
      >
        <h2
          class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title"
        >
          Grant Writing
          <span class="flex items-center justify-center badge">{{
            grants.length
          }}</span>
        </h2>
      </div>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in grants"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
    <div class="w-full flex items-center justify-center flex-col">
      <div
        class="w-full flex items-start justify-center flex-col resources__title-container"
      >
        <h2
          class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title"
        >
          Health &amp; Wellness
          <span class="flex items-center justify-center badge">{{
            health.length
          }}</span>
        </h2>
      </div>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in health"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
    <div class="w-full flex items-center justify-center flex-col">
      <h2
        class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title"
      >
        Investment &amp; Development
        <span class="flex items-center justify-center badge">{{
          investment.length
        }}</span>
      </h2>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in investment"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
    <div class="w-full flex items-center justify-center flex-col">
      <div
        class="w-full flex items-start justify-center flex-col resources__title-container"
      >
        <h2
          class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title"
        >
          Infrastructure
          <span class="flex items-center justify-center badge">{{
            infrastructure.length
          }}</span>
        </h2>
      </div>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in infrastructure"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
    <div class="w-full flex items-center justify-center flex-col">
      <div
        class="w-full flex items-start justify-center flex-col resources__title-container"
      >
        <h2
          class="uppercase font-bold relative mt-20 md:mt-28 mb-4 md:mb-8 tracking-wider resources__title"
        >
          Environmental
          <span class="flex items-center justify-center badge">{{
            environmental.length
          }}</span>
        </h2>
      </div>
      <div class="w-full resources__title-border"></div>
      <now-resource-card-data
        v-for="(resource, index) in environmental"
        :key="index"
        :item="resource"
        class=""
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
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
          name: 'description',
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
    plans() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Community Plans & Strategies'
      })
    },
    environmental() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Environmental & Geospatial'
      })
    },
    grants() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Grant Writing'
      })
    },
    health() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Health & Wellness'
      })
    },
    infrastructure() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Infrastructure'
      })
    },
    investment() {
      const vm = this
      return vm.resources.filter(function (resource) {
        return resource.category === 'Investment & Development'
      })
    },
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

<style lang="scss" scoped>
@import './assets/scss/vars';
@import './assets/scss/pages/resources';
.resources__title-container {
  max-width: 800px;
}
.resources__title {
  font-size: 28px;
  line-height: 24px;
  padding-left: 5px;
  padding-right: 15px;
  border-left: 10px solid $navy;

  @media (min-width: $breakpoint-small) {
  }
  @media (min-width: $breakpoint-medium) {
    font-size: 46px;
    line-height: 36px;
    border-left: 15px solid $navy;
  }

  .badge {
    position: absolute;
    right: -10px;
    top: -15px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: $navy;
    color: $green;
    font-size: 10px;
    font-family: $bold-font;
    border-radius: 50%;
    letter-spacing: normal;
  }
}
.resources__title-border {
  height: 0px;
  background: rgba($grey, 0.5);
}
.resource-card-data:nth-of-type(even) {
  background: #eeeeee;
}
</style>
