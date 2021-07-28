<template>
  <div id="event" class="flex flex-col justify-center items-center relative">
    <h2 id="event__bg-title" class="uppercase absolute">Event</h2>
    <div
      id="event__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <div
        id="event__intro-caption"
        class="flex items-center justify-center flex-col relative lg:py-8"
      >
        <div
          class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6"
        >
          <div
            class="w-1/2 flex items-center justify-center shadow-lg event__image"
          >
            <img
              v-if="item.image"
              class=""
              :src="imageLocation + item.image.private_hash + '?key=medium'"
              :alt="item.title"
            />
          </div>
          <div class="w-1/2 flex items-center justify-center flex-col">
            <h1
              class="w-full uppercase green pl-4 text-left event__page-title"
              :class="{ 'text-xs': tooLong }"
            >
              <span class="navy">Event: </span>
              {{ item.title }}
            </h1>
            <h3
              class="w-full pl-4 mt-4 tracking-widest bold uppercase event__date"
            >
              <span class="opacity-50">Date: </span
              >{{ $moment(item.date).format('MMMM Do YYYY') }}
            </h3>
            <h3
              v-if="item.time"
              class="w-full pl-4 tracking-widest bold uppercase event__date"
            >
              <span class="opacity-50">Time: </span>{{ item.time }}
            </h3>
          </div>
        </div>

        <div
          v-if="item.initiatives.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 pb-6 mb-4 event__stats"
        >
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ item.initiatives.length }} Initiative<span
                v-if="item.initiatives.length > 1"
                >s</span
              >
              Served:
            </h4>
            <h5
              v-for="(initiative, index) in item.initiatives"
              :key="index"
              class="uppercase mr-1 mb-1"
            >
              {{ initiative.initiatives_id.title }}
              <span v-if="index + 1 < item.initiatives.length" class="green">
                /</span
              >
            </h5>
          </div>
        </div>
      </div>
      <div
        id="event__description"
        class="w-5/6 lg:w-full"
        v-text="item.description"
      ></div>
    </div>
    <div
      v-if="item.link"
      class="w-full mt-8 mb-8 px-4 md:px-12 flex items-center justify-center event__links"
    >
      <a :href="item.link" target="_blank" rel="noreferrer"
        ><span class="mr-1 uppercase grey tracking-wider">Link:</span>
        {{ item.link }} <link-icon></link-icon
      ></a>
    </div>
    <div
      v-if="item.resources.length"
      id="event__resources"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative"
    >
      <h2 class="uppercase green relative event__title">Event Resources</h2>
      <swiper
        :options="resourcesSwiperOption"
        class="swiper w-full flex flex-row items-center justify-center pt-4 pb-4"
      >
        <swiper-slide
          v-for="(resource, index) in item.resources"
          :key="index"
          class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
        >
          <resource-card :item="resource.resources_id"></resource-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
    </div>
    <div class="w-full px-4 md:px-12 pb-12 mt-12 flex event__share-section">
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
            :url="'https://southerntier8.org/regional-news/' + item.url"
            :title="item.title"
            :description="removeHTML(item.description)"
            :quote="item.title"
            :media="coverImage"
            network="linkedin"
            hashtags="southernTier"
            ><linkedin-icon size="1.15x" class="share-icon"></linkedin-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + item.url"
            :title="item.title"
            :description="removeHTML(item.description)"
            :quote="item.title"
            :media="coverImage"
            network="twitter"
            hashtags="southernTier"
            ><twitter-icon size="1.15x" class="share-icon"></twitter-icon>
          </ShareNetwork>
          <ShareNetwork
            :url="'https://southerntier8.org/regional-news/' + item.url"
            :title="item.title"
            :description="removeHTML(item.description)"
            :quote="item.title"
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'vue-feather-icons'
import resourceCard from '~/components/now/resourceCardVertical'
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    Swiper,
    SwiperSlide,
    linkIcon,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    resourceCard,
  },
  async asyncData({ params, $axios }) {
    const [eventsReq] = await Promise.all([
      $axios.$get(
        '/items/events?filter[url][eq]=' +
          params.slug +
          '&fields=*.*.*.*&single=1'
      ),
    ])
    return {
      item: eventsReq.data,
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      coverImage: '',
      tooLong: false,
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
      title: this.item.title + ' - Featured Southern Tier Event',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.truncateString(this.item.description, 160),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/regional-events/' + this.item.url,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.coverImage,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.item.title + ' - Featured Southern Tier Event',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.truncateString(this.item.description, 120),
        },

        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.item.title + ' - Featured Southern Tier Event',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.truncateString(this.item.description, 120),
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.coverImage,
        },
        {
          hid: 'twitter:image:alt',
          content: this.item.title,
        },
      ],
    }
  },
  created() {
    this.countTitle(this.item.title)
    if (this.item.image) {
      this.coverImage =
        process.env.imageUrl + this.item.image.private_hash + '?key=large'
    } else {
      this.coverImage = process.env.imageUrl + '1avcl3u0gukko40g?key=large'
    }
  },
  methods: {
    countTitle(title) {
      if (title.length > 30) {
        this.tooLong = true
      } else {
        this.tooLong = false
      }
    },
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
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/event';
</style>
