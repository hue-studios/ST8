<script setup lang="ts">
import type { ResourceCardItem } from '#shared/types/st8'

const props = defineProps<{ item: ResourceCardItem }>()
const asset = useAsset()
const { ask } = useResourceRequest()

const program = computed(() => props.item.programs?.[0]?.programs_id?.title ?? '')
const fileUrl = computed(() => (props.item.file ? asset(props.item.file.id) : ''))
const isFile = computed(() => props.item.type === 'Internal File / PDF' && !!props.item.file)
const isLink = computed(() => props.item.type === 'External Link')
// A gated file opens the request form first; everything else is a plain link to the file or the resource.
const gated = computed(() => isFile.value && !!props.item.require_info)
// A gated file gets no href, so the file's address is not in the page for crawlers or a middle-click to open.
const href = computed(() => (gated.value ? undefined : isFile.value ? fileUrl.value : isLink.value ? props.item.link || undefined : undefined))

function onClick(event: MouseEvent) {
  if (!gated.value) return
  event.preventDefault()
  ask({ id: props.item.id, title: props.item.title })
}
</script>

<template>
  <a
    :id="'resource-card-data-' + item.id"
    :href="href"
    :target="href ? '_blank' : undefined"
    rel="noreferrer"
    class="flex items-center justify-center flex-col px-4 cursor-pointer resource-card-data"
    @click="onClick"
  >
    <div class="flex items-center justify-center flex-col resource-card-data__container">
      <h2 v-if="item.title" class="uppercase tracking-wider w-full thin-font resource-card-data__title">
        {{ item.title }}
      </h2>
      <h3 v-if="program" class="uppercase py-2 resource-card-data__program">
        <span>Program: </span>{{ program }}
      </h3>
      <div
        v-if="item.description"
        class="w-full pt-4 pb-3 resource-card-data__description addBorder"
      >
        <p>{{ item.description }}</p>
      </div>
      <h5 v-if="item.type" class="w-full uppercase text-xs green bold tracking-widest resource-card-data__link">
        <span v-if="isFile">View Document</span>
        <span v-else-if="isLink">Go to Resource</span>
        <UniversalLinkIcon />
      </h5>
    </div>
  </a>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;

.resource-card-data {
  color: $navy;
  border-radius: 0px;
  background: $white;
  width: 100%;
  position: relative;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0);
  transition: all 0.25s $curve;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  .resource-card-data__container {
    width: 100%;
    max-width: 600px;
  }
  .resource-card-data__program {
    font-size: 9px;
    line-height: 10px;
    font-family: $bold-font;
    color: $green;
    width: 100%;
    transition: all 0.25s $curve 0.01s;
    span {
      color: $darkGrey;
      display: block;
    }
  }
  .resource-card-data__title {
    font-size: 16px;
    line-height: 20px;
    transition: all 0.25s $curve 0s;
    font-family: $bold-font;
    @media (min-width: $breakpoint-medium) {
      font-size: 18px;
    }
    @media (min-width: $breakpoint-large) {
      font-size: 22px;
      line-height: 22px;
    }
  }
  .resource-card-data__description {
    transition: all 0.25s $curve 0.02s;
    p {
      font-size: 13px;
    }
  }
  .resource-card-data__link {
    min-height: 30px;
    transition: all 0.25s $curve 0.03s;
    .link-icon {
      background: none;
      color: $green;
      stroke: $green;
      margin-left: 0px;
    }
  }
  .resource-card-data__description.addBorder {
    border-top: thin solid $navy;
  }
  a {
    font-size: 10px;
  }
}
.resource-card-data:hover {
  z-index: 10;
  .resource-card-data__title {
    transform: translateX(10px);
  }
  .resource-card-data__program {
    transform: translateX(13px);
  }
  .resource-card-data__description {
    transform: translateX(16px);
  }
  .resource-card-data__link {
    transform: translateX(19px);
  }
}
</style>
