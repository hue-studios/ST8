<template>
  <div id="home" :class="{ index: $store.state.page === 'index' }">
    <div
      id="home__intro"
      class="flex flex-col justify-center items-center relative"
      :class="{ show: panel !== 'home' }"
    >
      <a id="home-intro__logo" @click.prevent="changePanelTwo()">
        <logo-name></logo-name>
        <h5 class="uppercase absolute">Regional Board</h5>
        <pulse-icon icon-i-d="" class-name="block button"></pulse-icon>
      </a>

      <div
        id="home-intro__navigation"
        class="w-full flex justify-around items-center absolute home-intro__navigation"
      >
        <a
          :class="[panel === 'active' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('active', 1)"
        >
          Active</a
        >
        <a
          :class="[panel === 'regional' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('regional', 2)"
          >Regional</a
        >
        <a
          :class="[panel === 'now' ? 'current' : '']"
          class="uppercase tracking-widest home-intro__navigation-btn"
          @click.prevent="changePanel('now', 3)"
          >Now</a
        >
      </div>
      <h4
        v-if="homeData.introduction"
        :class="{ hide: hideMessage }"
        class="bold navy tracking-wider absolute home-intro__intro"
      >
        {{ homeData.introduction }}
      </h4>
      <h4
        v-else
        :class="{ hide: hideMessage }"
        class="bold navy uppercase tracking-widest absolute home-intro__intro"
      >
        Welcome to our digital experience.
      </h4>

      <transition
        :enter-active-class="animateIn"
        :leave-active-class="animateOut"
        mode="out-in"
      >
        <div v-if="panel === 'home'" key="0"></div>
        <div
          v-if="panel === 'active'"
          id="active-caption"
          key="1"
          :class="{ show: panel === 'active' }"
          class="home-intro__navigation-description"
        >
          <h5 class="text-center uppercase grey tracking-widest mb-4">
            Active
          </h5>
          <p>
            Our <strong>Initiatives</strong>, <strong>Programs</strong>, and
            <strong>Services</strong> are designed to serve and adapt to the
            region’s economic, workforce, infrastructure, rural, and quality of
            life needs. We are <strong>ACTIVE</strong> because we are always
            evolving and partnering with organizations throughout the region to
            create innovative, practical, and timely solutions with vision,
            dedication, and commitment to our region’s growth and success.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <nuxt-link
              to="/economic-development-initiatives"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Initiatives
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/economic-development-programs"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Programs
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/economic-development-services"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Services
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
          </div>
        </div>

        <div
          v-if="panel === 'regional'"
          id="regional-caption"
          key="2"
          :class="{ show: panel === 'regional' }"
          class="home-intro__navigation-description"
        >
          <h5 class="uppercase grey tracking-widest mb-4 text-center">
            Regional
          </h5>
          <p>
            We are an 8 County Organization so we are not one place, one county,
            we cover a large portion of Upstate NY. Every county that is part of
            our organization is unique with its own natural, economic, and
            business assets. We are committed to evaluating and innovating for
            each, while still looking at the strength of our region as a whole.
            We believe that as one <strong>united region</strong>, we are
            stronger, we build a more <strong>powerful economy</strong>, and
            create the best opportunities for <strong>growth</strong>.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <nuxt-link
              to="/regional-partnerships"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Partnerships
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/regional-profile"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Profile
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/regional-organization"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Organization
              <pulse-icon
                icon-i-d=""
                class-name="inline-block button"
              ></pulse-icon
            ></nuxt-link>
          </div>
        </div>

        <div
          v-if="panel === 'now'"
          id="now-caption"
          key="3"
          :class="{ show: panel === 'now' }"
          class="home-intro__navigation-description"
        >
          <h5 class="uppercase grey tracking-widest mb-4 text-center">Now</h5>
          <p>
            Our <strong>News</strong>, <strong>Resources</strong>, and
            <strong>Events</strong> are published to share progress of our
            organization’s initiatives, programs, and services. We also focus on
            gathering and announcing funding opportunities to help county
            legislatures and organizations benefit from every opportunity that
            is available to them in order to continually strengthen the economic
            growth of our region.
          </p>
          <div class="w-full flex items-center justify-center flex-row">
            <nuxt-link
              to="/regional-news"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >News
              <pulse-icon icon-i-d="" class-name="block button"></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/regional-events"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Events
              <pulse-icon icon-i-d="" class-name="block button"></pulse-icon
            ></nuxt-link>
            <nuxt-link
              to="/regional-news/resources"
              class="green w-full text-center mt-4 tracking-widest uppercase inline-block flex items-center justify-center flex-col link-font"
              >Resources
              <pulse-icon icon-i-d="" class-name="block button"></pulse-icon
            ></nuxt-link>
          </div>
        </div>
      </transition>
      <div
        class="absolute home-intro__scroll-icon"
        data-section="#home__mission"
        @click.prevent="smoothScroll('#home__mission')"
      >
        <chevron-down-icon size="1.5x"></chevron-down-icon>
      </div>
    </div>
    <div
      id="home__mission"
      class="w-full flex items-start justify-end flex-col relative"
    >
      <div
        id="mission"
        class="flex flex-col lg:flex-row justify-center items-start mb-20 md:mb-24 lg:mb-32 xl:mb-40 statement"
      >
        <h2 class="uppercase white tracking-wider thin-font mb-2 lg:mb-0">
          Mission Statement
        </h2>
        <p class="white xl:ml-2">{{ organization.mission_statement }}</p>
      </div>
      <nuxt-link
        to="/regional-organization"
        class="uppercase green pt-2 link-font"
        >Learn More<span class="hidden md:inline-block ml-2">
          About Southern Tier 8</span
        >
        <link-icon class="ml-1"></link-icon
      ></nuxt-link>
      <div id="cropped-overlay" class="absolute"></div>
    </div>
    <div
      v-if="homeData.featured_resource"
      id="home__resource"
      class="w-full flex justify-center items-center flex-row flex-wrap relative shadow-lg home__section"
    >
      <h2
        class="uppercase green relative thin-font grey w-full mb-2 pl-2 home__title"
      >
        <span class="green small-title block tracking-widest bold"
          >Featured </span
        >Resource
      </h2>
      <now-resource-card-data
        :item="homeData.featured_resource"
        class="inline-block"
      />
    </div>
    <iframe
      src="https://betterconnection.org/banner"
      height="350"
      width="100%"
      border="0"
    ></iframe>
    <div
      v-if="news.length"
      id="home__news"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative shadow-lg home__section"
    >
      <h2
        class="uppercase green relative thin-font grey w-full mb-2 pl-2 home__title"
      >
        <span class="green small-title block tracking-widest bold"
          >Featured </span
        >News
      </h2>
      <div class="w-full pl-3 pr-3 mb-2 lg:pl-5 lg:pr-5 home__subtitle">
        <p class="">
          Read the latest news from the Southern Tier region focused on economic
          development, workforce initiatives, and all things regional.
        </p>
      </div>
      <swiper
        :options="newsSwiperOption"
        class="swiper w-full flex flex-row pt-4 pb-4"
      >
        <swiper-slide
          v-for="(item, index) in news"
          :key="index"
          class="flex flex-col items-center justify-center px-3 sm:px-8 pt-4 pb-8"
        >
          <news-card-vertical :item="item"></news-card-vertical>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-next" class="swiper-button-next"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
      </swiper>
      <nuxt-link
        to="/regional-news"
        class="green w-full text-center pt-8 tracking-widest uppercase link-font"
        >View All {{ newsMeta.meta.status_count.published }} Articles
        <link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>
    <div
      id="home__funding"
      class="w-full flex relative justify-center items-center flex-col flex-wrap relative home__section"
    >
      <h2
        class="uppercase thin-font w-full relative mb-2 pl-2 green home__title"
      >
        Looking for funding?
      </h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 white home__subtitle">
        <p class="">
          Our team will assist applicants with questions about program
          development, partner engagement, grant writing, match support
          requirements and budgets.
        </p>
      </div>
      <nuxt-link to="how-to-apply" class="mt-4 sm:mt-8 uppercase py-4 px-12"
        >ARC Opportunities<link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>

    <div
      id="home__partners"
      class="w-full flex justify-center items-center md:items-end flex-col flex-wrap relative shadow-lg home__section"
    >
      <h2
        class="uppercase thin-font grey w-full relative mb-2 pl-2 home__title"
      >
        Partnerships
        <span class="absolute right-0 tracking-widest navy pr-1 date">{{
          $moment().format('MMMM Do, YYYY')
        }}</span>
      </h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 home__subtitle">
        <p class="">
          We partner with numerous organizations to collaborate on programs that
          support our mission.
        </p>
      </div>
      <observer
        :options="options"
        @intersect="
          animateValue(
            'regional-total',
            0,
            regionalPartners.length,
            regionalPartners.length * 75
          )
        "
      ></observer>
      <h3
        v-if="regionalPartners.length"
        class="uppercase w-5/6 md:w-1/2 flex items-center justify-start flex-row py-4"
      >
        <span id="regional-total" class="green thin-font number">{{
          regionalPartners.length
        }}</span>
        Federal &amp; State Partners
      </h3>
      <observer
        :options="options"
        @intersect="
          animateValue(
            'planner-total',
            0,
            plannerPartners.length,
            plannerPartners.length * 75
          )
        "
      ></observer>
      <h3
        v-if="plannerPartners.length"
        class="uppercase w-5/6 md:w-1/2 flex items-center justify-start flex-row py-4"
      >
        <span id="planner-total" class="green thin-font number">{{
          plannerPartners.length
        }}</span>
        County Planners
      </h3>
      <observer
        :options="options"
        @intersect="
          animateValue(
            'developer-total',
            0,
            developerPartners.length,
            developerPartners.length * 75
          )
        "
      ></observer>
      <h3
        v-if="developerPartners.length"
        class="uppercase w-5/6 md:w-1/2 flex items-center justify-start flex-row py-4"
      >
        <span id="developer-total" class="green thin-font number">{{
          developerPartners.length
        }}</span>
        Economic Development Agencies
      </h3>
      <observer
        :options="options"
        @intersect="
          animateValue(
            'workforce-total',
            0,
            workforcePartners.length,
            workforcePartners.length * 75
          )
        "
      ></observer>
      <h3
        v-if="workforcePartners.length"
        class="uppercase w-5/6 md:w-1/2 flex items-center justify-start flex-row py-4"
      >
        <span id="workforce-total" class="green thin-font number">{{
          workforcePartners.length
        }}</span>
        Workforce Partners
      </h3>

      <nuxt-link
        to="/regional-partnerships"
        class="green w-full text-center pt-8 link-font"
        >LEARN MORE<span class="hidden sm:inline-block ml-2">
          ABOUT PARTNERSHIPS</span
        ><span class="hidden md:inline-block ml-2">
          AND HOW YOU CAN BE INVOLVED</span
        >
        <link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>

    <div
      id="home__programs"
      class="w-full flex relative justify-center items-center flex-row flex-wrap relative home__section"
    >
      <h2
        class="uppercase green relative thin-font grey mb-2 pl-2 w-full home__title"
      >
        <span class="green small-title block tracking-widest bold"
          >Featured </span
        >Programs
      </h2>
      <div class="w-full pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 home__subtitle">
        <p class="">
          Our programs are designed to help grow our region. Select a program
          below to learn the what it is, who we partnered with, and what it
          accomplishes.
        </p>
      </div>
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
      <nuxt-link
        to="/economic-development-programs"
        class="green w-full text-center pt-8 tracking-widest uppercase link-font"
        >View All {{ programsMeta.meta.status_count.published }} Programs
        <link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>
    <div
      id="home__data"
      class="w-full flex relative justify-center items-center flex-col relative shadow-lg home__section"
    >
      <h2
        class="uppercase green relative thin-font grey mb-2 pl-2 pr-2 w-full text-center home__title"
      >
        <span class="green small-title block tracking-widest bold"
          >Featured Regional </span
        >Data
      </h2>
      <div class="pl-3 pr-3 lg:pl-5 lg:pr-5 mb-8 text-center home__subtitle">
        <p class="">
          The Southern Tier region features 10 major industry sectors.
        </p>
      </div>
      <industry-chart></industry-chart>
      <nuxt-link
        to="/regional-profile"
        class="green w-full text-center pt-16 tracking-widest uppercase link-font"
        >View Regional Profile <link-icon class="ml-2"></link-icon
      ></nuxt-link>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { ChevronDownIcon } from 'vue-feather-icons'
