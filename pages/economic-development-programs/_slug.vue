<template>
  <div id="program">
    <div
      id="program__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <div
        id="program__intro-caption"
        class="flex items-center justify-center flex-col relative lg:py-8 max-w-5xl"
      >
        <div
          class="w-5/6 lg:w-full flex flex-row items-end justify-center mb-6"
        >
          <div
            class="w-1/2 flex items-center justify-center shadow-lg progam__image"
          >
            <img
              v-if="program.images.length > 0"
              class=""
              :src="
                imageLocation +
                  program.images[0].file_id.private_hash +
                  '?key=medium'
              "
              :alt="program.title"
            />
          </div>
          <h1 class="w-1/2 uppercase green pl-4 text-left program__page-title">
            <span class=" navy">Program: </span> {{ program.title }}
          </h1>
        </div>
        <div
          v-if="program.counties.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <!-- <h4 class="uppercase green mb-2">Counties Served:</h4> -->
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-2">
              {{ program.counties.length }} Counties Served:
            </h4>
            <h5
              v-for="(county, index) in program.counties"
              :key="index"
              class="uppercase mr-1 mb-2"
            >
              {{ county.county_id.title }}
              <span v-if="index + 1 < program.counties.length" class="green">
                /</span
              >
            </h5>
          </div>
        </div>
        <div
          v-if="program.initiatives.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <!-- <h4 class="uppercase green mb-2">{{program.initiatives.length}} Initiatives Served:</h4> -->
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-2">
              {{ program.initiatives.length }} Initiatives Served:
            </h4>
            <h5
              v-for="(initiative, index) in program.initiatives"
              :key="index"
              class="uppercase mr-1 mb-2"
            >
              {{ initiative.initiative_id.title }}
              <span v-if="index + 1 < program.initiatives.length" class="green">
                /</span
              >
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex relative justify-center items-center flex-col relative program__section"
    >
      <h3 id="purpose-title" class="uppercase green relative program__title">
        What is it?
      </h3>

      <div
        id="the-goal-description"
        class="relative p-6 program__description"
        v-html="program.what_is_it"
      ></div>
    </div>
    <div
      class="flex relative justify-center items-center flex-col relative program__section"
    >
      <h3
        id="accomplishes-title"
        class="uppercase green relative program__title"
      >
        What it accomplishes.
      </h3>

      <div
        id="the-challenge-description"
        class="relative p-6 program__description"
        v-html="program.what_it_accomplishes"
      ></div>
    </div>
    <div
      id="program__partners"
      class="w-full flex flex-col items-center justify-center program__section"
    >
      <h3 class="uppercase green relative program__title">
        Partners
      </h3>
      <div
        class="w-full flex flex-row justify-center items-center flex-wrap mt-6 px-10 max-w-5xl"
      >
        <div
          v-for="partner in program.partners"
          :key="partner.partner_id.sort"
          class="rounded-full flex items-center justify-center partners-badge"
        >
          <img
            v-if="partner.partner_id.logo"
            :src="
              imageLocation +
                partner.partner_id.logo.private_hash +
                '?key=thumbnail'
            "
            :alt="partner.partner_id.title"
            :width="partner.partner_id.logo.width"
            :height="partner.partner_id.logo.height"
          />
        </div>
      </div>
    </div>
    <div
      v-if="resources.length"
      id="program__resources"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative program__section"
    >
      <h2 class="uppercase green relative program__title">
        Resources
      </h2>
      <swiper
        :options="resourcesSwiperOption"
        class="swiper w-full flex flex-row items-center justify-center pt-4 pb-4"
      >
        <swiper-slide
          v-for="(item, index) in resources"
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
    <div
      v-if="news.length"
      id="program__news"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative program__section"
    >
      <h2 class="uppercase green relative program__title">
        Related News
      </h2>
      <swiper
        :options="resourcesSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(item, index) in news"
          :key="index"
          class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
        >
          <news-card-vertical :item="item.news_id"></news-card-vertical>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
    </div>
    <div
      id="program__programs"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative program__section"
    >
      <h2 class="uppercase green relative program__title">
        Explore Our Programs
      </h2>
      <swiper
        :options="programsSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="program in programs"
          :key="program.sort"
          class="flex flex-col items-center justify-center px-3 sm:px-8"
        >
          <program-card :program="program"></program-card>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import programCard from '~/components/programs/programCard'
import newsCardVertical from '~/components/now/newsCardVertical'
import resourceCard from '~/components/now/resourceCard'
export default {
  components: {
    Swiper,
    SwiperSlide,
    programCard,
    newsCardVertical,
    resourceCard
  },
  async asyncData({ params, $axios }) {
    const [programReq] = await Promise.all([
      $axios.$get(
        '/items/programs?filter[url][eq]=' +
          params.slug +
          '&fields=*.*.*.*.*&single=1'
      )
    ])
    return {
      program: programReq.data,
      news: programReq.data.news,
      resources: programReq.data.resources
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      programs: [],
      resourcesSwiperOption: {
        // freeMode: true,
        // freeModeSticky: true,
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        // centeredSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
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
          hideOnClick: true
        }
      },
      programsSwiperOption: {
        // freeMode: true,
        // freeModeSticky: true,
        // slidesPerView: 'auto',
        // slidesOffsetBefore: 15,
        centeredSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
        },
        breakpoints: {
          1024: {
            // slidesOffsetBefore: 24
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true
        }
      }
    }
  },
  head() {},
  created() {
    this.$axios
      .$get(
        '/items/programs?filter[id][neq]=' + this.program.id + '&fields=*.*.*'
      )
      .then((response) => {
        console.log(response)
        this.programs = response.data
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {}
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/program';
</style>
