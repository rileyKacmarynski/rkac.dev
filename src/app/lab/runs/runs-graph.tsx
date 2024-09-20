import { cn } from '@/lib/utils'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useRef, useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { RunDay } from './metrics'
import { metersToMiles, convertSecondsToTime } from './utils'

export type RunsGraphProps = {
  days: RunDay[]
  selectedDay: RunDay
  setSelectedDay: Dispatch<SetStateAction<RunDay>>
}

export default function RunsGraph({ days, selectedDay, setSelectedDay }: RunsGraphProps) {
  const markerRef = useRef<HTMLDivElement>(null)
  const daysRef = useRef<Map<RunDay, HTMLDivElement> | null>(null)

  const scrollViewportRef = useRef<HTMLDivElement>(null)

  // scroll last run into view
  useEffect(() => {
    const run = getDaysMap().get(selectedDay)
    if (run) {
      // setTimeout is needed to so this work on IOS Safari 🤷
      setTimeout(() => run.scrollIntoView({ behavior: 'smooth', inline: 'center' }))
    }
  }, [])

  const getDaysMap = useCallback(() => {
    if (!daysRef.current) {
      daysRef.current = new Map()
    }

    return daysRef.current
  }, [])

  const setSelectedDayDebounced = useDebouncedCallback((day: RunDay) => {
    if (!isTapping) {
      setSelectedDay(day)
    }
  }, 600)

  const [isTapping, setTapping] = useState(false)
  const manageScroll = useCallback(() => {
    if (!markerRef.current) return

    const isIntersecting = (el1: HTMLDivElement, el2: HTMLDivElement) => {
      const rect1 = el1.getBoundingClientRect()
      const rect2 = el2.getBoundingClientRect()

      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      )
    }

    for (const [day, el] of getDaysMap()) {
      if (isIntersecting(el, markerRef.current.querySelector('#marker')!)) {
        setSelectedDayDebounced(day)

        const runEl = markerRef.current.querySelector('#run')!
        const dateEl = markerRef.current.querySelector('#day')!
        const date = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(day.date)
        dateEl.innerHTML = date

        if (day.run) {
          const distance = metersToMiles(parseFloat(day.run.distance ?? '0'))
          const pace = convertSecondsToTime(Number(day.run.movingTime ?? '0') / distance)
          runEl.innerHTML = `${metersToMiles(Number(day.run.distance)).toFixed(2)}mi • ${pace}`
        } else {
          runEl.innerHTML = 'Rest'
        }
      }
    }
  }, [])

  return (
    <>
      <ScrollArea.Root>
        <ScrollArea.Viewport
          onTouchStart={() => setTapping(true)}
          onTouchEnd={() => setTapping(false)}
          onScroll={(e) => {
            manageScroll()
          }}
          className="snap-x snap-mandatory"
          ref={scrollViewportRef}
        >
          <div className="flex gap-[6px] justify-center items-end h-[320px]">
            {days.map((day) => (
              <div
                ref={(node) => {
                  const map = getDaysMap()
                  if (node) {
                    map.set(day, node)
                  } else {
                    map.delete(day)
                  }
                }}
                key={day.date.toString()}
                className="group flex justify-center items-end h-full snap-center"
              >
                <div
                  className={cn(
                    'w-[1.5px] transition',
                    day.run ? 'bg-contrast/75 group-hover:bg-contrast' : 'bg-contrast/25',
                    day.date.getDate() === 1 && 'dark:bg-violet-400/75'
                  )}
                  style={{
                    height: day.run
                      ? `${(25 + Number(day.run?.distance ?? 0) * 0.015).toFixed(2)}px`
                      : '25px',
                  }}
                  onClick={() => setSelectedDay(day)}
                ></div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <div
        ref={markerRef}
        className="h-[280px] pointer-events-none absolute left-[calc(50%)] -translate-x-[50%] top-[55px] flex flex-col items-center w-[200px]"
      >
        <div
          id="run"
          className="absolute w-max -top-[1.5em] text-sm dark:text-mauve-3 tracking-wider"
        ></div>
        <div id="marker" className="rounded-full h-full dark:bg-violet-600/50 w-[2px]" />
        <div
          id="day"
          className="absolute w-max -bottom-[1.5em] text-sm text-muted-fg"
        ></div>
      </div>
    </>
  )
}
