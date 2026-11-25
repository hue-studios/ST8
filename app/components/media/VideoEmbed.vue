<script setup lang="ts">
// A click-to-load YouTube, Vimeo or Spotify player. Until the visitor presses play the page shows a plain button, so no
// third-party script, cookie or iframe loads with the page. Shared by the podcast (session 8) and Housing videos
// (session 9). A link it does not recognise renders as a plain "open" link.
const props = defineProps<{
  url: string
  title: string
  /** Directus file id shown behind the play button. */
  poster?: string | null
}>()

const loaded = ref(false)

const embed = computed(() => {
  let link: URL
  try {
    link = new URL(props.url)
  }
  catch {
    return null
  }
  const host = link.hostname.replace(/^www\.|^m\./, '')
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
    const id = host === 'youtu.be'
      ? link.pathname.slice(1)
      : link.searchParams.get('v') || /^\/(?:embed|shorts|live)\/([\w-]+)/.exec(link.pathname)?.[1]
    if (!id || !/^[\w-]{6,}$/.test(id)) return null
    return { kind: 'youtube' as const, src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, height: null }
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    // vimeo.com/123456, vimeo.com/123456/abcdef (unlisted, with its hash), player.vimeo.com/video/123456
    const match = /^\/(?:video\/)?(\d+)(?:\/(\w+))?/.exec(link.pathname)
    if (!match) return null
    const hash = match[2] || link.searchParams.get('h')
    return {
      kind: 'vimeo' as const,
      src: `https://player.vimeo.com/video/${match[1]}?autoplay=1&dnt=1${hash ? `&h=${hash}` : ''}`,
      height: null,
    }
  }
  if (host === 'open.spotify.com') {
    const match = /^\/(?:embed\/)?(episode|show|track|playlist)\/(\w+)/.exec(link.pathname)
    if (!match) return null
    return {
      kind: 'spotify' as const,
      src: `https://open.spotify.com/embed/${match[1]}/${match[2]}?autoplay=1`,
      height: match[1] === 'episode' || match[1] === 'track' ? 152 : 352,
    }
  }
  return null
})

const PLAYERS = { youtube: 'YouTube', vimeo: 'Vimeo', spotify: 'Spotify' } as const
const label = computed(() => (embed.value?.kind === 'spotify' ? 'Play on Spotify' : 'Play video'))
</script>

<template>
  <div v-if="embed" class="video-embed" :class="`video-embed--${embed.kind}`">
    <iframe
      v-if="loaded"
      :src="embed.src"
      :title="title"
      :height="embed.height ?? undefined"
      class="video-embed__frame"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowfullscreen
      loading="lazy"
    />
    <button v-else type="button" class="video-embed__start" :aria-label="`${label}: ${title}`" @click="loaded = true">
      <NuxtImg v-if="poster" :src="poster" width="800" quality="75" alt="" class="video-embed__poster" />
      <span class="video-embed__play">
        <Icon name="lucide:play" />
        <span>{{ label }}</span>
      </span>
      <span class="video-embed__note">Loads a player from {{ PLAYERS[embed.kind] }}</span>
    </button>
  </div>
  <a v-else :href="url" target="_blank" rel="noreferrer" class="video-embed__link">Open {{ title }}</a>
</template>

<style lang="scss">
@use '~/assets/scss/vars' as *;

.video-embed {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: $navy;

  &--youtube,
  &--vimeo { aspect-ratio: 16 / 9; }
  &--spotify { min-height: 152px; background: transparent; }

  .video-embed__frame {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
  &--spotify .video-embed__frame { border-radius: 12px; }

  .video-embed__start {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    min-height: inherit;
    color: #fff;
    background: $navy;
    border-radius: inherit;
    cursor: pointer;
  }
  &--spotify .video-embed__start { border-radius: 12px; }

  .video-embed__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;
  }
  .video-embed__play {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: $green;
    border-radius: 999px;
    transition: transform 0.15s ease;
  }
  .video-embed__start:hover .video-embed__play,
  .video-embed__start:focus-visible .video-embed__play { transform: scale(1.05); }
  .video-embed__note {
    position: relative;
    font-size: 10px;
    letter-spacing: 0.1em;
    opacity: 0.75;
  }
}
.video-embed__link {
  color: $green;
  font-weight: 700;
  text-decoration: underline;
}
</style>
