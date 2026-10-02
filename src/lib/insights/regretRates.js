export function regretRates(items) {
  // `regretCount / swipedCount` by category, by `normalized_name`, by time bucket 
  // (morning 5–11, afternoon 12–16, evening 17–21, late-night 22–4; skip `time_known=false`)
  
  const byCategory = {}
  const byName = {}
  const byTime = { morning: {r:0, t:0}, afternoon: {r:0, t:0}, evening: {r:0, t:0}, 'late-night': {r:0, t:0} }
  
  for (const item of items) {
    if (item.regret === null) continue // unswiped
    
    const isRegret = item.regret === true
    
    // Category
    if (!byCategory[item.category]) byCategory[item.category] = { r: 0, t: 0 }
    byCategory[item.category].t++
    if (isRegret) byCategory[item.category].r++
    
    // Name
    const name = item.normalized_name
    if (!byName[name]) byName[name] = { r: 0, t: 0 }
    byName[name].t++
    if (isRegret) byName[name].r++
    
    // Time bucket
    if (item.time_known) {
      const dateObj = new Date(item.purchased_at)
      const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
      const istDate = new Date(istTime)
      const hour = istDate.getUTCHours()
      
      let bucket
      if (hour >= 5 && hour < 12) bucket = 'morning'
      else if (hour >= 12 && hour < 17) bucket = 'afternoon'
      else if (hour >= 17 && hour < 22) bucket = 'evening'
      else bucket = 'late-night'
      
      byTime[bucket].t++
      if (isRegret) byTime[bucket].r++
    }
  }
  
  const compute = (map) => {
    const res = {}
    for (const [k, v] of Object.entries(map)) {
      if (v.t > 0) res[k] = v.r / v.t
    }
    return res
  }
  
  return {
    category: compute(byCategory),
    name: compute(byName),
    timeBucket: compute(byTime)
  }
}
