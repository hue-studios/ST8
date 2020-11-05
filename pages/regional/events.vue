<template>
  <div id="initiatives"><FullCalendar :options="calendarOptions" /></div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
// const CLIENT_ID =
//   '192341614431-cqbkk2mb8s1pg56cccaiop585m5jr8c4.apps.googleusercontent.com'
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, googleCalendarPlugin],
        googleCalendarApiKey: 'AIzaSyC7L-5WMQh2gHY-wqj7qFLzdKOYQwUFAaY',
        initialView: 'dayGridMonth',
        events: {
          googleCalendarId: 'calendarst8@gmail.com'
        }
      }
    }
  },
  // async asyncData({ params, $axios }) {
  //   const servicesReq = await $axios.get(
  //     process.env.apiUrl + '/items/services?fields=*.*.*'
  //   )
  //   return {
  //     services: servicesReq.data.data
  //   }
  // },
  async fetch({ store, app }) {
    // await store.dispatch('getUser', app.$auth.user.email)
  },
  created() {},
  head() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss"></style>
