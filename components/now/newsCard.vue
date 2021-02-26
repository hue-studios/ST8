<template>
  <div
    :id="'news-card-' + item.id"
    class="w-full flex items-center justify-start flex-row mb-6 md:mb-10 relative news-card"
  >
    <div
      v-if="item.cover_image"
      class="w-full news-card__image"
      :style="
        'background-image: url(' +
          imageLocation +
          item.cover_image.private_hash +
          ')'
      "
    ></div>
    <div
      v-else
      class="w-full news-card__image"
      :style="'background-image: url(' + imageLocation + '1avcl3u0gukko40g)'"
    ></div>
    <div
      class="w-full flex flex-col items-start justify-center news-card__content"
    >
      <h2
        class="uppercase tracking-widest w-full mb-2 sm:mb-4 news-card__title"
      >
        {{ truncateString(item.title, 65) }}
      </h2>

      <h5
        v-if="item.date_published"
        class="w-full uppercase navy tracking-widest sm:mb-4 news-card__date"
      >
        {{ $moment(item.date_published).format('dddd MMMM Do, YYYY') }}
      </h5>
      <h5
        v-else
        class="w-full uppercase navy tracking-widest mb-4 news-card__date"
      >
        {{ $moment(item.modified_on).format('dddd MMMM Do, YYYY') }}
      </h5>
      <div
        v-if="item.tags.length > 0"
        class="w-full flex flex-row items-start justify-start text-xs mb-4 news-card__tags"
      >
        <h5
          v-for="(tag, index) in item.tags"
          :key="index"
          class="uppercase white mr-2 inline-block"
        >
          {{ tag }}
        </h5>
      </div>
      <p class="w-full px-4 navy news-card__description">
        {{ truncateString(item.article, 120) }}
      </p>
    </div>

    <nuxt-link
      v-if="item.type === 'ST8 Article'"
      :to="'/regional-news/' + item.url"
      class="flex items-center justify-center news-card__link"
    >
      <arrow-right-icon
        size="2.2x"
        stroke-width="2"
        class="inline-block"
      ></arrow-right-icon>
    </nuxt-link>
    <a
      v-if="item.type === 'External Article'"
      :href="item.url"
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-center news-card__link"
    >
      <arrow-right-icon
        size="2.2x"
        stroke-width="2"
        class="inline-block"
      ></arrow-right-icon>
    </a>
  </div>
</template>
<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl
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
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/components/newsCard';
</style>
