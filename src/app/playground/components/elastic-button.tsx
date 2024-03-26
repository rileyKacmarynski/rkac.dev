'use client'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Transition,
  Variant,
  Variants,
} from 'framer-motion'
import { Loader2Icon } from 'lucide-react'
import { FormEvent, forwardRef, useCallback, useState } from 'react'
import useMeasure from 'react-use-measure'

const initialTags = [
  { id: crypto.randomUUID(), text: 'tag 1', loading: false },
  { id: crypto.randomUUID(), text: 'tag 2', loading: false },
  { id: crypto.randomUUID(), text: 'tag 3', loading: false },
  { id: crypto.randomUUID(), text: 'tag 4', loading: false },
]

const transition = { type: 'spring', bounce: 0.2, duration: 0.5 }

const MotionButton = motion(Button)

const textVariants: Variants = {
  initial: { opacity: 0, scale: 0.7, y: '-100%' },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.7, y: '100%' },
}

export default function ElasticButton() {
  const [submitting, setSubmitting] = useState(false)
  const [measureRef, bounds] = useMeasure()

  const initialText = 'submit'
  const [input, setInput] = useState(initialText)
  const [text, setText] = useState(initialText)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setText(input)
  }

  function buttonClick() {
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
    }, 2000)
  }

  return (
    <div>
      <div className="space-y-8">
        <form onSubmit={onSubmit} className="space-y-2">
          <label className="dark:text-zinc-300 text-zinc-500" htmlFor="button-text">
            Change me and watch the button stretch
          </label>
          <Input
            id="button-text"
            name="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={(e) => setText(e.target.value)}
          />
        </form>
        <MotionButton
          className="px-0"
          animate={{ width: bounds.width > 0 ? bounds.width : undefined }}
          transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
          disabled={submitting}
          onClick={buttonClick}
        >
          <div ref={measureRef} className="px-4 text-nowrap">
            <MotionConfig transition={{ duration: 0.3, ease: 'easeOut', delay: 0 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {!submitting ? (
                  <motion.div
                    key={text}
                    {...textVariants}
                    className="inline-flex gap-2 items-center"
                  >
                    <span>{text}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    {...textVariants}
                    key="submitting"
                    className="inline-flex gap-2 items-center"
                  >
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Submitting</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionConfig>
          </div>
        </MotionButton>
      </div>
    </div>
  )
}
