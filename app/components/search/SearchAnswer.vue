<script setup lang="ts">
import type { AskResponse, AskSource } from '#shared/utils/ask'
import { isAskable } from '#shared/utils/ask'

/**
 * Ask ST8: a short AI-written answer above the search results, with links to the pages it came from. Shown only when
 * the server says the feature is on (a model key is set and the Directus switch is on); otherwise this renders nothing
 * and the results look exactly as they did before. A failure of any kind also renders nothing.
 *
 * It asks only for question-like queries (see isAskable) and only once the visitor has stopped typing for a moment,
 * so a sentence typed at speed costs one request, not one per pause. Parents keep it mounted while the query changes
 * (it renders nothing when it has nothing to show): mounting it again per search would ask at once every time.
 */
const props = defineProps<{ query: string }>()
const emit = defineEmits<{ choose: [source: AskSource] }>()

// Once the server says the feature is off, stop asking for the rest of the visit. 'unknown' until the first answer.
const state = useState<'unknown' | 'on' | 'off'>('ask-state', () => 'unknown')

const answer = ref<Extract<AskResponse, { enabled: true }> | null>(null)
const pending = ref(false)
const asked = ref('')

const settled = refDebounced(computed(() => props.query.trim()), 700)

async function ask(q: string) {
  answer.value = null
  asked.value = q
  if (state.value === 'off' || !isAskable(q)) {
    pending.value = false
    return
  }
  pending.value = true
  try {
    const data = await $fetch<AskResponse>('/api/ask', { method: 'POST', body: { q } })
    if (asked.value !== q) return
    if (!data.enabled) {
      state.value = 'off'
      return
    }
    state.value = 'on'
    answer.value = data.answer ? data : null
  }
  catch {
    // Rate-limited or failed: the results below are unaffected.
  }
  finally {
    if (asked.value === q) pending.value = false
  }
}

// Client only: the /search page is server-rendered, and its results must not wait on the model.
onMounted(() => {
  watch(settled, q => ask(q), { immediate: true })
})

// While typing, an answer to the previous question must not sit over new results.
const current = computed(() => !!answer.value && asked.value === props.query.trim())
const showPending = computed(() => pending.value && state.value === 'on' && asked.value === props.query.trim())
</script>

<template>
  <section
    v-if="current || showPending"
    class="search-answer mb-3 rounded-lg border border-navy/15 bg-navy/[0.03] px-4 py-3 text-navy"
    aria-label="AI-generated answer"
  >
    <p class="mb-1.5 flex items-center gap-1.5 text-xs tracking-widest text-navy/60 uppercase">
      <Icon name="lucide:sparkles" class="size-3.5" />
      AI-generated answer
    </p>
    <p v-if="showPending && !current" class="text-sm text-navy/60">
      Writing a short answer from ST8’s pages…
    </p>
    <template v-else-if="answer">
      <p class="text-sm leading-relaxed">
        {{ answer.answer }}
      </p>
      <ul v-if="answer.sources.length" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <li v-for="s in answer.sources" :key="s.url" @click="emit('choose', s)">
          <NuxtLink
            :to="s.url"
            :external="s.external"
            :target="s.external ? '_blank' : undefined"
            :rel="s.external ? 'noreferrer' : undefined"
            class="inline-flex items-center gap-1 underline underline-offset-2 hover:text-brand"
          >
            {{ s.title }}
            <Icon :name="s.external ? 'lucide:external-link' : 'lucide:arrow-right'" class="size-3.5" />
          </NuxtLink>
        </li>
      </ul>
      <p v-if="answer.covered" class="mt-2 text-xs text-navy/50">
        Written by AI from the results below. It can be wrong: check the linked page.
      </p>
    </template>
  </section>
</template>
