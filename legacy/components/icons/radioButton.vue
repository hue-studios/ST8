<template>
  <svg
    class="radio-button-icon"
    data-name="Capa 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 510 510"
  >
    <path
      d="M255,54A201,201,0,0,1,397.13,397.13,201,201,0,0,1,112.87,112.87,199.71,199.71,0,0,1,255,54m0-54C114.17,0,0,114.17,0,255S114.17,510,255,510,510,395.83,510,255,395.83,0,255,0Z"
      :stroke="color"
      :fill="color"
    />
    <circle cx="255" cy="255" r="139.08" :fill="color" />
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
}
</script>
<style lang="postcss" scoped></style>
