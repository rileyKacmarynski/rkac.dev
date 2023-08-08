'use client'

import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'

export type TableOfContentsProps = {
  headings: {
    id: string
    heading: string
  }[]
}
export function TableOfContents({ headings }: TableOfContentsProps) {
  // 400 ish is a good amount
  const { scrollY } = useScroll()
  const reduceMotion = useReducedMotion()

  useMotionValueEvent(scrollY, 'change', (latest) => console.log(latest))

  return (
    <ul className="px-4 py-2 space-y-4 ">
      {headings.map(({ heading, id }, index) => (
        <li
          key={id}
          data-active={index === 2}
          className="text-sm [text-wrap:balance] text-zinc-500 font-medium dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition data-[active=true]:text-indigo-900 dark:data-[active=true]:text-indigo-400"
        >
          <a href={`#${id}`}>{heading}</a>
        </li>
      ))}
    </ul>
  )
}
