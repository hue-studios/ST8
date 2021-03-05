<template>
  <div
    :id="'resource-card-' + item.id"
    class="flex items-center justify-center flex-col py-12 shadow-lg resource-card"
  >
    <h2
      class="uppercase tracking-widest w-full mb-4 px-4 md:px-6 resource-card__title"
      :class="{ 'text-xs': tooLong }"
    >
      {{ item.title }}
    </h2>

    <a
      v-if="item.type === 'Internal File / PDF' && item.file"
      :href="imageLocation + item.file.private_hash"
      class="w-full uppercase text-xs green bold tracking-widest px-4 md:px-6 resource-card__link"
      target="_blank"
      >View File
      <link-icon class="ml-2"></link-icon>
    </a>
    <a
      v-if="item.type === 'External Link'"
      :href="item.link"
      target="_blank"
      rel="noreferrer"
      class="w-full uppercase text-xs green bold tracking-widest px-4 md:px-6 resource-card__link"
      >Go to Resource
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
      tooLong: false,
    }
  },
  created() {
    this.countTitle(this.item.title)
  },
  methods: {
    countTitle(title) {
      if (title.length > 30) {
        this.tooLong = true
      } else {
        this.tooLong = false
      }
    },
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
@import './assets/scss/components/resourceCardVertical';
</style>
