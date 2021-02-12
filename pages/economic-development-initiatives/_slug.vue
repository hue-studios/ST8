<template>
  <div id="initiative">
    <div id="temp" class="h-screen flex items-center justify-center w-full">
      <h2>
        Hey Jen...don't freak out...the
        <span class="green">{{ initiative.title }}</span> initiative page is not
        done.
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const [initiativeReq, programsReq, newsReq] = await Promise.all([
      $axios.$get(
        '/items/initiatives?filter[url][eq]=' +
          params.slug +
          '&fields=*.*.*&single=1'
      ),
      $axios.$get(
        '/items/programs?filter[initiatives.initiative_id.url][eq]=' +
          params.slug +
          '&fields=*.*.*&limit=5'
      ),
      $axios.$get(
        '/items/news?filter[initiatives.initiative_id.url][eq]=' +
          params.slug +
          '&fields=*.*.*&limit=5'
      )
    ])
    return {
      initiative: initiativeReq.data,
      programs: programsReq.data,
      news: newsReq.data
    }
  },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/initiative';
</style>
