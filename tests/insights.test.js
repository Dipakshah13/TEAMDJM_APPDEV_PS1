import { describe, it, expect } from 'vitest'
import { forecast } from '../src/lib/insights/forecast'
import { safeToSpend } from '../src/lib/insights/safeToSpend'
import { repeatPurchases } from '../src/lib/insights/repeatPurchases'
import { regretRates } from '../src/lib/insights/regretRates'

describe('Insights Engine', () => {
  it('forecast: at_risk', () => {
    const res = forecast({ spent: 5000, limit: 10000, items: [1,2,3], today: '2026-10-10' })
    expect(res.status).toBe('at_risk')
    expect(res.limitDate).toBe(20) // rate=500, toLimit=5000, 5000/500=10 days -> day 20
  })

  it('forecast: exceeded', () => {
    const res = forecast({ spent: 12000, limit: 10000, items: [1,2,3], today: '2026-10-10' })
    expect(res.status).toBe('exceeded')
    expect(res.overBy).toBe(2000)
  })

  it('safeToSpend: calculates correctly', () => {
    const safe = safeToSpend({ budget: 3000, spent: 1000, today: '2026-10-29' })
    // Oct has 31 days. 29, 30, 31 = 3 days remaining.
    // 2000 / 3 = 666.66...
    expect(Math.round(safe)).toBe(667)
  })

  it('safeToSpend: over budget', () => {
    const safe = safeToSpend({ budget: 3000, spent: 4000, today: '2026-10-29' })
    expect(safe).toBe(0)
  })

  it('repeatPurchases: only >= 3 and within 30 days', () => {
    // today is 2026-10-31
    const items = [
      { purchased_at: '2026-10-15T12:00:00Z', normalized_name: 'coffee', price: 100 },
      { purchased_at: '2026-10-20T12:00:00Z', normalized_name: 'coffee', price: 100 },
      { purchased_at: '2026-10-25T12:00:00Z', normalized_name: 'coffee', price: 100 },
      { purchased_at: '2026-10-10T12:00:00Z', normalized_name: 'tea', price: 50 },
      { purchased_at: '2026-10-11T12:00:00Z', normalized_name: 'tea', price: 50 },
    ]
    const res = repeatPurchases(items, '2026-10-31')
    expect(res.length).toBe(1)
    expect(res[0].name).toBe('coffee')
    expect(res[0].count).toBe(3)
  })
  
  it('regretRates: time buckets correctly mapped to IST', () => {
    // morning 5-11, afternoon 12-16, evening 17-21, late-night 22-4
    // UTC 00:00 = 05:30 IST (morning)
    // UTC 22:00 = 03:30 IST next day (late-night)
    const items = [
      { purchased_at: '2026-10-10T00:00:00Z', time_known: true, regret: true, normalized_name: 'a', category: 'food' }, // 5:30 morning
      { purchased_at: '2026-10-10T22:00:00Z', time_known: true, regret: true, normalized_name: 'b', category: 'food' }, // 3:30 late-night
    ]
    const rates = regretRates(items)
    expect(rates.timeBucket['morning']).toBe(1)
    expect(rates.timeBucket['late-night']).toBe(1)
    expect(rates.timeBucket['afternoon']).toBeUndefined()
  })
})
