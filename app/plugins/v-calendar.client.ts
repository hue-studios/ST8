import { Calendar, setupCalendar } from 'v-calendar'

// v-calendar 3 for the events page. Browser only: the calendar is drawn after the page loads. Its stylesheet is
// imported in assets/css/main.css, in the low `vendor` layer.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(setupCalendar, {})
  nuxtApp.vueApp.component('VCalendar', Calendar)
})
