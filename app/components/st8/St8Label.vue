<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label } from '~/components/ui/label'

const props = defineProps<{ for?: string, class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Label :for="props.for" :class="cn('uppercase tracking-wider text-xs', props.class)">
    <slot />
  </Label>
</template>
