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
      className={({ isDisabled, isHovered, isPressed, isFocusVisible }) =>
        cn(
          className,
          'inline-flex overflow-hidden bg-transparent relative items-center h-8 py-2 px-2 justify-center  rounded-md text-sm font-medium transition',
          isFocusVisible && 'ring-1 ring-offset-1',
          isHovered && 'bg-hover',
          isPressed && 'bg-muted',
          isDisabled &&
            'dark:text-neutral-600 text-neutral-400 pointer-events-none'
        )
      }
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
    <Button className={cn(className, 'h-10 w-10')} {...props}>
      {children}
    </Button>
  )
})
IconButton.displayName = 'IconButton'

export { Button, IconButton }
