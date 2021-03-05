<template>
  <div id="events" class="flex flex-col items-center justify-center">
    <div
      id="events__intro"
      class="flex flex-col flex-wrap justify-center items-center relative w-full"
    >
      <h1
        class="navy uppercase tracking-widest mb-2 w-5/6 sm:w-3/5 md:w-1/2 text-center thin-font"
      >
        Events
      </h1>
      <p class="navy w-5/6 sm:w-3/5 md:w-1/2 text-center">
        View our featured events and organizational calendar.
      </p>
    </div>
    <div
      class="w-full flex items-start justify-center flex-col md:flex-row h-full"
    >
      <div class="w-full md:w-2/5 flex item-center justify-center flex-col">
        <div id="events__featured" class="">
          <h3 id="title" class="uppercase navy w-full text-center mt-3">
            Featured Events
          </h3>

          <swiper
            :options="swiperOptions"
            class="swiper w-full flex flex-row pt-4 pb-4"
          >
            <swiper-slide
              v-for="(item, index) in featuredEvents"
              :key="index"
              class=""
            >
              <div class="shadow-lg mx-4 events__event">
                <div class="w-full flex items-center justify-center flex-row">
                  <div
                    class="bg-cover bg-no-repeat bg-center events__event-image"
                    :style="
                      'background-image: url(' +
                      imageLocation +
                      item.image.private_hash +
                      '?key=small)'
                    "
                  ></div>
                  <div class="events__event-title">
                    <h3 class="uppercase tracking-wider">{{ item.title }}</h3>
                    <h4 class="uppercase tracking-wider bold">
                      {{ $moment(item.date).format('MM / DD / YYYY') }}
                    </h4>
                  </div>
                </div>
                <p
                  class="w-full events__event-description"
                  v-text="item.description"
                ></p>
              </div>
            </swiper-slide>

            <div slot="button-next" class="swiper-button-next"></div>
            <div slot="button-prev" class="swiper-button-prev"></div>
          </swiper>
        </div>
        <transition
          enter-active-class="uk-animation-slide-left uk-animation-fast"
          leave-active-class="uk-animation-slide-left-small uk-animation-reverse uk-animation-fast"
          mode="out-in"
        >
          <div v-if="selectedDay" class="p-8 selected-day">
            <h5 class="green mb-3 uppercase tracking-widest">
              {{ selectedDay.date.toDateString() }}
            </h5>
            <transition
              enter-active-class="uk-animation-slide-left uk-animation-fast"
              leave-active-class="uk-animation-slide-left-small uk-animation-reverse uk-animation-fast"
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
              <p v-else class="navy uppercase text-xs">
                There are no events scheduled for this day.
              </p>
            </transition>
          </div>
          <div v-else class="p-8 selected-day">
            <p class="text-center navy uppercase text-xs">
              Select a day on the calendar to view scheduled events for that
              day.
            </p>
          </div>
        </transition>
      </div>
      <div class="w-full md:w-3/5 relative">
        <transition
          enter-active-class="uk-animation-fade"
          leave-active-class="uk-animation-fade uk-animation-reverse"
        >
          <div
            v-if="calendarLoading"
            id="calendar-loader"
            class="flex items-center justify-center"
          >
            <img src="/images/loader.gif" alt="Loading GIF" />
          </div>
        </transition>
        <v-calendar
          class="flex flex-col items-center justify-center"
          :attributes="attrs"
          is-expanded
          @dayclick="dayClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
export default {
  components: { Swiper, SwiperSlide },
  async asyncData({ params, $axios }) {
    const eventsReq = await $axios.get(
      process.env.apiUrl + '/items/events?fields=*.*.*&filter[status]=published'
    )
    return {
      featuredEvents: eventsReq.data.data,
    }
  },
  data() {
    return {
      calendarLoading: true,
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
            '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
        },
      },
      imageLocation: process.env.imageUrl,
      swiperOptions: {
        slidesPerView: 1,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        spaceBetween: 30,
        loop: false,
        centeredSlides: true,
        centerInsufficientSlides: true,
        // initialSlide: 4,
        // pagination: {
        //   el: '.swiper-pagination',
        //   dynamicBullets: true
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true,
        },
      },
    }
  },
  head() {
    return {}
  },
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
            backgroundColor: '#eeeeee',
          },
        },
        dot: {
          style: {
            backgroundColor: '#1effbc',
          },
        },
        popover: {
          label: t.summary + ' @ ' + app.formatTime(t.start.dateTime),
          labelClass: 'testClass',
        },
        customData: t,
      }))
    },
  },
  created() {
    const app = this
    axios
      .get(
        'https://www.googleapis.com/calendar/v3/calendars/calendarst8@gmail.com/events?key=' +
          this.calendarKey +
          '&timeMin=2020-01-01T00:00:00Z&timeMax=2021-12-31T23:59:59Z&singleEvents=true&orderBy=startTime&maxResults=2500'
      )
      .then(function (res) {
        app.calendarLoading = false
        app.events = res.data.items
        // app.dayClicked()
      })
  },
  methods: {
    formatTime(time) {
      const newTime = moment(time)
      return moment(newTime).format('h:mm a')
    },
    dayClicked(day) {
      console.log('today ' + moment().format('YYYY-MM-DD'))
      let date
      if (!day) {
        date = {
          id: moment().format('YYYY-MM-DD'),
          attributes: this.todaysEvents,
          isToday: true,
          date: new Date(),
        }
      } else {
        date = day
        console.log(day)
      }

      console.log(date)
      this.selectedDay = date
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
#events {
  #events__intro {
    height: 200px;
    @media (min-width: $breakpoint-medium) {
      height: 250px;
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
        left: -10%;
      }
      @media (min-width: $breakpoint-medium) {
      }
    }
    p {
      font-size: 14px;
    }
  }
  #events__featured {
    height: 300px;
    #title {
      font-size: 18px;
      letter-spacing: 0.35em;
    }
    .swiper-slide {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .events__event {
      width: 96%;
      border: thin solid rgba($grey, 0.2);

      .events__event-image {
        width: 100px;
        height: 100px;
      }
      .events__event-title {
        width: calc(100% - 120px);
        margin-left: 20px;
        padding-right: 20px;
        h3 {
        }
        h4 {
          font-size: 10px;
        }
      }
      .events__event-description {
        padding: 20px;
        font-size: 12px;
        line-height: 1.2em;
      }
    }
  }
  #calendar-loader {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 10;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(6px);
    img {
      width: 40px;
      height: 40px;
    }
  }
  .vc-container {
    border-radius: 0px;
    border: none !important;
    border-color: $white !important;
    font-family: $body-font;
    background: none;
    width: 100%;
    @media (min-width: $breakpoint-medium) {
      // height: 600px;
    }
    .vc-pane-container {
      display: flex;
      justify-content: center;
      @media (min-width: $breakpoint-medium) {
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
            height: 450px !important;
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
          position: relative;
          font-size: 13px;
          padding-left: 12px;
          margin-bottom: 5px;
        }
        h5:before {
          content: '';
          width: 5px;
          position: absolute;
          left: 0px;
          top: 5px;
          height: 10px;
          background: $navy;
        }
      }
    }
  }
}
</style>
