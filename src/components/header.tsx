import ThemeToggle from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <div
      aria-hidden="true"
      className="fixed select-none pointer-events-none top-0 w-full h-24 z-10 opacity-90 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_10%,transparent)] before:absolute before:inset-0 before:[background:linear-gradient(to_bottom,var(--color-primary-bg),transparent)]"
    ></div>
  )
}
