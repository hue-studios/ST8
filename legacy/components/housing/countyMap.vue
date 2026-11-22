<template>
  <div class="county-map">
    <svg
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      role="group"
      aria-label="Housing data by county"
    >
      <!-- New York State behind the region, on the same coordinate system, so the counties sit
           where they really are within it. -->
      <path
        :d="nyOutline"
        :transform="nyTransform"
        class="county-map__state"
        vector-effect="non-scaling-stroke"
      />
      <a
        v-for="county in shapes"
        :key="county.geoid"
        :href="county.href"
        class="county-map__county"
        :class="{ 'is-current': county.geoid === currentGeoid }"
        @click="go($event, county)"
      >
        <title>{{ county.label }} County housing data</title>
        <path :d="county.d" class="county-map__shape" />
        <text
          :x="county.labelX"
          :y="county.labelY"
          class="county-map__label"
          text-anchor="middle"
        >
          {{ county.label }}
        </text>
      </a>
    </svg>
  </div>
</template>

<script>
import { COUNTY_SHAPES, COUNTY_MAP_VIEWBOX } from '~/config/counties'
import { NY_OUTLINE, NY_TRANSFORM } from '~/config/newYorkOutline'

export default {
  props: {
    // Rows from the Directus `counties` collection: { title, url, geoid }. A shape is matched
    // to its row on geoid, so the CMS supplies the name and the route.
    counties: {
      type: Array,
      default: () => [],
    },
    // Geoid of the county whose page we are already on, so it can be marked.
    currentGeoid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      viewBox: COUNTY_MAP_VIEWBOX,
      nyOutline: NY_OUTLINE,
      nyTransform: NY_TRANSFORM,
    }
  },
  computed: {
    shapes() {
      return COUNTY_SHAPES.map((shape) => {
        const row = this.counties.find((c) => c.geoid === shape.geoid)
        return {
          ...shape,
          label: row ? row.title : shape.name,
          // Without a CMS row there is nowhere to send people, so the shape still draws but
          // does not pretend to be a link.
          href: row ? '/regional-housing-forecast/' + row.url : null,
        }
      })
    },
  },
  methods: {
    // A real href keeps the shapes crawlable and lets people open a county in a new tab; this
    // only takes over the plain left click, which the router can handle without a page load.
    go(event, county) {
      if (!county.href) {
        event.preventDefault()
        return
      }
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
      if (county.geoid !== this.currentGeoid) this.$router.push(county.href)
    },
  },
}
</script>
