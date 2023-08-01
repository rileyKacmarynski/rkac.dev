import { cn } from '@/lib/utils'
import Link from 'next/link'

export type FancyAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  external?: true
  href: string
}
export function FancyAnchor({
  external,
  children,
  className,
  ...rest
}: FancyAnchorProps) {
  const props = external
    ? {
        target: '_blank',
        rel: 'noreferrer',
        ...rest,
      }
    : rest

  return (
    <Link
      className={cn(
        'inline-flex gap-1 items-center underline-offset-4 no-underline text-indigo-700 dark:text-indigo-500 after:scale-x-0 font-medium relative after:absolute after:bottom-[1px] after:ease-out group hover:after:scale-x-100 after:transition after:duration-200 after:delay-100 after:w-full after:h-[1.5px] after:bg-indigo-500'
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
