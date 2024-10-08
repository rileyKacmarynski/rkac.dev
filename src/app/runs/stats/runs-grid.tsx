import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { RunSelect } from '@/db/schema'
import {
  subDays,
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
  eachDayOfInterval,
  isSameDay,
  format,
} from 'date-fns'
import { metersToMiles } from '../utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function RunsGrid({ runs }: { runs: RunSelect[] }) {
  const today = new Date()
  const startDate = subDays(today, 365)
  const interval = { start: startOfWeek(startDate), end: endOfWeek(today) }
  // slice off current month
  const months = eachMonthOfInterval(interval)
    .slice(0, -1)
    .map((d) => format(d, 'MMM'))
  const days = eachDayOfInterval(interval)

  const rows: Date[][] = []
  for (let i = 0; i < days.length; i++) {
    const row = i % 7
    if (rows.length <= row) {
      rows.push([])
    }

    rows[row].push(days[i])
  }

  return (
    <Card className="col-span-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="pb-3">
            <table
              className="overflow-hidden m-auto w-max border-spacing-1 border-separate"
              role="grid"
              aria-readonly="true"
            >
              <caption className="sr-only">Runs Graph</caption>
              <thead>
                <tr className="text-sm">
                  {months.map((m, i) => (
                    <td key={i} colSpan={(i + 1) % 3 === 0 ? 5 : 4}>
                      {m}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((week, i) => (
                  <tr key={`runs-table-row-${i}`} className="">
                    {week.map((day) => {
                      const run = runs.find((r) => isSameDay(r.startTime, day))

                      const distanceInMiles = metersToMiles(Number(run?.distance ?? '0'))
                      const tooltipContent = run
                        ? `${day.toLocaleDateString()} - ${distanceInMiles.toFixed(1)} miles`
                        : `${day.toLocaleDateString()} - Rest`

                      const level = distanceInMiles ? Math.ceil(distanceInMiles / 2) : 0

                      return (
                        <td
                          key={day.toISOString()}
                          data-level={level}
                          className="size-2.5 bg-muted-bg/25 data-[level=1]:bg-violet-200/50 data-[level=2]:bg-violet-300/50 data-[level=3]:bg-violet-400/50 data-[level=4]:bg-violet-500/50 data-[level=5]:bg-violet-600/50 rounded-sm"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-full h-full" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltipContent}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
