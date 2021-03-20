<template>
  <div id="news" class="flex flex-col items-center justify-center pb-32">
    <div
      id="news__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font"
      >
        News
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-3/5">
        The latest economic and community development news from the Southern
        Tier 8 region.
      </p>
    </div>
    <div
      id="news__news-cards"
      class="relative w-full flex items-center justify-center flex-col pb-20"
    >
      <!-- <div class="w-full text-center px-8 mb-4 news__filters">
        <input
          v-model="search"
          class="condensed uppercase shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline search-input"
          type="text"
          placeholder="Search."
        />
      </div> -->

      <transition-group
        name="list"
        mode="out-in"
        tag="div"
        class="w-full flex flex-col items-center justify-center px-3 sm:px-8"
      >
        <news-card
          v-for="item in filteredArticles"
          :key="item.id"
          :item="item"
        ></news-card>
      </transition-group>
      <transition
        mode="out-in"
        enter-active-class="uk-animation-fade"
        leave-active-class="uk-animation-fade uk-animation-fast"
      >
        <p
          v-if="filteredArticles.length < 1"
          class="uppercase text-xs tracking-widest mt-24 text-center"
        >
          there were no results.
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import newsCard from '~/components/now/newsCard'
export default {
  components: {
    newsCard,
  },
  async asyncData({ params, $axios }) {
    const [newsReq] = await Promise.all([
      $axios.$get(
        '/items/news?fields=id,title,article,url,cover_image.private_hash,tags,type,featured,date_published,link,initiatives.initiative_id.title,programs.*,related_resources.*&filter[status]=published&sort=-date_published'
      ),
    ])
    return {
      news: newsReq.data,
    }
  },
  data() {
    return {
      search: '',
    }
  },
  head() {
    return {
      title: "Regional News for the Southern Tier Region's Economy",
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: "Regional News for the Southern Tier Region's Economy",
        },
        {
          hid: 'description',
          property: 'description',
          content:
            'Regional news focused on the economic development for the Southern Tier region of New York.',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://southerntier8.org/regional-news/',
        },
      ],
    }
  },
  computed: {
    filteredArticles() {
      const app = this
      const search = app.search
      if (search === '') {
        return app.news
      } else {
        return app.news.filter(function (item) {
          return (
            search === '' ||
            item.tags.includes(app.search.toLowerCase()) ||
            item.title.includes(app.search.toLowerCase())
          )
        })
      }
    },
  },
  // beforeDestroy() {
  //   window.removeEventListener('scroll', this.lineFunction)
  // },
  // mounted() {
  //   const straightLine = document.getElementById('straight-line')
  //   const straightLength = straightLine.getTotalLength()
  //   straightLine.style.strokeDasharray = straightLength
  //   straightLine.style.strokeDashoffset = straightLength
  //   // desktop line animation
  //
  //   window.addEventListener('scroll', this.lineFunction)
  // },
  created() {},
  methods: {
    // lineFunction() {
    //   const straightLine = document.getElementById('straight-line')
    //   const straightLength = straightLine.getTotalLength()
    //
    //   requestAnimationFrame(function () {
    //     const svgContainer = document.getElementById('news__news-cards')
    //     const svgContainerRect = svgContainer.getBoundingClientRect()
    //     const svgDivHeight = svgContainerRect.height
    //     const windowScroll = window.pageYOffset
    //     const scrollPercent = (windowScroll / svgDivHeight) * 0.8
    //     if (scrollPercent < 1) {
    //       const drawStraight = straightLength * scrollPercent
    //       straightLine.style.strokeDashoffset = straightLength - drawStraight
    //     }
    //   })
    // },
    checkInitiative() {
      if (this.programFilters.includes('Workforce Development')) {
        console.log('Yes')
      }
    },
    removeFilter(value) {
      const app = this
      const index = app.programFilters.indexOf(value)
      if (index > -1) {
        app.programFilters.splice(index, 1)
      }
      return app.programFilters
    },
    setFilter(filter) {
      const app = this
      console.log(filter)
      if (app.programFilters.includes(filter)) {
        app.removeFilter(filter)
      } else {
        app.programFilters.push(filter)
      }

      console.log(app.programFilters)
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/news';
</style>
