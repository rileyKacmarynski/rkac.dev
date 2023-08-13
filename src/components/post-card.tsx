'use client'

import { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { MouseEvent } from 'react'

export function PostCard({ post }: { post: Post }) {
  const reduceMotion = useReducedMotion()
  const spring = {
    stiffness: 500,
    damping: 25,
  }
  let mouseX = useMotionValue(0)
  mouseX = useSpring(mouseX, spring)
  let mouseY = useMotionValue(0)
  mouseY = useSpring(mouseY, spring)

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <Link
      onMouseMove={handleMouseMove}
      href={post.slug}
      className="relative flex flex-col p-6 no-underline h-[260px] transition border shadow group rounded-xl border-border dark:hover:border-zinc-700 hover:border-zinc-300 hover:cursor-pointer"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl text-zinc-900/90 dark:text-zinc-100/90 duration-300 [mask-image:linear-gradient(20deg,transparent,white)] opacity-20 transition group-hover:opacity-30">
        <Hexagons />
      </div>
      <motion.div
        className="absolute transition [--spotlight:0,0,0,0.05] dark:[--spotlight:255,255,255,0.1] duration-700 opacity-0 pointer-events-none -inset-px rounded-xl bg-gradient-to-tr from-indigo-700 to-rose-700 group-hover:opacity-20 dark:group-hover:opacity-30"
        style={
          !reduceMotion
            ? {
                maskImage: useMotionTemplate`
            radial-gradient(
              320px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
                WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              320px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
              }
            : undefined
        }
      />
      <div className="z-10 mt-auto">
        <header className="mb-4">
          <h2 className="m-0 text-2xl font-bold tracking-tight text-transparent text-gray-900 transition-colors bg-clip-text dark:from-white dark:to-neutral-200 from-black to-neutral-800 bg-gradient-to-b ">
            <Balancer>{post.title}</Balancer>
          </h2>
          <p className="mt-1 space-x-1 text-xs text-muted-foreground">
            <span>{format(parseISO(post.date), 'MMMM dd, yyyy')}</span>
            <span>{` • `}</span>
            <span>{post.readingTime.text}</span>
          </p>
        </header>
        {post.description && (
          <p className="mt-auto font-normal max-h-32 line-clamp-2 sm:line-clamp-4">
            {post.description}
          </p>
        )}
        {/* <footer className="flex items-center gap-3 transition text-muted-foreground group-hover:text-foreground">
          <span className="ml-auto">Read more</span>
          <MoveRight className="mt-[4px] transition group-hover:translate-x-1" />
        </footer> */}
      </div>
    </Link>
  )
}

export default PostCard

function Hexagons() {
  return (
    <svg
      id="patternId"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="-skew-x-[15deg] rotate-[30deg] scale-[200%] bg-gradient-to-tr fill-black/25 "
    >
      <defs>
        <pattern
          id="hex-pattern"
          patternUnits="userSpaceOnUse"
          width="29"
          height="50.115"
          patternTransform="scale(1) rotate(0)"
        >
          <rect x="0" y="0" width="100%" height="100%" fill="none" />
          <path
            d="M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z"
            stroke-width="0.25"
            stroke="currentColor"
            fill="none"
          />
        </pattern>
      </defs>
      <rect
        width="800%"
        height="800%"
        transform="translate(0,0)"
        fill="url(#hex-pattern)"
      />
    </svg>
  )
}
