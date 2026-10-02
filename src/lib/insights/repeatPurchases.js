export function repeatPurchases(items, today) {
  // Last 30 days
  const [year, month, day] = today.split('-').map(Number)
  const todayMs = Date.UTC(year, month - 1, day)
  
  const groups = {}
  
  for (const item of items) {
    // Parse item date and convert to IST pseudo-UTC
    const dateObj = new Date(item.purchased_at)
    const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
    const istDate = new Date(istTime)
    
    // Truncate to day
    const itemDayMs = Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate())
    
    // Difference in days
    const diffDays = Math.floor((todayMs - itemDayMs) / (1000 * 60 * 60 * 24))
    
    if (diffDays >= 0 && diffDays < 30) {
      const name = item.normalized_name
      if (!groups[name]) {
        groups[name] = { name, count: 0, totalSpent: 0 }
      }
      groups[name].count += 1
      groups[name].totalSpent += Number(item.price)
    }
  }
  
  const repeats = Object.values(groups).filter(g => g.count >= 3)
  return repeats.sort((a, b) => b.totalSpent - a.totalSpent)
}
