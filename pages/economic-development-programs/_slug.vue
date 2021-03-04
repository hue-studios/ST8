<template>
  <div id="program" class="relative">
    <div
      id="program__intro"
      class="flex flex-col justify-center items-center relative"
    >
      <div
        id="program__intro-caption"
        class="flex items-center justify-center flex-col relative lg:py-8 max-w-4xl"
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
          <h1
            class="w-1/2 uppercase green pl-4 text-left program__page-title"
            :class="{ 'text-xs': tooLong }"
          >
            <span class=" navy">Program: </span>
            {{ program.title }}
          </h1>
        </div>
        <div
          v-if="program.counties.length > 0"
          class="w-5/6 lg:w-full flex flex-col items-center justify-center pt-6 mt-4 program__stats"
        >
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.counties.length }} Count<span
                v-if="program.counties.length > 1"
                >ies</span
              ><span v-else>y</span> Served:
            </h4>
            <h5
              v-for="(county, index) in program.counties"
              :key="index"
              class="uppercase mr-1 mb-1"
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
          <div
            class="w-full flex flex-row flex-wrap items-center justify-start"
          >
            <h4 class="uppercase green mr-2 mb-1 bold">
              {{ program.initiatives.length }} Initiative<span
                v-if="program.initiatives.length > 1"
                >s</span
              >
              Served:
            </h4>
            <h5
              v-for="(initiative, index) in program.initiatives"
              :key="index"
              class="uppercase mr-1 mb-1"
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
      id="program__story"
      class="flex flex-col justify-start items-center relative program__story"
    >
      <svg
        id="start-btn"
        class="button"
        expanded="true"
        height="41px"
        width="41px"
      >
        <circle fill="#1accb8" cx="50%" cy="50%" r="7px"></circle>
        <circle class="pulse" cx="50%" cy="50%" r="10px"></circle>
        <circle class="pulse2" cx="50%" cy="50%" r="10px"></circle>
      </svg>
      <svg
        id="straightLineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 695.51"
      >
        <path
          id="straight-line"
          data-name="Path 6808"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M.5,0V695.51"
        />
      </svg>
      <svg
        id="lineSVG"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 963 1479.58"
      >
        <path
          id="program-line"
          class="cls-1"
          fill="none"
          stroke="#1accb8"
          stroke-width="2"
          d="M961.5,0V155.37H1.5V456.1h960V753.44H481.12v300.23H1.5v298.51H481.12v127.4"
        />
      </svg>

      <h3 id="purpose-title" class="uppercase green relative program__title">
        What it is.
      </h3>

      <div
        id="purpose-description"
        class="relative p-6 program__description"
        v-html="program.what_is_it"
      ></div>

      <h3
        id="accomplishes-title"
        class="uppercase green relative program__title"
      >
        What it accomplishes.
      </h3>

      <div
        id="accomplishes-description"
        class="relative p-6 program__description"
        v-html="program.what_it_accomplishes"
      ></div>
      <svg
        id="finish-btn"
        class="button"
        expanded="true"
        height="41px"
        width="41px"
      >
        <circle fill="#1accb8" cx="50%" cy="50%" r="7px"></circle>
        <circle class="pulse" cx="50%" cy="50%" r="10px"></circle>
        <circle class="pulse2" cx="50%" cy="50%" r="10px"></circle>
      </svg>
    </div>
    <div
      class="flex flex-col justify-center items-center relative program__related"
    >
      <h3 class="uppercase green relative program__title">
        Partners
      </h3>
      <p class="px-4 text-center program__p">
        We had
        <span class="bold"
          >{{ program.partners.length }} partner<span
            v-if="program.partners.length > 1"
            >s</span
          ></span
        >
        for the {{ program.title }} program.
      </p>
      <div
        id="program__partners"
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
      <div
        v-if="resources.length"
        id="program__resources"
        class="w-full flex relative justify-center items-center flex-row flex-wrap relative"
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
          '&fields=id,title,what_is_it,what_it_accomplishes,url,counties.county_id.title,initiatives.initiative_id.title,images.file_id.private_hash,partners.partner_id.title,partners.partner_id.logo.private_hash,resources.resources_id.title,resources.resources_id.type,resources.resources_id.file.private_hash,news.news_id.title,news.news_id.article,news.news_id.link,news.news_id.type,news.news_id.tags,news.news_id.date_published,news.news_id.url,news.news_id.link,url,news.news_id.cover_image.private_hash&single=1'
      )
    ])
    return {
      program: programReq.data,
      news: programReq.data.news,
      resources: programReq.data.resources
    }
  },
  data(app) {
    return {
      imageLocation: process.env.imageUrl,
      programs: [],

      resourcesSwiperOption: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        centeredSlides: true,
        initialSlide: 1,
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
      },
      tooLong: false
    }
  },
  head() {},
  beforeDestroy() {
    window.removeEventListener('scroll', this.lineFunction)
  },
  mounted() {
    // mobile line animation
    const straightLine = document.getElementById('straight-line')
    const straightLength = straightLine.getTotalLength()
    straightLine.style.strokeDasharray = straightLength
    straightLine.style.strokeDashoffset = straightLength
    // desktop line animation
    const longLine = document.getElementById('program-line')
    const length = longLine.getTotalLength()
    longLine.style.strokeDasharray = length
    longLine.style.strokeDashoffset = length
    window.addEventListener('scroll', this.lineFunction)
  },
  created() {
    this.$axios
      .$get(
        '/items/programs?filter[id][neq]=' +
          this.program.id +
          '&fields=id,title,what_is_it,url,counties.county_id.title,initiatives.initiative_id.title,images.file_id.private_hash,partners.partner_id.title'
      )
      .then((response) => {
        this.programs = response.data
      })
      .catch(function(error) {
        console.log(error)
      })
    this.countTitle(this.program.title)
  },
  methods: {
    lineFunction() {
      const straightLine = document.getElementById('straight-line')
      const straightLength = straightLine.getTotalLength()
      const longLine = document.getElementById('program-line')
      const length = longLine.getTotalLength()
      requestAnimationFrame(function() {
        const svgContainer = document.getElementById('program__story')
        const svgContainerRect = svgContainer.getBoundingClientRect()
        const svgDivHeight = svgContainerRect.height
        const windowScroll = window.pageYOffset
        const scrollPercent = (windowScroll / svgDivHeight) * 0.72
        if (scrollPercent < 1) {
          const draw = length * scrollPercent
          longLine.style.strokeDashoffset = length - draw
          const drawStraight = straightLength * scrollPercent
          straightLine.style.strokeDashoffset = straightLength - drawStraight
        }
      })
    },
    countTitle(title) {
      if (title.length > 30) {
        this.tooLong = true
      } else {
        this.tooLong = false
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/program';
</style>
