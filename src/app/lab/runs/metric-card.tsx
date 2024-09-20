import { ibmPlexMono } from '@/app/fonts'
import { cn } from '@/lib/utils'

export function MetricCard({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'p-4 grid [grid-template-columns:repeat(3,1fr)] [grid-template-rows:min-content_1fr]  @container leading-none',
        className
      )}
      {...props}
    >
      <div className="flex flex-col col-start-2">{children}</div>
    </div>
  )
}

function Label({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p
      className={cn(
        '[font-size:clamp(0.75rem,5cqi,var(--font-size-sm))] text-nowrap text-left row-start-1 col-start-2 font-medium dark:text-muted-fg mb-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}
MetricCard.Label = Label

export function Value({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'tracking-normal leading-none font-medium [font-size:clamp(var(--font-size-sm),20cqi,var(--font-size-5xl))]',
        className,
        ibmPlexMono.className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
MetricCard.Value = Value

export function Unit({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'self-end text-muted-fg tabular-nums [font-size:clamp(0.75rem,5cqi,var(--font-size-sm))]',
        className,
        ibmPlexMono.className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
MetricCard.Unit = Unit
