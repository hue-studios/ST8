<template>
  <div id="resources" class="flex flex-col items-center justify-center pb-32">
    <div
      id="resources__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-wider sm:tracking-widest text-center mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font"
      >
        Resources
      </h1>
      <p class="navy text-center w-5/6 sm:w-3/5 md:w-1/2">
        This is a collection of resources.
      </p>
    </div>
    <resource-card
      v-for="(item, index) in resources"
      :key="index"
      :item="item"
      class="mb-6 mx-6"
    ></resource-card>
  </div>
</template>

<script>
import moment from 'moment'
import resourceCard from '~/components/now/resourceCard'
export default {
  components: { resourceCard },
  async asyncData({ params, $axios }) {
    const resourcesReq = await $axios.get(
      process.env.apiUrl +
        '/items/resources?fields=*.*.*&filter[status]=published'
    )
    return {
      resources: resourcesReq.data.data,
    }
  },
  data() {
    return {}
  },
  head() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    formatTime(time) {
      const newTime = moment(time)
      return moment(newTime).format('h:mm a')
    },
    dayClicked(day) {
      this.selectedDay = day
    },
    checkDates(start, end) {
      let dates
      if (!end || start.dateTime === end.dateTime) {
        dates = start.dateTime
      } else if (end) {
        dates = {
          start: start.dateTime,
          end: end.dateTime,
        }
      }
      return dates
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/resources';
</style>
