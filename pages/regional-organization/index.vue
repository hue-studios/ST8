<template>
  <div id="organization">
    <div
      id="mission-section"
      class="w-full flex items-center justify-center flex-col relative"
    >
      <div id="mission-section__counties" class="absolute left-0">
        <h1
          v-for="(county, index) in counties"
          :key="index"
          class="uppercase grey block opacity-25 thin-font"
        >
          {{ county.title }}
        </h1>
      </div>
      <div class="flex flex-col justify-center items-start statement">
        <h2 class="uppercase green tracking-widest thin-font">
          Mission
        </h2>
        <p class="navy">{{ organization.mission_statement }}</p>
      </div>
    </div>
    <div
      id="organization-info"
      class="w-full flex items-center flex-col justify-center py-20"
    >
      <div
        id="organization-info__container"
        class="flex flex-col items-start px-8"
      >
        <h2 class="page-title uppercase green tracking-widest mb-4 relative">
          Who We Are
        </h2>
        <div class="whitespace-pre-wrap">{{ organization.who_we_are }}</div>

        <h2
          class="page-title uppercase green tracking-widest mt-8 mb-4 relative"
        >
          Our Role
        </h2>
        <div class="whitespace-pre-wrap">{{ organization.our_role }}</div>

        <h2
          class="page-title uppercase green tracking-widest mt-8 mb-4 relative"
        >
          Our History
        </h2>
        <div class="whitespace-pre-wrap">{{ organization.our_history }}</div>

        <div class="w-full mt-6 text-center">
          <p lass="mt-6">View our 5 year plan released in 2019:</p>
          <a
            class="mt-4 inline-block px-12 py-6 uppercase green tracking-widest font-medium"
            href="#"
            >5 Year Plan</a
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
          :style="
            'background-image: url(' +
              imageLocation +
              person.image.private_hash +
              '?key=small)'
          "
          class="bg-cover bg-center bg-no-repeat people-card__image"
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
      class="w-full flex justify-center items-center flex-row flex-wrap py-20"
    >
      <h2
        class="uppercase w-full text-center page-title tracking-widest thin-font white mb-0"
      >
        Board of Directors
      </h2>
      <p class="w-full text-center white mb-6">
        Our experienced board is comprised of 23 members, including many
        long-standing contributors.
      </p>

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
  </div>
</template>

<script>
export default {
  components: {},
  async asyncData({ $axios }) {
    const [organizationReq, peopleReq, countiesReq] = await Promise.all([
      $axios.$get('/items/organization?single=1&fields=*.*.*'),
      $axios.$get('/items/people?fields=*.*.*'),
      $axios.$get('/items/counties?fields=*.*')
    ])
    return {
      organization: organizationReq.data,
      people: peopleReq.data,
      counties: countiesReq.data
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl
    }
  },
  head() {},
  computed: {
    staff() {
      return this.people.filter((person) => person.category === 'Staff')
    },
    board() {
      return this.people.filter((person) => person.category === 'Board')
    }
  },
  created() {},
  mounted() {},
  methods: {
    smoothScroll(e) {
      console.log(e.target.getAttribute('href'))
      const href = e.target.getAttribute('href')
      const offsetTop = document.querySelector(href).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth'
      })
    },
    filteredBoard(county) {
      return this.board.filter((person) => person.county.title === county)
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pageStyles';
@import './assets/scss/pages/organization';
</style>
