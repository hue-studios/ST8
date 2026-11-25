<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Input } from '~/components/ui/input'

// ST8's text input. Use inside St8Field so the label and error are wired up.
const model = defineModel<string | number>()
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Input v-model="model" :class="cn('bg-white', props.class)" />
</template>
