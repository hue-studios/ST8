<template>
  <div id="news">
    <div
      id="news__intro"
      class="flex flex-col flex-wrap justify-center items-center relative"
    >
      <h1
        class="navy uppercase tracking-widest mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font text-center"
      >
        News
      </h1>
      <p class="navy w-5/6 sm:w-3/5 md:w-1/2 text-center">
        The latest economic and community development news from the Southern
        Tier 8 region.
      </p>
      <div class="w-full absolute background text-right">
        <h3 class="uppercase bold"></h3>
      </div>
    </div>
    <div
      id="news__news-cards"
      class="w-full flex items-center justify-center flex-col pb-20"
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
        '/items/news?fields=id,title,article,url,cover_image.private_hash,tags,type,featured,date_published,initiatives.initiative_id.title,programs.*,related_resources.*&filter[status]=published&sort=-date_published'
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
  head() {},
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
  created() {},
  methods: {
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
