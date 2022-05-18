<template>
  <svg
    class="error-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      :fill="backgroundOne"
      d="M355.83,512H156.18a15,15,0,0,1-10.61-4.39L4.39,366.43A15,15,0,0,1,0,355.83V156.18a15,15,0,0,1,4.39-10.61L145.57,4.39A15,15,0,0,1,156.18,0H355.83a15,15,0,0,1,10.6,4.39L507.61,145.57A15,15,0,0,1,512,156.18V355.83a15,15,0,0,1-4.39,10.6L366.43,507.61A15,15,0,0,1,355.83,512Z"
      transform="translate(0 0)"
    />
    <path
      :fill="backgroundTwo"
      d="M355.83,512a15,15,0,0,0,10.6-4.39L507.61,366.43A15,15,0,0,0,512,355.82V156.17a15,15,0,0,0-4.39-10.6L366.43,4.39A15,15,0,0,0,355.83,0H256V512Z"
      transform="translate(0 0)"
    />
    <path
      :fill="foregroundOne"
      d="M285.43,317.45H226.57a11,11,0,0,1-11-10.53L206,93.37a22.06,22.06,0,0,1,22-23h55.88a22.06,22.06,0,0,1,22,23l-9.53,213.55A11,11,0,0,1,285.43,317.45Z"
      transform="translate(0 0)"
    />
    <path
      :fill="foregroundOne"
      d="M256,441.67a40,40,0,1,1,40-40A40,40,0,0,1,256,441.67Z"
      transform="translate(0 0)"
    />
    <path
      :fill="foregroundTwo"
      d="M256,361.72v79.95a40,40,0,0,0,40-40h0A40,40,0,0,0,256,361.72Z"
      transform="translate(0 0)"
    />
    <path
      :fill="foregroundTwo"
      d="M283.94,70.33H256V317.45h29.43a11,11,0,0,0,11-10.53L306,93.37A22.06,22.06,0,0,0,283.94,70.33Z"
      transform="translate(0 0)"
    />
  </svg>
</template>

<script>
export default {
  props: {
    backgroundOne: {
      type: String,
      default: null,
    },
    backgroundTwo: {
      type: String,
      default: null,
    },
    foregroundOne: {
      type: String,
      default: null,
    },
    foregroundTwo: {
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
