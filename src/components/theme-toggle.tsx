'use client'
import { IconButton } from '@/components/ui/button'
import { AnimatePresence, MotionConfig, Variants, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <IconButton onPress={toggleTheme} className="ml-auto">
      <MotionConfig transition={{ duration: 0.5 }}>
        <motion.div
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {theme === 'light' ? (
              <MoonIcon key="moon" />
            ) : (
              <SunIcon key="sun" />
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    </IconButton>
  )
}

const totalDuration = 0.5

const svgVariants: Variants = {
  visible: (childCount: number) => ({
    transition: {
      staggerChildren: totalDuration / 2 / childCount,
      duration: totalDuration / 2,
    },
  }),
  exit: (childCount: number) => ({
    transition: {
      staggerChildren: totalDuration / 2 / childCount,
      duration: totalDuration / 2,
      staggerDirection: -1,
    },
  }),
}

const pathVariants: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
  },
  exit: {
    pathLength: 0,
    opacity: 0,
  },
}

function SunIcon() {
  return (
    <motion.svg
      custom={9}
      variants={svgVariants}
      initial="initial"
      animate="visible"
      exit="exit"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-sun"
    >
      <motion.circle
        variants={pathVariants}
        transform="rotate(-90, 12, 12)"
        cx="12"
        cy="12"
        r="4"
      />
      <motion.path variants={pathVariants} d="M12 2v2" />
      <motion.path variants={pathVariants} d="m19.07 4.93-1.41 1.41" />
      <motion.path variants={pathVariants} d="M20 12h2" />
      <motion.path variants={pathVariants} d="m17.66 17.66 1.41 1.41" />
      <motion.path variants={pathVariants} d="M12 20v2" />
      <motion.path variants={pathVariants} d="m6.34 17.66-1.41 1.41" />
      <motion.path variants={pathVariants} d="M2 12h2" />
      <motion.path variants={pathVariants} d="m4.93 4.93 1.41 1.41" />
    </motion.svg>
  )
}

function MoonIcon() {
  return (
    <motion.svg
      variants={svgVariants}
      initial="initial"
      animate="visible"
      exit="exit"
      custom={1}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-moon"
    >
      <motion.path
        variants={pathVariants}
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      />
    </motion.svg>
  )
}
