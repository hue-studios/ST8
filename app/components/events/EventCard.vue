<script setup lang="ts">
// One event as a card: image, title, date and time, a short description, and an arrow to its event page. Used by the
// Featured Events slider on /regional-events and by Videos and Events on the Housing page.
import type { EventListItem } from '#shared/types/st8'

defineProps<{ event: EventListItem }>()

const asset = useAsset()
</script>

<template>
  <div class="shadow-lg events__event">
    <div class="w-full flex items-center justify-center flex-row">
      <div
        class="bg-cover bg-no-repeat bg-center events__event-image"
        :style="event.image ? { backgroundImage: `url(${asset(event.image.id, 'small')})` } : undefined"
      />
      <div class="events__event-description">
        <h3 class="uppercase tracking-wider bold mb-2">{{ truncate(event.title, 100) }}</h3>
        <h4 class="uppercase tracking-wider bold">
          <span class="opacity-50">Date: </span>{{ formatDate(event.date, 'MMMM do yyyy') }}
        </h4>
        <h4 v-if="event.time" class="uppercase tracking-wider bold mb-2">
          <span class="opacity-50">Time: </span> {{ event.time }}
        </h4>
        <p class="w-full hidden md:inline-block">{{ truncate(event.description, 80) }}</p>
      </div>
      <NuxtLink
        :to="'/regional-events/' + event.url"
        class="flex items-center justify-center events__event-link"
        :aria-label="event.title"
      >
        <UniversalLinkIcon />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;

.events__event {
  width: 96%;
  border: thin solid rgba($grey, 0.2);
  background: $white;

  .events__event-image {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    background-color: $navy;
  }

  .events__event-description {
    border-left: thin solid rgba($grey, 0.5);
    padding: 20px;
    font-size: 12px;
    line-height: 1.2em;
    width: calc(100% - 150px);
    h4 {
      font-size: 10px;
    }
  }
  .events__event-link {
    width: 50px;
    flex-shrink: 0;
  }
}
</style>
