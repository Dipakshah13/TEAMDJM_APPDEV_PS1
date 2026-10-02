/**
 * @file flags.js
 * Feature flags — hide unfinished features without removing code.
 * Set to true to enable, false to hide.
 *
 * In production, could be driven by env vars or a remote config.
 * For now: simple object checked at render time.
 */

/** @type {Record<string, boolean>} */
const FLAGS = {
  // Core — always on
  SCAN_FLOW: true,
  INSIGHTS: true,
  DEMO_DATA: true,
  SWIPE_REVIEW: true,
  HISTORY: true,
  SETTINGS: true,

  // SHOULD — enabled
  REGRET_LEAKS: true,
  ROAST_COACH: true,
  SPROUT: true,

  // COULD — disabled until built
  SPEND_PERSONALITY: false,
  PRICE_DRIFT: false,

  // LATER — backlog
  BANK_IMPORT: false,
  RECURRING_BILLS: false,
  GOALS: false,
  SHARED_BUDGETS: false,
  PUSH_REMINDERS: false,
  HINDI_UI: false,
  DARK_MODE: false,
}

/**
 * Check if a feature flag is enabled.
 * @param {string} flag
 * @returns {boolean}
 */
export function isEnabled(flag) {
  return FLAGS[flag] === true
}

export default FLAGS
