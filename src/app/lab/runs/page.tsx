import { db } from '@/db'
import { runsTable } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { ibmPlexMono } from '@/app/fonts'
import { cn } from '@/lib/utils'
import React from 'react'
import { MetricCard } from '@/components/metric-card'

export default async function RunsPage() {
  const runs = await db.query.runsTable.findMany({
    orderBy: [desc(runsTable.startTime)],
  })

  if (!runs) {
    return null
  }

  const today = new Date()
  const total = runs
    .filter((r) => r.startTime >= new Date(today.getFullYear(), 1, 1))
    .reduce(
      ({ distance, time }, run) => {
        return {
          distance: distance + Number(run.distance),
          time: time + Number(run.movingTime),
        }
      },
      { distance: 0, time: 0 }
    )

  console.log('totals', total)

  const startDate = runs.at(-1)!.startTime
  const endDate = padEnd(today)

  const days = getDates(startDate, endDate).map((date) => {
    // I don't run more than once in a day, so this is fine
    const run = runs.find((r) => isSameDate(r.startTime, date))

    return { date, run }
  })

  const selectedRun = days.find((d) => d.run)
  if (!selectedRun?.run) return null

  return (
    <div>
      <div className="px-3 xpt-20 pt-3 pb-6 mx-auto max-w-3xl">
        <span className="text-[12px] flex justify-end text-muted-fg/75">
          <p>{Math.round(metersToMiles(total.distance))} miles so far this year.</p>
        </span>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 justify-items-center py-6">
          <MetricCard>
            <MetricCard.Label>Distance</MetricCard.Label>
            <MetricCard.Value>
              {metersToMiles(parseFloat(selectedRun.run.distance)).toFixed(2)}
            </MetricCard.Value>
            <MetricCard.Unit>miles</MetricCard.Unit>
          </MetricCard>
          <MetricCard>
            <MetricCard.Label>Time</MetricCard.Label>
            <MetricCard.Value>
              {convertSecondsToTime(Number(selectedRun.run.totalTime))}
            </MetricCard.Value>
          </MetricCard>
          <MetricCard>
            <MetricCard.Label>Average Speed</MetricCard.Label>
            <MetricCard.Value>
              {metersPerSecondToMph(Number(selectedRun.run.averageSpeed)).toFixed(2)}
            </MetricCard.Value>
            <MetricCard.Unit>mph</MetricCard.Unit>
          </MetricCard>
        </div>
      </div>
    </div>
  )
}

function getDates(startDate: Date, endDate: Date) {
  const dateArray = []
  let currentDate = new Date(startDate)

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray
}

function padEnd(date: Date) {
  let daysUntilSunday = 7 - date.getDay()

  // If today is Sunday, we want to start counting from next Sunday
  if (daysUntilSunday === 0) {
    daysUntilSunday = 7
  }

  // Add 7 more days to get to the second Sunday
  const totalDaysToAdd = daysUntilSunday + 7

  const secondSunday = new Date(date.getTime() + totalDaysToAdd * 24 * 60 * 60 * 1000)

  return secondSunday
}

function isSameDate(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function roundString(n: string) {
  return Number(n).toFixed(2)
}

function metersToMiles(meters: number) {
  const meterToMileRatio = 0.000621371
  return meters * meterToMileRatio
}

function metersPerSecondToMph(speed: number) {
  return speed * 2.3694
}

function convertSecondsToTime(totalSeconds: number) {
  const hours = totalSeconds / 3600
  const minutes = (totalSeconds % 3600) / 60
  const seconds = totalSeconds % 60

  const fmt = (t: number) => Math.round(t).toString().padStart(2, '0')

  console.log('hours', hours)

  if (hours < 1) {
    return `${fmt(minutes)}:${fmt(seconds)}`
  }

  return `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`
}
