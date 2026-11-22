import { format, parseISO } from 'date-fns'

// The old site formatted every date in America/New_York (moment's defaultTimezone). Directus date-only values
// ('2026-01-05') and timestamps without an offset are wall time already; anything with an offset is converted.
// The result is a Date whose *local* fields hold the New York wall time, so date-fns format() prints it as is, and the
// server (UTC) and the browser agree, which keeps hydration quiet.

const NY = 'America/New_York'
const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/

export function nyWallTime(value: string | Date): Date {
  if (typeof value === 'string' && !HAS_OFFSET.test(value)) return parseISO(value)
  const date = value instanceof Date ? value : new Date(value)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: NY,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(date).map(p => [p.type, p.value]),
  ) as Record<string, string>
  return new Date(+parts.year!, +parts.month! - 1, +parts.day!, +parts.hour!, +parts.minute!, +parts.second!)
}

/** moment's tokens are not date-fns's: 'dddd MMMM Do, YYYY' is 'EEEE MMMM do, yyyy'. */
export function formatDate(value: string | Date, pattern: string) {
  return format(nyWallTime(value), pattern)
}

export function nowInNewYork() {
  return nyWallTime(new Date())
}
