import ThemeToggle from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-10 h-16 px-6 border-b backdrop-blur-sm border-border bg-background/50">
        <a
          className="absolute z-10 w-1 h-1 -m-1 overflow-hidden font-semibold text-center rounded opacity-0 focus:opacity-100 focus:w-auto focus:h-auto focus:overflow-visible focus:whitespace-normal focus:px-3 focus:py-2 focus:ring-1 dark:ring-white ring-zinc-900 bg-background top-4 left-4"
          href="#skip-nav"
          tabIndex={0}
        >
          skip to content
        </a>
        <nav className="flex items-center h-full max-w-4xl m-auto">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', transform: false }),
              'block py-0 px-4 -ml-4 hover:bg-transparent active:bg-transparent'
            )}
          >
            <span className="inline-block text-3xl font-semibold tracking-tight -skew-x-6">
              rkac
            </span>
            <span className="text-xs font-light tracking-tight">.dev</span>
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <div id="skip-nav" className="scroll-m-16" tabIndex={-1} />
    </>
  )
}
