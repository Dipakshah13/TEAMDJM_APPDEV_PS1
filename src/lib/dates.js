/**
 * @file dates.js
 * Date/time helpers for BillBuddy. All "today", month boundaries and
 * time-of-day buckets are computed in Asia/Kolkata (IST).
 *
 * Never use Date.now() or new Date() directly in insight functions —
 * pass `today` (a Date) in and call these helpers.
 */

import {
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
  getDaysInMonth,
  getDate,
  parseISO,
  format,
  isValid,
} from 'date-fns'
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz'

export const TZ = 'Asia/Kolkata'

/**
 * Convert a UTC Date to IST-zoned Date (same instant, IST display).
 * @param {Date} utcDate
 * @returns {Date}
 */
export function toIST(utcDate) {
  return toZonedTime(utcDate, TZ)
}

/**
 * Convert an IST-zoned Date to UTC.
 * @param {Date} istDate
 * @returns {Date}
 */
export function fromIST(istDate) {
  return fromZonedTime(istDate, TZ)
}

/**
 * Today in IST (start of day).
 * @returns {Date}
 */
export function todayIST() {
  return toIST(new Date())
}

/**
 * Number of days remaining in the current IST month, including today.
 * @param {Date} today - IST-zoned date
 * @returns {number}
 */
export function daysRemainingInclToday(today) {
  const daysInMonth = getDaysInMonth(today)
  const dayOfMonth = getDate(today)
  return daysInMonth - dayOfMonth + 1
}

/**
 * Number of days elapsed so far in the current IST month (including today).
 * @param {Date} today - IST-zoned date
 * @returns {number}
 */
export function daysElapsedInMonth(today) {
  return getDate(today)
}

/**
 * Total days in the current month.
 * @param {Date} today
 * @returns {number}
 */
export function daysInCurrentMonth(today) {
  return getDaysInMonth(today)
}

/**
 * Start of the current month in IST.
 * @param {Date} today
 * @returns {Date}
 */
export function startOfCurrentMonthIST(today) {
  return startOfMonth(today)
}

/**
 * End of the current month in IST.
 * @param {Date} today
 * @returns {Date}
 */
export function endOfCurrentMonthIST(today) {
  return endOfMonth(today)
}

/**
 * Check if an item's purchased_at falls in the current month (IST).
 * @param {string|Date} purchasedAt
 * @param {Date} today - IST-zoned
 * @returns {boolean}
 */
export function isCurrentMonth(purchasedAt, today) {
  const d = typeof purchasedAt === 'string' ? toIST(parseISO(purchasedAt)) : toIST(purchasedAt)
  return (
    d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()
  )
}

/**
 * Check if an item's purchased_at falls within the last N days.
 * @param {string|Date} purchasedAt
 * @param {Date} today - IST-zoned
 * @param {number} days
 * @returns {boolean}
 */
export function isWithinLastDays(purchasedAt, today, days) {
  const d = typeof purchasedAt === 'string' ? toIST(parseISO(purchasedAt)) : toIST(purchasedAt)
  const diff = differenceInCalendarDays(today, d)
  return diff >= 0 && diff < days
}

/**
 * Time-of-day bucket from a Date or ISO string.
 * Returns null if time is not known.
 * @param {string|Date} purchasedAt
 * @param {boolean} timeKnown
 * @returns {'morning'|'afternoon'|'evening'|'late-night'|null}
 */
export function timeBucket(purchasedAt, timeKnown) {
  if (!timeKnown) return null
  const d = typeof purchasedAt === 'string' ? toIST(parseISO(purchasedAt)) : toIST(purchasedAt)
  const hour = d.getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'late-night' // 22-4
}

/**
 * Format a date as "19 Oct" in IST.
 * @param {Date} date
 * @returns {string}
 */
export function formatDayMonth(date) {
  return formatInTimeZone(date, TZ, 'd MMM')
}

/**
 * Format a date as "Oct 2026" in IST.
 * @param {Date} date
 * @returns {string}
 */
export function formatMonthYear(date) {
  return formatInTimeZone(date, TZ, 'MMM yyyy')
}

/**
 * Parse an ISO date string safely. Returns null if invalid.
 * @param {string|null|undefined} str
 * @returns {Date|null}
 */
export function safeParseISO(str) {
  if (!str) return null
  const d = parseISO(str)
  return isValid(d) ? d : null
}

/**
 * Build an ISO timestamptz string from a date string and optional time string,
 * in IST. If timeStr is null, defaults to 12:00 IST.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string|null} timeStr - HH:mm
 * @returns {string} ISO 8601 UTC string
 */
export function buildTimestamp(dateStr, timeStr) {
  const combined = `${dateStr}T${timeStr ?? '12:00'}:00`
  return fromZonedTime(combined, TZ).toISOString()
}

/**
 * Get the ordinal string for a day number (e.g. "19th").
 * @param {number} n
 * @returns {string}
 */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
