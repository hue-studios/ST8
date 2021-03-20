<template>
  <div id="article" class="flex flex-col justify-center items-center relative">
    <h2 id="article__bg-title" class="uppercase absolute">News</h2>
    <div
      class="w-full flex items-center justify-center flex-col py-20 md:py-32 article__header"
      :style="'background-image: url( ' + coverImage + ')'"
    >
      <h1 class="uppercase green thin-font px-4 md:px-12 article__title">
        {{ article.title }}
      </h1>
      <h5
        v-if="article.date_published"
        class="w-full uppercase px-4 md:px-12 mt-2 white tracking-wider"
      >
        <span class="mr-1">Published on:</span>
        {{ $moment(article.date_published).format('dddd MMMM Do, YYYY') }}
      </h5>
      <h5
        v-else
        class="w-full uppercase px-4 md:px-12 mt-2 white tracking-wider"
      >
        <span class="mr-1">Published on:</span>
        {{ $moment(article.modified_on).format('dddd MMMM Do, YYYY') }}
      </h5>
    </div>
    <div
      class="px-4 md:px-12 py-12 article__content"
      v-html="article.article"
    ></div>
    <div
      v-if="article.link"
      class="w-full px-4 md:px-12 pb-6 text-center article__links"
    >
      <a :href="article.link" target="_blank" class="" rel="noreferrer"
        ><span v-if="article.type === 'External Article'" class="bold"
          ><span class="mr-1 uppercase green tracking-wider">Link:</span>Go To
          Article</span
        ><span v-if="article.type === 'document'">View Document</span>
        <span v-else
          ><span class="mr-1 uppercase green bold tracking-wider">Link:</span
          >{{ article.link }}</span
        >
        <link-icon></link-icon
      ></a>
    </div>
    <div
      v-if="article.tags.length > 0"
      class="w-full flex flex-row items-center justify-center text-xs px-4 md:px-12 py-6 article__tags"
    >
      <span class="mr-1 uppercase bold grey tracking-wider mb-2">Tags:</span>
      <h5
        v-for="(tag, index) in article.tags"
        :key="index"
        class="uppercase white mr-2 inline-block mb-2"
      >
        {{ tag }}
      </h5>
    </div>
    <div class="w-full px-4 md:px-12 pb-12 pt-6 flex article__share-section">
      <div
        class="w-full mb-4 flex justify-center items-center flex-col text-center"
      >
        <div
          id="sharing"
          class="flex flex-row items-center justify-center flex-wrap"
        >
          <h5 class="uppercase grey script mb-4 md:mb-0 md:mr-2 tracking-wider">
            Share:
          </h5>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="coverImage"
            network="linkedin"
            hashtags="ST8,southernTier"
            ><linkedin-icon size="1.15x" class="share-icon"></linkedin-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="coverImage"
            network="twitter"
            hashtags="ST8,southernTier"
            ><twitter-icon size="1.15x" class="share-icon"></twitter-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="coverImage"
            network="facebook"
            hashtags="ST8,southernTier"
            ><facebook-icon size="1.15x" class="share-icon"></facebook-icon>
          </ShareNetwork>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'vue-feather-icons'
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    linkIcon,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
  },
  async asyncData({ params, $axios }) {
    const [newsReq] = await Promise.all([
      $axios.$get(
        '/items/news?filter[url][eq]=' + params.slug + '&fields=*.*.*&single=1'
      ),
    ])
    return {
      article: newsReq.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      coverImage: '',
    }
  },
  head() {
    return {
      title: this.article.title + ' - Southern Tier New York News - ST8',
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: this.truncateString(this.article.article, 120),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://southerntier8.org/regional-news/' + this.article.url,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.coverImage,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.article.title + ' - Southern Tier New York News - ST8',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.truncateString(this.article.article, 120),
        },

        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.article.title + ' - Southern Tier New York News - ST8',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.truncateString(this.article.article, 120),
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.coverImage,
        },
        {
          hid: 'twitter:image:alt',
          content: this.article.title,
        },
      ],
    }
  },
  created() {
    if (this.article.cover_image) {
      this.coverImage =
        process.env.imageUrl +
        this.article.cover_image.private_hash +
        '?key=large'
    } else {
      this.coverImage = process.env.imageUrl + '1avcl3u0gukko40g?key=large'
    }
  },
  methods: {
    removeHTML(str) {
      const firstEdit = str.replace(/<(.|\n)*?>/g, '')
      const secondEdit = firstEdit.replace('&nbsp;', ' ')
      const thirdEdit = secondEdit.replace('&hellip;', '...')
      const fourthEdit = thirdEdit.replace('&rsquo;', "'")
      return fourthEdit
    },
    removeTags(str) {
      if (str === null || str === '') return false
      else str = str.toString()
      const strOne = str.replace(/&nbsp;/gi, ' ')
      return strOne.replace(/(<([^>]+)>)/gi, '')
    },
    truncateString(str, num) {
      const newStr = this.removeTags(str)
      if (newStr.length <= num) {
        return newStr
      }
      return newStr.slice(0, num) + '...'
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/article';
</style>
