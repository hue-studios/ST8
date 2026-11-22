<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'

// ST8's modal. v-model:open controls it; `title` is required for screen readers (hide it with `hide-title`).
const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  title: string
  description?: string
  hideTitle?: boolean
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :class="cn('bg-white text-navy', props.class)">
      <DialogHeader :class="props.hideTitle ? 'sr-only' : ''">
        <DialogTitle class="uppercase tracking-widest">
          {{ props.title }}
        </DialogTitle>
        <DialogDescription v-if="props.description">
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>
</template>
