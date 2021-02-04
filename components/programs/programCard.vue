<template>
  <div id="program-card" class="flex items-center justify-center flex-col p-8">
    <h2 class="uppercase tracking-widest w-full mb-4 progam-card__title">
      {{ program.title }}
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
    <p class="w-full mt-4 navy progam-card__description">
      {{ truncateString(program.what_is_it, 220) }}
    </p>
    <nuxt-link
      :to="'/economic-development-programs/' + program.url"
      class="mt-6 w-full uppercase text-xs green bold tracking-widest"
      >Program Details
      <arrow-right-icon
        size="2.2x"
        stroke-width="2"
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
  created() {
    if (this.program.initiatives.length > 0) {
      console.log(this.program.initiatives)
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
