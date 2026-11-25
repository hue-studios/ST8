<script setup lang="ts">
// The search overlay the header's button opens. Empty for now: it holds the place (and the shared open state) for the
// search panel.
const { open } = useSearchOpen()
</script>

<template>
  <St8Dialog v-model:open="open" title="Search" class="search-dialog" />
</template>
