import { cn } from '@/lib/utils'

export function MetricCard({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('p-8 xbg-white/5 rounded-lg leading-none', className)} {...props}>
      {children}
    </div>
  )
}

function Label({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p className={cn('text-sm dark:text-muted-fg mb-1', className)} {...props}>
      {children}
    </p>
  )
}
MetricCard.Label = Label

export function Value({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'tracking-normal text-5xl sm:text-6xl lg:text-7xl font-medium',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
MetricCard.Value = Value

export function Unit({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('font-medium xself-end text-muted-fg', className)} {...props}>
      {/* this is going to bite me isn't it? */} {children}
    </span>
  )
}
MetricCard.Unit = Unit
