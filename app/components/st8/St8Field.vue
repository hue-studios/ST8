<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Field, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field'

// A labelled form row: label, the control (default slot), optional help text and an error message. The form session
// binds `error` to vee-validate's field errors.
const props = defineProps<{
  label?: string
  for?: string
  description?: string
  error?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Field :data-invalid="props.error ? true : undefined" :class="props.class">
    <FieldLabel v-if="props.label" :for="props.for" class="uppercase tracking-wider text-xs">
      {{ props.label }}
    </FieldLabel>
    <slot />
    <FieldDescription v-if="props.description">
      {{ props.description }}
    </FieldDescription>
    <FieldError v-if="props.error">
      {{ props.error }}
    </FieldError>
  </Field>
</template>
