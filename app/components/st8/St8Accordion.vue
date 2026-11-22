<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

// ST8's accordion: pass `items` ({ value, title }) and put each panel in the slot named after its value.
//   <St8Accordion :items="[{ value: 'a', title: 'First' }]"><template #a>…</template></St8Accordion>
const props = withDefaults(defineProps<{
  items: Array<{ value: string, title: string }>
  type?: 'single' | 'multiple'
  collapsible?: boolean
  class?: HTMLAttributes['class']
}>(), { type: 'single', collapsible: true })
</script>

<template>
  <Accordion :type="props.type" :collapsible="props.collapsible" :class="props.class">
    <AccordionItem v-for="item in props.items" :key="item.value" :value="item.value">
      <AccordionTrigger class="uppercase tracking-widest">
        {{ item.title }}
      </AccordionTrigger>
      <AccordionContent>
        <slot :name="item.value" />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
