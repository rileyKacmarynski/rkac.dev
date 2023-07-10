'use client'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

import {
  Button as RAButton,
  ButtonProps as RAButtonProps,
} from 'react-aria-components'

export interface ButtonProps
  extends RAButtonProps,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>(({ className, children, variant, size, ...props }, ref) => {
  return (
    <RAButton
      className={cn(buttonVariants({ variant, size, className }))}
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
      variant="ghost"
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
