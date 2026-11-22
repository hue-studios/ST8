<script lang="ts">
// Letting every card on the page start at once makes CommunityScale's API drop requests, and a dropped request leaves
// an empty frame with no error to react to: scrolling the page quickly was enough to blank out the last third of it.
// Cards queue for one of a few slots instead and give the slot back once they have drawn. The queue is browser-only
// (cards only enqueue after mount), so module state is never shared between server requests.
const MAX_CONCURRENT_LOADS = 2
let activeLoads = 0
const waiting: Array<() => void> = []

function drainQueue() {
  while (activeLoads < MAX_CONCURRENT_LOADS && waiting.length) {
    activeLoads++
    waiting.shift()!()
  }
}
function takeSlot(start: () => void) {
  waiting.push(start)
  drainQueue()
}
function releaseSlot() {
  activeLoads = Math.max(0, activeLoads - 1)
  drainQueue()
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  cardId: string
  label?: string
  /** Starting height. The card reports its real height once it has drawn itself. */
  initialHeight?: number
  /** Geography prefix, e.g. '/county/36007'. Empty means the regional dashboard. */
  scope?: string
}>(), { label: 'Housing forecast chart', initialHeight: 400, scope: '' })

const emit = defineEmits<{ nodata: [cardId: string] }>()

// Long enough for a slow chart, short enough that one stuck frame does not stall the rest.
const SLOT_TIMEOUT = 8000
// When to re-measure after a frame loads, until it reports a height of its own.
const REMEASURE_DELAYS = [400, 1500, 3500, 7000]
// A card that has loaded but reported no height by now never drew: its API call was dropped.
const RENDER_WATCHDOG = 11000
const MAX_ATTEMPTS = 3

const frame = ref<HTMLIFrameElement | null>(null)
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const loaded = ref(false)
const empty = ref(false)
const height = ref(props.initialHeight)
const tooltip = ref({ show: false, html: '', x: 0, y: 0 })
const nudge = ref(false)
const frameKey = ref(0)
const src = computed(() => `${CS_ORIGIN}${props.scope}/cards/${props.cardId}`)

let observer: IntersectionObserver | null = null
let timers: ReturnType<typeof setTimeout>[] = []
let holdsSlot = false
let attempts = 0
let gotHeight = false

function start() {
  holdsSlot = true
  visible.value = true
  // Do not let a frame that never fires `load` hold its slot indefinitely.
  timers.push(setTimeout(freeSlot, SLOT_TIMEOUT))
}
function freeSlot() {
  if (!holdsSlot) return
  holdsSlot = false
  releaseSlot()
}
function scheduleRemeasure() {
  REMEASURE_DELAYS.forEach((delay) => {
    timers.push(setTimeout(() => {
      if (gotHeight) return
      nudge.value = true
      timers.push(setTimeout(() => { nudge.value = false }, 250))
    }, delay))
  })
}
function giveUpOrRetry() {
  if (attempts >= MAX_ATTEMPTS) {
    empty.value = true
    emit('nodata', props.cardId)
    return
  }
  reload()
}
function reload() {
  attempts++
  loaded.value = false
  visible.value = false
  gotHeight = false
  frameKey.value++
  // Back to the end of the queue so the retry does not pile onto the current batch.
  nextTick(() => takeSlot(start))
}
function onLoad() {
  loaded.value = true
  // The slot is deliberately not freed here: `load` only means the frame's document arrived. It is freed when the chart
  // reports a height, the first sign it actually drew something.
  //
  // A card posts its height once, 100ms after it draws, and `load` fires well before that. Miss the message and the
  // frame keeps `initialHeight` forever, so change the frame's width by a pixel and back to make it post again.
  scheduleRemeasure()
  timers.push(setTimeout(() => {
    if (gotHeight || empty.value) return
    giveUpOrRetry()
  }, RENDER_WATCHDOG))
}
// Charts delegate their tooltips to the parent so they can overflow the iframe. The markup comes from CommunityScale and
// is only rendered after the message is confirmed to come from their origin and from this card's own frame.
function onMessage(event: MessageEvent) {
  if (event.origin !== CS_ORIGIN) return
  if (!frame.value || event.source !== frame.value.contentWindow) return
  const data = event.data
  if (!data || typeof data !== 'object') return
  switch (data.type) {
    case 'communityscale-chart-resize':
      freeSlot()
      if (typeof data.height === 'number' && data.height > 0) {
        gotHeight = true
        height.value = data.height
      }
      break
    case 'communityscale-chart-nodata':
      // Sent both when a geography has no figures and when the card's own API call failed; try once more first.
      freeSlot()
      giveUpOrRetry()
      break
    case 'communityscale-tooltip-show':
      tooltip.value = {
        show: true,
        html: typeof data.html === 'string' ? data.html : '',
        x: Number(data.x) || 0,
        y: Number(data.y) || 0,
      }
      break
    case 'communityscale-tooltip-hide':
      tooltip.value = { ...tooltip.value, show: false }
      break
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  // Twenty-two charts on one page is a lot to load at once; hold each one until it is close.
  if (typeof IntersectionObserver === 'undefined' || !root.value) {
    takeSlot(start)
    return
  }
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      observer?.disconnect()
      observer = null
      takeSlot(start)
    }
  }, { rootMargin: '400px 0px' })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  observer?.disconnect()
  timers.forEach(clearTimeout)
  timers = []
  freeSlot()
  // A card still waiting for a slot must not start once it is gone.
  const index = waiting.indexOf(start)
  if (index >= 0) waiting.splice(index, 1)
})
</script>

<template>
  <div
    v-show="!empty"
    ref="root"
    class="community-scale-card relative w-full"
    :class="{ 'is-loaded': loaded }"
    :style="{ minHeight: loaded ? undefined : `${height}px` }"
  >
    <iframe
      v-if="visible"
      :key="frameKey"
      ref="frame"
      :src="src"
      :title="label"
      :height="height"
      :style="{ width: nudge ? 'calc(100% - 1px)' : '100%' }"
      class="community-scale-card__frame"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin allow-downloads"
      @load="onLoad"
    />
    <div v-if="!loaded" class="community-scale-card__placeholder flex items-center justify-center text-center">
      <span class="uppercase tracking-widest text-xs grey px-6">{{ label }}</span>
    </div>
    <div
      v-show="tooltip.show"
      class="community-scale-card__tooltip"
      :style="{ left: `${tooltip.x + 12}px`, top: `${tooltip.y + 12}px` }"
      v-html="tooltip.html"
    />
  </div>
</template>
