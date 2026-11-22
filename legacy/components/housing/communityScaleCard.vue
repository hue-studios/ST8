<template>
  <div
    v-show="!empty"
    class="community-scale-card relative w-full"
    :class="{ 'is-loaded': loaded }"
    :style="{ minHeight: loaded ? null : height + 'px' }"
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
    <div
      v-if="!loaded"
      class="community-scale-card__placeholder flex items-center justify-center text-center"
    >
      <span class="uppercase tracking-widest text-xs grey px-6">{{
        label
      }}</span>
    </div>
    <!-- Charts delegate their tooltips to the parent so they can overflow the iframe. The
         markup comes from CommunityScale and is only rendered after the message is confirmed
         to come from their origin and from this card's own frame. -->
    <div
      v-show="tooltip.show"
      class="community-scale-card__tooltip"
      :style="{ left: tooltip.x + 12 + 'px', top: tooltip.y + 12 + 'px' }"
      v-html="tooltip.html"
    />
  </div>
</template>

<script>
import { CS_ORIGIN } from '~/config/housingForecast'

// Letting every card on the page start at once makes CommunityScale's API drop requests, and a
// dropped request leaves an empty frame with no error to react to — scrolling the page quickly
// was enough to blank out the last third of it. Cards queue for one of a few slots instead and
// give the slot back once they have loaded.
const MAX_CONCURRENT_LOADS = 2
// Long enough for a slow chart, short enough that one stuck frame does not stall the rest.
const SLOT_TIMEOUT = 8000
// When to re-measure after a frame loads, until it reports a height of its own.
const REMEASURE_DELAYS = [400, 1500, 3500, 7000]
// A card that has loaded but reported no height by now never drew — its API call was dropped.
// There is no error to listen for, so this is the only signal that it needs another go.
const RENDER_WATCHDOG = 11000
const MAX_ATTEMPTS = 3

let activeLoads = 0
const waiting = []

function drainQueue() {
  while (activeLoads < MAX_CONCURRENT_LOADS && waiting.length) {
    activeLoads++
    waiting.shift()()
  }
}

function takeSlot(start) {
  waiting.push(start)
  drainQueue()
}

function releaseSlot() {
  activeLoads = Math.max(0, activeLoads - 1)
  drainQueue()
}

export default {
  props: {
    cardId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Housing forecast chart',
    },
    // Starting height. The card reports its real height once it has drawn itself.
    initialHeight: {
      type: Number,
      default: 400,
    },
    // Geography prefix, e.g. '/county/36007'. Empty means the regional dashboard, whose
    // geography CommunityScale has configured on their side rather than in the URL.
    scope: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      loaded: false,
      empty: false,
      height: this.initialHeight,
      tooltip: { show: false, html: '', x: 0, y: 0 },
      observer: null,
      nudge: false,
      timers: [],
      holdsSlot: false,
      attempts: 0,
      gotHeight: false,
      frameKey: 0,
    }
  },
  computed: {
    src() {
      return CS_ORIGIN + this.scope + '/cards/' + this.cardId
    },
  },
  mounted() {
    window.addEventListener('message', this.onMessage)

    // Twenty-two charts on one page is a lot to load at once; hold each one until it is close.
    if (typeof IntersectionObserver === 'undefined') {
      takeSlot(this.start)
      return
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          this.observer.disconnect()
          this.observer = null
          takeSlot(this.start)
        }
      },
      { rootMargin: '400px 0px' }
    )
    this.observer.observe(this.$el)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onMessage)
    if (this.observer) this.observer.disconnect()
    this.timers.forEach(clearTimeout)
    this.freeSlot()
  },
  methods: {
    start() {
      this.holdsSlot = true
      this.visible = true
      // Do not let a frame that never fires `load` hold its slot indefinitely.
      this.timers.push(setTimeout(this.freeSlot, SLOT_TIMEOUT))
    },
    freeSlot() {
      if (!this.holdsSlot) return
      this.holdsSlot = false
      releaseSlot()
    },
    scheduleRemeasure() {
      REMEASURE_DELAYS.forEach((delay) => {
        this.timers.push(
          setTimeout(() => {
            if (this.gotHeight) return
            this.nudge = true
            this.timers.push(setTimeout(() => (this.nudge = false), 250))
          }, delay)
        )
      })
    },
    giveUpOrRetry() {
      if (this.attempts >= MAX_ATTEMPTS) {
        this.empty = true
        this.$emit('nodata', this.cardId)
        return
      }
      this.reload()
    },
    reload() {
      this.attempts++
      this.loaded = false
      this.visible = false
      this.gotHeight = false
      this.frameKey++
      // Go back to the end of the queue so the retry does not pile onto the current batch.
      this.$nextTick(() => takeSlot(this.start))
    },
    onLoad() {
      this.loaded = true
      // The slot is deliberately not freed here: `load` only means the frame's document
      // arrived, and the chart has yet to call the API. It is freed when the chart reports a
      // height, which is the first sign it actually drew something.

      // A card posts its height once, 100ms after it draws, and never again unless its own
      // window resizes — and `load` fires well before that, while it is still fetching. Miss
      // that one message and the frame keeps `initialHeight` forever. Changing the frame's
      // width by a pixel and putting it back makes the card re-measure and post again, so try
      // that a few times, spaced out, until a height actually arrives.
      this.scheduleRemeasure()

      // Nothing drawn by now means the request was dropped, most likely because too many
      // frames asked at once. Start it over rather than leave a blank panel on the page.
      this.timers.push(
        setTimeout(() => {
          if (this.gotHeight || this.empty) return
          this.giveUpOrRetry()
        }, RENDER_WATCHDOG)
      )
    },
    onMessage(event) {
      if (event.origin !== CS_ORIGIN) return
      const frame = this.$refs.frame
      if (!frame || event.source !== frame.contentWindow) return

      const data = event.data
      if (!data || typeof data !== 'object') return

      switch (data.type) {
        case 'communityscale-chart-resize':
          // The chart has drawn, so whoever is queued behind it can start.
          this.freeSlot()
          if (typeof data.height === 'number' && data.height > 0) {
            this.gotHeight = true
            this.height = data.height
          }
          break
        case 'communityscale-chart-nodata':
          // Sent both when a geography genuinely has no figures and when the card's own API
          // call failed, which a burst of requests can cause. Give it one more go before
          // concluding there is nothing to show.
          this.freeSlot()
          this.giveUpOrRetry()
          break
        case 'communityscale-tooltip-show':
          this.tooltip = {
            show: true,
            html: typeof data.html === 'string' ? data.html : '',
            x: Number(data.x) || 0,
            y: Number(data.y) || 0,
          }
          break
        case 'communityscale-tooltip-hide':
          this.tooltip = { ...this.tooltip, show: false }
          break
      }
    },
  },
}
</script>
