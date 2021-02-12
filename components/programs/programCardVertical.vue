<template>
  <div
    :id="'program-card-vertical' + program.id"
    class="w-full flex flex-col items-center justify-center program-card-vertical"
    :data-initiatives="programInitiatives"
  >
    <div
      v-if="program.images.length > 0"
      class="progam-card-vertical__image"
      :style="
        'background-image: url(' +
          imageLocation +
          program.images[0].file_id.private_hash +
          '?key=small)'
      "
    ></div>
    <div v-else class="progam-card-vertical__image" style=""></div>
    <div class="progam-card-vertical__content">
      <h3 class="progam-card-vertical__title">{{ program.title }}</h3>
    </div>
    <nuxt-link
      :to="'/economic-development-programs/' + program.url"
      class="flex items-center justify-center progam-card__link"
    >
      <arrow-right-icon
        size="2.2x"
        stroke-width="1.5"
        class="inline-block"
      ></arrow-right-icon>
    </nuxt-link>
  </div>
</template>
<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  props: {
    program: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      programInitiatives: [],
      imageLocation: process.env.imageUrl
    }
  },
  created() {
    const app = this
    if (this.program.initiatives.length > 0) {
      console.log(this.program.initiatives)
      this.program.initiatives.map((initiative) => {
        return app.programInitiatives.push(initiative.initiative_id.title)
      })
    }
  },
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
@import './assets/scss/components/programCardVertical';
</style>
