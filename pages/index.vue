<template>
  <div id="home">
    <div
      id="home-intro"
      class="flex flex-col justify-center items-center relative"
    >
      <counties></counties>
      <logo-name></logo-name>
      <div
        class="w-full flex justify-around items-center absolute home-intro__navigation"
      >
        <nuxt-link to="/" class="uppercase tracking-widest">Active</nuxt-link>
        <nuxt-link
          to="/regional-profile"
          class="uppercase tracking-widest shadow-md"
          >Regional</nuxt-link
        >
        <nuxt-link to="/" class="uppercase tracking-widest shadow-lg"
          >Now</nuxt-link
        >
      </div>
    </div>
    <div id="home-motto" class="w-full py-20">
      <div id="motto-1" class="flex flex-col items-start">
        <h1 class="green uppercase tracking-widest">Our Motto</h1>
        <h2 class="green uppercase tracking-widest">
          Partnership Propels Progress
        </h2>
      </div>
      <div id="motto-2" class="flex flex-row items-start justify-center">
        <h3 class="navy lowercase font-medium mr-4">[ pahrt-ner-ship ]</h3>
        <p class="navy lowercase">
          the state or condition of being a partner; participation; association;
          joint interest.
        </p>
      </div>
      <div id="motto-3" class="w-full text-center">
        Our <span class="bold uppercase">Collaborative Interest</span> is the
        Southern Tier 8 Region.
      </div>
    </div>
    <div id="home-graphic" class="w-full relative py-20">
      <!-- <h1>Our Mission</h1>
      <p>
        TO PARTNER with member counties to identify and address multi-county
        issues in order to improve the quality of life within the region.
      </p> -->
      <home-graphic />
    </div>
    <div class="">
      <!-- <h1>How do we achieve our mission?</h1>
      <p>
        To us, partnerships are everything. One of the main goals of our
        organization at Southern Tier 8 Regional Board is to encourage and
        promote partnerships in all that we do. By working together with county
        planning and economic development organizations, we offer the community
        more support to effectively address creative solutions for many
        cross-boundary challenges at hand.
      </p> -->
    </div>
  </div>
</template>

<script>
import counties from '~/components/layout/countiesOutline'
import logoName from '~/components/layout/logoName'
import homeGraphic from '~/components/homeGraphic'
export default {
  components: {
    counties,
    logoName,
    homeGraphic
  },
  async asyncData({ params, $axios }) {
    const countiesReq = await $axios.get(
      process.env.apiUrl + '/items/counties?fields=*.*.*'
    )
    return {
      counties: countiesReq.data.data
    }
  },
  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';

@import './assets/scss/pages/home';
</style>
