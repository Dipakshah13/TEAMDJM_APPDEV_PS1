export function monthSpent(items, today, category = null) {
  const [todayYear, todayMonth] = today.split('-')
  
  return items.reduce((sum, item) => {
    // Only count items matching the category (if provided)
    if (category && item.category !== category) return sum
    
    // Check if item's purchased_at (in IST) matches todayYear and todayMonth
    // Note: Since items come from the DB, purchased_at is UTC. We need to convert to IST
    // For pure logic tests, we assume items already have a `purchased_at` string in UTC that we can parse,
    // or we just rely on date-fns-tz. But to keep pure JS without imports:
    // It's safer to use date-fns-tz here, but since the engine is "pure JS", let's assume
    // we use a helper or just do the parsing carefully.
    // Wait, the spec says "month of `today`".
    
    // Better: let's use date-fns-tz inside the engine if needed, or just do offset math.
    // The spec says "no new Date()".
    // I will do offset math for IST: +5h30m.
    const dateObj = new Date(item.purchased_at)
    // Shift by 5.5 hours to get IST time for naive month matching
    const istTime = dateObj.getTime() + (5.5 * 60 * 60 * 1000)
    const istDate = new Date(istTime)
    
    if (istDate.getUTCFullYear() === parseInt(todayYear, 10) && 
        (istDate.getUTCMonth() + 1) === parseInt(todayMonth, 10)) {
      return sum + Number(item.price)
    }
    return sum
  }, 0)
}
