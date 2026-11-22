<script setup lang="ts">
import { readItems } from '@directus/sdk'
import type { NewsDetail } from '#shared/types/st8'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const directus = useDirectus()
const asset = useAsset()
const { orgFileId } = useOrganization()

const { data, error } = await useAsyncData(
  () => `news-${slug.value}`,
  async () => {
    const rows = await directus.request(readItems('news', {
      filter: { url: { _eq: slug.value } },
      fields: [
        'id', 'status', 'article', 'cover_image.id', 'date_published', 'date_created', 'date_updated', 'link', 'tags',
        'title', 'type', 'url', 'related_resources.resources_id.*', 'related_resources.resources_id.file.id',
      ] as never,
      limit: 1,
    }))
    return (rows as unknown as NewsDetail[])[0] ?? null
  },
  { watch: [slug] },
)
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'This article could not be loaded', fatal: true })
}
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}
const article = computed(() => data.value!)
const resources = computed(() => article.value.related_resources.filter(r => r.resources_id))
const tags = computed(() => article.value.tags || [])

// The header shows the CMS's own 1200x630 render; the share tags need a URL on this host, the only one a crawler fetches.
const imageId = computed(() => article.value.cover_image?.id || orgFileId('default_cover_image'))
const coverImage = computed(() =>
  imageId.value ? `${asset(imageId.value)}?width=${OG_WIDTH}&height=${OG_HEIGHT}&fit=cover&format=jpg&quality=80` : DEFAULT_CARD)
const publishedOn = computed(() => formatDate(article.value.date_published || article.value.date_updated || article.value.date_created!, 'EEEE MMMM do, yyyy'))

const title = `${article.value.title} - Southern Tier New York News`
useShareMeta({
  title,
  // An external-article item carries only a link, with no body of its own, so the card would otherwise go out with no
  // text under the headline.
  description: cardText(article.value.article, 160) || 'Regional news on the economy of the Southern Tier 8 Region of New York.',
  path: `/regional-news/${article.value.url}`,
  image: imageId.value ? shareCard(imageId.value) : DEFAULT_CARD,
  imageAlt: article.value.title,
  type: 'article',
  published: article.value.date_published || article.value.date_created || undefined,
  modified: article.value.date_updated || undefined,
})
useSchemaOrg([
  defineArticle({
    headline: article.value.title,
    description: cardText(article.value.article, 160) || undefined,
    image: imageId.value ? shareCard(imageId.value) : DEFAULT_CARD,
    datePublished: article.value.date_published || article.value.date_created || undefined,
    dateModified: article.value.date_updated || undefined,
  }),
])
</script>

<template>
  <div id="article" class="flex flex-col justify-center items-center relative">
    <h2 id="article__bg-title" class="uppercase absolute">News</h2>
    <div
      class="w-full flex items-center justify-center flex-col py-20 md:py-32 article__header"
      :style="{ backgroundImage: `url(${coverImage})` }"
    >
      <h1 class="uppercase green thin-font px-4 md:px-12 article__title">
        {{ article.title }}
      </h1>
      <h5 class="w-full uppercase px-4 md:px-12 mt-2 white tracking-wider">
        <span class="mr-1">Published on:</span>
        {{ publishedOn }}
      </h5>
    </div>
    <div class="px-4 md:px-12 py-12 article__content" v-html="article.article" />
    <div v-if="article.link" class="w-full px-4 md:px-12 pb-6 text-center article__links">
      <a :href="article.link" target="_blank" rel="noreferrer">
        <span v-if="article.type === 'External Article'" class="bold">
          <span class="mr-1 uppercase green tracking-wider">Link:</span>Go To Article
        </span>
        {{ ' ' }}
        <span v-if="article.type === 'document'">View Document</span>
        <span v-else>
          <span class="mr-1 uppercase green bold tracking-wider">Link:</span>{{ article.link }}
        </span>
        {{ ' ' }}
        <UniversalLinkIcon />
      </a>
    </div>

    <div
      v-if="tags.length > 0"
      class="w-full flex flex-row flex-wrap items-center justify-center text-xs px-4 md:px-12 py-6 article__tags"
    >
      <span class="mr-1 uppercase bold grey tracking-wider mb-2">Tags:</span>
      <h5 v-for="(tag, index) in tags" :key="index" class="uppercase white mr-2 inline-block mb-2">
        {{ tag }}
      </h5>
    </div>
    <div v-if="resources.length" id="article__resources" class="w-full relative">
      <h2 class="w-full text-center uppercase green relative article__title">Resources</h2>
      <CardSwiper :items="resources" preset="resources">
        <template #default="{ item }">
          <NowResourceCardVertical :item="item.resources_id" />
        </template>
      </CardSwiper>
    </div>
    <div class="w-full px-4 md:px-12 pb-12 pt-6 flex article__share-section">
      <div class="w-full mb-4 flex justify-center items-center flex-col text-center">
        <SocialShare :path="`/regional-news/${article.url}`" :title="article.title" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/pages/article';
// The live page draws the link arrow 35px with a 4px lead-in; the shared icon is 30px.
#article .article__links .link-icon {
  width: 35px;
  height: 35px;
  margin-left: 4px;
}
</style>
