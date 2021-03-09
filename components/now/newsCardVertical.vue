<template>
  <div
    :id="'news-card-vertical-' + item.id"
    class="flex items-center justify-start flex-col shadow-lg news-card-vertical"
  >
    <div
      v-if="item.cover_image"
      class="w-full mb-8 news-card-vertical__image"
      :style="
        'background-image: url(' +
        imageLocation +
        item.cover_image.private_hash +
        '?key=medium)'
      "
    ></div>
    <div
      v-else
      class="w-full mb-4 news-card-vertical__image"
      :style="
        'background-image: url(' +
        imageLocation +
        '1avcl3u0gukko40g?key=medium)'
      "
    ></div>

    <div
      v-if="item.tags.length > 0"
      class="w-full flex flex-row items-start justify-start flex-wrap text-xs mb-4 px-4 md:px-6 news-card-vertical__tags"
    >
      <h5
        v-for="(tag, index) in item.tags"
        :key="index"
        class="uppercase white mr-2 mb-2 bold"
      >
        {{ tag }}
      </h5>
    </div>
    <h2 class="uppercase w-full px-4 news-card-vertical__title">
      {{ truncateString(item.title, 55) }}
    </h2>

    <h5
      v-if="item.date_published"
      class="w-full uppercase navy tracking-widest mt-4 mb-4 px-4 news-card-vertical__date"
    >
      {{ $moment(item.date_published).format('dddd MMMM Do, YYYY') }}
    </h5>
    <h5
      v-else
      class="w-full uppercase navy tracking-widest mb-4 px-4 news-card-vertical__date"
    >
      {{ $moment(item.modified_on).format('dddd MMMM Do, YYYY') }}
    </h5>
    <p class="w-full mb-4 px-4 navy hidden news-card-vertical__description">
      {{ truncateString(item.article, 120) }}
    </p>

    <nuxt-link
      v-if="item.type === 'ST8 Article'"
      :to="'/regional-news/' + item.url"
      class="w-full uppercase text-xs green bold tracking-widest pb-8 px-4"
      >Read Article
      <link-icon class="ml-2"></link-icon>
    </nuxt-link>
    <a
      v-if="item.type === 'External Article'"
      :href="item.url"
      target="_blank"
      rel="noreferrer"
      class="w-full uppercase text-xs green bold tracking-widest pb-8 px-4"
      >Visit Article Link
      <link-icon class="ml-2"></link-icon>
    </a>
  </div>
</template>
<script>
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    linkIcon,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
    }
  },
  created() {},
  methods: {
    removeTags(str) {
      if (str === null || str === '') return false
      else str = str.toString()
      const strOne = str.replace(/&nbsp;/gi, ' ')
      return strOne.replace(/(<([^>]+)>)/gi, '')
    },
    truncateString(str, num) {
      const newStr = this.removeTags(str)
      if (newStr.length <= num) {
        return newStr
      }
      return newStr.slice(0, num) + '...'
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/components/newsCardVertical';
</style>
