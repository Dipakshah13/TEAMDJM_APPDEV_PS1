/**
 * @file money.js
 * Currency formatting and arithmetic helpers for INR.
 * All monetary values are stored as numeric(12,2) in the DB.
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const INR_FORMATTER_DECIMAL = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Format a number as INR with no decimal places.
 * @param {number} amount
 * @returns {string} e.g. "₹1,240"
 */
export function formatINR(amount) {
  return INR_FORMATTER.format(amount)
}

/**
 * Format a number as INR with 2 decimal places.
 * @param {number} amount
 * @returns {string} e.g. "₹1,240.50"
 */
export function formatINRDecimal(amount) {
  return INR_FORMATTER_DECIMAL.format(amount)
}

/**
 * Sum an array of receipt items by their price field.
 * @param {Array<{price: number}>} items
 * @returns {number}
 */
export function sumPrices(items) {
  return items.reduce((acc, item) => acc + (Number(item.price) || 0), 0)
}

/**
 * Round to 2 decimal places (banker-safe).
 * @param {number} value
 * @returns {number}
 */
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * Clamp a price to the valid range [0, 1_000_000].
 * @param {number} price
 * @returns {number}
 */
export function clampPrice(price) {
  return Math.max(0, Math.min(1_000_000, Number(price) || 0))
}
