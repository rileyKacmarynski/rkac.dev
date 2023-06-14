import { cn } from '@/lib/utils'
import './globals.css'
import { Inter as FontSans, JetBrains_Mono as FontMono } from 'next/font/google'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'rkac.dev',
  description: 'My personal site and blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen font-sans bg-zinc-50 dark:bg-black text-zinc-950 dark:text-neutral-200 antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="">{children}</div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
