<template>
  <div id="programs">
    <div class="mt-20 pt-24 flex flex-col justify-center items-center">
      <h1 v-for="(program, index) in programs" :key="index">
        {{ initiative.title }}
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const programsReq = await $axios.get(
      process.env.apiUrl + '/items/programs?fields=*.*.*'
    )
    return {
      programs: programsReq.data.data
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {}
}
</script>

<style lang="scss">
#programs {
  height: 300vh;
}
</style>
