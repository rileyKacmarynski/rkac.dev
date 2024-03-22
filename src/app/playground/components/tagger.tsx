'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, MotionConfig, Transition } from 'framer-motion'
import { Loader2Icon } from 'lucide-react'
import { forwardRef, useCallback, useState } from 'react'
import useMeasure from 'react-use-measure'
import { mergeRefs } from 'react-merge-refs'

const initialTags = [
  { id: crypto.randomUUID(), text: 'tag 1', loading: false },
  { id: crypto.randomUUID(), text: 'tag 2', loading: false },
  { id: crypto.randomUUID(), text: 'tag 3', loading: false },
  { id: crypto.randomUUID(), text: 'tag 4', loading: false },
]

const transition = { type: 'spring', bounce: 0.2, duration: 0.5 }

export default function Tagger() {
  const [tags, setTags] = useState(initialTags)

  function addTag() {
    const id = crypto.randomUUID()
    setTags([...tags, { id, text: `tag ${tags.length + 1}`, loading: true }])
    // this probably isn't the best
    window.setTimeout(() => {
      setTags((tags) => {
        const newTags = [...tags]

        const tag = newTags.find((t) => t.id === id)
        if (!tag) return newTags

        tag.loading = false

        return newTags
      })
    }, 2000)
  }

  return (
    <div>
      <div className="mb-5">
        <Button variant="ghost" onClick={addTag}>
          Add Tag
        </Button>
      </div>
      <ul className="flex flex-row-reverse flex-wrap justify-end">
        <AnimatePresence initial={false} mode="popLayout">
          {tags.map((t) => (
            <MotionTag
              key={t.id}
              tag={t}
              removeTag={() => setTags((tags) => tags.filter((tag) => tag.id !== t.id))}
              layout
              transition={{ duration: 0.8, type: 'spring', bounce: 0.15 }}
              initial={{
                opacity: 0,
                // scale: 0.2,
              }}
              animate={{
                opacity: 1,
                // scale: 1,
              }}
              exit={{
                opacity: 0,
                // scale: 0.2,
              }}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

type Tag = (typeof initialTags)[number]

type TagProps = { removeTag: () => void; tag: Tag }

const Tag = forwardRef<HTMLLIElement, TagProps>(({ removeTag, tag }, ref) => {
  const [measureRef, bounds] = useMeasure()

  console.log(`width ${tag.text}`, bounds.width)

  return (
    <li ref={ref} className="origin-center" onClick={removeTag}>
      <div className="mx-1 my-1">
        <div
          className={cn(
            'px-3 py-1 cursor-pointer shadow-inner text-xs font-bold text-indigo-500 bg-indigo-100 border-indigo-200 border rounded-full dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-900/70',
            tag.loading &&
              'text-indigo-500/20 bg-indigo-100/20 border-indigo-200/20 dark:bg-indigo-900/20 dark:text-indigo-300/20 dark:border-indigo-900/10 cursor-not-allowed'
          )}
        >
          <motion.div
            className="overflow-hidden flex items-center"
            animate={{ width: bounds.width > 0 ? bounds.width : undefined }}
            transition={transition}
          >
            <div ref={measureRef} className="inline-flex">
              <MotionConfig transition={transition}>
                <AnimatePresence initial={false} mode="popLayout">
                  {tag.loading ? (
                    <motion.div
                      key="loader"
                      className="shrink"
                      exit={{ opacity: 0 }}
                      transition={{
                        ...transition,
                        duration: transition.duration / 2,
                      }}
                    >
                      <Loader2Icon className="size-4 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="text-nowrap shrink"
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        ...transition,
                        duration: transition.duration / 2,
                        delay: transition.duration / 2,
                      }}
                    >
                      {tag.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </MotionConfig>
            </div>
          </motion.div>
        </div>
      </div>
    </li>
  )
})
Tag.displayName = 'Tag'

const MotionTag = motion(Tag)
