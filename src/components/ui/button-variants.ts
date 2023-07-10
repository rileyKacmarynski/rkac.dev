import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex overflow-hidden relative items-center justify-center rounded-md text-sm font-medium  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:dark:text-neutral-600 disabled:text-neutral-400 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground dark:hover:bg-zinc-200 hover:bg-zinc-800',
        ghost: 'bg-transparent hover:bg-hover active:bg-muted',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 py-2 px-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
