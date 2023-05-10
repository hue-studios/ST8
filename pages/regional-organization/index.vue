<template>
  <div id="organization">
    <div
      id="mission-section"
      class="w-full flex items-center justify-center flex-col relative"
    >
      <div id="mission-section__counties" class="absolute left-0">
        <h1
          v-for="(county, index) in filteredCounties"
          :key="index"
          class="uppercase grey block md:opacity-25 bold"
        >
          {{ county.title }}
        </h1>
      </div>
      <div class="flex flex-col justify-center items-start statement">
        <h2 class="uppercase green tracking-widest thin-font">Mission</h2>
        <p class="navy">{{ organization.mission_statement }}</p>
      </div>
    </div>
    <div
      id="organization-info"
      class="w-full flex items-center flex-col justify-center py-20 relative"
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
      <div
        id="organization-info__container"
        class="flex flex-col items-start px-8"
      >
        <h2
          class="w-full page-title uppercase tracking-widest mb-4 pt-2 pb-1 thin-font mb-20 relative text-center"
        >
          Our Vision
        </h2>
        <div class="whitespace-pre-wrap mb-20 pb-4 text-center">
          {{ organization.who_we_are }}
        </div>

        <h2
          class="w-full page-title uppercase tracking-widest mt-8 mb-4 thin-font pt-2 pb-1 mb-20 text-center relative"
        >
          Our Approach
        </h2>
        <div class="whitespace-pre-wrap mb-20 pb-4 text-center">
          {{ organization.our_role }}
        </div>

        <h2
          class="w-full page-title uppercase text-center tracking-widest thin-font mt-8 mb-4 pt-2 pb-1 mb-20 relative"
        >
          Our History
        </h2>
        <div class="whitespace-pre-wrap mb-20 pb-4 text-center">
          {{ organization.our_history }}
        </div>

        <p
          class="w-full text-center mb-20 py-4 tracking-widest uppercase bold text-xs"
        >
          View our 5 year plan 2018-2022:
        </p>
        <div class="w-full text-center bg-transparent">
          <a
            class="inline-block px-12 py-6 uppercase green bold tracking-widest font-medium"
            href="https://admin.steny.org/southern-tier-8/assets/olp5pu0u2tc4000c"
            target="_blank"
            rel="noreferrer"
            >CEDS</a
          >
        </div>
      </div>
    </div>
    <div
      id="staff-section"
      class="w-full flex flex-col justify-center items-center py-20"
    >
      <h2
        class="uppercase navy thin-font w-full text-center page-title tracking-widest"
      >
        Team
      </h2>
      <div
        v-for="(person, index) in staff"
        :key="index"
        class="flex flex-row justify-between items-center w-full md:w-5/6 people-card"
      >
        <div
          v-if="person.image"
          :style="
            'background-image: url(' +
            imageLocation +
            person.image.private_hash +
            '?key=small)'
          "
          class="bg-cover bg-center bg-no-repeat people-card__image"
        ></div>
        <div
          v-else
          :style="
            'background-image: url(' +
            imageLocation +
            'io8iw0uluxsk8kcs?key=small)'
          "
          class="bg-center bg-no-repeat people-card__image"
          style="background-size: 100% auto"
        ></div>
        <div class="people-card__info">
          <div
            class="flex flex-row justify-between items-center tracking-widest bold people-card__name"
          >
            <h3 class="uppercase">{{ person.name }}</h3>
            <div class="flex flex-col justify-end items-end people-card__links">
              <a
                :href="'tel:' + person.phone"
                class="uppercase"
                target="_blank"
                >{{ person.phone }}</a
              >
              <a
                :href="'mailto:' + person.email"
                class="uppercase"
                target="_blank"
                >{{ person.email }}</a
              >
            </div>
          </div>
          <h5 v-if="person.title" class="uppercase bold people-card__title">
            {{ person.title }}
          </h5>
        </div>
      </div>
    </div>

    <div
      id="board-section"
      class="w-full flex justify-center items-start flex-row flex-wrap py-20"
    >
      <h2
        class="uppercase w-full text-center page-title tracking-widest thin-font white mb-6"
      >
        Board of Directors
      </h2>

      <div class="text-center board-card">
        <h3 class="uppercase">Broome County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Broome')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Chenango County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Chenango')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Cortland County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Cortland')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Delaware County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Delaware')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>

      <div class="text-center board-card">
        <h3 class="uppercase">Otsego County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Otsego')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Schoharie County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Schoharie')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Tioga County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Tioga')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
      <div class="text-center board-card">
        <h3 class="uppercase">Tompkins County</h3>
        <h5
          v-for="(person, index) in filteredBoard('Tompkins')"
          :key="index"
          class="uppercase"
        >
          {{ person.name
          }}<span v-if="person.title" class="title"> {{ person.title }}</span>
        </h5>
      </div>
    </div>
    <div
      id="roi-section"
      class="w-full flex justify-center items-center flex-col py-20"
    >
      <h2
        class="uppercase w-full text-center page-title tracking-widest thin-font mb-8 navy"
      >
        Return on Investment
      </h2>
      <a
        :href="imageLocation + 'b602bcfus7ww8o4o'"
        target="_blank"
        rel="noreferrer"
        class="flex items-center justify-center flex-col relative py-12 mb-8 roi-card"
      >
        <h5 class="absolute uppercase thin-font">ROI</h5>
        <h3 class="green uppercase tracking-widest bold">Regional</h3>
      </a>
      <p class="w-full px-8 mb-8">
        Southern Tier 8 Regional Board represents eight counties as the 6th
        largest Local Development District for the Appalachian Regional
        Commission (ARC), and five counties as an Economic Development District
        under the US Economic Development Administration (EDA). Federal
        partners, ARC and EDA offer investments to leverage private sector
        dollars that increase job opportunities, raise per capita income,
        promote infrastructure improvements and strengthen the capacity of our
        people to compete in global economies. County participation and
        investments make these programs possible, with an average annual return
        of $5,500 per $1 of local investment.
      </p>
      <div
        class="flex flex-row flex-wrap items-center justify-center max-w-3xl"
      >
        <div v-for="(county, index) in filteredCounties" :key="index">
          <a
            v-if="county.roi"
            :href="imageLocation + county.roi.private_hash"
            target="_blank"
            rel="noreferrer"
            class="flex items-center justify-center flex-col relative py-12 mx-2 mb-4 roi-card"
          >
            <h5 class="absolute uppercase thin-font">ROI</h5>
            <h3 class="green uppercase tracking-widest bold">
              {{ county.title }}
            </h3>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pulseIcon from '~/components/universal/pulseIcon'
