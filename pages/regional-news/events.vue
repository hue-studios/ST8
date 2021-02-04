<template>
  <div id="events">
    <v-calendar :attributes="attrs" @dayclick="dayClicked" is-expanded />
    <transition
      enter-active-class="uk-animation-slide-top uk-animation-fast"
      leave-active-class="uk-animation-slide-top-small uk-animation-reverse uk-animation-fast"
      mode="out-in"
    >
      <div v-if="selectedDay" class="selected-day">
        <h5 class="brand text-center uppercase">
          {{ selectedDay.date.toDateString() }}
        </h5>
        <transition
          enter-active-class="uk-animation-slide-top uk-animation-fast"
          leave-active-class="uk-animation-slide-top-small uk-animation-reverse uk-animation-fast"
          mode="out-in"
        >
          <ul v-if="selectedDay.attributes.length > 0">
            <li
              v-for="attr in selectedDay.attributes"
              :key="attr.key"
              class="flex justify-center items-center selected-day-event"
            >
              <div class="selected-day-event-header">
                <h5 class="text-uppercase bold">
                  {{ attr.customData.summary }} @
                  {{ formatTime(attr.customData.start.dateTime) }}
                  <span v-if="attr.customData.end.dateTime"
                    >- {{ formatTime(attr.customData.end.dateTime) }}</span
                  >
                </h5>
                <div v-if="attr.customData.location">
                  <p>{{ attr.customData.location }}</p>
                </div>
              </div>
            </li>
          </ul>
          <p v-else class="navy text-center">
            There are no events scheduled for this day.
          </p>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
  components: {},
  data() {
    return {
      calendarKey: 'AIzaSyAWRNx_1aSXBJxQcJPJg3QSpjx9R9jGRSk',
      selectedDay: null,
      events: [],
      themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          borderRadius: '5px',
          boxShadow:
            '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
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
  computed: {
    attrs() {
      const app = this
      return this.events.map((t) => ({
        key: `event.${t.id}`,
        // bar: {
        //   style: {
        //     backgroundColor: '#1effbc'
        //   }
        // },
        dates: t.start.dateTime,
        // highlight: {
        //   color: 'orange',
        //   fillMode: 'light'
        // },
        // highlight: {
        //   style: {
        //     backgroundColor: '#1effbc'
        //   }
        // },
        dot: {
          style: {
            backgroundColor: '#1effbc'
          }
        },
        popover: {
          label: t.summary + ' @ ' + app.formatTime(t.start.dateTime),
          labelClass: 'testClass'
        },
        customData: t
      }))
    }
  },
  created() {
    const app = this
    axios
      .get(
        'https://www.googleapis.com/calendar/v3/calendars/calendarst8@gmail.com/events?key=' +
          this.calendarKey +
          '&timeMin=2020-01-01T00:00:00Z&timeMax=2020-12-31T23:59:59Z&singleEvents=true&orderBy=startTime&maxResults=500'
      )
      .then(function(res) {
        app.events = res.data.items
      })
  },
  head() {
    return {}
  },
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
