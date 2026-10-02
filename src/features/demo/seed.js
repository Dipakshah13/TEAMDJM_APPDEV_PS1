/**
 * @file features/demo/seed.js
 * P1 Demo Seed generation (Spec §7.2)
 * Generates deterministic realistic receipt data.
 */

import { addDays, subDays, startOfMonth, setHours, setMinutes } from 'date-fns'
import { toIST } from '@/lib/dates'

// We create a deterministic mock setup for the past ~45 days.
export function generateDemoData() {
  const now = new Date()
  const todayIST = toIST(now)
  const currentMonthStart = startOfMonth(todayIST)

  /** @type {import('@/lib/models').ExtractedReceipt[]} */
  const receipts = []

  // Helper to create a date at a specific time relative to today
  const createDate = (daysOffset, hour, minute) => {
    let d = addDays(todayIST, daysOffset)
    d = setHours(d, hour)
    d = setMinutes(d, minute)
    return d
  }

  // 1. Regular Groceries (Every ~7 days)
  for (let offset = -40; offset <= 0; offset += 7) {
    const d = createDate(offset, 10, 30) // 10:30 AM
    receipts.push({
      store: 'SuperMart',
      date: d.toISOString().split('T')[0],
      time: '10:30',
      total: 1250,
      confidence: 1,
      items: [
        { name: 'Milk 1L', normalized_name: 'milk', price: 60, category: 'groceries' },
        { name: 'Eggs 1doz', normalized_name: 'eggs', price: 80, category: 'groceries' },
        { name: 'Bread', normalized_name: 'bread', price: 40, category: 'groceries' },
        { name: 'Rice 5kg', normalized_name: 'rice', price: 450, category: 'groceries' },
        { name: 'Chicken 1kg', normalized_name: 'chicken', price: 280, category: 'groceries' },
        { name: 'Apples 1kg', normalized_name: 'apples', price: 180, category: 'groceries' },
        { name: 'Veggies', normalized_name: 'vegetables', price: 160, category: 'groceries' },
      ],
      source: 'demo'
    })
  }

  // 2. The Regret Leak: Late night food delivery (3 times this month)
  // Ensures regretRate > 0.5 (we'll set regret to true for 2 out of 3)
  for (const offset of [-25, -12, -4]) {
    const d = createDate(offset, 23, 45) // 11:45 PM
    receipts.push({
      store: 'Zomato/Swiggy',
      date: d.toISOString().split('T')[0],
      time: '23:45',
      total: 540,
      confidence: 1,
      items: [
        { 
          name: 'Midnight Burger Combo', 
          normalized_name: 'midnight burger combo', 
          price: 540, 
          category: 'food',
          regret: offset > -20 // the last two are regrets
        }
      ],
      source: 'demo'
    })
  }

  // 3. Small-spend leak: Coffee (Almost daily, 80 INR each)
  for (let offset = -28; offset <= 0; offset += 2) {
    const d = createDate(offset, 9, 15) // 9:15 AM
    receipts.push({
      store: 'Local Cafe',
      date: d.toISOString().split('T')[0],
      time: '09:15',
      total: 80,
      confidence: 1,
      items: [
        { name: 'Cappuccino', normalized_name: 'cappuccino', price: 80, category: 'food' }
      ],
      source: 'demo'
    })
  }

  // 4. One-off big expense
  receipts.push({
    store: 'Zudio',
    date: createDate(-15, 16, 0).toISOString().split('T')[0],
    time: '16:00',
    total: 2499,
    confidence: 1,
    items: [
      { name: 'Sneakers', normalized_name: 'sneakers', price: 1499, category: 'clothing' },
      { name: 'T-Shirt', normalized_name: 't-shirt', price: 1000, category: 'clothing' }
    ],
    source: 'demo'
  })

  // 5. Fuel
  receipts.push({
    store: 'Indian Oil',
    date: createDate(-10, 8, 0).toISOString().split('T')[0],
    time: '08:00',
    total: 2000,
    confidence: 1,
    items: [
      { name: 'Petrol', normalized_name: 'petrol', price: 2000, category: 'fuel' }
    ],
    source: 'demo'
  })

  return receipts
}
