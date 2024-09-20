export function getDates(startDate: Date, endDate: Date) {
  const dateArray = []
  let currentDate = new Date(startDate)

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray
}

// this is all just ChatGPT slop
export function padEnd(date: Date) {
  let daysUntilSunday = 7 - date.getDay()

  // If today is Sunday, we want to start counting from next Sunday
  if (daysUntilSunday === 0) {
    daysUntilSunday = 7
  }

  // Add 7 more days to get to the second Sunday
  const totalDaysToAdd = daysUntilSunday + 100

  const secondSunday = new Date(date.getTime() + totalDaysToAdd * 24 * 60 * 60 * 1000)

  return secondSunday
}

export function padStart(date: Date) {
  let daysUntilSunday = 7 - date.getDay()

  // If today is Sunday, we want to start counting from next Sunday
  if (daysUntilSunday === 0) {
    daysUntilSunday = 7
  }

  // Add 7 more days to get to the second Sunday
  const totalDaysToAdd = daysUntilSunday - 100

  const secondSunday = new Date(date.getTime() + totalDaysToAdd * 24 * 60 * 60 * 1000)

  return secondSunday
}

export function isSameDate(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function roundString(n: string) {
  return Number(n).toFixed(2)
}

export function metersToMiles(meters: number) {
  const meterToMileRatio = 0.000621371
  return meters * meterToMileRatio
}

export function metersPerSecondToMph(speed: number) {
  return speed * 2.237
}

export function convertSecondsToTime(totalSeconds: number) {
  totalSeconds = Math.round(totalSeconds)
  const hours = totalSeconds / 3600
  const seconds = totalSeconds % 60
  const fmt = (t: number) => Math.round(t).toString().padStart(2, '0')

  if (hours < 1) {
    const minutes = Math.floor(totalSeconds / 60)

    return `${fmt(minutes)}:${fmt(seconds)}`
  }

  const minutes = (totalSeconds % 3600) / 60

  return `${fmt(Math.floor(hours))}:${fmt(minutes)}`
}
