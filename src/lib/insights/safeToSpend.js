export function safeToSpend({ budget, spent, today }) {
  const [year, month, day] = today.split('-').map(Number)
  
  // Find days in month
  // Note: we can use Date trick for days in month. month is 1-indexed, so passing month (0-indexed next month) with day 0 gives last day of current month.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  
  const daysRemainingInclToday = daysInMonth - day + 1
  
  const remainingBudget = budget - spent
  return Math.max(0, remainingBudget / daysRemainingInclToday)
}
