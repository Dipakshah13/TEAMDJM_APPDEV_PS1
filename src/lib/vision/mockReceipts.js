/**
 * @file vision/mockReceipts.js
 * Three realistic mock receipts for Demo Mode fallback (spec §8.3).
 * Used when the API key is missing, the call times out, or returns invalid data.
 * The client shows a "Demo extraction" badge when these are used.
 */

/** @type {import('../models').ExtractedReceipt[]} */
export const MOCK_RECEIPTS = [
  // 1. Grocery receipt
  {
    store: 'Fresh Basket Supermarket',
    date: null, // will be replaced with today by client
    time: '11:30',
    total: 1284,
    confidence: 0.95,
    items: [
      { name: 'Amul Taza Milk 1L', normalized_name: 'amul milk', price: 68, category: 'groceries' },
      { name: 'Britannia Brown Bread', normalized_name: 'britannia bread', price: 45, category: 'groceries' },
      { name: 'Tata Salt 1kg', normalized_name: 'tata salt', price: 28, category: 'groceries' },
      { name: 'Surf Excel 500g', normalized_name: 'surf excel', price: 120, category: 'household' },
      { name: 'Colgate Toothpaste 150g', normalized_name: 'colgate toothpaste', price: 89, category: 'household' },
      { name: 'Basmati Rice 5kg', normalized_name: 'basmati rice', price: 380, category: 'groceries' },
      { name: 'Onions 2kg', normalized_name: 'onions', price: 60, category: 'groceries' },
      { name: 'Tomatoes 1kg', normalized_name: 'tomatoes', price: 40, category: 'groceries' },
      { name: 'Lays Chips Classic', normalized_name: 'lays chips', price: 30, category: 'food' },
      { name: 'Coca Cola 1.25L', normalized_name: 'coca cola', price: 65, category: 'food' },
      { name: 'Maggi Noodles 4pk', normalized_name: 'maggi noodles', price: 60, category: 'groceries' },
      { name: 'Dettol Handwash 250ml', normalized_name: 'dettol handwash', price: 85, category: 'household' },
      { name: 'Eggs 12pc', normalized_name: 'eggs', price: 84, category: 'groceries' },
      { name: 'Yogurt 400g', normalized_name: 'yogurt', price: 60, category: 'groceries' },
      { name: 'Cornflakes 500g', normalized_name: 'cornflakes', price: 70, category: 'groceries' },
    ],
  },

  // 2. Late-night cafe receipt
  {
    store: 'Night Bites Cafe',
    date: null,
    time: '23:15',
    total: 486,
    confidence: 0.88,
    items: [
      { name: 'Monster Energy Drink', normalized_name: 'monster energy drink', price: 120, category: 'food' },
      { name: 'Chicken Burger', normalized_name: 'chicken burger', price: 179, category: 'food' },
      { name: 'Loaded Fries', normalized_name: 'loaded fries', price: 129, category: 'food' },
      { name: 'Red Bull 250ml', normalized_name: 'red bull energy drink', price: 115, category: 'food' },
      { name: 'Oreo Shake', normalized_name: 'oreo milkshake', price: 99, category: 'food' },
    ],
  },

  // 3. Fuel receipt
  {
    store: 'FuelUp Station',
    date: null,
    time: '09:00',
    total: 2000,
    confidence: 0.97,
    items: [
      { name: 'Petrol 40.16L @ 49.8/L', normalized_name: 'petrol', price: 2000, category: 'fuel' },
    ],
  },
]

/**
 * Return a random mock receipt (for variety in demos).
 * @returns {import('../models').ExtractedReceipt}
 */
export function getRandomMockReceipt() {
  return MOCK_RECEIPTS[Math.floor(Math.random() * MOCK_RECEIPTS.length)]
}
