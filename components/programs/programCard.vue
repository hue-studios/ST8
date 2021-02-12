<template>
  <div
    :id="'program-card-' + program.id"
    class="w-full relative flex items-center justify-center flex-row mb-8 program-card"
    :data-initiatives="programInitiatives"
  >
    <div class="w-full h-full absolute program-card__background"></div>
    <div
      v-if="program.images.length > 0"
      class="progam-card__image"
      :style="
        'background-image: url(' +
          imageLocation +
          program.images[0].file_id.private_hash +
          '?key=small)'
      "
    ></div>
    <div v-else class="progam-card__image" style=""></div>
    <div class="flex flex-col items-start justify-center program-card__content">
      <h2 class="uppercase w-full mb-1 md:mb-4 progam-card__title">
        {{ truncateString(program.title, 65) }}
      </h2>
      <div
        class="w-full flex flex-row items-start justify-start text-xs progam-card__tags"
      >
        <h5 v-if="program.initiatives.length > 0" class="uppercase navy">
          {{ program.initiatives.length }}
          <span class="green"
            >Initiative<span v-if="program.initiatives.length > 1">s</span>
          </span>
        </h5>
        <span v-if="program.counties.length > 0" class="ml-1 mr-1">/</span>
        <h5 v-if="program.counties.length > 0" class="uppercase navy">
          {{ program.counties.length }}
          <span class="green"
            >Count<span v-if="program.counties.length > 1">ies</span
            ><span v-else>y</span>
          </span>
        </h5>
        <span
          v-if="program.counties.length > 0 && program.partners.length > 0"
          class="ml-1 mr-1"
          >/</span
        >
        <h5 v-if="program.partners.length > 0" class="uppercase navy ">
          {{ program.partners.length }}
          <span class="green"
            >Partner<span v-if="program.partners.length > 1">s</span>
          </span>
        </h5>
      </div>
      <p
        class="w-full mt-4 navy hidden md:inline-block progam-card__description"
      >
        {{ truncateString(program.what_is_it, 120) }}
      </p>
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
@import './assets/scss/components/programCard';
</style>
