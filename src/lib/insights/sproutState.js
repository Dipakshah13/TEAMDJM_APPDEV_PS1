export function sproutState({ spent, budget, today }) {
  const [year, month, day] = today.split('-').map(Number)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  
  const pace = (spent / budget) / (day / daysInMonth)
  
  if (spent >= budget) {
    return { mood: 'sick', text: 'You\'ve exceeded your budget. Sprout needs watering.' }
  } else if (pace <= 0.8) {
    return { mood: 'thriving', text: 'Sprout is thriving! You are saving like a pro.' }
  } else if (pace <= 1.0) {
    return { mood: 'okay', text: 'Sprout is doing okay. Keep it up.' }
  } else if (pace <= 1.25) {
    return { mood: 'worried', text: 'Sprout is looking a bit worried.' }
  } else {
    return { mood: 'sick', text: 'Sprout is sick. You are spending too fast.' }
  }
}
