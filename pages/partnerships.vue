<template>
  <div id="partnerships" class="flex flex-col items-center justify-center">
    <div
      id="partnerships__intro"
      class="relative flex flex-col items-center justify-center w-full"
    >
      <h3 class="w-full text-center navy lowercase thin-font mb-8">
        [ <span class="green">pahrt</span>-ner-ship ]
      </h3>
      <p class="navy uppercase tracking-wider w-5/6 text-center">
        <span class="bold font-black">Def:</span> the state or condition of
        being a partner; participation; association; joint interest.
      </p>
      <h5 class="absolute green uppercase tracking-widest w-5/6 text-center">
        Our joint interest is the Southern Tier 8 region.
      </h5>
    </div>
    <div
      id="partnerships__everything"
      class="w-full flex flex-col items-center justify-center partnerships__section"
    >
      <h2
        class="w-full text-center uppercase thin-font mb-2 partnerships__title"
      >
        Partnerships are Everything
      </h2>
      <p>
        One of the main goals of our organization at Southern Tier 8, is to
        encourage and promote partnership in all that we do, or anything we get
        involved with. We believe that only in this manner can we accomplish
        things more effectively, smoothly, and creatively.
      </p>
      <p>
        As a regional organization for the Southern Tier, we have the task of
        assisting 8 counties in Upstate NY, hence why we strongly believe that
        only by working together with our partners we’ll find the best solutions
        for any challenge at hand.
      </p>
      <p>
        We love our partnerships and we are always open to any ideas,
        collaboration concepts, project discussions…anything that it takes to
        help continually evolve our region.
      </p>
      <p>
        We welcome organizations and municipalities to partner with us to
        accomplish ideas, tackle challenges, and accomplish crucial projects
        with innovative solutions and collaboration to help grow the Southern
        Tier 8 region.
      </p>
    </div>
    <div
      id="partnerships__regional"
      class="w-full flex flex-col items-center justify-center partnerships__section"
    >
      <h2 class="w-full text-center uppercase thin-font partnerships__title">
        OUR FEDERAL AND STATE PARTNERS
      </h2>
      <div
        class="w-full flex items-center justify-center flex-col partnerships__partner-category"
      >
        <h3 class="green thin-font mt-8 mb-1 number">
          <span v-if="regionalPartners.length < 10">0</span
          >{{ regionalPartners.length }}
        </h3>

        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <swiper
            :options="swiperOptions"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <swiper-slide
              v-for="(item, index) in regionalPartners"
              :key="index"
              class="px-3 sm:px-8 pt-4 pb-8 partnerships__partner"
            >
              <a
                :href="item.website"
                target="_blank"
                class="shadow-lg border-gray-100 rounded-full bg-cover bg-no-repeat mx-4"
                :style="
                  'background-image: url(' +
                    imageLocation +
                    item.logo.private_hash +
                    ')'
                "
              ></a>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination"></div>
            <div slot="button-next" class="swiper-button-next"></div>
            <div slot="button-prev" class="swiper-button-prev"></div>
          </swiper>
        </div>
      </div>
    </div>
    <div
      id="partnerships__county"
      class="w-full flex flex-col items-center justify-center partnerships__section"
    >
      <h2 class="w-full text-center uppercase thin-font partnerships__title">
        OUR COUNTY PARTNERS
      </h2>

      <div
        class="w-full flex items-center justify-center flex-col partnerships__partner-category"
      >
        <h3 class="green thin-font mt-8 number">
          <span v-if="plannerPartners.length < 10">0</span
          >{{ plannerPartners.length }}
        </h3>
        <h5 class="uppercase grey tracking-widest bold mt-1 mb-1 title">
          County Planners
        </h5>
        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <swiper
            :options="swiperOptions"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <swiper-slide
              v-for="(item, index) in plannerPartners"
              :key="index"
              class="px-3 sm:px-8 pt-4 pb-8 partnerships__partner"
            >
              <a
                :href="item.website"
                target="_blank"
                class="shadow-lg border-gray-100 rounded-full bg-cover bg-no-repeat mx-4"
                :style="
                  'background-image: url(' +
                    imageLocation +
                    item.logo.private_hash +
                    ')'
                "
              ></a>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination"></div>
            <div slot="button-next" class="swiper-button-next"></div>
            <div slot="button-prev" class="swiper-button-prev"></div>
          </swiper>
        </div>
      </div>
      <div
        class="w-full flex items-center justify-center flex-col partnerships__partner-category"
      >
        <h3 class="green thin-font mt-8 number">
          <span v-if="workforcePartners.length < 10">0</span
          >{{ workforcePartners.length }}
        </h3>
        <h5 class="uppercase grey tracking-widest bold mt-1 mb-1 title">
          Workforce Partners
        </h5>
        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <swiper
            :options="swiperOptions"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <swiper-slide
              v-for="(item, index) in workforcePartners"
              :key="index"
              class="px-3 sm:px-8 pt-4 pb-8 partnerships__partner"
            >
              <a
                :href="item.website"
                target="_blank"
                class="shadow-lg border-gray-100 rounded-full bg-no-repeat mx-4"
                :style="
                  'background-image: url(' +
                    imageLocation +
                    item.logo.private_hash +
                    ')'
                "
              ></a>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination"></div>
            <div slot="button-next" class="swiper-button-next"></div>
            <div slot="button-prev" class="swiper-button-prev"></div>
          </swiper>
        </div>
      </div>
      <div
        class="w-full flex items-center justify-center flex-col partnerships__partner-category"
      >
        <h3 class="green thin-font mt-8 number">
          <span v-if="developerPartners.length < 10">0</span
          >{{ developerPartners.length }}
        </h3>
        <h5 class="uppercase grey tracking-widest bold mt-1 mb-1 title">
          Economic Development Agencies
        </h5>
        <div class="w-full flex items-center justify-center flex-row flex-wrap">
          <swiper
            :options="swiperOptions"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <swiper-slide
              v-for="(item, index) in developerPartners"
              :key="index"
              class="px-3 sm:px-8 pt-4 pb-8 partnerships__partner"
            >
              <a
                :href="item.website"
                target="_blank"
                class="shadow-lg border-gray-100 rounded-full bg-cover bg-no-repeat mx-4"
                :style="
                  'background-image: url(' +
                    imageLocation +
                    item.logo.private_hash +
                    ')'
                "
              ></a>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination"></div>
            <div slot="button-next" class="swiper-button-next"></div>
            <div slot="button-prev" class="swiper-button-prev"></div>
          </swiper>
        </div>
      </div>
    </div>
    <div
      id="partnerships__initiatives"
      class="w-full flex flex-col items-center justify-center partnerships__section"
    >
      <h2
        class="w-full text-center uppercase thin-font partnerships__title"
      ></h2>

      <home-graphic />
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import homeGraphic from '~/components/homeGraphic'
export default {
  components: {
    homeGraphic,
    Swiper,
    SwiperSlide
  },
  async asyncData({ params, $axios }) {
    const partnersReq = await $axios.get(
      process.env.apiUrl +
        '/items/partners?fields=id,title,website,category,logo.private_hash,programs.program_id.initiatives.initiative_id.title'
    )
    return {
      partners: partnersReq.data.data
    }
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
      swiperOptions: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        centeredSlides: true,
        spaceBetween: 30,
        initialSlide: 4,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
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
  computed: {
    economicDevelopmentPartners() {
      const vm = this
      return vm.partners.filter(function(item) {
        return item.programs.program_id.initiatives.initiative_id.title.includes(
          'Economic Development'
        )
      })
    },
    regionalPartners() {
      const vm = this
      return vm.partners.filter(function(item) {
        return item.category.includes('Regional')
      })
    },
    plannerPartners() {
      const vm = this
      return vm.partners.filter(function(item) {
        return item.category.includes('Planner')
      })
    },
    developerPartners() {
      const vm = this
      return vm.partners.filter(function(item) {
        return item.category.includes('Economic Developer')
      })
    },
    workforcePartners() {
      const vm = this
      return vm.partners.filter(function(item) {
        return item.category.includes('Workforce')
      })
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/partnerships';
</style>
