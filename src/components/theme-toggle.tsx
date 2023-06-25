'use client'
import { IconButton } from '@/components/ui/button'
import {
  AnimatePresence,
  MotionConfig,
  MotionProps,
  Variant,
  Variants,
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
      <MotionConfig transition={{ duration: 0.5 }}>
        <AnimatePresence initial={false} mode="wait">
          {theme === 'dark' ? <SunIcon key="sun" /> : <MoonIcon key="moon" />}
        </AnimatePresence>
      </MotionConfig>
    </IconButton>
  )
}

const svgVariants: Variants = {
  hidden: {
    // opacity: 0,
    // rotateZ: '30deg',
  },
  visible: {
    // opacity: 1,
    // rotateZ: '0',
    transition: { staggerChildren: 0.1 },
  },
}

const pathVariants: Variants = {
  hidden: {
    pathLength: 0,
  },
  visible: {
    pathLength: 1,
  },
}

function SunIcon() {
  return (
    <motion.svg
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
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
      <motion.circle
        variants={pathVariants}
        strokeDasharray="0 1"
        cx="12"
        cy="12"
        r="4"
      />
      <motion.path variants={pathVariants} strokeDasharray="0 1" d="M12 2v2" />
      <motion.path
        variants={pathVariants}
        strokeDasharray="0 1"
        d="m19.07 4.93-1.41 1.41"
      />
      <motion.path variants={pathVariants} strokeDasharray="0 1" d="M20 12h2" />
      <motion.path
        variants={pathVariants}
        strokeDasharray="0 1"
        d="m17.66 17.66 1.41 1.41"
      />
      <motion.path variants={pathVariants} strokeDasharray="0 1" d="M12 20v2" />
      <motion.path
        variants={pathVariants}
        strokeDasharray="0 1"
        d="m6.34 17.66-1.41 1.41"
      />
      <motion.path variants={pathVariants} strokeDasharray="0 1" d="M2 12h2" />
      <motion.path
        variants={pathVariants}
        strokeDasharray="0 1"
        d="m4.93 4.93 1.41 1.41"
      />
    </motion.svg>
  )
}

function MoonIcon() {
  return (
    <motion.svg
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
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
      <motion.path
        variants={pathVariants}
        strokeDasharray="0 1"
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      />
    </motion.svg>
  )
}
