<template>
  <svg
    :id="iconID"
    :class="className"
    expanded="true"
    height="41px"
    width="41px"
  >
    <circle fill="#1accb8" cx="50%" cy="50%" r="7px"></circle>
    <circle class="pulse" cx="50%" cy="50%" r="10px"></circle>
    <circle class="pulse2" cx="50%" cy="50%" r="10px"></circle>
  </svg>
</template>
<script>
export default {
  props: {
    iconID: {
      type: String,
      default: null,
    },
    className: {
      type: String,
      default: 'inline-block',
    },
  },
}
</script>
<style lang="scss" scoped>
@import './assets/scss/vars';
circle {
  stroke: $green;
  stroke-width: 2px;
  stroke-opacity: 1;
}

.pulse {
  stroke: rgba($navy, 0.25);
  fill: white;
  fill-opacity: 0;
  transform-origin: 50% 50%;
  animation-duration: 2s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

.pulse2 {
  stroke: rgba($green, 0.75);
  fill: white;
  fill-opacity: 0;
  transform-origin: 50% 50%;
  animation-duration: 2s;
  animation-name: pulse2;
  animation-delay: 0.75s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
}

@keyframes pulse {
  from {
    stroke-width: 3px;
    stroke-opacity: 1;
    transform: scale(0.3);
  }
  to {
    stroke-width: 0;
    stroke-opacity: 0;
    transform: scale(2);
  }
}
@keyframes pulse2 {
  from {
    stroke-width: 3px;
    stroke-opacity: 1;
    transform: scale(0.3);
  }
  to {
    stroke-width: 0;
    stroke-opacity: 0;
    transform: scale(2);
  }
}
</style>
