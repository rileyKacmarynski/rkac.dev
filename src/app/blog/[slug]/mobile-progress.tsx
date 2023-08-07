'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function MobileProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 60 })

  return (
    <motion.div
      aria-hidden
      className="md:hidden fixed top-16 left-0 w-full h-[1px] bg-zinc-400 dark:bg-zinc-500 origin-left"
      style={{ scaleX }}
    />
  )
}
