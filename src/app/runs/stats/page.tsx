import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { SomeChart } from './area'
import { RulerIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { db } from '@/db'
import { RunSelect } from '@/db/schema'
import { metersPerSecondToMph, metersToMiles } from '../utils'

type RunStats = {
  numberOfRuns: number
  distance: number
  movingTime: number
  averageSpeeds: number[]
}

type RunsDone = Omit<RunStats, 'averageSpeeds'> & { averageSpeed: number }

export default async function stats() {
  const data = await db.query.runsTable.findMany()

  // Get the first day of the current year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1)
  const today = new Date()

  // Filter data for Year-to-Date
  const ytdData = data.filter((item) => {
    const itemDate = new Date(item.startTime)
    return itemDate >= startOfYear && itemDate <= today
  })

  // Group by Month and Sum Sales
  const monthlyStats = ytdData.reduce((acc, curr) => {
    const start = new Date(curr.startTime)
    const month = start.getMonth()
    const date = new Date(start.getFullYear(), start.getMonth(), 1).toISOString()

    // If the month already exists in the accumulator, add to the sales; otherwise, initialize it
    if (acc.has(date)) {
      const run = acc.get(date)!
      run.distance += Number(curr.distance)
      run.movingTime += Number(curr.movingTime)
      run.averageSpeeds.push(Number(curr.averageSpeed))
      run.numberOfRuns++
    } else {
      acc.set(date, {
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
    const average = (nums: number[]) => {
      const total = nums.reduce((sum, val) => sum + val)
      return total / nums.length
    }
    runsByMonth.set(month, {
      averageSpeed: metersPerSecondToMph(average(stats.averageSpeeds)),
      distance: metersToMiles(stats.distance),
      numberOfRuns: stats.numberOfRuns,
      movingTime: stats.movingTime,
    })
  }

  console.log(runsByMonth)

  return (
    <div className="p-5 bg-primary-bg max-w-6xl m-auto @container">
      <div className="grid gap-5 grid-cols-1 @md:grid-cols-6 @lg:grid-cols-6">
        <Stats />
        <Stats />
        <Stats />
        <SomeChart />
        <SomeChart />
        <SomeChart />
        <SomeChart />
      </div>
    </div>
  )
}

function Stats() {
  return (
    <Card className="col-span-1 @md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Distance (Year)</CardTitle>
        <RulerIcon className="h-4 w-4 text-muted-fg" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">218.8 mi</div>
        <p className="text-xs text-muted-fg">
          This month: 42.3 mi
          {1 > 0 ? (
            <TrendingUpIcon className="inline h-4 w-4 text-emerald-600 ml-1" />
          ) : (
            <TrendingDownIcon className="inline h-4 w-4 text-rose-600 ml-1" />
          )}
        </p>
      </CardContent>
    </Card>
  )
}

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
    predictedCurrentMonthValue,
    averagePerMonth,
    finalPrediction,
  }
}
