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
      className={({
        isDisabled,
        isHovered,
        isPressed,
        isFocusVisible,
        isFocused,
      }) =>
        cn(
          className,
          'inline-flex items-center h-8 py-2 px-2 justify-center  rounded-md text-sm font-medium transition',
          isHovered && 'dark:bg-neutral-900 bg-neutral-200',
          isPressed && 'dark:bg-neutral-800 bg-neutral-300',
          isFocused && 'ring-0 ring-offset-0',
          isFocusVisible && 'ring-1 ring-offset-1',
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

export { Button }
