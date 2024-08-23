'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isUsingPointer, setIsUsingPointer] = React.useState(false)

    return (
      <input
        onPointerDown={() => setIsUsingPointer(true)}
        onBlur={() => setIsUsingPointer(false)}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-50/5 dark:bg-zinc-50/5 bg-zinc-100 px-3 py-2 text-sm shadow-sm ring-offset-background file:my-[-5px] file:h-8 file:rounded-md file:border-0 file:bg-white/5 file:px-2 file:text-sm file:font-medium file:text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&[type="file"]]:pl-1',
          !isUsingPointer &&
            'focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export default Input
