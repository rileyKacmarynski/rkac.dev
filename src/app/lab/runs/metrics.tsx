'use client'

import { MetricCard } from '@/app/lab/runs/metric-card'
import { convertSecondsToTime, metersPerSecondToMph, metersToMiles } from './utils'
import { RunSelect } from '@/db/schema'
import { useState } from 'react'
import AnimatedNumber from './animated-number'
import RunsGraph from './runs-graph'
import RouteBackrop from './route-backdrop'

export type RunDay = {
  date: Date
  run?: RunSelect
}

export type MetricsProps = {
  days: Array<RunDay>
}

export default function ({ days }: MetricsProps) {
  const [selectedDay, setSelectedDay] = useState(days.filter((d) => d.run).at(-2)!)

  if (!selectedDay) return null

  const distance = metersToMiles(parseFloat(selectedDay.run?.distance ?? '0'))

  return (
    <div className="pb-6">
      <RouteBackrop run={selectedDay.run} />
      <div className="px-3 py-6 mx-auto flex flex-col">
        <div className="grid gap-2 grid-cols-2 lg:grid-cols-4 justify-items-stretch text-center">
          <MetricCard>
            <>
              <MetricCard.Label>Distance</MetricCard.Label>
              <MetricCard.Value>
                <AnimatedNumber value={distance.toFixed(2)} />
              </MetricCard.Value>
              <MetricCard.Unit>miles</MetricCard.Unit>
            </>
          </MetricCard>
          <MetricCard>
            <>
              <MetricCard.Label>Time</MetricCard.Label>
              <MetricCard.Value>
                <AnimatedNumber
                  stagger={0.1}
                  value={convertSecondsToTime(Number(selectedDay.run?.totalTime ?? '0'))}
                />
              </MetricCard.Value>
              <MetricCard.Unit>
                <AnimatedNumber
                  stagger={0.2}
                  value={
                    Number(selectedDay.run?.totalTime ?? '0') > 3600 ? 'hh:mm' : 'mm:ss'
                  }
                />
              </MetricCard.Unit>
            </>
          </MetricCard>
          <MetricCard>
            <>
              <MetricCard.Label>Average Speed</MetricCard.Label>
              <MetricCard.Value>
                <AnimatedNumber
                  stagger={0.25}
                  value={metersPerSecondToMph(
                    Number(selectedDay.run?.averageSpeed ?? '0')
                  ).toFixed(2)}
                />
              </MetricCard.Value>
              <MetricCard.Unit>mph</MetricCard.Unit>
            </>
          </MetricCard>
          <MetricCard>
            <>
              <MetricCard.Label>Average Pace</MetricCard.Label>
              <MetricCard.Value>
                <AnimatedNumber
                  stagger={0.3}
                  value={
                    selectedDay.run
                      ? convertSecondsToTime(
                          Number(selectedDay.run.movingTime ?? '0') / distance
                        )
                      : '00:00'
                  }
                />
              </MetricCard.Value>
              <MetricCard.Unit>mm:ss</MetricCard.Unit>
            </>
          </MetricCard>
        </div>
      </div>
      <div className="pb-6 mt-3 sm:mt-6 xcursor-none relative">
        <RunsGraph
          days={days}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </div>
    </div>
  )
}
