// The organizational calendar for the events page: ST8's public Google Calendar, a year back to a year ahead. The Nuxt
// 2 site asked Google from the browser; here the server does, so the key stays out of the page and a few minutes of
// caching spares the quota. Google restricts the key to the live site, so the request says it comes from there.
import { addYears, formatISO, subYears } from 'date-fns'

const CALENDAR = 'calendarst8@gmail.com'

export default defineCachedEventHandler(async () => {
  const now = new Date()
  const timeMin = `${formatISO(subYears(now, 1), { representation: 'date' })}T00:00:00Z`
  const timeMax = `${formatISO(addYears(now, 1), { representation: 'date' })}T23:59:59Z`
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR)}/events`
    + `?key=${encodeURIComponent(useRuntimeConfig().googleCalendarKey)}&timeMin=${timeMin}&timeMax=${timeMax}`
    + '&singleEvents=true&orderBy=startTime&maxResults=2500'

  const res = await fetch(url, { headers: { referer: 'https://southerntier8.org/' } }).catch(() => null)
  if (!res || !res.ok) {
    // A calendar outage leaves the featured events and an empty calendar, never an error page.
    console.error('calendar: Google Calendar did not answer', res?.status)
    return { items: [] }
  }
  const body = await res.json() as { items?: unknown[] }
  return { items: body.items ?? [] }
}, { maxAge: 60 * 10, swr: true, name: 'calendar' })
