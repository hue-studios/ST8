<template>
  <div class="chart-accordion" :class="{ 'is-open': open }">
    <button
      :id="buttonId"
      type="button"
      class="chart-accordion__toggle"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <span class="chart-accordion__question">{{ question }}</span>
      <span class="chart-accordion__chevron" aria-hidden="true">
        <chevron-down />
      </span>
    </button>
    <div
      v-show="open"
      :id="panelId"
      role="region"
      :aria-labelledby="buttonId"
      class="chart-accordion__panel"
    >
      <!-- Mounted only once opened, so a page of these costs nothing until asked for. -->
      <housing-community-scale-card
        v-if="mounted"
        :card-id="cardId"
        :label="question"
        :initial-height="initialHeight"
        :scope="scope"
      />
    </div>
  </div>
</template>

<script>
import chevronDown from '~/components/icons/chevronDown'
import housingCommunityScaleCard from '~/components/housing/communityScaleCard'

export default {
  components: {
    chevronDown,
    housingCommunityScaleCard,
  },
  props: {
    cardId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    initialHeight: {
      type: Number,
      default: 400,
    },
    scope: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      open: false,
      // Kept true once opened so reopening does not reload the chart.
      mounted: false,
    }
  },
  computed: {
    slug() {
      return this.cardId.replace(/[^a-z0-9]+/gi, '-')
    },
    buttonId() {
      return 'accordion-' + this.slug
    },
    panelId() {
      return 'panel-' + this.slug
    },
  },
  watch: {
    open(isOpen) {
      if (isOpen) this.mounted = true
    },
  },
}
</script>
