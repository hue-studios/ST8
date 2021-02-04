<template>
  <div id="organization">
    <div
      id="organization-intro"
      class="w-full mt-20 pt-24 flex flex-col justify-center items-center"
    >
      <counties></counties>
      <logo-name></logo-name>
      <h1 v-for="(service, index) in services" :key="index">
        {{ service.title }}
      </h1>
    </div>
    <div
      id="mission-section"
      class="w-full flex items-center justify-center flex-col relative"
    >
      <h2 class="uppercase">Mission Statement</h2>
      <p>{{ organization.mission_statement }}</p>
      <img
        id="cropped-overlay"
        src="/images/organization/downtown-cropped.jpg"
        alt="Downtown Binghamton"
        class="absolute"
      />
    </div>
    <div
      id="staff-section"
      class="w-full flex flex-col justify-center items-center"
    >
      <h2 class="uppercase white w-full text-center">Team</h2>
      <div
        v-for="(person, index) in staff"
        :key="index"
        class="flex flex-row justify-center items-center people-card"
      >
        <div
          :style="
            'background-image: url(' +
              imageLocation +
              person.image.private_hash +
              '?key=thumbnail)'
          "
          class="bg-cover bg-center bg-no-repeat people-card__image"
        ></div>
        <div class="people-card__info">
          <div class="flex flex-row people-card__name">
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
          <h5 v-if="person.title" class="uppercase people-card__title">
            {{ person.title }}
          </h5>
        </div>
      </div>
    </div>

    <div
      id="board-section"
      class="w-full flex justify-center items-center flex-row flex-wrap"
    >
      <h2 class="uppercase w-full text-left">Board of Directors</h2>
      <p class="w-full">
        Our experienced board is comprised of 23 members, including many
        long-standing contributors:
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
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import counties from '~/components/layout/countiesColoredNamed'
import logoName from '~/components/layout/logoName'

export default {
  components: {
    logoName,
    counties
  },
  data() {
    return {
      imageLocation: process.env.imageUrl
    }
  },
  computed: {
    staff() {
      return this.people.filter((person) => person.category === 'Staff')
    },
    board() {
      return this.people.filter((person) => person.category === 'Board')
    }
  },
  async asyncData({ $axios }) {
    const [servicesReq, organizationReq, peopleReq] = await Promise.all([
      $axios.$get('/items/services?fields=*.*.*'),
      $axios.$get('/items/organization?single=1&fields=*.*.*'),
      $axios.$get('/items/people?fields=*.*.*')
    ])
    return {
      services: servicesReq.data,
      organization: organizationReq.data,
      people: peopleReq.data
    }
  },
  created() {
    console.log(this.people)
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger)
    // gsap.to('#cropped-overlay', {
    //   scrollTrigger: {
    //     trigger: '#mission-section', // this is the element that will trigger the animation
    //     start: 'top center', // this string defines the trigger and scroller start
    //     end: 'bottom center', // this string defines the trigger and scroller end
    //     scrub: true // this tells GSAP to link animation progress to scroll progress
    //   },
    //   x: '50px'
    // })
  },
  methods: {
    filteredBoard(county) {
      return this.board.filter((person) => person.county.title === county)
    }
  },
  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/organization';
</style>
