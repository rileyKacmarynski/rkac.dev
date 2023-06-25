'use client'
import { IconButton } from '@/components/ui/button'
import {
  AnimatePresence,
  MotionConfig,
  MotionProps,
  motion,
} from 'framer-motion'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <IconButton onPress={toggleTheme} className="ml-auto">
      <AnimatePresence initial={false} mode="wait">
        {theme === 'dark' ? <SunIcon key="sun" /> : <MoonIcon key="moon" />}
      </AnimatePresence>
    </IconButton>
  )
}

const toggleAnimation: MotionProps = {}

function SunIcon() {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-sun"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  )
}

function MoonIcon() {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-moon"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.svg>
  )
}
