<template>
  <div class="housing-forecast__body">
    <div class="housing-forecast__main">
      <nav
        class="housing-forecast__contents xl:hidden mb-12"
        aria-label="On this page"
      >
        <h4 class="uppercase tracking-widest green bold mb-3">On this page</h4>
        <ul class="flex flex-row flex-wrap">
          <li v-for="item in navItems" :key="item.id" class="mr-4 mb-2">
            <a :href="'#' + item.id" class="uppercase navy">{{
              item.heading
            }}</a>
          </li>
        </ul>
      </nav>

      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="housing-forecast__section"
      >
        <h2 class="navy uppercase tracking-wider mb-3">
          {{ section.heading }}
        </h2>
        <p class="navy mb-8 page-paragraph">{{ section.intro }}</p>

        <housing-community-scale-card
          :card-id="section.card.id"
          :label="section.card.label"
          :initial-height="section.card.height || 400"
          :scope="scope"
          class="mb-6"
        />

        <div v-if="section.more && section.more.length">
          <housing-chart-accordion
            v-for="item in section.more"
            :key="item.id"
            :card-id="item.id"
            :question="item.question"
            :initial-height="item.height || 400"
            :scope="scope"
          />
        </div>
      </section>

      <section
        v-if="supplyNeed"
        :id="supplyNeed.id"
        class="housing-forecast__section housing-forecast__supply"
      >
        <h2 class="navy uppercase tracking-wider mb-3">
          {{ supplyNeed.heading }}
        </h2>
        <p class="navy mb-8 page-paragraph">{{ supplyNeed.intro }}</p>
        <dl class="housing-forecast__supply-rows">
          <div v-for="row in supplyNeed.rows" :key="row.label">
            <dt>{{ row.value }}</dt>
            <dd>
              {{ row.label }}
              <span class="housing-forecast__supply-detail">{{
                row.detail
              }}</span>
            </dd>
          </div>
          <div class="housing-forecast__supply-total">
            <dt>{{ supplyNeed.total }}</dt>
            <dd>{{ supplyNeed.totalLabel }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <aside
      class="housing-forecast__toc hidden xl:block"
      aria-label="On this page"
    >
      <div class="housing-forecast__toc-inner">
        <h4 class="uppercase tracking-widest green bold mb-4">On this page</h4>
        <ul ref="tocList" class="housing-forecast__toc-list">
          <!-- The rail behind the beads: a grey line with a teal band that slides down it as
               the page scrolls, sitting over whichever section is being read. -->
          <span
            class="housing-forecast__toc-rail"
            :style="railBox"
            aria-hidden="true"
          />
          <span
            class="housing-forecast__toc-rail-lit"
            :style="railStyle"
            aria-hidden="true"
          />
          <li v-for="item in navItems" :key="item.id">
            <a
              ref="tocLinks"
              :href="'#' + item.id"
              class="housing-forecast__toc-link"
              :class="{ 'is-active': activeSection === item.id }"
            >
              <span
                ref="tocBeads"
                class="housing-forecast__toc-bead"
                aria-hidden="true"
              />
              {{ item.heading }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script>
import housingCommunityScaleCard from '~/components/housing/communityScaleCard'
import housingChartAccordion from '~/components/housing/chartAccordion'

export default {
  components: {
    housingCommunityScaleCard,
    housingChartAccordion,
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
    // Regional total, left out on the county pages.
    supplyNeed: {
      type: Object,
      default: null,
    },
    // Geography prefix passed through to every chart, e.g. '/county/36007'.
    scope: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeSection: this.sections[0].id,
      // Rail geometry, all measured from the beads: where the rail starts and how long it is,
      // and where the lit band sits within it.
      railTop: 0,
      railHeight: 0,
      railY: 0,
      railReady: false,
      rafId: null,
    }
  },
  computed: {
    navItems() {
      const items = this.sections.map((s) => ({
        id: s.id,
        heading: s.heading,
      }))
      if (this.supplyNeed) {
        items.push({ id: this.supplyNeed.id, heading: this.supplyNeed.heading })
      }
      return items
    },
    railBox() {
      if (!this.railReady) return { opacity: 0 }
      return { top: this.railTop + 'px', height: this.railHeight + 'px' }
    },
    railStyle() {
      // Hidden until the first measurement, so it does not flash at the top of the rail.
      if (!this.railReady) return { opacity: 0 }
      return { ...this.railBox, '--rail-y': this.railY + 'px' }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.queueRailUpdate, { passive: true })
    window.addEventListener('resize', this.queueRailUpdate)
    this.updateRail()
    // The charts resize themselves as they draw, and opening an accordion moves everything
    // below it, so keep remeasuring for a while after the page first settles.
    this.railSettle = setInterval(this.updateRail, 1000)
    this.railSettleStop = setTimeout(
      () => clearInterval(this.railSettle),
      30000
    )
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.queueRailUpdate)
    window.removeEventListener('resize', this.queueRailUpdate)
    if (this.rafId) cancelAnimationFrame(this.rafId)
    clearInterval(this.railSettle)
    clearTimeout(this.railSettleStop)
  },
  methods: {
    queueRailUpdate() {
      if (this.rafId) return
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null
        this.updateRail()
      })
    },
    // Work out which section the reading line sits in and how far through it we are, then put
    // the lit band at the matching point between two beads. Interpolating rather than snapping
    // is what makes the band travel with the scroll instead of jumping from link to link.
    updateRail() {
      const links = this.$refs.tocLinks
      if (!links || !links.length) return

      const readingLine = window.scrollY + 140
      const boxes = []
      for (const item of this.navItems) {
        const el = document.getElementById(item.id)
        if (!el) return
        boxes.push({
          top: el.getBoundingClientRect().top + window.scrollY,
          height: el.offsetHeight || 1,
        })
      }

      let index = 0
      let within = 0
      if (readingLine >= boxes[boxes.length - 1].top) {
        index = boxes.length - 1
        within = 1
      } else if (readingLine > boxes[0].top) {
        for (let i = 0; i < boxes.length; i++) {
          if (readingLine < boxes[i].top) break
          index = i
          within = (readingLine - boxes[i].top) / boxes[i].height
        }
      }
      within = Math.min(1, Math.max(0, within))

      // Measure the beads themselves. Each bead is positioned inside its link, and each link
      // is positioned against the list, so the two offsets together give its centre in list
      // coordinates — no assumptions about line height or padding.
      const beads = this.$refs.tocBeads
      if (!beads || beads.length !== links.length) return
      const centerOf = (i) =>
        links[i].offsetTop + beads[i].offsetTop + beads[i].offsetHeight / 2

      const first = centerOf(0)
      const last = centerOf(links.length - 1)
      const from = centerOf(index)
      const to = index + 1 < links.length ? centerOf(index + 1) : from

      // The rail spans bead to bead, so it never overshoots the last dot.
      this.railTop = first
      this.railHeight = Math.max(0, last - first)
      // `--rail-y` is read inside the rail's own box, so it is relative to the first bead.
      this.railY = from + (to - from) * within - first
      this.railReady = true
      this.activeSection = this.navItems[index].id
    },
  },
}
</script>