export default {
  components: { pulseIcon },
  async asyncData({ $axios }) {
    const [organizationReq, peopleReq, countiesReq] = await Promise.all([
      $axios.$get('/items/organization?single=1&fields=*.*.*'),
      $axios.$get('/items/people?fields=*.*.*&filter[status]=published'),
      $axios.$get('/items/counties?fields=*.*'),
    ])
    return {
      organization: organizationReq.data,
      people: peopleReq.data,
      counties: countiesReq.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
    }
  },
  head() {
    return {
      title:
        'Regional Economic Development Organization for the Southern Tier of New York',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            'Regional Economic Development Organization for the Southern Tier of New York',
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
          content: 'https://southerntier8.org/regional-organization/',
        },
      ],
    }
  },
  computed: {
    staff() {
      return this.people.filter((person) => person.category === 'Staff')
    },
    board() {
      return this.people.filter((person) => person.category === 'Board')
    },
    filteredCounties(county) {
      return this.counties.filter((county) => county.title !== 'Regional')
    },
    regionalData(county) {
      return this.counties.filter((county) => county.title === 'Regional')
    },
  },
  created() {},

  beforeDestroy() {
    window.removeEventListener('scroll', this.lineFunction)
  },
  mounted() {
    // mobile line animation
    const straightLine = document.getElementById('straight-line')
    const straightLength = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = straightLength
    straightLine.style.strokeDashoffset = straightLength
    window.addEventListener('scroll', this.lineFunction)
  },
  methods: {
    smoothScroll(e) {
      console.log(e.target.getAttribute('href'))
      const href = e.target.getAttribute('href')
      const offsetTop = document.querySelector(href).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth',
      })
    },
    filteredBoard(county) {
      return this.board.filter((person) => person.county.title === county)
    },
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()
      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('organization-info')
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
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pageStyles';
@import './assets/scss/pages/organization';
</style>
