import { repeatPurchases } from './repeatPurchases'
import { regretRates } from './regretRates'
import { forecast } from './forecast'

export function regretLeaks({ items, settings, today }) {
  // Last 30 days by `normalized_name`. 
  // Include if (`count>=3` and `regretRate>=0.5`) or (small-spend and `regretCount>=2`). 
  // `leakAmount` = sum of regretted item prices. Top 3 by `leakAmount`.
  
  // Note: we can compute repeats first
  const repeats = repeatPurchases(items, today) // items from last 30 days, count >= 3
  const rates = regretRates(items) // overall rates
  
  // To handle the small-spend condition accurately for the last 30 days,
  // we should just filter items in the last 30 days.
  const [year, month, day] = today.split('-').map(Number)
  const todayMs = Date.UTC(year, month - 1, day)
  
  const recentItems = items.filter(item => {
    const dateObj = new Date(item.purchased_at)
    const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
    const istDate = new Date(istTime)
    const itemDayMs = Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate())
    const diffDays = Math.floor((todayMs - itemDayMs) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays < 30
  })
  
  // Group recent items by name
  const groups = {}
  for (const item of recentItems) {
    const name = item.normalized_name
    if (!groups[name]) groups[name] = { count: 0, regretCount: 0, leakAmount: 0 }
    groups[name].count++
    if (item.regret === true) {
      groups[name].regretCount++
      groups[name].leakAmount += Number(item.price)
    }
  }
  
  const threshold = settings.small_spend_threshold || 100
  
  const leaks = []
  for (const [name, data] of Object.entries(groups)) {
    const rate = rates.name[name] || 0
    const isRepeatRegret = data.count >= 3 && rate >= 0.5
    
    // Check if it's generally a small spend item? 
    // We can average the price of the item to see if it's <= threshold
    // Or check if ANY item price is <= threshold? Spec says: "or (small-spend and regretCount>=2)".
    // Let's check if leakAmount > 0 and regretCount >= 2 and avg price <= threshold
    const avgPrice = data.regretCount > 0 ? (data.leakAmount / data.regretCount) : 0
    const isSmallSpendRegret = avgPrice <= threshold && data.regretCount >= 2
    
    if ((isRepeatRegret || isSmallSpendRegret) && data.leakAmount > 0) {
      leaks.push({ name, leakAmount: data.leakAmount, count: data.count, regretCount: data.regretCount })
    }
  }
  
  leaks.sort((a, b) => b.leakAmount - a.leakAmount)
  const top3 = leaks.slice(0, 3)
  
  // What-if calculation
  if (top3.length === 0) {
    return { leaks: [], whatIfText: null }
  }
  
  const totalLeakAmount = top3.reduce((sum, l) => sum + l.leakAmount, 0)
  
  // Recompute overall forecast
  // We need spent and limit for the current month.
  // We compute current month spent:
  const currentMonthItems = items.filter(item => {
    const dateObj = new Date(item.purchased_at)
    const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
    const istDate = new Date(istTime)
    return istDate.getUTCFullYear() === year && (istDate.getUTCMonth() + 1) === month
  })
  
  const spent = currentMonthItems.reduce((sum, i) => sum + Number(i.price), 0)
  const limit = settings.monthly_budget
  
  const currentForecast = forecast({ spent, limit, items: currentMonthItems, today })
  const whatIfForecast = forecast({ spent: spent - totalLeakAmount, limit, items: currentMonthItems, today })
  
  let whatIfText = null
  if (currentForecast.status === 'at_risk' && whatIfForecast.status === 'at_risk') {
    const diff = whatIfForecast.limitDate - currentForecast.limitDate
    if (diff > 0) {
      whatIfText = `Skip this and your limit date moves from the ${currentForecast.limitDate}th to the ${whatIfForecast.limitDate}th (+${diff} days).`
    }
  } else if (currentForecast.status === 'at_risk' && whatIfForecast.status === 'on_track') {
    whatIfText = 'Skip this and you\'d stay within budget this month.'
  }
  
  return { leaks: top3, whatIfText }
}
