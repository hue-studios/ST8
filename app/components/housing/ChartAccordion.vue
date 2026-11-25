<script setup lang="ts">
const props = withDefaults(defineProps<{
  cardId: string
  question: string
  initialHeight?: number
  scope?: string
}>(), { initialHeight: 400, scope: '' })

const open = ref(false)
// Kept true once opened so reopening does not reload the chart.
const mounted = ref(false)
watch(open, (isOpen) => {
  if (isOpen) mounted.value = true
})

const slug = computed(() => props.cardId.replace(/[^a-z0-9]+/gi, '-'))
const buttonId = computed(() => `accordion-${slug.value}`)
const panelId = computed(() => `panel-${slug.value}`)
</script>

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
        <!-- The page's Sass sizes this (11px wide) and fills it, as it did the old icon component. -->
        <svg class="chevron-down-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.67 32">
          <path d="M1.17,0,30.84,29.66,60.5,0l1.17,1.16L30.84,32,0,1.16,1.17,0Z" />
        </svg>
      </span>
    </button>
    <div v-show="open" :id="panelId" role="region" :aria-labelledby="buttonId" class="chart-accordion__panel">
      <!-- Mounted only once opened, so a page of these costs nothing until asked for. -->
      <HousingCommunityScaleCard
        v-if="mounted"
        :card-id="cardId"
        :label="question"
        :initial-height="initialHeight"
        :scope="scope"
      />
    </div>
  </div>
</template>
