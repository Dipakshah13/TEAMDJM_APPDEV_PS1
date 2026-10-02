/**
 * @file models.js
 * JSDoc typedefs for BillBuddy data shapes.
 * No runtime code — import-free, purely for documentation.
 */

// ─── Enums (as constants) ────────────────────────────────────────────────────

/** @type {readonly string[]} */
export const CATEGORIES = /** @type {const} */ ([
  'food',
  'groceries',
  'transport',
  'fuel',
  'clothing',
  'entertainment',
  'household',
  'other',
])

/** @typedef {'food'|'groceries'|'transport'|'fuel'|'clothing'|'entertainment'|'household'|'other'} ExpenseCategory */
/** @typedef {'scan'|'manual'|'demo'} ReceiptSource */
/** @typedef {'roast'|'gentle'} CoachTone */

// ─── Database row shapes ─────────────────────────────────────────────────────

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string|null} display_name
 * @property {string|null} avatar_url
 * @property {boolean} is_anonymous
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} user_id
 * @property {number} monthly_budget
 * @property {Record<ExpenseCategory, number>} category_limits
 * @property {CoachTone} tone
 * @property {number} small_spend_threshold
 * @property {boolean} onboarding_done
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Receipt
 * @property {string} id
 * @property {string} user_id
 * @property {string} store
 * @property {string} purchased_at  - ISO timestamptz
 * @property {number|null} total
 * @property {number|null} confidence  - 0 to 1
 * @property {ReceiptSource} source
 * @property {string|null} notes
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ReceiptItem
 * @property {string} id
 * @property {string} receipt_id
 * @property {string} user_id
 * @property {string} name              - as printed on receipt
 * @property {string} normalized_name   - lowercase, cleaned
 * @property {number} price
 * @property {ExpenseCategory} category
 * @property {boolean|null} regret      - null = not yet swiped
 * @property {string|null} regret_at
 * @property {string} purchased_at
 * @property {boolean} time_known       - false = skip time-of-day insight
 * @property {string} created_at
 * @property {string} updated_at
 */

// ─── Extraction shapes ────────────────────────────────────────────────────────

/**
 * Raw item returned by the vision model (pre-validation).
 * @typedef {Object} RawExtractedItem
 * @property {string} name
 * @property {string} normalized_name
 * @property {number} price
 * @property {string} category  - may be unknown; clamped to ExpenseCategory
 */

/**
 * Validated extraction result from the vision API.
 * @typedef {Object} ExtractedReceipt
 * @property {string|null} store
 * @property {string|null} date         - YYYY-MM-DD
 * @property {string|null} time         - HH:mm
 * @property {number} total
 * @property {number} confidence        - 0 to 1
 * @property {RawExtractedItem[]} items
 */

// ─── Insight shapes ───────────────────────────────────────────────────────────

/**
 * @typedef {'exceeded'|'not_enough_data'|'on_track'|'at_risk'} ForecastStatus
 */

/**
 * @typedef {Object} ForecastResult
 * @property {ForecastStatus} status
 * @property {number} [overBy]       - when status='exceeded'
 * @property {Date} [limitDate]      - when status='at_risk'
 * @property {number} [daysEarly]    - when status='at_risk'
 */

/**
 * @typedef {Object} RepeatPurchase
 * @property {string} name
 * @property {number} count
 * @property {number} totalSpent
 */

/**
 * @typedef {Object} RegretLeak
 * @property {string} name
 * @property {number} count
 * @property {number} leakAmount
 * @property {number} regretRate
 * @property {ForecastResult} whatIfForecast
 * @property {string} whatIfText
 */

/**
 * @typedef {'thriving'|'okay'|'worried'|'sick'} SproutMood
 */

/**
 * @typedef {Object} SproutState
 * @property {SproutMood} mood
 * @property {number} pace
 * @property {string} message
 */
