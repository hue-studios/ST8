<template>
  <div id="home">
    <div
      id="home-intro"
      class="mt-20 pt-24 flex flex-col justify-center items-center"
    >
      <logo-name></logo-name>
      <div
        class="w-full flex justify-around items-center home-intro__navigation"
      >
        <nuxt-link to="/" class="uppercase">Active</nuxt-link>
        <nuxt-link to="/regional-profile" class="uppercase">Regional</nuxt-link>
        <nuxt-link to="/" class="uppercase">Now</nuxt-link>
      </div>
    </div>
    <div id="home-motto" class="w-full">
      <h1 class="green uppercase">Our Motto</h1>
      <h2 class="green uppercase">Partnership Propels Progress</h2>
      <div>
        <h3>[ pahrt-ner-ship ]</h3>
        <p>
          the state or condition of being a partner; participation; association;
          joint interest.
        </p>
      </div>
      <div class="">
        Our Collaborative Interest is the Southern Tier 8 Region.
      </div>
    </div>
    <div id="home-graphic" class="w-full relative">
      <h1>Our Mission</h1>
      <p>
        TO PARTNER with member counties to identify and address multi-county
        issues in order to improve the quality of life within the region.
      </p>
      <home-graphic />
    </div>
    <div class="">
      <h1>How do we achieve our mission?</h1>
      <p>
        To us, partnerships are everything. One of the main goals of our
        organization at Southern Tier 8 Regional Board is to encourage and
        promote partnerships in all that we do. By working together with county
        planning and economic development organizations, we offer the community
        more support to effectively address creative solutions for many
        cross-boundary challenges at hand.
      </p>
    </div>
  </div>
</template>

<script>
import logoName from '~/components/layout/logoName'
import homeGraphic from '~/components/homeGraphic'
export default {
  components: {
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
