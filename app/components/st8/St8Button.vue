<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Button } from '~/components/ui/button'

// ST8's button. Pages never import ui/button directly. `brand` is the green call-to-action used across the site;
// the other variants pass through to shadcn-vue's.
const props = withDefaults(defineProps<{
  variant?: 'brand' | 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  class?: HTMLAttributes['class']
  as?: string
  asChild?: boolean
}>(), { variant: 'brand', size: 'default', as: 'button' })

const variantClass: Record<string, string> = {
  brand: 'bg-brand text-white hover:bg-brand/85',
}
</script>

<template>
  <Button
    :variant="props.variant === 'brand' ? 'default' : props.variant"
    :size="props.size"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('uppercase tracking-widest', variantClass[props.variant], props.class)"
  >
    <slot />
  </Button>
</template>
