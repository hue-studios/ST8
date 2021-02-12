<template>
  <div id="events" class="flex flex-col items-center justify-center">
    <div id="temp" class="h-screen flex items-center justify-center w-full">
      <h2>
        Hey Jen...don't freak out...the
        <span class="green">resources</span> page is not done.
      </h2>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  data() {
    return {}
  },
  head() {
    return {}
  },
  // async asyncData({ params, $axios }) {
  //   const servicesReq = await $axios.get(
  //     process.env.apiUrl + '/items/services?fields=*.*.*'
  //   )
  //   return {
  //     services: servicesReq.data.data
  //   }
  // },
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
          end: end.dateTime
        }
      }
      return dates
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/pages/events';
</style>
