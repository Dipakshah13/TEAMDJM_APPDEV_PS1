import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Asia/Kolkata'

/**
 * Returns the current date in IST as 'yyyy-MM-dd'
 */
export function istDayString(date = new Date()) {
  return formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd')
}

/**
 * Returns a UTC Date object representing the start of the month (in IST)
 * for the given 'yyyy-MM-dd' string.
 */
export function monthStartUTC(todayDayString) {
  const [year, month] = todayDayString.split('-')
  const istDateString = `${year}-${month}-01T00:00:00`
  return fromZonedTime(istDateString, TIMEZONE)
}

/**
 * Returns a UTC Date object representing exactly `n` days ago (start of day in IST)
 */
export function daysAgoUTC(n, todayDayString = istDayString()) {
  const [year, month, day] = todayDayString.split('-')
  // We can just construct a date from the strings and subtract n days
  // fromZonedTime handles the math properly if we pass a JS date.
  // Wait, let's use standard JS date math but pinned to the IST string
  const istDateString = `${year}-${month}-${day}T00:00:00`
  const utcDate = fromZonedTime(istDateString, TIMEZONE)
  utcDate.setUTCDate(utcDate.getUTCDate() - n)
  return utcDate
}

/**
 * Builds a UTC Date string from a 'yyyy-MM-dd' date string and optional 'HH:mm' time string.
 * Defaults to 12:00 if no time is provided.
 */
export function buildTimestamp(dateStr, timeStr = null) {
  const time = timeStr || '12:00'
  const combined = `${dateStr}T${time}:00`
  const utcDate = fromZonedTime(combined, TIMEZONE)
  return utcDate.toISOString()
}

/**
 * Format a UTC Date object/string for client display
 */
export function formatClientDate(dateObjOrString, formatString = 'dd MMM yyyy') {
  const d = typeof dateObjOrString === 'string' ? new Date(dateObjOrString) : dateObjOrString
  return formatInTimeZone(d, TIMEZONE, formatString)
}
