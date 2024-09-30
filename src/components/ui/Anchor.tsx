import { cn } from '@/lib/utils'
import Link from 'next/link'

export type AchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  external?: true
  href?: string
}
export function Anchor({ external, children, className, href, ...rest }: AchorProps) {
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
        'custom-underline',
        // external && 'group inline-flex gap-1 items-center',
        className
      )}
      href={href ?? ''}
      {...props}
    >
      {children}
      {/* {external && (
        <ExternalLink className="w-2.5 h-2.5 text-muted-fg transition-colors" />
      )} */}
    </Link>
  )
}
