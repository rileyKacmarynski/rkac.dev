import { db } from '@/db'
import { runsTable } from '@/db/schema'
import { desc } from 'drizzle-orm'
import React from 'react'
import Metrics from './metrics'
import { padEnd, getDates, isSameDate, metersToMiles, padStart } from './utils'
import HomeLink from '@/components/home-link'
import { Anchor } from '@/components/ui/Anchor'
import GitHubIcon from '@/components/icons/github-icon'

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

  const startDate = padStart(runs.at(-1)!.startTime)
  const endDate = padEnd(today)

  const days = getDates(startDate, endDate).map((date) => {
    // I don't run more than once in a day, so this is fine
    const run = runs.find((r) => isSameDate(r.startTime, date))

    return { date, run }
  })

  return (
    <div>
      <div className="flex p-1 md:p-3 items-center bg-primary-bg justify-between">
        <nav className="whitespace-nowrap">
          <HomeLink />
        </nav>
        <span className="text-[0.675rem] sm:text-sm text-muted-fg/75">
          {Math.round(metersToMiles(total.distance))} miles so far this year.
        </span>
      </div>
      <Metrics days={days} />
      <footer className="fixed bottom-0 w-full flex align-center justify-between p-3 text-[0.675rem] md:text-sm text-muted-fg/75">
        <p>
          Inpired by{' '}
          <Anchor external href="https://rauno.me/run">
            rauno.me
          </Anchor>
        </p>
        <a className="hover:text-muted-fg" href="#">
          <GitHubIcon className="size-4" />
        </a>
      </footer>
    </div>
  )
}
