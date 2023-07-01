'use client'
import { IconButton } from '@/components/ui/button'
import {
  AnimatePresence,
  Variants,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const preferReducedMotion = useReducedMotion()

  const { svgVariants, pathVariants } = useIconToggleAnimation(
    preferReducedMotion ?? false
  )

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
      <motion.div
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence initial={false} mode="wait">
          {theme === 'light' ? (
            <MoonIcon
              svgVariants={svgVariants}
              pathVariants={pathVariants}
              key="moon"
            />
          ) : (
            <SunIcon
              svgVariants={svgVariants}
              pathVariants={pathVariants}
              key="sun"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </IconButton>
  )
}

type IconVariants = {
  svgVariants: Variants
  pathVariants: Variants
}

function SunIcon({ svgVariants, pathVariants }: IconVariants) {
  return (
    <motion.svg
      custom={9}
      whileTap={{ y: 1, scale: 0.98 }}
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

function MoonIcon({ svgVariants, pathVariants }: IconVariants) {
  return (
    <motion.svg
      variants={svgVariants}
      whileTap={{ y: 1, scale: 0.98 }}
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

function useIconToggleAnimation(preferReducedMotion: boolean) {
  return useMemo(() => {
    const inDuration = 0.5
    const outDuration = 0.25
    const svgVariants: Variants = {
      visible: (childCount: number) =>
        preferReducedMotion
          ? {
              initial: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
              },
              hidden: {
                opacity: 0,
              },
            }
          : {
              transition: {
                staggerChildren: inDuration / childCount,
                duration: inDuration,
              },
            },
    }

    const pathVariants: Variants = preferReducedMotion
      ? {}
      : {
          initial: {
            pathLength: 0,
            opacity: 0,
          },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              opacity: { duration: 0.01 },
              pathLength: { duration: inDuration },
            },
          },
          exit: {
            opacity: 0,
            transition: { duration: outDuration },
          },
        }

    return { svgVariants, pathVariants }
  }, [preferReducedMotion])
}
