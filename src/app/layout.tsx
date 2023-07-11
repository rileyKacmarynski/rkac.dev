import { cn } from '@/lib/utils'
import './globals.css'
import { Inter as FontSans, JetBrains_Mono as FontMono } from 'next/font/google'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: {
    template: '%s | rkac.dev',
    default: 'rkac.dev',
  },
  description: "Riley Kacmarynski's personal site and blog",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    openGraph: {
      title: 'rkac.dev',
      description: "Riley Kacmarynski's personal site and blog",
      url: 'https://rkac.dev',
      siteName: 'rkac.dev',
      locale: 'en-US',
      type: 'website',
      authors: ['Riley Kacmarynski'],
    },
    twitter: {
      title: 'rkac.dev',
      card: 'summary_large_image',
    },
  },
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="px-6 mt-6">{children}</main>

          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
