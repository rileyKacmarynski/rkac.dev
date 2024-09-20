'use client'

import { AnimatePresence, motion } from 'framer-motion'
import useMeasure from 'react-use-measure'

export default function AnimatedNumber({
  value,
  stagger,
}: {
  value: string
  stagger?: number
}) {
  const [ref, bounds] = useMeasure()

  return (
    <motion.div
      className="inline-flex"
      animate={{ width: bounds.width > 0 ? bounds.width : 'auto' }}
    >
      <div ref={ref} className="inline-flex ">
        {/* 
          Need to render some extra elements so we don't get jank
          when animating between numbers with a different number of digits
          for example 3.00 miles into 10.00 miles
        */}
        {[' ', ' ', ...value.split(''), ' ', ' '].map((n, i) => (
          <AnimatePresence key={i} initial={false} mode="popLayout">
            <motion.div
              transition={{
                type: 'spring',
                duration: 1,
                bounce: Math.random() * (0.35 - 0.25) + 0.25,
                delay: (value.length - i) * 0.05 + (stagger ?? 0),
              }}
              className="animated-digit"
              key={`motion-${i}-${n}`}
              initial={{ y: 25, opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ y: -25, opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
            >
              {n}
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  )
}
