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
          <resource-card :item="item.resource_id"></resource-card>
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
            :media="coverImage"
            network="linkedin"
            hashtags="southernTier"
            ><linkedin-icon size="1.15x" class="share-icon"></linkedin-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="coverImage"
            network="twitter"
            hashtags="southernTier"
            ><twitter-icon size="1.15x" class="share-icon"></twitter-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + article.url"
            :title="article.title"
            :description="removeHTML(article.article)"
            :quote="article.title"
            :media="coverImage"
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
  async asyncData({ params, $axios }) {
    const [newsReq] = await Promise.all([
      $axios.$get(
        '/items/news?filter[url][eq]=' +
          params.slug +
          '&fields=id,status,article,cover_image.private_hash,date_published,created_on,example_project,featured,link,tags,title,type,url,related_resources.resource_id.*,related_resources.resource_id.file.private_hash&single=1'
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
    return {
      title: this.article.title + ' - Southern Tier New York News',
      meta: [
        {
          hid: 'description',
          name: 'description',
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
          content: this.article.title + ' - Southern Tier New York News',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.truncateString(this.article.article, 120),
        },

        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.article.title + ' - Southern Tier New York News',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.truncateString(this.article.article, 160),
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
      if (str) {
        const firstEdit = str.replace(/<(.|\n)*?>/g, '')
        const secondEdit = firstEdit.replace('&nbsp;', ' ')
        const thirdEdit = secondEdit.replace('&hellip;', '...')
        const fourthEdit = thirdEdit.replace('&rsquo;', "'")
        return fourthEdit
      }
    },
    removeTags(str) {
      if (str === null || str === '') return false
      else str = str.toString()
      const strOne = str.replace(/&nbsp;/gi, ' ')
      return strOne.replace(/(<([^>]+)>)/gi, '')
    },
    truncateString(str, num) {
      if (str) {
        const newStr = this.removeTags(str)
        if (newStr.length <= num) {
          return newStr
        }
        return newStr.slice(0, num) + '...'
      }
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/article';
</style>
