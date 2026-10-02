export function forecast({ spent, limit, items, today }) {
  if (spent >= limit) {
    return { status: 'exceeded', overBy: spent - limit }
  }
  
  const [year, month, day] = today.split('-').map(Number)
  const daysElapsed = day // if today is the 10th, 10 days have elapsed
  
  if (daysElapsed < 3 || items.length < 3) {
    return { status: 'not_enough_data' }
  }
  
  const rate = spent / daysElapsed
  const daysToLimit = (limit - spent) / rate
  const limitDay = day + Math.ceil(daysToLimit)
  
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  
  if (limitDay > daysInMonth) {
    return { status: 'on_track' }
  }
  
  return { 
    status: 'at_risk', 
    limitDate: limitDay,
    daysEarly: daysInMonth - limitDay + 1
  }
}
