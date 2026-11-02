<template>
  <div class="county-programs">
    <h4 class="uppercase tracking-widest green bold mb-3">
      ST8 programs serving {{ countyName }}
    </h4>

    <!-- One list, read two ways: a capped column beside the map on large screens, and a
         horizontal swipe of cards below it on smaller ones, where a column this long would
         push the charts off the page. -->
    <ul class="county-programs__list">
      <li v-for="item in shown" :key="item.url" class="county-programs__item">
        <nuxt-link :to="'/economic-development-programs/' + item.url">{{
          item.title
        }}</nuxt-link>
      </li>
    </ul>

    <button
      v-if="programs.length > cap"
      type="button"
      class="county-programs__more uppercase tracking-widest"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show fewer' : 'Show all ' + programs.length }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    programs: {
      type: Array,
      required: true,
    },
    countyName: {
      type: String,
      required: true,
    },
    // How many to show in the column before the toggle takes over.
    cap: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      expanded: false,
      // The cap is a large-screen idea; the carousel scrolls, so it shows everything.
      isWide: false,
    }
  },
  computed: {
    shown() {
      if (!this.isWide || this.expanded) return this.programs
      return this.programs.slice(0, this.cap)
    },
  },
  mounted() {
    this.query = window.matchMedia('(min-width: 1024px)')
    this.onChange = (e) => {
      this.isWide = e.matches
    }
    this.isWide = this.query.matches
    // Safari below 14 only has the deprecated listener API.
    if (this.query.addEventListener) {
      this.query.addEventListener('change', this.onChange)
    } else {
      this.query.addListener(this.onChange)
    }
  },
  beforeDestroy() {
    if (!this.query) return
    if (this.query.removeEventListener) {
      this.query.removeEventListener('change', this.onChange)
    } else {
      this.query.removeListener(this.onChange)
    }
  },
}
</script>
