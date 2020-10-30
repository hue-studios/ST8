<template>
  <div id="initiatives">
    <div class="mt-20 pt-24 flex flex-col justify-center items-center">
      <h1 v-for="(service, index) in services" :key="index">
        {{ service.title }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const servicesReq = await $axios.get(
      process.env.apiUrl + '/items/services?fields=*.*.*'
    )
    return {
      services: servicesReq.data.data
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {}
}
</script>

<style lang="scss">
#initiatives {
  height: 300vh;
}
</style>
