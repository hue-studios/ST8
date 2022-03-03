<template>
  <div id="reporting" class="flex flex-col items-center justify-center pb-32">
    <div
      id="reporting__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font"
      >
        Reporting
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-3/5">
        This is a collection of our public documents published for reporting
        purposes and accessible to the public.
      </p>
    </div>
    <div
      id="reporting__reporting-cards"
      class="relative w-full flex items-center justify-center flex-col pb-20"
    >
      <div class="w-full text-center px-8 mb-4 reporting__filters">
        <input
          v-model="search"
          class="condensed uppercase shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline search-input"
          type="text"
          placeholder="Search."
        />
      </div>

      <transition-group
        name="list"
        mode="out-in"
        tag="div"
        class="w-full flex flex-col items-center justify-center px-3 sm:px-8"
      >
        <reporting-report-card
          v-for="item in filteredReports"
          :key="item.id"
          :item="item"
        />
      </transition-group>
      <transition
        mode="out-in"
        enter-active-class="uk-animation-fade"
        leave-active-class="uk-animation-fade uk-animation-fast"
      >
        <p
          v-if="filteredReports.length < 1"
          class="uppercase text-xs tracking-widest mt-24 text-center"
        >
          there were no results.
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const [reportingReq] = await Promise.all([
      $axios.$get('/items/reporting?fields=*.*.*'),
    ])
    return {
      reports: reportingReq.data,
    }
  },
  data() {
    return {
      search: '',
      imageLocation: process.env.imageUrl,
    }
  },
  head() {
    return {
      title:
        'Public Reporting and Documentation for Southern Tier 8 Regional Board',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            'Public Reporting and Documentation for Southern Tier 8 Regional Board',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            "The Southern Tier 8 organization partner's with member counties to identify and address multi-county issues in order to improve the quality of life within the region.",
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/reporting/',
        },
      ],
    }
  },
  computed: {
    filteredReports() {
      const app = this
      const search = app.search
      if (search === '') {
        return app.reports
      } else {
        return app.reports.filter(function (item) {
          return (
            search === '' ||
            item.title.toLowerCase().includes(search.toLowerCase())
          )
        })
      }
    },
  },
  created() {},

  beforeDestroy() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pageStyles';
#reporting {
  #reporting__intro {
    height: 200px;
    @media (min-width: $breakpoint-small) {
      height: 250px;
    }
    @media (min-width: $breakpoint-medium) {
    }
    @media (min-width: $breakpoint-large) {
      height: 200px;
    }

    h1 {
      font-size: 42px;
      line-height: 1.2em;
      position: relative;
      margin-top: 70px;
      @media (min-width: $breakpoint-small) {
        font-size: 62px;
      }
      @media (min-width: $breakpoint-large) {
        margin-top: 0px;
      }
    }
    h1:after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 1px;
      background: $navy;
      @media (min-width: $breakpoint-small) {
        width: 120%;
        left: -10%;
      }
      @media (min-width: $breakpoint-medium) {
      }
    }
    p {
      font-size: 14px;
      line-height: 1.2em;
    }
  }
}
#reporting__reporting-cards {
  .reporting__filters {
    input {
      max-width: 400px;
    }
  }
}
</style>
