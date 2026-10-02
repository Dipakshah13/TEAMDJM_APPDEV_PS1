export function getRoast({ store, topItem, itemCount, category, total, regretCount }, tone = 'roast', seed = Math.random()) {
  const roasts = [
    `Oh, ${store} again? Your wallet is weeping.`,
    `₹${total} on ${itemCount} items? And you thought you were saving money this month.`,
    `${topItem} was definitely an essential purchase, right? Just kidding, it wasn't.`,
    `Another trip to ${store}, another dent in your budget.`,
    `I see ${regretCount} regrets in your near future.`
  ]
  
  const gentle = [
    `You spent ₹${total} at ${store}. Keep an eye on your budget!`,
    `Consider if ${topItem} was a need or a want.`,
    `Small spends add up! Stay mindful at ${store}.`,
    `It's okay to treat yourself, just make sure it fits your plan.`
  ]
  
  const templates = tone === 'gentle' ? gentle : roasts
  const index = Math.floor(seed * templates.length)
  
  return templates[index]
}
