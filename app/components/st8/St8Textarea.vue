<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Textarea } from '~/components/ui/textarea'

const model = defineModel<string | number>()
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Textarea v-model="model" :class="cn('bg-white', props.class)" />
</template>