import observer from '~/components/utilities/observer'
import pulseIcon from '~/components/universal/pulseIcon'
import linkIcon from '~/components/universal/linkIcon'
import logoName from '~/components/layout/logoName'
import programCard from '~/components/programs/programCard'
import newsCardVertical from '~/components/now/newsCardVertical'
import nowResourceCardData from '~/components/now/resourceCardData'
import industryChart from '~/components/industryChart'

export default {
  components: {
    ChevronDownIcon,
    pulseIcon,
    logoName,
    Swiper,
    SwiperSlide,
    programCard,
    newsCardVertical,
    linkIcon,
    observer,
    nowResourceCardData,
    industryChart,
  },
  async asyncData({ app, $axios }) {
    const [
      partnersReq,
      newsReq,
      // eventsReq,
      programsReq,
      organizationReq,
      // resourceReq,
      homeReq,
    ] = await Promise.all([
      $axios.get(process.env.apiUrl + '/items/partners?fields=title,category'),
      $axios.get(
        process.env.apiUrl +
          '/items/news?fields=title,article,url,cover_image.private_hash,featured,date_published,type,link,tags&filter[featured]=1&meta=*&filter[status]=published&sort=-date_published'
      ),
      // $axios.get(process.env.apiUrl + '/items/events?fields=*.*.*'),
      $axios.get(
        process.env.apiUrl +
          '/items/programs?fields=title,what_is_it,url,featured,counties.county_id.title,images.file_id.private_hash,initiatives.initiative_id.title,partners.partner_id.title&filter[featured]=1&meta=*'
      ),
      $axios.$get('/items/organization?single=1&fields=mission_statement'),
      // $axios.$get('/items/resources/80?fields=*.*'),
      $axios.$get(
        '/items/home?fields=introduction,featured_resource.*,featured_resource.programs.programs_id.*,featured_resource.file.private_hash&single=1'
      ),
    ])
    return {
      partners: partnersReq.data.data,
      news: newsReq.data.data,
      newsMeta: newsReq.data,
      // events: eventsReq.data.data,
      programs: programsReq.data.data,
      programsMeta: programsReq.data,
      organization: organizationReq.data,
      // resource: resourceReq.data,
      homeData: homeReq.data,
    }
  },
  data() {
    return {
      hideMessage: false,
      panel: 'home',
      previousPanelKey: 1,
      panelKey: 0,
      animateIn: 'uk-animation-slide-right-medium uk-animation-fast',
      animateOut:
        'uk-animation-slide-left-medium uk-animation-reverse uk-animation-fast',
      options: {
        rootMargin: '0px',
        threshold: 1.0,
      },
      jotForm: '',
      newsSwiperOption: {
        slidesPerView: 'auto',
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        centeredSlides: false,
        spaceBetween: 30,
        loop: false,
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
      programsSwiperOption: {
        centeredSlides: true,
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

  computed: {
    regionalPartners() {
      const vm = this
      return vm.partners.filter(function (item) {
        return item.category.includes('Regional')
      })
    },
    plannerPartners() {
      const vm = this
      return vm.partners.filter(function (item) {
        return item.category.includes('Planner')
      })
    },
    developerPartners() {
      const vm = this
      return vm.partners.filter(function (item) {
        return item.category.includes('Economic Developer')
      })
    },
    workforcePartners() {
      const vm = this
      return vm.partners.filter(function (item) {
        return item.category.includes('Workforce')
      })
    },
  },
  // beforeDestroy() {
  //   gsap.registerPlugin(ScrollTrigger)
  //   ScrollTrigger.disable()
  // },
  mounted() {
    console.log(this.homeData)
    gsap.registerPlugin(ScrollTrigger)
    // ScrollTrigger.create({
    //   trigger: '#home__partners',
    //   start: 'top ',
    //   end: 'bottom',
    //   scrub: true,
    //   onEnter: this.animateValue(
    //     'planner-total',
    //     0,
    //     this.plannerPartners.length,
    //     this.plannerPartners.length * 100
    //   )
    // })

    ScrollTrigger.matchMedia({
      '(max-width: 1023px)'() {
        gsap.to('#cropped-overlay', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '100px',
        })
        gsap.to('#mission', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '-100px',
        })
      },
      '(min-width: 1024px) and (max-width: 1279px)'() {
        gsap.to('#cropped-overlay', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '100px',
        })
        gsap.to('#mission', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '-100px',
        })
      },
      '(min-width: 1280px)'() {
        gsap.to('#cropped-overlay', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '-100px',
        })
        gsap.to('#mission', {
          scrollTrigger: {
            trigger: '#home__mission',
            start: 'top bottom-=100px',
            end: '+=200%',
            scrub: true,
          },
          x: '100px',
        })
      },
    })
  },
  created() {
    this.$axios
      .$get('/items/resources?single=1&fields=*&filter[title][contains]=Pre')
      .then((response) => {
        this.jotForm = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    smoothScroll(element) {
      console.log(element)

      const offsetTop = document.querySelector(element).offsetTop
      scroll({
        top: offsetTop,
        behavior: 'smooth',
      })
    },
    animateValue(id, start, end, duration) {
      if (start === end) return
      const range = end - start
      let current = start
      const increment = end > start ? 1 : -1
      const stepTime = Math.abs(Math.floor(duration / range))
      const obj = document.getElementById(id)
      const timer = setInterval(function () {
        current += increment
        obj.innerHTML = current
        if (current === end) {
          clearInterval(timer)
        }
      }, stepTime)
    },
    changePanel(panel, key) {
      // const container = document.getElementById('home__intro')
      //
      // console.log(panel !== 'home')
      // if (panel !== 'home') {
      //   container.classList.add('show')
      //   console.log(container)
      // } else {
      //   container.classList.remove('show')
      // }
      this.hideMessage = true
      if (this.previousPanelKey < key) {
        this.animateIn = 'uk-animation-slide-right-medium uk-animation-fast'
        this.animateOut =
          'uk-animation-slide-left-medium uk-animation-reverse uk-animation-fast'
      } else {
        this.animateIn = 'uk-animation-slide-left-medium uk-animation-fast'
        this.animateOut =
          'uk-animation-slide-right-medium uk-animation-reverse uk-animation-fast'
      }
      this.previousPanelKey = key
      this.panel = panel
    },
    changePanelTwo() {
      this.hideMessage = true
      if (this.panel === 'home') {
        this.animateIn = 'uk-animation-slide-left-medium uk-animation-fast'
        this.animateOut =
          'uk-animation-slide-right-medium uk-animation-reverse uk-animation-fast'
        this.panel = 'active'
        this.previousPanelKey = 1
      } else {
        this.animateIn = 'uk-animation-slide-right-medium uk-animation-fast'
        this.animateOut =
          'uk-animation-slide-left-medium uk-animation-reverse uk-animation-fast'
        this.panel = 'home'
        this.previousPanelKey = 0
        this.hideMessage = false
      }
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/swiper';
@import './assets/scss/pages/home';
</style>
