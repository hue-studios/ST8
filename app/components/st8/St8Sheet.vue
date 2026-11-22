<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '~/components/ui/sheet'

// ST8's slide-in panel (the mobile menu). The title is announced to screen readers only.
const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(defineProps<{
  title: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  class?: HTMLAttributes['class']
}>(), { side: 'left' })
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent :side="props.side" :class="props.class">
      <SheetHeader class="sr-only">
        <SheetTitle>{{ props.title }}</SheetTitle>
        <SheetDescription>{{ props.description || props.title }}</SheetDescription>
      </SheetHeader>
      <slot />
    </SheetContent>
  </Sheet>
</template>
