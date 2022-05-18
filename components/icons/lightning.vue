<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <path
      :fill="colorOne"
      d="M13.504 31.832l12.343-21.253c0.279-0.481-0.117-1.073-0.668-0.998l-8.21 1.116 1.962-10.299c0.066-0.347-0.381-0.546-0.595-0.264l-12.136 16.019c-0.354 0.467 0.021 1.13 0.603 1.069l9.052-0.953-2.967 15.332c-0.072 0.37 0.428 0.557 0.617 0.231z"
    ></path>
    <path
      :fill="colorTwo"
      d="M9.994 15.018c-0.227 0.018-0.377-0.23-0.257-0.422l9.074-14.518c-0.135-0.107-0.348-0.114-0.476 0.056l-12.136 16.019c-0.354 0.467 0.021 1.13 0.603 1.069l9.052-0.953-2.967 15.332c-0.040 0.207 0.1 0.352 0.263 0.387l5.085-16.090c0.238-0.754-0.363-1.51-1.151-1.447l-7.088 0.567z"
    ></path>
  </svg>
</template>

<script>
export default {
  props: {
    colorOne: {
      type: String,
      default: '#ffdc64',
    },
    colorTwo: {
      type: String,
      default: '#ffc850',
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
