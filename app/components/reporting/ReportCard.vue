<script setup lang="ts">
import type { ReportItem } from '#shared/types/st8'

const props = defineProps<{ item: ReportItem }>()
const asset = useAsset()

const date = computed(() => {
  const value = props.item.date || props.item.date_updated || props.item.date_created
  return value ? formatDate(value, 'EEEE MMMM do, yyyy') : ''
})
</script>

<template>
  <div
    :id="'report-card-' + item.id"
    class="w-full flex items-center justify-start flex-row mb-6 shadow-lg relative report-card"
  >
    <div class="w-full flex flex-col items-start justify-center report-card__content">
      <h2 class="uppercase tracking-wider w-full mb-1 report-card__title">
        {{ item.title }}
      </h2>
      <h5 v-if="date" class="w-full uppercase navy tracking-widest report-card__date">
        {{ date }}
      </h5>
    </div>

    <a
      v-if="item.file"
      :href="asset(item.file.id)"
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-center flex-row uppercase report-card__link"
    >
      <span class="inline-block parent">Download <span class="hidden sm:inline-block">Document</span></span>
      <Icon name="lucide:file-down" size="20" class="inline-block" />
    </a>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;

.report-card {
  border: thin solid rgba($grey, 0.2);
  background: rgba($grey, 0.05);
  backdrop-filter: blur(2px);
  max-width: 680px;
  .report-card__content {
    padding: 1rem;
    .report-card__title {
      font-size: 12px;
      line-height: 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;
      color: $navy;
      letter-spacing: 0.2em;
      @media (min-width: $breakpoint-small) {
        font-size: 18px;
        line-height: 20px;
      }
    }
    .report-card__date {
      font-size: 8px;
    }
  }
  .report-card__link {
    font-size: 10px;
    letter-spacing: 0.2em;
    padding: 1rem;
    .parent {
      width: 75px;
      @media (min-width: $breakpoint-small) {
        width: 150px;
      }
    }
    svg {
      height: 20px;
      width: auto;
      path {
        fill: $green;
      }
    }
  }
}
</style>
