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

export default function stats() {
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
