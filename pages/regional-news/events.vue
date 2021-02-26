<template>
  <div id="events" class="flex flex-col items-center justify-center">
    <div
      id="events__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-widest mb-2 w-5/6 sm:w-3/5 md:w-1/2 thin-font"
      >
        Events
      </h1>
      <p class="navy w-5/6 sm:w-3/5 md:w-1/2">
        This is our organizational calendar.
      </p>
    </div>
    <v-calendar
      class="flex flex-col items-center justify-center"
      :attributes="attrs"
      is-expanded
      @dayclick="dayClicked"
    />
    <transition
      enter-active-class="uk-animation-slide-top uk-animation-fast"
      leave-active-class="uk-animation-slide-top-small uk-animation-reverse uk-animation-fast"
      mode="out-in"
    >
      <div v-if="selectedDay" class="mb-20 p-8 selected-day">
        <h5 class="green text-center uppercase tracking-widest">
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
              class="flex justify-start items-start selected-day-event"
            >
              <div class="selected-day-event-header">
                <h5 class="uppercase bold">
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
        highlight: {
          style: {
            backgroundColor: '#eeeeee'
          }
        },
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
          '&timeMin=2019-01-01T00:00:00Z&timeMax=2021-12-31T23:59:59Z&singleEvents=true&orderBy=startTime&maxResults=2500'
      )
      .then(function(res) {
        app.events = res.data.items
      })
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
