export function smallSpendLeaks(items, threshold, today) {
  // Items <= threshold summed per category; flag when > 25% of that category's spend
  const [year, month] = today.split('-').map(Number)
  
  const catTotal = {}
  const catSmall = {}
  
  for (const item of items) {
    const dateObj = new Date(item.purchased_at)
    const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
    const istDate = new Date(istTime)
    
    if (istDate.getUTCFullYear() === year && (istDate.getUTCMonth() + 1) === month) {
      const c = item.category
      const price = Number(item.price)
      
      if (!catTotal[c]) { catTotal[c] = 0; catSmall[c] = 0 }
      
      catTotal[c] += price
      if (price <= threshold) {
        catSmall[c] += price
      }
    }
  }
  
  const leaks = []
  for (const c of Object.keys(catTotal)) {
    if (catTotal[c] > 0) {
      const pct = catSmall[c] / catTotal[c]
      if (pct > 0.25) {
        leaks.push({ category: c, total: catTotal[c], smallSpend: catSmall[c], percentage: Math.round(pct * 100) })
      }
    }
  }
  
  return leaks
}
