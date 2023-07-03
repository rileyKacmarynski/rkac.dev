import { cn } from '@/lib/utils'
import './globals.css'
import { Inter as FontSans, JetBrains_Mono as FontMono } from 'next/font/google'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { SSRProvider, I18nProvider } from 'react-aria'
import Header from '@/components/header'

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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head />
      <body
        className={cn(
          'min-h-screen transition-colors font-sans bg-zinc-50 dark:bg-black text-zinc-950 dark:text-neutral-200 antialiased',
          fontSans.variable
        )}
      >
        {/* <SSRProvider>
          <I18nProvider locale="en"> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="px-6 mt-6">{children}</main>

          <TailwindIndicator />
        </ThemeProvider>
        {/* </I18nProvider>
        </SSRProvider> */}
      </body>
    </html>
  )
}
