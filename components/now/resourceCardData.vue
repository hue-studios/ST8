<template>
  <a
    :id="'resource-card-data-' + item.id"
    class="flex items-center justify-center flex-col px-4 cursor-pointer resource-card-data"
    @click.prevent="resourceAction"
  >
    <div
      class="flex items-center justify-center flex-col resource-card-data__container"
    >
      <h2
        class="uppercase tracking-wider w-full thin-font resource-card-data__title"
      >
        {{ item.title }}
      </h2>
      <h3 v-if="program" class="uppercase py-2 resource-card-data__program">
        <span class="">Program: </span>{{ program }}
      </h3>
      <div
        v-if="item.description"
        class="w-full pt-4 pb-3 resource-card-data__description"
        :class="{ addBorder: item.description }"
      >
        <p>{{ item.description }}</p>
      </div>
      <h5
        class="w-full uppercase text-xs green bold tracking-widest resource-card-data__link"
      >
        <span v-if="item.type === 'Internal File / PDF' && item.file"
          >View Document</span
        ><span v-else-if="item.type === 'External Link'">Go to Resource</span>
        <link-icon></link-icon>
      </h5>
      <!-- <h5
        v-if="item.type === 'Internal File / PDF' && item.file"
        :href="imageLocation + item.file.private_hash"
        class="w-full uppercase text-xs green bold tracking-widest resource-card-data__link"
        target="_blank"
        >View File
        <link-icon></link-icon>
      </h5>
      <a
        v-if="item.type === 'External Link'"
        :href="item.link"
        target="_blank"
        rel="noreferrer"
        class="w-full uppercase text-xs green bold tracking-widest resource-card-data__link"
        >Go to Resource
        <link-icon></link-icon>
      </a> -->
    </div>
  </a>
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
      program: '',
      link: '',
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
    resourceAction() {
      if (this.item.type === 'Internal File / PDF' && this.item.file) {
        if (this.item.require_info) {
          this.$store.commit('UPDATE_RESOURCE', {
            title: this.item.title,
            link: process.env.imageUrl + this.item.file.private_hash,
            resource: this.item.id,
          })
          this.$store.commit('UPDATE_RESOURCE_INFO', true)
        } else {
          window.open(
            process.env.imageUrl + this.item.file.private_hash,
            '_blank'
          )
        }
      } else if (this.item.type === 'External Link') {
        window.open(this.item.link, '_blank')
      }
    },
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

.resource-card-data {
  color: $navy;
  border-radius: 0px;
  background: $white;
  width: 100%;

  position: relative;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0);
  transition: all 0.25s $curve;
  @apply pt-6 pb-4;
  @media (min-width: $breakpoint-small) {
  }
  @media (min-width: $breakpoint-medium) {
  }
  .resource-card-data__container {
    width: 100%;
    max-width: 600px;
  }
  .resource-card-data__program {
    font-size: 9px;
    line-height: 10px;

    font-family: $bold-font;
    color: $green;
    @apply w-full;
    @media (min-width: $breakpoint-small) {
      // top: auto;
      // bottom: 1rem;
    }
    @media (min-width: $breakpoint-medium) {
    }
    span {
      color: $darkGrey;
      display: block;
    }
  }
  .resource-card-data__title {
    font-size: 16px;
    line-height: 20px;
    transition: all 0.25s $curve 0s;
    font-family: $bold-font;
    @media (min-width: $breakpoint-small) {
    }
    @media (min-width: $breakpoint-medium) {
      font-size: 18px;
    }
    @media (min-width: $breakpoint-large) {
      font-size: 22px;
      line-height: 22px;
    }
  }
  .resource-card-data__program {
    transition: all 0.25s $curve 0.01s;
  }
  .resource-card-data__description {
    transition: all 0.25s $curve 0.02s;

    p {
      font-size: 13px;
      @media (min-width: $breakpoint-small) {
      }
      @media (min-width: $breakpoint-medium) {
      }
    }
  }
  .resource-card-data__link {
    min-height: 30px;
    transition: all 0.25s $curve 0.03s;
    .link-icon {
      background: none;
      color: $green;
      stroke: $green;
      margin-left: 0px;
    }
  }
  .resource-card-data__description.addBorder {
    border-top: thin solid $navy;
  }
  a {
    font-size: 10px;
  }
}
.resource-card-data:hover {
  z-index: 10;

  @media (min-width: $breakpoint-medium) {
    // box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
    // transform: scale(1.05);
  }
  .resource-card-data__title {
    transform: translateX(10px);
  }
  .resource-card-data__program {
    transform: translateX(13px);
  }
  .resource-card-data__description {
    transform: translateX(16px);
  }

  .resource-card-data__link {
    transform: translateX(19px);
  }
}
// .resource-card.blue {
//   border: thin solid rgba($grey, 0.2);
//   background: $navy;
//   color: $white;
//   .resource-card-data__description.addBorder {
//     border-top: thin solid $white;
//   }
// }
</style>
