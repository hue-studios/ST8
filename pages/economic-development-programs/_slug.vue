<template>
  <div id="initiative">
    <div
      id="initiative__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <h2 id="initiative__bg-title" class="uppercase absolute">
        Ini tiati ves
      </h2>
      <div
        id="initiative__intro-caption"
        class="flex items-start flex-col relative"
      >
        <h3 class="absolute navy initiative__intro-sort">
          {{ initiative.sort }}
        </h3>
        <h1 class="uppercase green-two initiative__page-title">
          {{ initiative.title }}
        </h1>
        <p
          v-if="initiative.caption"
          class="navy text-xs mt-2 mb-2 md:mb-4 text-justify"
        >
          {{ initiative.caption }}
        </p>
      </div>
    </div>
    <div
      id="initiative__vertical-story"
      class="flex relative justify-center items-center flex-col relative"
    >
      <h2 id="active" class="absolute uppercase initiative__bg-title">
        Active
      </h2>
      <h3
        id="the-goal-title"
        class="uppercase green-two relative initiative__vertical-story-title"
      >
        The Goal
      </h3>

      <div
        id="the-goal-description"
        v-html="initiative.goal"
        class="navy relative initiative__vertical-story-description"
      ></div>
      <h3
        id="the-challenge-title"
        class="uppercase green-two relative initiative__vertical-story-title"
      >
        The Challenge
      </h3>

      <div
        id="the-challenge-description"
        v-html="initiative.challenge"
        class="navy relative initiative__vertical-story-description"
      ></div>
      <h3
        id="the-opportunity-title"
        class="uppercase green-two relative initiative__vertical-story-title"
      >
        The Opportunity
      </h3>

      <div
        id="the-opportunity-description"
        v-html="initiative.opportunity"
        class="navy relative initiative__vertical-story-description"
      ></div>
    </div>
    <div
      id="initiative__programs"
      class="flex relative justify-center items-center flex-row flex-wrap relative"
    >
      <h5 id="regional-title" class="absolute uppercase initiative__bg-title">
        Regional
      </h5>
      <h2 class="uppercase green-two relative story-title">
        How we accomplish this.
      </h2>
      <p>
        We currently have
        <strong>{{ programs.length }} active projects</strong> focused on
        regionalism. We initiate and partner with public and private
        organizations throughout the Southern Tier region to accomplish this
        initiative.
      </p>
      <div v-for="program in programs" :key="program.key" class="">
        {{ program.title }}
      </div>
    </div>
    <div
      id="initiative__news"
      class="flex relative justify-center items-center flex-row flex-wrap relative"
    >
      <h2 class="uppercase green-two relative story-title">
        Get Involved
      </h2>
      <div v-for="item in news" :key="item.key" class="">
        {{ item.title }}
      </div>
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
