import { cn } from '@/lib/utils'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Link from 'next/link'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const font = localFont({
  src: '../../public/Satoshi-Variable.woff2',
  // display: 'swap',
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
  },
  openGraph: {
    title: 'rkac.dev',
    description: "Riley Kacmarynski's personal site and blog",
    url: 'https://rkac.dev',
    siteName: 'rkac.dev',
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    creator: 'Riley Kacmarynski',
    title: 'rkac.dev',
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className="scroll-smooth">
      <head />
      <body
        className={cn(
          'h-full relative font-sans antialiased text-primary-fg bg-primary-bg',
          font.className
        )}
      >
        <div
          className="bg -z-10 pointer-events-none fixed left-0 top-0 h-full w-full"
          aria-hidden="true"
        ></div>
        <ThemeProvider defaultTheme="system" enableSystem>
          <Header />
          <main className="min-h-dvh py-20 px-6 mx-auto max-w-5xl relative">
            <article layout-grid="true">{children}</article>
          </main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
