import { RunSelect } from '@/db/schema'
import { AnimatePresence, motion } from 'framer-motion'
import useMeasure from 'react-use-measure'
// @ts-ignore
import { decode } from '@mapbox/polyline'

export default function RouteBackrop({ run }: { run?: RunSelect }) {
  const [containerRef, measure] = useMeasure()

  const coords = run?.mapPolyline ? decode(run.mapPolyline) : null
  const size = Math.min(measure.height, measure.width)

  return (
    <div
      ref={containerRef}
      className="absolute dark:text-mauve-11 overflow-hidden inset-0 grid place-items-center -z-10"
    >
      <AnimatePresence initial={true} mode="wait">
        {coords && (
          <motion.svg
            key={run!.startTime.getUTCSeconds()}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            width={size}
            height={size}
          >
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth={12}
              className="dark:opacity-[0.05] opacity-[0.01]"
              d={createSvgPath(coords, size, size, 100)}
              // filter="url(#blur)"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  )
}

function createSvgPath(
  coords: Array<[number, number]>,
  width: number,
  height: number,
  padding: number = 10
) {
  if (coords.length === 0) return

  const scaled = scaleCoordinates(coords, width, height, padding)

  return scaled
    .map((coord, index) => {
      const [x, y] = coord

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function scaleCoordinates(
  coords: Array<[number, number]>,
  width: number,
  height: number,
  padding: number
) {
  const lngs = coords.map((coord) => coord[0])
  const lats = coords.map((coord) => coord[1])

  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)

  const scaleLng = (width - 2 * padding) / (maxLng - minLng)
  const scaleLat = (height - 2 * padding) / (maxLat - minLat)

  return coords.map(([lng, lat]) => [
    (lng - minLng) * scaleLng + padding,
    height - ((lat - minLat) * scaleLat + padding), // Invert Y-axis
  ])
}
