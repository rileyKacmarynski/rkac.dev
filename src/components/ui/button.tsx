'use client'

import { cn } from '@/lib/utils'
import React from 'react'

import {
  Button as RAButton,
  ButtonProps as RAButtonProps,
} from 'react-aria-components'

export interface ButtonProps extends RAButtonProps {}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ className, children, ...props }, ref) => {
  return (
    <RAButton
      className={cn(
        'inline-flex overflow-hidden bg-transparent relative items-center h-8 py-2 px-2 justify-center  rounded-md text-sm font-medium transition',
        'hover:bg-hover active:bg-muted',
        'disabled:dark:text-neutral-600 disabled:text-neutral-400 disabled:pointer-events-none',
        className
      )}
      ref={ref}
      type="button"
      {...props}
    >
      {children}
    </RAButton>
  )
})
Button.displayName = 'Button'

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      className={cn(
        'h-10 w-10 hover:bg-transparent bg-transparent',
        'hover:bg-transparent active:bg-transparent',
        'hover:text-foreground dark:text-zinc-300 text-zinc-600',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
})
IconButton.displayName = 'IconButton'

export { Button, IconButton }
