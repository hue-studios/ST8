<template>
  <div
    :id="'resource-card-' + item.id"
    class="flex items-center justify-center flex-col px-4 md:px-6 py-6 shadow-lg h-full resource-card"
  >
    <h3 v-if="program" class="uppercase absolute resource-card__program">
      <span class="">Program: </span>{{ truncateString(program, 60) }}
    </h3>
    <h2
      class="uppercase tracking-widest w-full mt-6 md:mt-6 pb-4 thin-font resource-card__title"
      :class="{ long: tooLong }"
    >
      {{ item.title }}
    </h2>
    <div
      class="w-full pt-4 resource-card__description"
      :class="{ addBorder: item.description }"
    >
      <p>{{ item.description }}</p>
    </div>

    <a
      v-if="item.type === 'Internal File / PDF' && item.file"
      :href="imageLocation + item.file.private_hash"
      class="w-full uppercase text-xs green bold tracking-widest text-right resource-card__link"
      target="_blank"
      >View File
      <link-icon class="ml-2"></link-icon>
    </a>
    <a
      v-if="item.type === 'External Link'"
      :href="item.link"
      target="_blank"
      rel="noreferrer"
      class="w-full uppercase text-xs green bold tracking-widest text-right resource-card__link"
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
  props: ['item'],
  data() {
    return {
      imageLocation: process.env.imageUrl,
      tooLong: false,
      program: '',
    }
  },
  computed: {
    // program() {
    //   const vm = this
    //   if (vm.item.programs) {
    //     return vm.item.programs(function (program) {
    //       return program.programs_id.title
    //     })
    //   } else {
    //     return ''
    //   }
    // },
  },
  created() {
    this.countTitle(this.item.title)
    if (this.item.programs) {
      this.programName(this.item.programs)
    }
  },
  methods: {
    programName(programs) {
      if (programs.length) {
        // console.log(programs[0].programs_id.title)
        this.program = programs[0].programs_id.title
      }
    },
    countTitle(title) {
      if (title.length > 30 && this.item.description) {
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

@import './assets/scss/components/resourceCard';
</style>
