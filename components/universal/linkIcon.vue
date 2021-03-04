<template>
  <arrow-right-icon
    :size="size"
    :stroke-width="stroke"
    :class="className"
    class="link-icon"
  ></arrow-right-icon>
</template>
<script>
import { ArrowRightIcon } from 'vue-feather-icons'
export default {
  components: {
    ArrowRightIcon
  },
  props: {
    size: {
      type: String,
      default: '1x'
    },
    stroke: {
      type: String,
      default: '1.5'
    },
    className: {
      type: String,
      default: 'inline-block'
    }
  }
}
</script>
<style lang="scss" scoped>
@import './assets/scss/vars';
.link-icon {
  background: $green;
  border-radius: 50%;
  color: $white;
  stroke: $white;
  padding: 5px;
  width: 30px;
  height: 30px;
  margin-top: -3px;
}
</style>
