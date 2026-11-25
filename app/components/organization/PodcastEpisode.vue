<script setup lang="ts">
// One "Rebuilding So-Tier" episode on the Organization page: cover, number and date, title, guests (linked to their
// Team or Board entry further down the page), summary and the player. An uploaded file plays in a native <audio>;
// a YouTube or Spotify link loads only when the visitor presses play (MediaVideoEmbed).
export interface PodcastGuest { id: number, name: string, category?: string | null }
export interface PodcastEpisodeRow {
  id: number
  title: string
  url?: string | null
  episode_number?: number | null
  date_published?: string | null
  summary?: string | null
  duration?: string | null
  embed_url?: string | null
  audio_file?: { id: string, type?: string | null } | null
  cover_image?: { id: string } | null
  guests?: Array<{ people_id: PodcastGuest | null }> | null
}

const props = defineProps<{ episode: PodcastEpisodeRow, anchor: string }>()
const asset = useAsset()

const guests = computed(() => (props.episode.guests || []).map(g => g.people_id).filter((p): p is PodcastGuest => !!p))
const date = computed(() => (props.episode.date_published ? formatDate(props.episode.date_published, 'MMMM d, yyyy') : ''))
// Staff and Board entries carry a `person-<id>` anchor; anyone else (a guest kept in People as another category) is
// named without a link.
const guestLink = (guest: PodcastGuest) =>
  guest.category === 'Staff' || guest.category === 'Board' ? `#person-${guest.id}` : null
</script>

<template>
  <article :id="anchor" class="podcast-episode">
    <div class="podcast-episode__cover">
      <NuxtImg
        v-if="episode.cover_image"
        :src="episode.cover_image.id"
        width="240"
        height="240"
        fit="cover"
        quality="80"
        sizes="120px md:180px"
        :alt="`${episode.title} cover art`"
      />
      <div v-else class="podcast-episode__cover-fallback" aria-hidden="true">
        <Icon name="lucide:mic" />
      </div>
    </div>
    <div class="podcast-episode__body">
      <p class="podcast-episode__meta uppercase bold">
        <span v-if="episode.episode_number">Episode {{ episode.episode_number }}</span>
        <time v-if="date" :datetime="episode.date_published!">{{ date }}</time>
        <span v-if="episode.duration">{{ episode.duration }}</span>
      </p>
      <h3 class="podcast-episode__title navy bold">{{ episode.title }}</h3>
      <p v-if="guests.length" class="podcast-episode__guests">
        With
        <template v-for="(guest, i) in guests" :key="guest.id">
          <a v-if="guestLink(guest)" :href="guestLink(guest)!">{{ guest.name }}</a><span v-else>{{ guest.name }}</span><span v-if="i < guests.length - 2">, </span><span v-else-if="i === guests.length - 2"> and </span>
        </template>
      </p>
      <p v-if="episode.summary" class="podcast-episode__summary whitespace-pre-line" v-text="episode.summary.trim()" />
      <div class="podcast-episode__player">
        <audio v-if="episode.audio_file" controls preload="none" :aria-label="`Listen: ${episode.title}`">
          <source :src="asset(episode.audio_file.id)" :type="episode.audio_file.type || 'audio/mpeg'">
          <a :href="asset(episode.audio_file.id)">Download the episode</a>
        </audio>
        <MediaVideoEmbed
          v-else-if="episode.embed_url"
          :url="episode.embed_url"
          :title="episode.title"
          :poster="episode.cover_image?.id"
        />
      </div>
    </div>
  </article>
</template>
