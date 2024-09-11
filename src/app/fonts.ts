import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'

export const satoshi = localFont({
  src: '../../public/Satoshi-Variable.woff2',
  display: 'swap',
})

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
})
