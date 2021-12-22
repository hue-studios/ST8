<template>
  <div
    id="page-partners"
    class="flex justify-center items-center flex-col relative"
  >
    <svg
      id="chevron-one"
      xmlns="http://www.w3.org/2000/svg"
      width="662.021"
      height="1253.332"
      viewBox="0 0 662.021 1253.332"
    >
      <path
        d="M1221.977,7,612.988,615.988,4,7"
        transform="translate(10.678 1239.654) rotate(-90)"
      />
    </svg>
    <svg
      id="chevron-two"
      xmlns="http://www.w3.org/2000/svg"
      width="662.021"
      height="1253.332"
      viewBox="0 0 662.021 1253.332"
    >
      <path
        d="M1221.977,7,612.988,615.988,4,7"
        transform="translate(10.678 1239.654) rotate(-90)"
      />
    </svg>
    <svg
      id="chevron-three"
      xmlns="http://www.w3.org/2000/svg"
      width="662.021"
      height="1253.332"
      viewBox="0 0 662.021 1253.332"
    >
      <path
        d="M1221.977,7,612.988,615.988,4,7"
        transform="translate(10.678 1239.654) rotate(-90)"
      />
    </svg>
    <h2 class="uppercase tracking-widest green-two">
      Col<span class="white">lab</span>orate
    </h2>
    <p class="white w-5/6 md:w-3/5">
      We believe that partnership is everything and without it, we can’t
      possibility accomplish all the programs that can lead to true success. We
      invite you to reach out, share your ideas, and let’s see what we can put
      together to accomplish our regional initiatives.
    </p>
    <div
      class="w-full flex flex-row justify-center items-center flex-wrap mt-8"
    >
      <div
        v-for="partner in partners"
        :key="partner.sort"
        class="rounded-full flex items-center justify-center partners-badge"
      >
        <img
          v-if="partner.logo"
          :src="imageLocation + partner.logo.private_hash + '?key=thumbnail'"
          :alt="partner.title"
          :width="partner.logo.width"
          :height="partner.logo.height"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
export default {
  components: {},
  props: {
    imageLocation: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      partners: [],
    }
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger)
    gsap.to('#chevron-one', {
      scrollTrigger: {
        trigger: '#page-partners', // this is the element that will trigger the animation
        start: 'top bottom-=100px', // this string defines the trigger and scroller start
        end: '+=100%', // this string defines the trigger and scroller end
        scrub: true, // this tells GSAP to link animation progress to scroll progress
      },
      x: '-70px',
      y: '20px',
    })
    gsap.to('#chevron-three', {
      scrollTrigger: {
        trigger: '#page-partners', // this is the element that will trigger the animation
        start: 'top bottom-=100px', // this string defines the trigger and scroller start
        end: '+=100%', // this string defines the trigger and scroller end
        scrub: true, // this tells GSAP to link animation progress to scroll progress
      },
      x: '50px',
    })
  },
  created() {
    this.getPartners()
  },
  methods: {
    getPartners() {
      this.$axios
        .$get('/items/partners?fields=*.*.*')
        .then((response) => {
          this.partners = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/pagePartners';
</style>
