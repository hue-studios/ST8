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
        {{
          $moment(article.date_updated || article.date_created).format(
            'dddd MMMM Do, YYYY'
          )
        }}
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
      class="w-full flex flex-row flex-wrap items-center justify-center text-xs px-4 md:px-12 py-6 article__tags"
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
    <div
      v-if="article.related_resources.length"
      id="article__resources"
      class="w-full relative"
    >
      <h2 class="w-full text-center uppercase green relative article__title">
        Resources
      </h2>
      <swiper
        :options="resourcesSwiperOption"
        class="swiper w-full flex flex-row items-center justify-center pt-4 pb-4"
      >
        <swiper-slide
          v-for="(item, index) in article.related_resources"
          :key="index"
          class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
        >
          <resource-card :item="item.resources_id"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
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
            :media="shareImage"
            network="linkedin"
            hashtags="southernTier"
            ><linkedin-icon size="1.15x" class="share-icon"></linkedin-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="shareImage"
            network="twitter"
            hashtags="southernTier"
            ><twitter-icon size="1.15x" class="share-icon"></twitter-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="shareImage"
            network="facebook"
            hashtags="southernTier"
            ><facebook-icon size="1.15x" class="share-icon"></facebook-icon>
          </ShareNetwork>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'vue-feather-icons'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import linkIcon from '~/components/universal/linkIcon'
import resourceCard from '~/components/now/resourceCardVertical'
import {
  shareMeta,
  cardText,
  directusCard,
  shareCard,
  DEFAULT_CARD,
} from '~/config/share'
export default {
  components: {
    linkIcon,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    resourceCard,
    Swiper,
    SwiperSlide,
  },
  async asyncData({ params, $axios, error }) {
    const newsReq = await $axios.$get(
      '/items/news?filter[url][_eq]=' +
        encodeURIComponent(params.slug) +
        '&fields=id,status,article,cover_image.id,date_published,date_created,date_updated,example_project,featured,link,tags,title,type,url,related_resources.resources_id.*,related_resources.resources_id.file.id&limit=1'
    )
    if (!newsReq.data.length) {
      return error({ statusCode: 404, message: 'Article not found' })
    }
    return {
      article: newsReq.data[0],
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      coverImage: '',
      shareImage: '',
      resourcesSwiperOption: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        centeredSlides: false,
        centerInsufficientSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true,
        },
        breakpoints: {
          // 640: {
          //   slidesPerView: 2.5
          // },
          // 768: {
          //   slidesPerView: 2.5
          // },
          // 1024: {
          //   slidesPerView: 3.5
          // }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true,
        },
      },
    }
  },
  head() {
    const title = this.article.title + ' - Southern Tier New York News'
    return {
      title,
      meta: shareMeta({
        title,
        // An external-article item carries only a link, with no body of its own, so the card
        // would otherwise go out with no text under the headline.
        description:
          cardText(this.article.article, 160) ||
          'Regional news on the economy of the Southern Tier 8 Region of New York.',
        path: '/regional-news/' + this.article.url,
        image: this.shareImage,
        imageAlt: this.article.title,
        type: 'article',
        published: this.article.date_published || this.article.date_created,
        modified: this.article.date_updated,
      }),
    }
  },
  created() {
    // Assigned here rather than in mounted() or a computed on client-only state: head() runs
    // on the server, and anything unresolved by then ships as an empty tag no crawler sees.
    const imageId =
      (this.article.cover_image && this.article.cover_image.id) ||
      this.$store.getters.orgFileId('default_cover_image')
    // The header displays the CMS render directly; the share tags need a URL on this host, which
    // is the only one a crawler will fetch.
    this.coverImage = imageId ? directusCard(imageId) : DEFAULT_CARD
    this.shareImage = imageId ? shareCard(imageId) : DEFAULT_CARD
  },
  methods: {
    removeHTML(str) {
      if (str) {
        const firstEdit = str.replace(/<(.|\n)*?>/g, '')
        const secondEdit = firstEdit.replace('&nbsp;', ' ')
        const thirdEdit = secondEdit.replace('&hellip;', '...')
        const fourthEdit = thirdEdit.replace('&rsquo;', "'")
        return fourthEdit
      }
    },
  },
}
</script>

<style lang="scss">
@use '~/assets/scss/pages/article';
</style>
