<template>
  <div id="article" class="flex flex-col justify-center items-center relative">
    <h2 id="article__bg-title" class="uppercase absolute">
      News
    </h2>
    <h1 class="uppercase green bold article__title">
      {{ article.title }}
    </h1>
    <h5>{{ $moment(article.date_published).format('dddd MMMM Do, YYYY') }}</h5>
    <div
      v-if="article.tags.length > 0"
      class="w-full flex flex-row items-start justify-start text-xs article__tags"
    >
      <h5
        v-for="(tag, index) in article.tags"
        :key="index"
        class="uppercase navy"
      >
        {{ tag }}
      </h5>
    </div>
    <div class="article__content" v-html="article.article"></div>
    <div v-if="article.link" class="article__links">
      <a :href="article.link" target="_blank" rel="noreferrer"
        ><span v-if="article.type === 'External Article'"
          >Go To Article Link</span
        ><span v-if="article.type === 'document'">Go To Document Link</span>
        <arrow-right-icon
          size="2.2x"
          stroke-width="2"
          class="inline-block"
        ></arrow-right-icon
      ></a>
    </div>
  </div>
</template>

<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  async asyncData({ params, $axios }) {
    const [newsReq] = await Promise.all([
      $axios.$get(
        '/items/news?filter[url][eq]=' + params.slug + '&fields=*.*.*&single=1'
      )
    ])
    return {
      article: newsReq.data
    }
  },

  head() {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/article';
</style>
