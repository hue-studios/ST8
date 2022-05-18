<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 40 39.8"
  >
    <defs>
      <style>
        .cls-1 {
          fill: url(#linear-gradient);
        }
        .cls-2 {
          fill: url(#linear-gradient-2);
        }
      </style>
      <linearGradient
        id="linear-gradient"
        x1="74.63"
        y1="334.04"
        x2="74.63"
        y2="376.74"
        gradientTransform="translate(-55.58 -333.83)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00efd1" />
        <stop offset="1" stop-color="#00acea" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-2"
        x1="81.07"
        y1="334.04"
        x2="81.07"
        y2="376.74"
        xlink:href="#linear-gradient"
      />
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          class="cls-1"
          d="M36.92,25a1,1,0,0,0-1,1v8.85a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3v-26a3,3,0,0,1,3-3h8.85a1,1,0,0,0,0-2H5a5,5,0,0,0-5,5v26a5,5,0,0,0,5,5h28a5,5,0,0,0,5-5V26A1,1,0,0,0,36.92,25Z"
        />
        <path
          class="cls-2"
          d="M37.52,1.31a4.48,4.48,0,0,0-6.34,0L13.41,19.09a1.06,1.06,0,0,0-.26.43L10.81,28a1,1,0,0,0,.26,1,1,1,0,0,0,1,.26l8.44-2.34a1,1,0,0,0,.44-.25L38.69,8.82a4.48,4.48,0,0,0,0-6.34ZM15.58,19.73,30.12,5.19l4.69,4.69L20.27,24.42Zm-.94,1.88,3.75,3.75L13.2,26.8ZM37.28,7.41,36.22,8.47,31.53,3.78l1.06-1.06a2.49,2.49,0,0,1,3.52,0l1.17,1.17A2.49,2.49,0,0,1,37.28,7.41Z"
        />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    colors: {
      type: Object,
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
