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
#events {
  #events__intro {
    height: 300px;

    @media (min-width: $breakpoint-small) {
    }
    @media (min-width: $breakpoint-medium) {
      margin-top: 0px;
    }
    h1 {
      font-size: 42px;
      line-height: 1.2em;
      position: relative;
      margin-top: 70px;
      @media (min-width: $breakpoint-small) {
        font-size: 62px;
      }
      @media (min-width: $breakpoint-medium) {
        margin-top: 0px;
      }
    }
    h1:after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 1px;
      background: $navy;
      @media (min-width: $breakpoint-small) {
        width: 120%;
      }
      @media (min-width: $breakpoint-medium) {
      }
    }
    p {
      font-size: 14px;
    }
  }
  .vc-container {
    border-radius: 0px;
    border: none !important;
    border-color: $white !important;
    font-family: $body-font;
    // height: 500px;
    width: 100%;
    @media (min-width: $breakpoint-medium) {
      // height: 600px;
    }
    .vc-pane-container {
      display: flex;
      justify-content: center;
      @media (min-width: $breakpoint-medium) {
        height: 600px;
      }
      .vc-pane-layout {
        width: 100%;
        max-width: 1200px;
        @media (min-width: $breakpoint-medium) {
          height: 600px !important;
        }
        .vc-weeks {
          height: 400px !important;
          @media (min-width: $breakpoint-medium) {
            height: 500px !important;
          }
        }
      }
      .vc-header {
        margin-bottom: 30px;
      }
      .vc-grid-container {
        width: 100%;
      }
    }
    .vc-arrows-container {
      // padding: 0 30px 0;
      max-width: 500px;
    }
    .vc-day {
      height: 60px !important;
    }
    .vc-title {
      text-transform: uppercase;
      letter-spacing: 0.35em;
      font-weight: 400;
    }
    .vc-popover {
      .vc-bar {
        background-color: red;
      }
    }
    .vc-dots {
      .vc-dot:nth-of-type(1) {
        opacity: 1;
      }
      .vc-dot:nth-of-type(2) {
        opacity: 0.95;
      }
      .vc-dot:nth-of-type(3) {
        opacity: 0.9;
      }
      .vc-dot:nth-of-type(4) {
        opacity: 0.85;
      }
      .vc-dot:nth-of-type(5) {
        opacity: 0.8;
      }
      .vc-dot:nth-of-type(6) {
        opacity: 0.75;
      }
      .vc-dot:nth-of-type(7) {
        opacity: 0.7;
      }
      .vc-dot:nth-of-type(8) {
        opacity: 0.65;
      }
      .vc-dot:nth-of-type(9) {
        opacity: 0.6;
      }
      .vc-dot:nth-of-type(10) {
        opacity: 0.55;
      }
    }
  }
  .selected-day {
    max-width: 600px;
    ul {
      list-style: disc;

      .selected-day-event {
        list-style-type: disc;
        h5 {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
