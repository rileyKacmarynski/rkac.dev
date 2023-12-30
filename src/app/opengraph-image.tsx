import OGImage from '@/components/og-image'
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'rkac.dev'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// https://github.com/vercel/next.js/issues/48081
// Font has to be inside route handler I guess?

// Image generation
export default async function Image() {
  const interSemiBold = fetch(
    new URL('/public/Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(<OGImage>rkac.dev</OGImage>, {
    // For convenience, we can re-use the exported opengraph-image
    // size config to also set the ImageResponse's width and height.
    ...size,
    fonts: [
      {
        name: 'Inter',
        data: await interSemiBold,
        style: 'normal',
        weight: 400,
      },
    ],
  })
}
