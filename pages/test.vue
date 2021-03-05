<template>
  <div id="program" class="flex flex-col justify-center items-center relative">
    <section id="program__story">
      <!-- <svg id="mySVG">
        <path
          id="triangle"
          fill="none"
          stroke="red"
          stroke-width="3"
          d="M150 0 L75 200 L225 200 Z"
        />
        Sorry, your browser does not support inline SVG.
      </svg> -->
      <svg
        id="straightLineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 695.51"
      >
        <path
          id="straight-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M.5,0V695.51"
        />
      </svg>
    </section>

    <section id="some-space">some space here</section>
  </div>
</template>

<script>
export default {
  components: {},
  // async asyncData({ params, $axios }) {
  //   const [programReq] = await Promise.all([
  //     $axios.$get('/items/programs/4?fields=*.*.*.*.*')
  //   ])
  //   return {
  //     program: programReq.data,
  //     news: programReq.data.news,
  //     resources: programReq.data.resources
  //   }
  // },

  data() {
    return {}
  },
  head() {},
  mounted() {
    const straightLine = document.getElementById('straight-line')
    const length = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = length
    straightLine.style.strokeDashoffset = length
    window.addEventListener('scroll', straightLineFunction)
    function straightLineFunction() {
      requestAnimationFrame(function () {
        const svgContainer = document.getElementById('program__story')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 2
        if (scrollPercent < 1) {
          const draw = length * scrollPercent
          straightLine.style.strokeDashoffset = length - draw
        }
      })
    }
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
@import './assets/scss/vars';
@import './assets/scss/pages/program';
section {
  height: 1000px;
}

#straightLineSVG {
  position: sticky;
  top: 0%;
  width: 2px;
  height: 1000px;
}

#some-space {
  background: pink;
  color: #ffffff;
}
</style>
