<script setup lang="ts">
const props = withDefaults(defineProps<{
  sections: ForecastSection[]
  /** Regional total, left out on the county pages. */
  supplyNeed?: {
    id: string
    heading: string
    intro: string
    total: string
    totalLabel: string
    rows: Array<{ value: string, label: string, detail: string }>
  } | null
  /** Geography prefix passed through to every chart, e.g. '/county/36007'. */
  scope?: string
}>(), { supplyNeed: null, scope: '' })

const activeSection = ref(props.sections[0]!.id)
// Rail geometry, all measured from the beads: where the rail starts and how long it is, and where the lit band sits.
const railTop = ref(0)
const railHeight = ref(0)
const railY = ref(0)
const railReady = ref(false)

const tocLinks = ref<HTMLElement[]>([])
const tocBeads = ref<HTMLElement[]>([])

const navItems = computed(() => {
  const items = props.sections.map(s => ({ id: s.id, heading: s.heading }))
  if (props.supplyNeed) items.push({ id: props.supplyNeed.id, heading: props.supplyNeed.heading })
  return items
})
// Hidden until the first measurement, so it does not flash at the top of the rail.
const railBox = computed(() => (railReady.value ? { top: `${railTop.value}px`, height: `${railHeight.value}px` } : { opacity: 0 }))
const railStyle = computed(() => (railReady.value ? { ...railBox.value, '--rail-y': `${railY.value}px` } : { opacity: 0 }))

// Work out which section the reading line sits in and how far through it we are, then put the lit band at the matching
// point between two beads. Interpolating is what makes the band travel with the scroll instead of jumping link to link.
function updateRail() {
  const links = tocLinks.value
  const beads = tocBeads.value
  if (!links.length || beads.length !== links.length) return

  const readingLine = window.scrollY + 140
  const boxes: Array<{ top: number, height: number }> = []
  for (const item of navItems.value) {
    const el = document.getElementById(item.id)
    if (!el) return
    boxes.push({ top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight || 1 })
  }

  let index = 0
  let within = 0
  if (readingLine >= boxes[boxes.length - 1]!.top) {
    index = boxes.length - 1
    within = 1
  }
  else if (readingLine > boxes[0]!.top) {
    for (let i = 0; i < boxes.length; i++) {
      if (readingLine < boxes[i]!.top) break
      index = i
      within = (readingLine - boxes[i]!.top) / boxes[i]!.height
    }
  }
  within = Math.min(1, Math.max(0, within))

  // Each bead is positioned inside its link, and each link against the list, so the two offsets together give its
  // centre in list coordinates, with no assumptions about line height or padding.
  const centerOf = (i: number) => links[i]!.offsetTop + beads[i]!.offsetTop + beads[i]!.offsetHeight / 2
  const first = centerOf(0)
  const last = centerOf(links.length - 1)
  const from = centerOf(index)
  const to = index + 1 < links.length ? centerOf(index + 1) : from

  railTop.value = first
  railHeight.value = Math.max(0, last - first)
  // `--rail-y` is read inside the rail's own box, so it is relative to the first bead.
  railY.value = from + (to - from) * within - first
  railReady.value = true
  activeSection.value = navItems.value[index]!.id
}

let frame = 0
function queueRailUpdate() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    updateRail()
  })
}

// useEventListener removes its listeners on unmount (and on navigation, which unmounts the page).
useEventListener('scroll', queueRailUpdate, { passive: true })
useEventListener('resize', queueRailUpdate)

let settle: ReturnType<typeof setInterval> | undefined
let settleStop: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  updateRail()
  // The charts resize themselves as they draw, and opening an accordion moves everything below it, so keep
  // remeasuring for a while after the page first settles.
  settle = setInterval(updateRail, 1000)
  settleStop = setTimeout(() => clearInterval(settle), 30000)
})
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  clearInterval(settle)
  clearTimeout(settleStop)
})
</script>

<template>
  <div class="housing-forecast__body">
    <div class="housing-forecast__main">
      <nav class="housing-forecast__contents xl:hidden mb-12" aria-label="On this page">
        <h4 class="uppercase tracking-widest green bold mb-3">On this page</h4>
        <ul class="flex flex-row flex-wrap">
          <li v-for="item in navItems" :key="item.id" class="mr-4 mb-2">
            <a :href="`#${item.id}`" class="uppercase navy">{{ item.heading }}</a>
          </li>
        </ul>
      </nav>

      <section v-for="section in sections" :id="section.id" :key="section.id" class="housing-forecast__section">
        <h2 class="navy uppercase tracking-wider mb-3">{{ section.heading }}</h2>
        <p class="navy mb-8 page-paragraph">{{ section.intro }}</p>

        <HousingCommunityScaleCard
          :card-id="section.card.id"
          :label="section.card.label"
          :initial-height="section.card.height || 400"
          :scope="scope"
          class="mb-6"
        />

        <div v-if="section.more && section.more.length">
          <HousingChartAccordion
            v-for="item in section.more"
            :key="item.id"
            :card-id="item.id"
            :question="item.question"
            :initial-height="item.height || 400"
            :scope="scope"
          />
        </div>
      </section>

      <section v-if="supplyNeed" :id="supplyNeed.id" class="housing-forecast__section housing-forecast__supply">
        <h2 class="navy uppercase tracking-wider mb-3">{{ supplyNeed.heading }}</h2>
        <p class="navy mb-8 page-paragraph">{{ supplyNeed.intro }}</p>
        <dl class="housing-forecast__supply-rows">
          <div v-for="row in supplyNeed.rows" :key="row.label">
            <dt>{{ row.value }}</dt>
            <dd>
              {{ row.label }}
              <span class="housing-forecast__supply-detail">{{ row.detail }}</span>
            </dd>
          </div>
          <div class="housing-forecast__supply-total">
            <dt>{{ supplyNeed.total }}</dt>
            <dd>{{ supplyNeed.totalLabel }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <aside class="housing-forecast__toc hidden xl:block" aria-label="On this page">
      <div class="housing-forecast__toc-inner">
        <h4 class="uppercase tracking-widest green bold mb-4">On this page</h4>
        <ul class="housing-forecast__toc-list">
          <!-- The rail behind the beads: a grey line with a teal band that slides down it as the page scrolls, sitting
               over whichever section is being read. -->
          <span class="housing-forecast__toc-rail" :style="railBox" aria-hidden="true" />
          <span class="housing-forecast__toc-rail-lit" :style="railStyle" aria-hidden="true" />
          <li v-for="item in navItems" :key="item.id">
            <a
              ref="tocLinks"
              :href="`#${item.id}`"
              class="housing-forecast__toc-link"
              :class="{ 'is-active': activeSection === item.id }"
            >
              <span ref="tocBeads" class="housing-forecast__toc-bead" aria-hidden="true" />
              {{ item.heading }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
