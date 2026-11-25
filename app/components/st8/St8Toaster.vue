<script setup lang="ts">
import { Toaster } from '~/components/ui/sonner'

// Mount once in app.vue. Trigger toasts with `toast()` from 'vue-sonner'. Colours follow the old iziToast look.
</script>

<template>
  <Toaster position="bottom-right" rich-colors close-button />
</template>
