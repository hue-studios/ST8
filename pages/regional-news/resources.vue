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
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Community Plans &amp; Strategies
        <span class="flex items-center justify-center badge">{{
          plans.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in plans"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <now-resource-card :item="resource" class="mb-6 blue" />
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Grant Writing
        <span class="flex items-center justify-center badge">{{
          grants.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in grants"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <resource-card :item="resource" class="mb-6"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Health &amp; Wellness
        <span class="flex items-center justify-center badge">{{
          health.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in health"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <resource-card :item="resource" class="blue mb-6"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Investment &amp; Development
        <span class="flex items-center justify-center badge">{{
          investment.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in investment"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <resource-card :item="resource" class="mb-6"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Infrastructure
        <span class="flex items-center justify-center badge">{{
          infrastructure.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in infrastructure"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <resource-card :item="resource" class="blue mb-6"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
    <div
      class="w-full flex items-center lg:items-start justify-center flex-col"
    >
      <h2
        class="uppercase tracking-widest relative mt-12 md:mt-20 resources__title"
      >
        Environmental
        <span class="flex items-center justify-center badge">{{
          environmental.length
        }}</span>
      </h2>
      <swiper
        :options="resourceSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in environmental"
          :key="index"
          class="flex flex-col items-center justify-center pt-4 pb-8"
        >
          <resource-card :item="resource" class="mb-6"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import resourceCard from '~/components/now/resourceCard'
export default {
  components: { resourceCard, Swiper, SwiperSlide },
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
    return {
      resourceSwiperOption: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        spaceBetween: 30,
        centeredSlides: false,
        centerInsufficientSlides: true,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true,
        },
      },
    }
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
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/resources';
.swiper-slide {
  max-width: 500px;
  width: 300px;

  @media (min-width: $breakpoint-small) {
    width: 400px;
  }
  @media (min-width: $breakpoint-medium) {
    width: 500px;
  }
}
.resources__title {
  font-size: 22px;
  line-height: 20px;
  padding-left: 15px;
  padding-right: 15px;
  @media (min-width: $breakpoint-small) {
  }
  @media (min-width: $breakpoint-medium) {
    font-size: 46px;
    line-height: 44px;
  }

  .badge {
    position: absolute;
    right: -0px;
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
</style>
