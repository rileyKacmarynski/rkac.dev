'use client'

import { cn } from '@/lib/utils'
import {
  Variants,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export type TableOfContentsProps = {
  headings: {
    id: string
    heading: string
  }[]
}
export function TableOfContents({ headings }: TableOfContentsProps) {
  const { scrollY } = useScroll()
  const reduceMotion = useReducedMotion()
  const [tocVisible, setTocVisible] = useState(reduceMotion)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const showToc = reduceMotion || latest > 800
    if (tocVisible !== showToc) {
      setTocVisible(showToc)
    }
  })

  const variants: Variants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
    },
    visible: (shouldShow) => ({
      opacity: shouldShow ? 1 : 0,
    }),
  }

  const [currentActiveSectionId, setCurrentActiveSectionId] = useState(
    headings[0].id
  )
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((entry) => entry.intersectionRatio > 0)

          console.log(entry)
          if (entry) {
            // relying on header being the first child. Hopefully that's always true
            setCurrentActiveSectionId(entry.target.children[0].id)
          }
        },
        {
          rootMargin: '-160px 0px 0px 0px',
        }
      )
    }

    const observer = observerRef.current
    observer.disconnect()

    headings
      .map((h) => h.id)
      .forEach((id) => {
        // find the <heading /> and get the parent <section />
        const el = document.getElementById(id)?.parentElement
        if (el) {
          observer.observe(el)
        }
      })

    return () => observer.disconnect()
  }, [headings])

  return (
    <motion.div
      variants={variants}
      transition={{ type: 'spring', stiffness: 100, damping: 25 }}
      initial="hidden"
      animate="visible"
      custom={tocVisible}
      className="fixed left-4 top-1/2 w-[220px] -translate-y-1/2  border-l-2 border-border hidden lg:block transition-colors"
    >
      <ul className="space-y-4">
        {headings.map(({ heading, id }) => (
          <li
            key={id}
            className={cn(
              'relative px-4 text-sm [text-wrap:balance] transition delay-200 text-zinc-500 font-medium dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
              currentActiveSectionId === id &&
                'text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-400 hover:text-indigo-700'
            )}
          >
            {currentActiveSectionId === id && (
              <motion.span
                // if I don't delay clicking a link that skips headings will cause the
                // indicator to jumpt to each heading rather than through them
                transition={{ delay: 0.2 }}
                layoutId="active-section"
                className="absolute left-0 w-[3px] -mx-[2px] rounded-full h-full bg-indigo-700 dark:bg-indigo-400"
              />
            )}
            <a href={`#${id}`} className="block">
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
