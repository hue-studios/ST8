<template>
  <div id="home">
    <div class="mt-20 pt-24 flex flex-col justify-center items-center">
      <h1 v-for="(county, index) in counties" :key="index">
        {{ county.title }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const countiesReq = await $axios.get(
      process.env.apiUrl + '/items/counties?fields=*.*.*'
    )
    return {
      counties: countiesReq.data.data
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {}
}
</script>

<style lang="scss">
#home {
  height: 300vh;
}
</style>
