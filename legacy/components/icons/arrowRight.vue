<template>
  <svg
    class="arrow-right-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 22.5"
  >
    <path
      :fill="color"
      d="M21.55,5.09a1.13,1.13,0,0,0-1.62,1.59l8.18,8.18h-27A1.12,1.12,0,0,0,0,16a1.14,1.14,0,0,0,1.13,1.15h27L19.93,25.3a1.17,1.17,0,0,0,0,1.61,1.14,1.14,0,0,0,1.62,0L31.66,16.8a1.12,1.12,0,0,0,0-1.6Z"
      transform="translate(0 -4.75)"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: null,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style lang="postcss" scoped></style>
