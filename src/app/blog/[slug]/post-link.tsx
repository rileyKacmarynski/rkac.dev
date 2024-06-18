'use client'

import { Anchor } from '@/components/ui/Anchor'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

export function PostLink() {
  const prevScrollTop = useRef<number>()
  const lastSwap = useRef<number>()
  const [hideLink, setHideLink] = useState(false)

  useEventListener('scroll', () => {
    const y = window.scrollY
    if (y < (prevScrollTop?.current ?? 0) && y < (lastSwap?.current ?? 0) - 200) {
      // show link when scrolling up
      lastSwap.current = y
      if (hideLink) {
        setHideLink(false)
      }
    } else if (
      y > (prevScrollTop?.current ?? Infinity) &&
      y > 500 &&
      y > (lastSwap?.current ?? 0) + 500
    ) {
      // hide link when scrolling down a bit
      lastSwap.current = y
      if (!hideLink) {
        setHideLink(true)
      }
    }

    prevScrollTop.current = y <= 0 ? 0 : y
  })

  return (
    <div
      aria-hidden={hideLink}
      className={cn(
        'transition duration-300',
        hideLink && 'blur-sm opacity-0 scale-95 pointer-events-none'
      )}
    >
      <Anchor className="flex group gap-0.5 items-center" href="/blog">
        <ArrowLeftIcon className="w-4 h-4 stroke-muted-bg group-hover:stroke-hover duration-200" />
        Blog
      </Anchor>
    </div>
  )
}
