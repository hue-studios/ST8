<template>
  <svg
    class="checkmark-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 13.65 11.98"
  >
    <title>check-mark</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1_copy" data-name="Layer 1 copy">
        <polygon
          v-if="box"
          :stroke="colorOne"
          points="0.25 1.52 0.25 11.73 10.45 11.73 10.45 5.13 10.45 1.93 10.45 1.52 0.25 1.52"
        />
        <path
          :fill="colorTwo"
          :stroke="colorOne"
          class="cls-2"
          d="M12.65,1A21.29,21.29,0,0,0,5.59,8.67a.19.19,0,0,1-.28,0,.19.19,0,0,1,0-.28"
        />
        <path
          :fill="colorTwo"
          :stroke="colorOne"
          d="M5.45,8.73a.2.2,0,0,1-.14-.06L2.55,5.91a.21.21,0,0,1,0-.28.21.21,0,0,1,.29,0L5.59,8.39a.19.19,0,0,1,0,.28A.2.2,0,0,1,5.45,8.73Z"
        />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    colorOne: {
      type: String,
      default: null,
    },
    colorTwo: {
      type: String,
      default: null,
    },
    box: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style lang="postcss" scoped>
.checkmark-1 {
  fill: var(--white);
}
</style>
