<template>
  <div id="programs">
    <div
      id="programs__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <div class="w-full absolute background text-left">
        <h3
          v-for="initiative in initiatives"
          :key="initiative.id"
          class="uppercase bold"
        >
          {{ initiative.title }}
        </h3>
      </div>
      <h1
        id="programs__page-title"
        class="navy uppercase tracking-widest w-5/6 thin-font text-center mb-4"
      >
        Programs
      </h1>
      <p class="navy w-5/6 md:w-3/5 font-normal text-center">
        Our programs are designed to implement our five core initiatives. Each
        program is designed to create innovative ideas, develop practical
        solutions, and align strategic partnerships to meet the challenges and
        advance economic growth in the Southern Tier 8 Region.
      </p>
      <div id="programs__total" class="mt-6">
        <h5 class="uppercase tracking-widest bold px-8 py-6">
          <span class="green mr-1">{{ programs.length }}</span
          >Programs /
          <span class="thin-font">{{ $moment().format('MMM Do YYYY') }}</span>
        </h5>
      </div>
    </div>
    <div
      id="programs__program-cards"
      class="relative w-full flex items-center justify-center flex-col pb-60 mb-20 pt-20"
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
        class="w-full flex flex-col items-center justify-center px-3 sm:px-8"
      >
        <program-card
          v-for="(program, index) in programs"
          :key="index"
          :program="program"
          class="blur-bg"
        ></program-card>
        <div class="">
          <pulse-icon icon-i-d="finish-btn" class-name="button"></pulse-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import programCard from '~/components/programs/programCard'
import pulseIcon from '~/components/universal/pulseIcon'
export default {
  components: {
    programCard,
    pulseIcon,
  },
  async asyncData({ params, $axios }) {
    const [programsReq, initiativesReq] = await Promise.all([
      $axios.$get(
        '/items/programs?fields=id,title,what_is_it,url,collaboration,what_it_accomplishes,website,url,activity.activity_id.*,counties.county_id.title,images.file_id.private_hash,initiatives.initiative_id.title,initiatives.initiative_id.url,partners.partner_id.title,resources.resources_id.*&filter[status]=published'
      ),
      $axios.$get('/items/initiatives?fields=*.*.*&filter[status]=published'),
    ])
    return {
      programs: programsReq.data,
      initiatives: initiativesReq.data,
    }
  },
  data() {
    return {
      programFilters: [],
    }
  },
  head() {
    return {
      title:
        'Economic Development Programs for the Southern Tier Region of New York',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            'Economic Development Programs for the Southern Tier Region of New York',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Southern Tier 8 regional programs are designed to create innovative ideas, develop practical solutions, and align strategic partnerships to meet the challenges and advance economic growth in the Southern Tier 8 Region.',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/economic-development-programs/',
        },
      ],
    }
  },
  computed: {
    filteredPrograms() {
      const app = this
      // const itemFilters = []
      if (app.programFilters.length < 1) {
        return app.programs
      } else {
        return app.programs.filter((item) => {
          return item.initiatives.forEach(function (initiative, index) {
            return app.programFilters.includes(initiative.intiative_id.title)
          })
          // return app.programFilters.includes(
          //   item.initiatives.initiative_id.title
          // )
        })
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.lineFunction)
  },
  mounted() {
    // mobile line animation
    const straightLine = document.getElementById('straight-line')
    const straightLength = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = straightLength
    straightLine.style.strokeDashoffset = straightLength
    // desktop line animation

    window.addEventListener('scroll', this.lineFunction)
  },
  created() {
    // this.checkInitiative()
  },
  methods: {
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()

      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('programs__program-cards')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 0.8
        if (scrollPercent < 1) {
          const drawStraight = straightLength * scrollPercent
          straightLine.style.strokeDashoffset = straightLength - drawStraight
        }
      })
    },
    returnInitiativesTitle(initiatives) {
      console.log(initiatives)
      initiatives.map((initiative) => {
        return initiative.initiative_id.title
      })
    },
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
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/programs';
</style>
