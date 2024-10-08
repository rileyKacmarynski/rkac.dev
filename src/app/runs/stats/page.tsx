import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SomeChart } from './area'
import {
  ArrowLeftIcon,
  ClockIcon,
  GaugeIcon,
  RulerIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { db } from '@/db'
import { convertSecondsToTime, metersToMiles } from '../utils'
import {
  compareAsc,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
  subYears,
} from 'date-fns'
import { RunsGrid } from './runs-grid'
import HomeLink from '@/components/home-link'
import { Anchor } from '@/components/ui/Anchor'

type RunStats = {
  date: Date
  numberOfRuns: number
  distance: number
  movingTime: number
  averageSpeeds: number[]
}

type RunsDone = Omit<RunStats, 'averageSpeeds'> & { averageSpeed: number }

export const revalidate = 86400 // 24 hours in seconds

export default async function Stats() {
  const data = await db.query.runsTable.findMany()

  const today = new Date()
  const yearAgo = subYears(today, 1)

  // Filter data for Year-to-Date
  const ytdData = data.filter((item) => {
    const itemDate = new Date(item.startTime)
    return itemDate >= yearAgo && itemDate <= today
  })

  // Group by Month and Sum Sales
  const monthlyStats = ytdData.reduce((acc, curr) => {
    const start = new Date(curr.startTime)
    const date = startOfMonth(start)
    const month = date.toISOString()

    // If the month already exists in the accumulator, add to the sales; otherwise, initialize it
    if (acc.has(month)) {
      const run = acc.get(month)!
      run.distance += Number(curr.distance)
      run.movingTime += Number(curr.movingTime)
      run.averageSpeeds.push(Number(curr.averageSpeed))
      run.numberOfRuns++
    } else {
      acc.set(month, {
        date,
        distance: Number(curr.distance),
        movingTime: Number(curr.movingTime),
        averageSpeeds: [Number(curr.averageSpeed)],
        numberOfRuns: 1,
      })
    }

    return acc
  }, new Map<string, RunStats>())

  const runsByMonth: Map<string, RunsDone> = new Map()
  for (const [month, stats] of monthlyStats) {
    runsByMonth.set(month, {
      date: startOfMonth(month),
      averageSpeed: average(stats.averageSpeeds),
      distance: stats.distance,
      numberOfRuns: stats.numberOfRuns,
      movingTime: stats.movingTime,
    })
  }

  function getMonthKey(date: Date) {
    return startOfMonth(date).toISOString()
  }

  const currentMonthRuns = data.filter((r) => isSameMonth(r.startTime, today))
  const currentMonthTotal = runsByMonth.has(getMonthKey(today))
    ? runsByMonth.get(getMonthKey(today))!
    : createEmptyRun()

  const lastMonth = startOfMonth(subMonths(today, 1))
  const lastMonthTotal = runsByMonth.has(getMonthKey(lastMonth))
    ? runsByMonth.get(getMonthKey(lastMonth))!
    : createEmptyRun()

  const distanceTrend = createWeightedProjection(currentMonthTotal.distance, today, [
    lastMonthTotal.distance,
  ])
  const totalDistanceMeters = sum(ytdData.map((d) => d.distance))
  const totalDistance = metersToMiles(totalDistanceMeters).toFixed(1)

  const averagePace =
    sum(ytdData.map((r) => Number(r.movingTime) ?? 0)) /
    metersToMiles(totalDistanceMeters)
  const currentMonthPace =
    currentMonthTotal.movingTime / metersToMiles(currentMonthTotal.distance)
  const lastMonthPace = lastMonthTotal.movingTime / metersToMiles(lastMonthTotal.distance)
  const paceTrend = createWeightedProjection(currentMonthPace, today, [lastMonthPace])

  const ytdHours = sum(ytdData.map((d) => d.movingTime)) / 3600 // convert to hours
  const monthHours = currentMonthTotal.movingTime / 3600
  const predicted = createWeightedProjection(monthHours, today, [
    lastMonthTotal.movingTime / 3600,
  ])

  const chartData = Array.from(monthlyStats.values())
    .sort((r1, r2) => compareAsc(r1.date, r2.date))
    .map((run) => ({
      month: format(run.date, 'MMMM'),
      distance: metersToMiles(run.distance).toFixed(1),
      number: run.numberOfRuns,
      pace: run.movingTime / 60 / metersToMiles(run.distance),
      time: run.movingTime / 3600,
    }))

  return (
    <>
      <div className="flex p-1 md:p-3 items-center bg-primary-bg justify-between">
        <nav className="whitespace-nowrap flex justify-between w-full">
          <Anchor className="inline-flex group gap-0.5 items-center" href="/runs">
            <ArrowLeftIcon className="w-4 h-4 stroke-muted-bg group-hover:stroke-hover duration-200" />
            Back to runs
          </Anchor>
          <Anchor href="/">Home</Anchor>
        </nav>
      </div>
      <div className="@container">
        <div className="p-5 bg-primary-bg max-w-6xl m-auto ">
          <div className="grid gap-5 grid-cols-1 @md:grid-cols-6 @lg:grid-cols-6">
            <Card className="col-span-6 @lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Distance (Year)
                </CardTitle>
                <RulerIcon className="h-4 w-4 text-muted-fg" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance} mi</div>
                <p className="text-xs text-muted-fg">
                  This month: {metersToMiles(currentMonthTotal.distance).toFixed(1)} mi
                  {distanceTrend.predictedCurrentMonthValue >
                  distanceTrend.averagePerMonth ? (
                    <TrendingUpIcon className="inline h-4 w-4 text-emerald-600 ml-2" />
                  ) : (
                    <TrendingDownIcon className="inline h-4 w-4 text-rose-600 ml-2" />
                  )}
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-6 @lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Pace (Year)</CardTitle>
                <GaugeIcon className="h-4 w-4 text-muted-fg" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {convertSecondsToTime(averagePace)}
                </div>
                <p className="text-xs text-muted-fg">
                  This month: {convertSecondsToTime(currentMonthPace)}
                  {paceTrend.predictedCurrentMonthValue > averagePace ? (
                    <TrendingUpIcon className="inline h-4 w-4 text-emerald-600 ml-2" />
                  ) : (
                    <TrendingDownIcon className="inline h-4 w-4 text-rose-600 ml-2" />
                  )}
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-6 @lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent (Year)</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-fg" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ytdHours.toFixed(0)} Hours</div>
                <p className="text-xs text-muted-fg">
                  This month: {monthHours.toFixed(1)} Hours
                </p>
              </CardContent>
            </Card>
            <RunsGrid runs={data} />
            <SomeChart
              title="Average Distance"
              label="distance"
              description="Average monthly distance ran in miles."
              chartData={chartData}
            />
            <SomeChart
              title="Number of Runs"
              label="number"
              description="Number of runs per month"
              chartData={chartData}
            />
            <SomeChart
              title="Average Pace"
              label="pace"
              description="Average mile pace in minutes across all runs for the month."
              chartData={chartData}
            />
            <SomeChart
              title="Time"
              label="time"
              description="Time spent running in hours for the month."
              chartData={chartData}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function average(nums: number[]) {
  const total = nums.reduce((sum, val) => sum + val)
  return total / nums.length
}

function sum(nums: Array<string | number>) {
  return nums.reduce((t: number, n) => {
    return typeof n === 'string' ? t + Number(n) : t + n
  }, 0)
}

function createEmptyRun() {
  return {
    distance: 0,
    numberOfRuns: 0,
    movingTime: 0,
    averageSpeed: 0,
  }
}

// I don't think I even use the final value 🤷
function createWeightedProjection(
  currentValue: number,
  currentDate: Date,
  historicalValues: number[]
) {
  // Calculate the average from previous months
  const totalHistorical = historicalValues.reduce(
    (sum: number, value: number) => sum + value,
    0
  )
  const averagePerMonth = totalHistorical / historicalValues.length

  // Get the total number of days in the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) // Last day of the month
  const totalDays = endOfMonth.getDate()

  // Get the number of days passed so far
  const daysPassed = currentDate.getDate()

  // Calculate the ratio of days passed to total days
  const progressRatio = daysPassed / totalDays

  // Calculate predicted value based on current progress and historical average
  const predictedCurrentMonthValue = currentValue / progressRatio

  // Blend the current prediction with the historical average (50% from current month, 50% from history)
  const finalPrediction = (predictedCurrentMonthValue + averagePerMonth) / 2

  return {
    predictedCurrentMonthValue: metersToMiles(predictedCurrentMonthValue),
    averagePerMonth: metersToMiles(averagePerMonth),
    finalPrediction: metersToMiles(finalPrediction),
  }
}
