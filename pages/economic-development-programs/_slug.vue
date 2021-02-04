<template>
  <div id="program">
    <div
      id="program__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <h2 id="program__bg-title" class="uppercase absolute">
        Ini tiati ves
      </h2>
      <div
        id="initiative__intro-caption"
        class="flex items-start flex-col relative"
      >
        <h1 class="uppercase green-two initiative__page-title">
          {{ program.title }}
        </h1>
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
        class="navy relative initiative__vertical-story-description"
        v-html="program.what_is_it"
      ></div>
      <h3
        id="the-challenge-title"
        class="uppercase green-two relative initiative__vertical-story-title"
      >
        The Challenge
      </h3>

      <div
        id="the-challenge-description"
        class="navy relative initiative__vertical-story-description"
        v-html="program.what_it_accomplishes"
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
        <strong> active projects</strong> focused on regionalism. We initiate
        and partner with public and private organizations throughout the
        Southern Tier region to accomplish this initiative.
      </p>
    </div>
    <div
      id="initiative__news"
      class="flex relative justify-center items-center flex-row flex-wrap relative"
    >
      <h2 class="uppercase green-two relative story-title">
        Get Involved
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const [programReq] = await Promise.all([
      $axios.$get(
        '/items/programs?filter[url][eq]=' +
          params.slug +
          '&fields=*.*.*&single=1'
      )
    ])
    return {
      program: programReq.data
    }
  },

  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/program';
</style>
